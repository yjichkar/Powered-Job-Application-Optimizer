from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
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
load_dotenv(dotenv_path=env_path)

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

# 2. Configure Gemini
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
if not GEMINI_API_KEY:
    print("❌ ERROR: GEMINI_API_KEY not found.")
else:
    genai.configure(api_key=GEMINI_API_KEY)

# ==========================================
# 🚀 MODEL CONFIGURATION - Token Optimized
# ==========================================
selected_model = "gemini-2.5-flash-lite"
print(f"🚀 USING MODEL: {selected_model}")

model = genai.GenerativeModel(selected_model)

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
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
        }
        
        response = requests.get(url, headers=headers, timeout=15)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Remove script, style, nav, footer elements
        for element in soup(['script', 'style', 'nav', 'footer', 'header', 'aside']):
            element.decompose()
        
        # Try to find job description content
        jd_text = ""
        
        # Common job description container selectors
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
        
        # Fallback: get body text
        if len(jd_text) < 200:
            body = soup.find('body')
            if body:
                jd_text = body.get_text(separator='\n', strip=True)
        
        # Clean up the text
        lines = [line.strip() for line in jd_text.split('\n') if line.strip()]
        jd_text = '\n'.join(lines)
        
        # Extract company name and job title from meta/title
        title = soup.find('title')
        title_text = title.get_text() if title else ""
        
        # Try to extract company name
        company_name = ""
        company_meta = soup.find('meta', {'property': 'og:site_name'})
        if company_meta:
            company_name = company_meta.get('content', '')
        
        return {
            'success': True,
            'jd_text': jd_text[:5000],  # Limit to 5000 chars
            'page_title': title_text,
            'company_name': company_name,
            'url': url
        }
        
    except requests.exceptions.Timeout:
        return {'success': False, 'error': 'Request timed out. The website took too long to respond.'}
    except requests.exceptions.RequestException as e:
        return {'success': False, 'error': f'Could not fetch URL: {str(e)}'}
    except Exception as e:
        return {'success': False, 'error': f'Scraping error: {str(e)}'}

def generate_ai_response(prompt, fallback_text="AI response unavailable"):
    """Generate AI response with token-optimized config"""
    try:
        config = {
            "response_mime_type": "application/json",
            "temperature": 0.3,  # Lower = more deterministic, fewer tokens
            "max_output_tokens": 1500  # Limit output size
        }
        try:
            response = model.generate_content(prompt, generation_config=config)
            if not response or not response.text:
                print("❌ Empty response from Gemini API")
                return {"error": "Empty response from AI. Please try again."}
            return json.loads(response.text)
        except json.JSONDecodeError as je:
            print(f"❌ JSON parse error with config: {je}")
            # Try without JSON config
            response = model.generate_content(prompt)
            if not response or not response.text:
                return {"error": "Empty response from AI. Please try again."}
            text = response.text.strip()
            print(f"Raw response (first 200 chars): {text[:200]}")
            if text.startswith("```"):
                text = text.split("```")[1]
                if text.startswith("json"):
                    text = text[4:]
            return json.loads(text.strip())
        except Exception as inner_e:
            print(f"❌ Inner AI Error: {inner_e}")
            # Try fallback without JSON config
            try:
                response = model.generate_content(prompt)
                if not response or not response.text:
                    return {"error": "Empty response from AI. Please try again."}
                text = response.text.strip()
                print(f"Fallback raw response (first 200 chars): {text[:200]}")
                if text.startswith("```"):
                    text = text.split("```")[1]
                    if text.startswith("json"):
                        text = text[4:]
                return json.loads(text.strip())
            except Exception as fallback_e:
                print(f"❌ Fallback error: {fallback_e}")
                return {"error": f"AI processing failed: {str(inner_e)}"}
    except Exception as e:
        print(f"❌ AI Error: {e}")
        return {"error": f"AI service error: {str(e)}"}

# ==========================================
# API ENDPOINTS
# ==========================================

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'message': 'System Operational'}), 200

@app.route('/api/scrape-jd', methods=['POST'])
def scrape_jd():
    """Scrape job description from URL"""
    print("➡️ Processing URL Scrape...")
    try:
        data = request.json
        url = data.get('url', '')
        
        if not url:
            return jsonify({'success': False, 'error': 'URL is required'}), 400
        
        # Validate URL format
        parsed = urlparse(url)
        if not parsed.scheme or not parsed.netloc:
            return jsonify({'success': False, 'error': 'Invalid URL format'}), 400
        
        result = scrape_job_description(url)
        
        if result['success']:
            print(f"✅ Scraped {len(result['jd_text'])} characters from {url}")
        else:
            print(f"❌ Scrape failed: {result['error']}")
        
        return jsonify(result), 200 if result['success'] else 400
        
    except Exception as e:
        print(f"❌ Scrape Error: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/analyze-comprehensive', methods=['POST'])
def analyze_comprehensive():
    """Main comprehensive analysis - token optimized"""
    print(f"➡️ Processing Comprehensive Analysis...")
    try:
        jd_text = request.form.get('jd', '')
        resume_file = request.files.get('resume_file')
        
        resume_text = ""
        if resume_file:
            resume_text = extract_text_from_pdf(resume_file)
        
        prompt = f"""JD:{jd_text[:1500]}
RESUME:{resume_text[:1500]}
Return JSON:{{"ats_score":0-100,"job_suitability_score":0-100,"missing_skills":[],"strong_points":[],"callback_probability":0-100,"callback_reason":"brief","company_name":"str","hiring_manager_clues":[]}}"""
        
        result = generate_ai_response(prompt)
        result['resume_text_content'] = resume_text
        
        return jsonify(result), 200
    except Exception as e:
        print(f"❌ Error: {e}")
        return jsonify({'error': str(e)}), 500

# ==========================================
# SERVICE-SPECIFIC ENDPOINTS
# ==========================================

@app.route('/api/ats-scanner', methods=['POST'])
def ats_scanner():
    """ATS compatibility - token optimized"""
    print("➡️ Processing ATS Scanner...")
    try:
        data = request.json
        jd = data.get('jd', '')
        resume = data.get('resume', '')
        
        prompt = f"""JD:{jd[:1200]}
RESUME:{resume[:1200]}
ATS analysis JSON:{{"ats_score":0-100,"format_issues":[max3],"keyword_matches":[max5],"missing_keywords":[max5],"section_analysis":{{"contact":{{"status":"good/warning/error","feedback":"brief"}},"experience":{{...}},"education":{{...}},"skills":{{...}}}},"recommendations":[max3]}}"""
        
        result = generate_ai_response(prompt)
        print("✅ ATS Scanner completed")
        return jsonify(result), 200
    except Exception as e:
        print(f"❌ ATS Scanner Error: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/job-suitability', methods=['POST'])
def job_suitability():
    """Job match - token optimized"""
    print("➡️ Processing Job Suitability...")
    try:
        data = request.json
        jd = data.get('jd', '')
        resume = data.get('resume', '')
        
        prompt = f"""JD:{jd[:1200]}
RESUME:{resume[:1200]}
Match JSON:{{"suitability_score":0-100,"experience_match":0-100,"skills_match":0-100,"education_match":0-100,"overall_assessment":"1-2 sentences","strengths":[max4],"gaps":[max4],"verdict":"Strong/Good/Partial/Weak Match"}}"""
        
        result = generate_ai_response(prompt)
        print("✅ Job Suitability completed")
        return jsonify(result), 200
    except Exception as e:
        print(f"❌ Job Suitability Error: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/skill-gap', methods=['POST'])
def skill_gap():
    """Skill gap - token optimized"""
    print("➡️ Processing Skill Gap Analysis...")
    try:
        data = request.json
        jd = data.get('jd', '')
        resume = data.get('resume', '')
        
        prompt = f"""JD:{jd[:1200]}
RESUME:{resume[:1200]}
Skill gap JSON:{{"required_skills":[{{"skill":"str","importance":"critical/high/medium","has_skill":bool}}max6],"missing_critical":[max3],"missing_preferred":[max3],"transferable_skills":[max3],"learning_recommendations":[{{"skill":"str","resource_type":"course/cert/project","estimated_time":"str"}}max3],"gap_severity":"minimal/moderate/significant"}}"""
        
        result = generate_ai_response(prompt)
        print("✅ Skill Gap Analysis completed")
        return jsonify(result), 200
    except Exception as e:
        print(f"❌ Skill Gap Error: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/interview-prep', methods=['POST'])
def interview_prep():
    """Interview prep - token optimized"""
    print("➡️ Processing Interview Prep...")
    try:
        data = request.json
        jd = data.get('jd', '')
        resume = data.get('resume', '')
        
        prompt = f"""JD:{jd[:1200]}
RESUME:{resume[:1200]}
Interview prep JSON:{{"technical":[{{"question":"str","suggested_answer":"brief"}}x3],"behavioral":[{{"question":"str","suggested_answer":"brief"}}x3],"situational":[{{"question":"str","suggested_answer":"brief"}}x2],"questions_to_ask":[3 items],"company_research_points":[3 items]}}"""
        
        result = generate_ai_response(prompt)
        print("✅ Interview Prep completed")
        return jsonify(result), 200
    except Exception as e:
        print(f"❌ Interview Prep Error: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/cold-email', methods=['POST'])
def cold_email():
    """Cold email - token optimized"""
    print("➡️ Processing Cold Email Generator...")
    try:
        data = request.json
        jd = data.get('jd', '')
        resume = data.get('resume', '')
        
        prompt = f"""JD:{jd[:1000]}
RESUME:{resume[:1000]}
Cold outreach JSON:{{"email_to_recruiter":{{"subject":"str","body":"concise"}},"email_to_hiring_manager":{{"subject":"str","body":"concise"}},"linkedin_message":"50 words max","follow_up_email":{{"subject":"str","body":"concise"}},"tips":[3 items]}}"""
        
        result = generate_ai_response(prompt)
        print("✅ Cold Email completed")
        return jsonify(result), 200
    except Exception as e:
        print(f"❌ Cold Email Error: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/cv-builder', methods=['POST'])
def cv_builder():
    """CV builder - token optimized"""
    print("➡️ Processing CV Builder...")
    try:
        data = request.json
        jd = data.get('jd', '')
        resume = data.get('resume', '')
        
        prompt = f"""JD:{jd[:1200]}
RESUME:{resume[:1200]}
CV optimization JSON:{{"summary_suggestion":"2-3 sentences","experience_improvements":[{{"original":"brief","improved":"brief"}}max3],"skills_to_add":[max4],"skills_to_emphasize":[max3],"keywords_to_include":[max5],"formatting_tips":[max3],"overall_score":0-100}}"""
        
        result = generate_ai_response(prompt)
        print("✅ CV Builder completed")
        return jsonify(result), 200
    except Exception as e:
        print(f"❌ CV Builder Error: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/linkedin-people', methods=['POST'])
def linkedin_people():
    """LinkedIn finder - token optimized"""
    print("➡️ Processing LinkedIn People Finder...")
    try:
        data = request.json
        jd = data.get('jd', '')
        
        prompt = f"""JD:{jd[:1000]}
LinkedIn networking JSON:{{"company_name":"str","roles_to_find":[max4],"search_queries":[max3],"connection_message_templates":[max2],"engagement_tips":[max3],"networking_strategy":"1-2 sentences"}}"""
        
        result = generate_ai_response(prompt)
        print("✅ LinkedIn People completed")
        return jsonify(result), 200
    except Exception as e:
        print(f"❌ LinkedIn People Error: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/callback-probability', methods=['POST'])
def callback_probability():
    """Callback probability - token optimized"""
    print("➡️ Processing Callback Probability...")
    try:
        data = request.json
        jd = data.get('jd', '')
        resume = data.get('resume', '')
        
        prompt = f"""JD:{jd[:1200]}
RESUME:{resume[:1200]}
Callback analysis JSON:{{"callback_probability":0-100,"confidence_level":"low/medium/high","positive_factors":[max3],"negative_factors":[max3],"competition_assessment":"1 sentence","timing_advice":"1 sentence","improvement_actions":[max3],"realistic_expectation":"1-2 sentences"}}"""
        
        result = generate_ai_response(prompt)
        print("✅ Callback Probability completed")
        return jsonify(result), 200
    except Exception as e:
        print(f"❌ Callback Probability Error: {e}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    print("✅ Server starting on Port 5000...")
    app.run(debug=True, port=5000)