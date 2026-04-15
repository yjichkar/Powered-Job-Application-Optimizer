from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
from pypdf import PdfReader
from pathlib import Path
import json
import requests
from bs4 import BeautifulSoup
from urllib.parse import urlparse

# 1. Load Environment Variables
current_dir = Path(__file__).resolve().parent
env_path = current_dir / '.env'
load_dotenv(dotenv_path=env_path, override=True)

# Force reload triggers here
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

# 2. Configure OpenRouter
OPENROUTER_API_KEY = os.getenv('OPENROUTER_API_KEY', '').strip()
selected_model = "deepseek/deepseek-chat"

print(f"🚀 USING MODEL: {selected_model}")

# Check key on startup
print("🔑 API KEY STATUS:")
if OPENROUTER_API_KEY and not OPENROUTER_API_KEY.startswith("YOUR_"):
    masked = f"{OPENROUTER_API_KEY[:6]}...{OPENROUTER_API_KEY[-4:]}" if len(OPENROUTER_API_KEY) > 10 else "SET"
    print(f"  OpenRouter Key: {masked}")
else:
    print(f"  OpenRouter Key: MISSING/DEFAULT")

# ==========================================
# UTILITY FUNCTIONS
# ==========================================

def extract_text_from_pdf(file):
    try:
        reader = PdfReader(file)
        text = ""
        for page in reader.pages:
            text += page.extract_text() + "\n"
        return text.strip()
    except Exception as e:
        print(f"PDF Error: {e}")
        return ""

def scrape_job_description(url):
    """Scrape job description text from a given URL"""
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Accept': 'text/html,application/xhtml+xml',
        }
        
        response = requests.get(url, headers=headers, timeout=15)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.text, 'html.parser')
        
        for element in soup(['script', 'style', 'nav', 'footer', 'header', 'aside']):
            element.decompose()
        
        jd_text = ""
        selectors = [
            '.job-description', '.jobDescription', '#job-description',
            '.description', '.job-details', '.job-content',
            '[data-job-description]', '.posting-content',
            'article', '.content', 'main'
        ]
        
        for selector in selectors:
            container = soup.select_one(selector)
            if container:
                jd_text = container.get_text(separator='\n', strip=True)
                if len(jd_text) > 200:
                    break
        
        if len(jd_text) < 200:
            body = soup.find('body')
            if body:
                jd_text = body.get_text(separator='\n', strip=True)
        
        lines = [line.strip() for line in jd_text.split('\n') if line.strip()]
        jd_text = '\n'.join(lines)
        
        title = soup.find('title')
        title_text = title.get_text() if title else ""
        
        company_name = ""
        company_meta = soup.find('meta', {'property': 'og:site_name'})
        if company_meta:
            company_name = company_meta.get('content', '')
        
        return {
            'success': True,
            'jd_text': jd_text[:3000],  # Reduced from 5000 to 3000
            'page_title': title_text,
            'company_name': company_name,
            'url': url
        }
        
    except requests.exceptions.Timeout:
        return {'success': False, 'error': 'Request timed out.'}
    except requests.exceptions.RequestException as e:
        return {'success': False, 'error': f'Could not fetch URL: {str(e)}'}
    except Exception as e:
        return {'success': False, 'error': f'Scraping error: {str(e)}'}

def extract_company_and_role(jd_text, manual_company=None):
    """Extract company name and role from JD text with noise filtering.
    
    Args:
        jd_text: The job description text (first 500 chars used)
        manual_company: Optional manually provided company name (takes priority)
    
    Returns:
        tuple: (company_name, role_title)
    """
    import re
    
    snippet = jd_text[:800] if jd_text else ""
    
    # --- NOISE PHRASES to strip before extraction ---
    noise_phrases = [
        r'join\s+us', r'we\s+are\s+hiring', r'apply\s+now', r'job\s+opening',
        r'career\s+opportunity', r'we\s+are\s+looking', r'currently\s+hiring',
        r'immediate\s+opening', r'urgent\s+requirement', r'walk[\s-]?in',
        r'vacancy', r'openings?\s+for', r'hiring\s+for', r'looking\s+for',
        r'job\s+description', r'responsibilities', r'requirements',
        r'qualifications', r'about\s+the\s+role', r'role\s+overview',
    ]
    
    # Common role words that should NOT be treated as company names
    role_words = {
        'business', 'analyst', 'engineer', 'developer', 'manager', 'designer',
        'consultant', 'associate', 'executive', 'lead', 'senior', 'junior',
        'intern', 'trainee', 'architect', 'specialist', 'coordinator',
        'administrator', 'officer', 'director', 'head', 'chief', 'vp',
        'assistant', 'full', 'stack', 'front', 'back', 'end', 'data',
        'software', 'hardware', 'product', 'project', 'program', 'quality',
        'test', 'qa', 'devops', 'cloud', 'security', 'network', 'system',
        'sales', 'marketing', 'hr', 'human', 'resource', 'operations',
        'digital', 'web', 'mobile', 'ui', 'ux', 'graphic',
    }
    
    def is_likely_company(name):
        """Check if extracted name looks like a company (not a role/phrase)."""
        if not name or len(name) < 2 or len(name) > 40:
            return False
        words = name.lower().split()
        # If most words are role-related, it's not a company
        role_word_count = sum(1 for w in words if w in role_words)
        if role_word_count > len(words) * 0.5:
            return False
        # Check against noise
        name_lower = name.lower()
        for noise in noise_phrases:
            if re.search(noise, name_lower):
                return False
        return True
    
    # === COMPANY EXTRACTION ===
    company = None
    
    # Priority 1: Manual input
    if manual_company and manual_company.strip():
        company = manual_company.strip()
    
    # Priority 2: Explicit label patterns like "Company: TCS" or "Organization: Infosys"
    if not company:
        label_patterns = [
            r'(?:Company|Organization|Employer|Firm|Client)\s*[:\-]\s*([A-Z][A-Za-z0-9\s&.]+?)(?:\n|,|\.|;|\s{2,})',
        ]
        for pat in label_patterns:
            m = re.search(pat, snippet)
            if m and is_likely_company(m.group(1).strip()):
                company = m.group(1).strip()
                break
    
    # Priority 3: "at {Company}" pattern (e.g. "Software Engineer at TCS")
    if not company:
        at_patterns = [
            r'(?:at|@)\s+([A-Z][A-Za-z0-9\s&.]+?)(?:\n|,|\.|;|\s{2,}|\s+is|\s+in)',
        ]
        for pat in at_patterns:
            m = re.search(pat, snippet)
            if m and is_likely_company(m.group(1).strip()):
                company = m.group(1).strip()
                break
    
    # Priority 4: "About {Company}" (but NOT "About the role" / "About us")
    if not company:
        m = re.search(r'About\s+([A-Z][A-Za-z0-9\s&.]+?)(?:\n|,|\.|\s{2,})', snippet)
        if m:
            candidate = m.group(1).strip()
            skip = {'the role', 'the position', 'the job', 'us', 'the company', 'this role'}
            if candidate.lower() not in skip and is_likely_company(candidate):
                company = candidate
    
    # Priority 5: "{Company} is hiring" / "{Company} is looking"
    if not company:
        m = re.search(r'([A-Z][A-Za-z0-9\s&.]{2,30}?)\s+is\s+(?:hiring|looking|seeking|recruiting)', snippet)
        if m and is_likely_company(m.group(1).strip()):
            company = m.group(1).strip()
    
    # Fallback
    if not company:
        company = ""
    
    # === ROLE EXTRACTION ===
    role = ""
    role_patterns = [
        r'(?:Role|Position|Title|Job\s*Title|Designation)\s*[:\-]\s*([A-Za-z\s/()]+?)(?:\n|,|;|\s{2,})',
        r'(?:Hiring|Opening)\s+(?:for\s+)?(?:a\s+)?([A-Z][A-Za-z\s/]+?)(?:\n|,|\.|\s+at\s+)',
        r'^([A-Z][A-Za-z\s/]+?)(?:\s+at\s+|\s*\n|\s*\-\s*)',
    ]
    for pat in role_patterns:
        m = re.search(pat, snippet, re.MULTILINE)
        if m:
            candidate = m.group(1).strip()
            if 3 < len(candidate) < 60:
                role = candidate
                break
    
    if not role:
        role = "Software Engineer"
    
    # === CLEAN ROLE TEXT ===
    # Strip noise prefixes that sometimes get captured with the role
    role_noise_prefixes = [
        r'^join\s+us\s+as\s+(?:a\s+|an\s+)?',
        r'^we\s+are\s+hiring\s+(?:a\s+|an\s+)?(?:for\s+)?',
        r'^hiring\s+(?:a\s+|an\s+)?(?:for\s+)?',
        r'^looking\s+for\s+(?:a\s+|an\s+)?',
        r'^we\s+are\s+looking\s+for\s+(?:a\s+|an\s+)?',
        r'^openings?\s+for\s+(?:a\s+|an\s+)?',
        r'^job\s+opening\s*[:\-]?\s*',
        r'^position\s+of\s+(?:a\s+|an\s+)?',
        r'^seeking\s+(?:a\s+|an\s+)?',
        r'^wanted\s*[:\-]?\s*',
        r'^apply\s+for\s+(?:a\s+|an\s+)?',
        r'^urgent\s+(?:requirement|hiring)\s*[:\-]?\s*(?:for\s+)?(?:a\s+|an\s+)?',
        r'^immediate\s+(?:opening|requirement)\s*[:\-]?\s*(?:for\s+)?(?:a\s+|an\s+)?',
    ]
    cleaned_role = role
    for prefix in role_noise_prefixes:
        cleaned_role = re.sub(prefix, '', cleaned_role, flags=re.IGNORECASE).strip()
    
    # If cleaning emptied the role, keep original
    if len(cleaned_role) > 2:
        role = cleaned_role
    
    print(f"📋 Extracted -> Company: '{company}', Role: '{role}'")
    return company, role

def build_link_urls(company, role):
    """Build URL-safe link strings from company and role names.
    
    Returns:
        dict with keys: company_hyphen, role_hyphen, company_plus, role_plus
    """
    import re
    return {
        'company_hyphen': re.sub(r'\s+', '-', company.lower().strip()) if company else 'company',
        'role_hyphen': re.sub(r'\s+', '-', role.lower().strip()),
        'company_plus': re.sub(r'\s+', '+', company.strip()) if company else 'company',
        'role_plus': re.sub(r'\s+', '+', role.strip()),
    }

def extract_json_from_text(text):
    """Robustly extract JSON from AI response text"""
    import re
    text = text.strip()
    
    # 1. Try direct parse
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        pass
    
    # 2. Try extracting from markdown code blocks
    # Match ```json ... ``` or ``` ... ```
    pattern = r'```(?:json)?\s*\n?(.*?)\n?\s*```'
    match = re.search(pattern, text, re.DOTALL)
    if match:
        try:
            return json.loads(match.group(1).strip())
        except json.JSONDecodeError:
            pass
    
    # 3. Find first { to last } 
    first_brace = text.find('{')
    last_brace = text.rfind('}')
    if first_brace != -1 and last_brace > first_brace:
        try:
            return json.loads(text[first_brace:last_brace + 1])
        except json.JSONDecodeError:
            pass
    
    return None


def generate_ai_response(prompt, max_tokens=220, service_name="default"):
    """Generate AI response - using OpenRouter DeepSeek"""
    try:
        if not OPENROUTER_API_KEY or OPENROUTER_API_KEY.startswith("your_"):
            print(f"❌ Error: Invalid/Missing API Key found for service '{service_name}'")
            return {"error": "Server configuration error: Please update OPENROUTER_API_KEY in .env with your actual key."}

        headers = {
            "Authorization": f"Bearer {OPENROUTER_API_KEY}",
            "HTTP-Referer": "http://localhost:5000",
            "X-Title": "Job Optimizer",
            "Content-Type": "application/json"
        }

        payload = {
            "model": selected_model,
            "messages": [
                {"role": "user", "content": prompt}
            ],
            "temperature": 0.4,
            "top_p": 0.9,
            "max_tokens": max_tokens,
            "response_format": {"type": "json_object"}
        }

        print(f"🔑 Generating response for {service_name} with {selected_model}")
        
        response = requests.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers=headers,
            json=payload,
            timeout=30
        )
        response.raise_for_status()
        resp_json = response.json()
        
        if "choices" not in resp_json or not resp_json["choices"]:
            return {"error": "Empty response from AI."}
            
        raw = resp_json["choices"][0]["message"]["content"].strip()
        print(f"📝 AI raw ({len(raw)} chars): {raw[:150]}...")
        
        # DEBUG: Write full response to file
        with open("debug_response.txt", "w", encoding="utf-8") as f:
            f.write(raw)
        
        result = extract_json_from_text(raw)
        if result:
            return result
        
        print(f"❌ JSON parse failed. Full response:\n{raw[:500]}")
        return {"error": "Failed to parse AI response. Please try again."}
        
    except requests.exceptions.RequestException as e:
        print(f"❌ OpenRouter API Error ({service_name}): {e}")
        return {"error": "Service temporarily unavailable"}
    except Exception as e:
        print(f"❌ AI Error ({service_name}): {e}")
        return {"error": "Service temporarily unavailable"}


# ==========================================
# API ENDPOINTS
# ==========================================

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy'}), 200

# NEW: PDF text extraction only - NO AI call, zero tokens
@app.route('/api/extract-resume', methods=['POST'])
def extract_resume():
    """Extract text from uploaded resume - NO AI tokens used"""
    print("➡️ Extracting resume text...")
    try:
        resume_file = request.files.get('resume_file')
        if not resume_file:
            return jsonify({'error': 'No file uploaded'}), 400
        
        resume_text = extract_text_from_pdf(resume_file)
        if not resume_text:
            return jsonify({'error': 'Could not extract text from file'}), 400
        
        print(f"✅ Extracted {len(resume_text)} chars from resume")
        return jsonify({
            'success': True,
            'resume_text': resume_text[:3000]  # Cap at 3000 chars
        }), 200
    except Exception as e:
        print(f"❌ Extract Error: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/scrape-jd', methods=['POST'])
def scrape_jd():
    """Scrape job description from URL - NO AI tokens used"""
    print("➡️ Processing URL Scrape...")
    try:
        data = request.json
        url = data.get('url', '')
        
        if not url:
            return jsonify({'success': False, 'error': 'URL is required'}), 400
        
        parsed = urlparse(url)
        if not parsed.scheme or not parsed.netloc:
            return jsonify({'success': False, 'error': 'Invalid URL format'}), 400
        
        result = scrape_job_description(url)
        
        if result['success']:
            print(f"✅ Scraped {len(result['jd_text'])} chars")
        else:
            print(f"❌ Scrape failed: {result['error']}")
        
        return jsonify(result), 200 if result['success'] else 400
        
    except Exception as e:
        print(f"❌ Scrape Error: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500

# ==========================================
# BATCH ENDPOINT - ALL SERVICES IN 1 AI CALL
# ==========================================

INPUT_LIMIT = 800  # Chars of JD/resume per call

@app.route('/api/analyze-all', methods=['POST'])
def analyze_all():
    """Run ALL 8 services in a single AI request - saves 7 API calls"""
    print("➡️ Running batch analysis (all services)...")
    try:
        data = request.json
        jd = data.get('jd', '')[:INPUT_LIMIT]
        resume = data.get('resume', '')[:INPUT_LIMIT]

        prompt = f"""Analyze the resume against the job description. Return ONLY valid JSON. No markdown. No greeting.
Provide detailed, meaningful, realistic results for each section. Never return 0% unless resume is completely unrelated.
Ensure at least 3 items in each list. Do not output placeholders or empty strings.

JD:{jd}
CV:{resume}

Return this exact JSON structure:
{{
  "ats_scanner": {{"ATS Score": 65, "Key Strengths": ["str","str"], "Improvements": ["str","str","str"]}},
  "job_match": {{"Match Percentage": 60, "Matching Skills": ["str","str","str","str"], "Missing Skills": ["str","str","str"], "Profile Summary": "1 sentence"}},
  "skill_gap": {{"Missing Skills": ["str","str","str","str"], "Learning Suggestions": ["str","str"]}},
  "interview_prep": {{"Questions": ["1. q","2. q","3. q","4. q","5. q"]}},
  "cold_email": {{"Subject": "str", "Email": "120-150 words, mention skills and value"}},
  "cv_builder": {{"Resume Points": ["action verb + skill + impact","action verb + skill + impact","action verb + skill + impact","action verb + skill + impact"]}},
  "response_rate": {{"Response Probability": 60, "Reasons": ["str","str"], "Tips": ["str","str"]}}
}}

Rules:
- ATS Score range: 40-95. Improvements must be specific and practical.
- Match Percentage range: 50-90. Based on skills, tools, domain, experience overlap.
- Missing Skills: max 6. Learning Suggestions must be practical (course, project, tool).
- Interview questions: mix of technical, scenario-based, experience-based. Must feel realistic.
- Resume bullets: start with action verb, mention skill/tool, mention impact/result. Max 18 words each.
- Cold email: 120-150 words. Mention skills, value, interest. Avoid "I am writing to express...".
- Response Probability range: 55-85. Tips must be actionable."""

        result = generate_ai_response(prompt, max_tokens=2000, service_name="analyze-all")
        
        # Local, non-LLM generation for Network Map + Interview links
        if isinstance(result, dict):
            from urllib.parse import quote_plus
            
            # Use centralized extraction; accept optional manual company from request
            manual_company = data.get('company', '')
            company, role = extract_company_and_role(jd, manual_company)
            urls = build_link_urls(company, role)
            
            display_company = company if company else "Company"
            query = f"{display_company} HR OR Recruiter"
            
            result['linkedin_people'] = {
                "company": display_company,
                "people": [
                    {
                        "title": f"HR / Recruiters at {display_company}",
                        "search_query": query,
                        "linkedin_url": f"https://www.linkedin.com/search/results/people/?keywords={quote_plus(query)}"
                    }
                ],
                "company_linkedin_url": f"https://www.linkedin.com/search/results/companies/?keywords={quote_plus(display_company)}"
            }
            
            # Inject external interview question links into interview_prep section
            if 'interview_prep' in result and isinstance(result['interview_prep'], dict):
                result['interview_prep']['_external_links'] = [
                    {
                        "label": "View on AmbitionBox",
                        "url": f"https://www.ambitionbox.com/interviews/{urls['company_hyphen']}-interview-questions/{urls['role_hyphen']}"
                    },
                    {
                        "label": "View on Glassdoor",
                        "url": f"https://www.google.com/search?q={urls['company_plus']}+{urls['role_plus']}+glassdoor+interview+questions"
                    }
                ]
        
        print("✅ Batch analysis done")
        return jsonify(result), 200
    except Exception as e:
        print(f"❌ Batch Error: {e}")
        return jsonify({'error': str(e)}), 500

# ==========================================
# INDIVIDUAL SERVICE ENDPOINTS (fallback)
# ==========================================

@app.route('/api/ats-scanner', methods=['POST'])
def ats_scanner():
    print("➡️ ATS Scanner...")
    try:
        data = request.json
        jd = data.get('jd', '')[:INPUT_LIMIT]
        resume = data.get('resume', '')[:INPUT_LIMIT]
        
        prompt = f"""Analyze resume for ATS compatibility against the job description.
Evaluate: keyword relevance, skills clarity, experience structure, format readability.

Return ONLY valid JSON:
{{
  "ATS Score": <number 40-95>,
  "Key Strengths": ["strength 1", "strength 2"],
  "Improvements": ["improvement 1", "improvement 2", "improvement 3"]
}}

Rules:
- Score must be realistic (40-95 range). Never 0 unless completely unrelated.
- Provide exactly 2 strengths and 3 improvements.
- Improvements must be specific and practical (max 15 words each).
- No placeholders. No empty strings. No markdown. No greeting.

JD:{jd}
CV:{resume}"""
        
        result = generate_ai_response(prompt, max_tokens=220, service_name="ats-scanner")
        print("✅ ATS done")
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/job-suitability', methods=['POST'])
def job_suitability():
    print("➡️ Job Match...")
    try:
        data = request.json
        jd = data.get('jd', '')[:INPUT_LIMIT]
        resume = data.get('resume', '')[:INPUT_LIMIT]
        
        prompt = f"""Compare resume with job description. Estimate realistic match percentage.
Evaluate: skills match, tools match, domain relevance, experience similarity.

Return ONLY valid JSON:
{{
  "Match Percentage": <number 50-90>,
  "Matching Skills": ["skill 1", "skill 2", "skill 3", "skill 4"],
  "Missing Skills": ["skill 1", "skill 2", "skill 3"],
  "Profile Summary": "1 short sentence explaining fit"
}}

Rules:
- Match Percentage must be realistic (50-90). Never 0 unless completely unrelated job.
- List 3-4 matching skills and 3 missing skills.
- Profile Summary: 1 sentence max.
- No placeholders. No empty strings. No markdown. No greeting.

JD:{jd}
CV:{resume}"""
        
        result = generate_ai_response(prompt, max_tokens=220, service_name="job-suitability")
        print("✅ Job Match done")
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/skill-gap', methods=['POST'])
def skill_gap():
    print("➡️ Skill Gap...")
    try:
        data = request.json
        jd = data.get('jd', '')[:INPUT_LIMIT]
        resume = data.get('resume', '')[:INPUT_LIMIT]
        
        prompt = f"""Identify meaningful missing skills by comparing resume against job description.

Return ONLY valid JSON:
{{
  "Missing Skills": ["skill 1", "skill 2", "skill 3", "skill 4"],
  "Learning Suggestions": ["practical suggestion 1", "practical suggestion 2"]
}}

Rules:
- List 4-6 genuinely missing skills (not skills already on the resume).
- Learning Suggestions must be practical: specific course, project, or tool to learn.
- No placeholders. No empty strings. No markdown. No greeting.

JD:{jd}
CV:{resume}"""
        
        result = generate_ai_response(prompt, max_tokens=220, service_name="skill-gap")
        print("✅ Skill Gap done")
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/interview-prep', methods=['POST'])
def interview_prep():
    print("➡️ Interview Prep...")
    try:
        data = request.json
        jd = data.get('jd', '')[:INPUT_LIMIT]
        resume = data.get('resume', '')[:INPUT_LIMIT]
        
        prompt = f"""Generate detailed interview preparation content for this specific job role.
Each question should be 1-2 lines long, realistic, and not generic.

Return ONLY valid JSON:
{{
  "Role-Specific Questions": [
    "1. detailed question about the role?",
    "2. detailed question about the role?",
    "3. detailed question about the role?",
    "4. detailed question about the role?"
  ],
  "Behavioral Questions": [
    "1. scenario-based behavioral question encouraging structured answers?",
    "2. scenario-based behavioral question encouraging structured answers?"
  ],
  "Technical Questions": [
    "1. skill/tool-based technical question mentioning specific concepts?",
    "2. skill/tool-based technical question mentioning specific concepts?",
    "3. skill/tool-based technical question mentioning specific concepts?"
  ],
  "STAR Method Guidance": [
    "Situation: Set the scene with context about the challenge you faced.",
    "Task: Explain your specific responsibility or goal in that situation.",
    "Action: Describe the concrete steps you took to address the challenge.",
    "Result: Share the measurable outcome or impact of your actions."
  ],
  "Answer Improvement Tips": [
    "practical tip 1",
    "practical tip 2",
    "practical tip 3"
  ],
  "Mock Interview Practice": [
    "1. realistic case-based scenario question with context?",
    "2. realistic case-based scenario question with context?"
  ]
}}

Rules:
- Role-Specific: 4 questions directly tied to the job responsibilities in the JD. Each 1-2 lines.
- Behavioral: 2 questions testing leadership, teamwork, conflict resolution. Encourage structured STAR answers.
- Technical: 3 questions mentioning specific tools, concepts, or frameworks from JD.
- STAR Guidance: 4 lines, one for each letter (Situation, Task, Action, Result).
- Tips: 3 practical, actionable tips to improve interview answers.
- Mock Practice: 2 realistic case-based questions with scenario context.
- Avoid very short one-line generic questions. Make them detailed.
- No placeholders. No empty strings. No markdown. No greeting.

JD:{jd}
CV:{resume}"""
        
        result = generate_ai_response(prompt, max_tokens=280, service_name="interview-prep")
        
        # Enrich with external question source links (no LLM usage)
        if isinstance(result, dict) and 'error' not in result:
            manual_company = data.get('company', '')
            company, role = extract_company_and_role(jd, manual_company)
            urls = build_link_urls(company, role)
            
            # Store links under a special key the frontend will render as buttons
            result['_external_links'] = [
                {
                    "label": "View on AmbitionBox",
                    "url": f"https://www.ambitionbox.com/interviews/{urls['company_hyphen']}-interview-questions/{urls['role_hyphen']}"
                },
                {
                    "label": "View on Glassdoor",
                    "url": f"https://www.google.com/search?q={urls['company_plus']}+{urls['role_plus']}+glassdoor+interview+questions"
                }
            ]
        
        print("✅ Interview Prep done")
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/cold-email', methods=['POST'])
def cold_email():
    print("➡️ Cold Email...")
    try:
        data = request.json
        jd = data.get('jd', '')[:INPUT_LIMIT]
        resume = data.get('resume', '')[:INPUT_LIMIT]
        
        prompt = f"""Write a personalized cold job application email.

Return ONLY valid JSON:
{{
  "Subject": "short relevant subject line",
  "Email": "email body"
}}

Rules:
- Email body: 120-150 words.
- Mention candidate's relevant skills from the resume.
- Mention specific value the candidate brings.
- Express genuine interest in the company/role.
- Professional tone. Avoid generic phrases like "I am writing to express my interest".
- No placeholders. No markdown. No greeting outside the email body.

JD:{jd}
CV:{resume}"""
        
        result = generate_ai_response(prompt, max_tokens=220, service_name="cold-email")
        print("✅ Cold Email done")
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/cv-builder', methods=['POST'])
def cv_builder():
    print("➡️ CV Builder...")
    try:
        data = request.json
        jd = data.get('jd', '')[:INPUT_LIMIT]
        resume = data.get('resume', '')[:INPUT_LIMIT]
        
        prompt = f"""Create 4 strong ATS-optimized resume bullet points tailored to this job.

Return ONLY valid JSON:
{{
  "Resume Points": [
    "bullet 1",
    "bullet 2",
    "bullet 3",
    "bullet 4"
  ]
}}

Rules:
- Each bullet: start with action verb, mention a specific skill or tool, mention impact or result.
- Max 18 words per bullet.
- Example style: "Improved SQL query performance reducing report generation time by 30%."
- No placeholders. No empty strings. No markdown. No greeting.

JD:{jd}
CV:{resume}"""
        
        result = generate_ai_response(prompt, max_tokens=220, service_name="cv-builder")
        print("✅ CV Builder done")
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/linkedin-people', methods=['POST'])
def linkedin_people():
    print("➡️ LinkedIn People...")
    try:
        data = request.json
        jd = data.get('jd', '')[:600]
        
        from urllib.parse import quote_plus

        # Use centralized extraction; accept optional manual company from request
        manual_company = data.get('company', '')
        company, role = extract_company_and_role(jd, manual_company)
        
        display_company = company if company else "Company"
        query = f"{display_company} HR"
        
        result = {
            "company": display_company,
            "people": [
                {
                    "title": f"HR / Recruiter",
                    "search_query": query,
                    "linkedin_url": f"https://www.linkedin.com/search/results/people/?keywords={quote_plus(query)}"
                }
            ],
            "company_linkedin_url": f"https://www.linkedin.com/search/results/companies/?keywords={quote_plus(display_company)}"
        }
        
        print("✅ LinkedIn done")
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/callback-probability', methods=['POST'])
def callback_probability():
    print("➡️ Callback Probability...")
    try:
        data = request.json
        jd = data.get('jd', '')[:INPUT_LIMIT]
        resume = data.get('resume', '')[:INPUT_LIMIT]
        
        prompt = f"""Estimate realistic callback probability for this job application.

Return ONLY valid JSON:
{{
  "Response Probability": <number 55-85>,
  "Reasons": ["reason 1", "reason 2"],
  "Tips": ["actionable tip 1", "actionable tip 2"]
}}

Rules:
- Probability range: 55-85. Never 0 unless completely unrelated.
- Provide 2 reasons explaining the probability estimate.
- Provide 2 actionable tips to improve chances.
- Tips must be specific (e.g. "Add Docker certification" not "Improve skills").
- No placeholders. No empty strings. No markdown. No greeting.

JD:{jd}
CV:{resume}"""
        
        result = generate_ai_response(prompt, max_tokens=220, service_name="callback-probability")
        print("✅ Callback done")
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    print("✅ Server starting on Port 5000...")
    app.run(debug=True, port=5000)