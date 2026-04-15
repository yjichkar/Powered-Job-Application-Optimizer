"""Quick test to validate each API key individually"""
import google.generativeai as genai
import os, sys
from pathlib import Path
from dotenv import load_dotenv

# Force stdout flush
sys.stdout.reconfigure(line_buffering=True)

# Load .env
env_path = Path(__file__).resolve().parent / '.env'
load_dotenv(dotenv_path=env_path)

keys = {
    1: os.getenv('GEMINI_API_KEY_1', '').strip(),
    2: os.getenv('GEMINI_API_KEY_2', '').strip(),
    3: os.getenv('GEMINI_API_KEY_3', '').strip(),
    4: os.getenv('GEMINI_API_KEY_4', '').strip(),
}

results = []

# Test with gemini-2.0-flash as fallback
models_to_try = ["gemini-2.5-flash", "gemini-2.0-flash"]

for model_name in models_to_try:
    print(f"\n=== Testing with model: {model_name} ===")
    for key_id, api_key in keys.items():
        if not api_key:
            print(f"  Key {key_id}: EMPTY")
            continue
        
        try:
            genai.configure(api_key=api_key)
            model = genai.GenerativeModel(model_name)
            response = model.generate_content("Reply with exactly: OK",
                generation_config=genai.GenerationConfig(max_output_tokens=10))
            print(f"  Key {key_id}: ✅ VALID - '{response.text.strip()}'")
            results.append((key_id, model_name, "OK"))
            break  # If one key works with this model, we know the model works
        except Exception as e:
            err_str = str(e)
            # Truncate long errors
            if len(err_str) > 120:
                err_str = err_str[:120] + "..."
            print(f"  Key {key_id}: ❌ FAILED - {err_str}")
            results.append((key_id, model_name, err_str))
    
    # If any key worked, stop trying other models
    if any(r[2] == "OK" for r in results):
        break

print("\n=== SUMMARY ===")
working_model = None
for r in results:
    if r[2] == "OK":
        working_model = r[1]
        print(f"✅ Key {r[0]} works with {r[1]}")

if working_model:
    print(f"\nRecommendation: Use model '{working_model}'")
else:
    print("\n❌ No keys/models worked. Keys may be revoked or API not enabled.")
