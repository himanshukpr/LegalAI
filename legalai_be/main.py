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

from src.legalai_be.crew import LegalaiBe

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

        # Check if this is a process/procedure query
        if not _is_process_query(input_data):
            # Handle as conversational query
            return _handle_conversational_query(input_data)

        # Use the crew system with our enhanced tools for process queries
        crew_instance = LegalaiBe().crew()
        
        # Get current year for the crew
        current_year = datetime.now().year
        
        # Run the crew with the updated prompt
        result = crew_instance.kickoff(inputs={
            'topic': input_data,
            'current_year': current_year
        })
        
        # Extract the final result
        ai_response = str(result)
        
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
        # Fallback to simple Gemini response if crew fails
        try:
            if _is_process_query(input_data):
                # Use detailed process format
                client = genai.Client(api_key="AIzaSyCBCjV4BhCSUeXWoGxPxCWxIo3rB9To-6s")

                prompt = f"""
                User asked: "{input_data}"
                
                Provide SHORT legal process information for India only. Format:
                
                ## Main Laws & Definitions
                • **[Law 1 Name]**
                  [2-3 line definition explaining what this law covers]
                • **[Law 2 Name]**
                  [2-3 line definition explaining what this law covers]
                
                ## Online Process (Detailed Steps)
                1. **[Step Title]**
                   - [Detailed action to take]
                   - Portal: [specific website/portal]
                
                2. **[Step Title]**
                   - [Detailed action to take]
                   - Portal: [specific website/portal]
                
                ## Offline Process (Detailed Steps)
                1. **[Step Title]**
                   - [Detailed action to take]
                   - Location: [specific office/location]
                
                2. **[Step Title]**
                   - [Detailed action to take]
                   - Location: [specific office/location]
                
                ## Documents
                • [Doc 1]
                • [Doc 2]
                • [Doc 3]
                
                ## Official Links
                • [Official government link]
                • [Application portal]
                
                **Timeline:** [duration]
                **Fees:** [amount]
                
                Keep under 250 words. Focus on India only. Include law definitions and detailed step-by-step processes.
                """
            else:
                # Use conversational format
                client = genai.Client(api_key="AIzaSyCBCjV4BhCSUeXWoGxPxCWxIo3rB9To-6s")

                prompt = f"""
                User asked: "{input_data}"
                
                Provide a helpful conversational response about legal matters in India. 
                Do NOT provide detailed process steps unless specifically asked for a procedure or process.
                
                Keep the response informative but conversational, under 150 words.
                If the user needs process information, suggest they ask about specific procedures.
                """

            response = client.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt
            )

            ai_response = getattr(response, "text", "") or str(response)
            
        except Exception as fallback_error:
            ai_response = f"Sorry, I encountered an error: {str(e)}. Fallback also failed: {str(fallback_error)}. Please try again."
        
        # Return fallback response
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


def _is_process_query(query: str) -> bool:
    """Check if the query is asking for a legal process/procedure"""
    query_lower = query.lower()
    
    # Strong process indicators - these clearly indicate process queries
    strong_process_keywords = [
        "registration", "register", "apply", "procedure", "process", "steps", 
        "how to", "filing", "submit", "application", "documents required",
        "requirements", "forms", "certificate", "license", "permit",
        "incorporation", "dissolution", "transfer"
    ]
    
    # Process-specific question patterns
    process_patterns = [
        "how do i", "how can i", "what is the procedure", "what are the steps",
        "how to get", "how to obtain", "how to apply", "how to file",
        "what documents", "which documents", "what forms", "which forms",
        "where to apply", "where to submit", "when to apply", "timeline for",
        "cost of", "fee for", "charges for", "time required for",
        "how to start", "how to setup", "how to create", "how to establish"
    ]
    
    # Check for strong process indicators first
    has_strong_keywords = any(keyword in query_lower for keyword in strong_process_keywords)
    has_process_patterns = any(pattern in query_lower for pattern in process_patterns)
    
    # If we have strong indicators, it's definitely a process query
    if has_strong_keywords or has_process_patterns:
        return True
    
    # Additional check: if query is just asking "what is X" or "define X" or "explain X"
    # then it's likely conversational, not process
    conversational_patterns = [
        "what is", "what are", "define", "explain", "meaning of", 
        "concept of", "types of", "kinds of", "tell me about"
    ]
    
    is_conversational = any(pattern in query_lower for pattern in conversational_patterns)
    
    # If it's clearly conversational, return False
    if is_conversational:
        return False
    
    # For edge cases, check if it contains specific legal areas combined with action words
    legal_areas = ["company", "business", "property", "marriage", "divorce", "visa", "passport"]
    action_words = ["buy", "sell", "purchase", "sale", "start", "setup", "create", "establish"]
    
    has_legal_area = any(area in query_lower for area in legal_areas)
    has_action = any(action in query_lower for action in action_words)
    
    # If it has both legal area and action words, it's likely a process query
    if has_legal_area and has_action:
        return True
    
    # Default to conversational for ambiguous cases
    return False


def _handle_conversational_query(query: str):
    """Handle conversational queries that don't need process information"""
    try:
        client = genai.Client(api_key="AIzaSyCBCjV4BhCSUeXWoGxPxCWxIo3rB9To-6s")

        prompt = f"""
        User asked: "{query}"
        
        Provide a helpful, conversational response about legal matters in India. 
        Do NOT provide detailed process steps, laws, or formatted procedure information unless specifically asked.
        
        Keep the response informative but conversational, under 150 words.
        If the user needs specific process information, suggest they ask about procedures or processes.
        Focus on answering their question directly and naturally.
        """

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )

        ai_response = getattr(response, "text", "") or str(response)
        
        # Return conversational response
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
        # Simple fallback for conversational queries
        fallback_response = f"I can help you with legal information for India. If you need specific procedures or step-by-step guidance, please ask about the particular process you're interested in."
        
        result = flask.jsonify({
            "success": True,
            "response": fallback_response,
            "result": fallback_response
        })
        
        result.headers.add('Access-Control-Allow-Origin', '*')
        result.headers.add('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        result.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        
        return result



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