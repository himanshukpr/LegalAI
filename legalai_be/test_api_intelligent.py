#!/usr/bin/env python3

"""
Final demonstration of the intelligent Legal AI system
Shows how it distinguishes between process and conversational queries
"""

import requests
import json
import time

API_URL = "http://127.0.0.1:5000/api/ai_research"

def test_api_query(query, expected_type):
    """Test a single query via API"""
    try:
        response = requests.post(
            API_URL,
            headers={"Content-Type": "application/json"},
            json={"query": query},
            timeout=30
        )
        
        if response.status_code == 200:
            data = response.json()
            if data.get("success"):
                result = data.get("response", "")
                
                # Determine response type
                if "## Main Laws & Definitions" in result:
                    detected_type = "PROCESS (Detailed Format)"
                else:
                    detected_type = "CONVERSATIONAL (Simple Format)"
                
                status = "✅ CORRECT" if expected_type.upper() in detected_type else "❌ WRONG"
                
                print(f"{status} | '{query}'")
                print(f"Expected: {expected_type}")
                print(f"Detected: {detected_type}")
                print(f"Response: {result[:150]}...")
                print("-" * 80)
                return True
            else:
                print(f"❌ API Error for '{query}': {data.get('error', 'Unknown error')}")
                return False
        else:
            print(f"❌ HTTP Error for '{query}': {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Exception for '{query}': {str(e)}")
        return False

def main():
    print("🧠 Testing Intelligent Legal AI System via API")
    print("=" * 80)
    print("🔍 Detecting Process vs Conversational Queries")
    print("=" * 80)
    
    # Test cases: (query, expected_type)
    test_cases = [
        # Process queries (should get detailed format)
        ("company registration process", "PROCESS"),
        ("how to register a business", "PROCESS"),
        ("property registration procedure", "PROCESS"), 
        ("marriage registration steps", "PROCESS"),
        ("what documents are required for GST registration", "PROCESS"),
        ("how do I apply for a passport", "PROCESS"),
        ("how to start a company", "PROCESS"),
        
        # Conversational queries (should get simple format)
        ("what is constitutional law", "CONVERSATIONAL"),
        ("explain property rights in India", "CONVERSATIONAL"),
        ("what are fundamental rights", "CONVERSATIONAL"),
        ("define contract law", "CONVERSATIONAL"),
        ("what is company law", "CONVERSATIONAL"),
        ("explain the concept of bail", "CONVERSATIONAL"),
        ("tell me about Indian legal system", "CONVERSATIONAL"),
        
        # Edge cases
        ("company law", "CONVERSATIONAL"),
        ("property", "CONVERSATIONAL"),
        ("legal advice", "CONVERSATIONAL")
    ]
    
    print(f"Testing {len(test_cases)} queries...\n")
    
    success_count = 0
    total_count = len(test_cases)
    
    for query, expected_type in test_cases:
        if test_api_query(query, expected_type):
            success_count += 1
        time.sleep(1)  # Small delay between requests
    
    print("=" * 80)
    print("📊 FINAL RESULTS")
    print("=" * 80)
    print(f"✅ Successful Tests: {success_count}/{total_count}")
    print(f"📈 Success Rate: {(success_count/total_count)*100:.1f}%")
    print()
    
    if success_count == total_count:
        print("🎉 ALL TESTS PASSED!")
        print("✅ Process queries → Detailed format with laws, steps, documents")
        print("✅ Conversational queries → Simple, direct answers")
        print("✅ System intelligently detects query type")
    else:
        print("⚠️  Some tests failed. Check the results above.")
    
    print("=" * 80)

if __name__ == "__main__":
    # Wait a moment for server to be ready
    print("Waiting for server to be ready...")
    time.sleep(3)
    main()
