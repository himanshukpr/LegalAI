import flask
from flask_cors import CORS
import os
import re
import json
from google import genai
from google.genai import types


import sys
import warnings

from datetime import datetime

from legalai_be.crew import LegalaiBe

warnings.filterwarnings("ignore", category=SyntaxWarning, module="pysbd")

app = flask.Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/api/ai_research', methods=['OPTIONS'])
@app.route('/api/get-news', methods=['OPTIONS'])
def handle_options():
    """Handle preflight CORS requests"""
    response = flask.make_response()
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
    return response

@app.route('/api/ai_research', methods=['POST'])
def run():
    try:
        input_data = flask.request.json.get('query', '')
        if not input_data.strip():
            return flask.jsonify({
                "success": False,
                "error": "Query cannot be empty"
            }), 400

        # For now, let's use a simple response since LegalaiBe import is failing
        # You can replace this with your actual crew implementation later
        
        # Simple AI response using the same Gemini client as news endpoint
        client = genai.Client(api_key="AIzaSyCBCjV4BhCSUeXWoGxPxCWxIo3rB9To-6s")

        # Create a legal research prompt
        prompt = f"""
        You are a legal research assistant. The user has asked: "{input_data}"
        
        Provide a comprehensive, well-structured response that includes:
        1. Direct answer to the question
        2. Relevant legal principles or laws
        3. Key considerations
        4. Practical implications
        
        Format your response in clear sections with headers using markdown.
        Be accurate, informative, and professional.
        """

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )

        ai_response = getattr(response, "text", "") or str(response)
        
        # Return in the format expected by frontend
        result = flask.jsonify({
            "success": True,
            "response": ai_response,
            "result": ai_response
        })
        
        # Add CORS headers
        result.headers.add('Access-Control-Allow-Origin', '*')
        result.headers.add('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        result.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        
        return result
        
    except Exception as e:
        error_response = flask.jsonify({
            "success": False,
            "error": str(e),
            "response": f"Sorry, I encountered an error: {str(e)}. Please try again."
        })
        
        # Add CORS headers even for error responses
        error_response.headers.add('Access-Control-Allow-Origin', '*')
        error_response.headers.add('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        error_response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        
        return error_response, 500



@app.route('/api/get-news', methods=['GET'])
def get_news():
    

    client = genai.Client()

    # Use grounding tool if needed (kept from your original)
    grounding_tool = types.Tool(
        google_search=types.GoogleSearch()
    )

    config = types.GenerateContentConfig(
        tools=[grounding_tool]
    )

    # Strong instruction: return only valid JSON (no extra text)
    prompt = """
    You are a web-research assistant. Use web research to find laws / rules implemented in India within the last 1 month.
    Return EXACTLY one JSON object and nothing else. The JSON object must have a single key "recent_laws_and_rules_india"
    whose value is an array of objects. Each object must include:
    - title
    - topic
    - implementation_status
    - date_of_event
    - description

    Do NOT include any explanatory text, markdown, or commentary — only valid JSON.
    """

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
        config=config,
    )

    raw = getattr(response, "text", "") or str(response)

    # Try to parse directly; if that fails, extract first JSON object from text
    parsed = None
    try:
        parsed = json.loads(raw)
    except json.JSONDecodeError:
        # extract the first {...} block (greedy within balanced braces is hard; this finds outermost JSON object)
        match = re.search(r"(\{(?:.|\n)*\})", raw)
        if match:
            candidate = match.group(1)
            try:
                parsed = json.loads(candidate)
            except json.JSONDecodeError:
                parsed = None

    if parsed is None:
        # If still not parsed, return error response
        return flask.jsonify({
            "error": "There is some problem with the response, Please try again later",
            "recent_laws_and_rules_india": []
        }), 500

    # Create response with CORS headers
    response = flask.jsonify(parsed)
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
    
    return response


def main():
    app.run(debug=True)

if __name__ == "__main__":
    main()