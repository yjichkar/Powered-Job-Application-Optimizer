import requests
import json

url = "http://localhost:5000/api/analyze-all"
data = {
    "jd": "Software Engineer job description...",
    "resume": "Senior Developer resume..."
}

try:
    print("Sending request...")
    res = requests.post(url, json=data)
    print(f"Status: {res.status_code}")
    print(f"Text: {res.text[:500]}")
except Exception as e:
    print(f"Error: {e}")
