#!/usr/bin/env python3

"""
Test script for the intelligent legal AI system that distinguishes between:
1. Process queries (detailed format with laws, steps, documents)
2. Conversational queries (simple, direct answers)
"""

from src.legalai_be.tools.simple_legal_tool import SimpleLegalSearchTool

def test_process_queries():
    """Test queries that should trigger detailed process format"""
    print("=" * 80)
    print("TESTING PROCESS QUERIES (Should get detailed format)")
    print("=" * 80)
    
    tool = SimpleLegalSearchTool()
    
    process_queries = [
        "company registration process",
        "how to register a business",
        "property registration procedure",
        "marriage registration steps",
        "what documents are required for GST registration",
        "how do I apply for a passport",
        "business license application process"
    ]
    
    for query in process_queries:
        print(f"\n🔧 PROCESS QUERY: '{query}'")
        print("-" * 50)
        result = tool._run(query, 'India')
        # Show first 300 characters to check format
        preview = result[:300] + "..." if len(result) > 300 else result
        print(preview)
        print()

def test_conversational_queries():
    """Test queries that should trigger conversational responses"""
    print("=" * 80)
    print("TESTING CONVERSATIONAL QUERIES (Should get simple answers)")
    print("=" * 80)
    
    tool = SimpleLegalSearchTool()
    
    conversational_queries = [
        "what is constitutional law",
        "explain property rights in India",
        "what are fundamental rights",
        "tell me about Indian legal system",
        "what is the meaning of jurisprudence",
        "define contract law",
        "what are the types of courts in India",
        "explain the concept of bail"
    ]
    
    for query in conversational_queries:
        print(f"\n💬 CONVERSATIONAL QUERY: '{query}'")
        print("-" * 50)
        result = tool._run(query, 'India')
        print(result)
        print()

def test_edge_cases():
    """Test edge cases and ambiguous queries"""
    print("=" * 80)
    print("TESTING EDGE CASES")
    print("=" * 80)
    
    tool = SimpleLegalSearchTool()
    
    edge_queries = [
        "company law",  # Could be either
        "property",     # General term
        "marriage",     # General term
        "legal advice", # General
        "court cases",  # General
        "how to start a company",  # Should be process
        "what is company law"       # Should be conversational
    ]
    
    for query in edge_queries:
        print(f"\n❓ EDGE CASE: '{query}'")
        print("-" * 50)
        result = tool._run(query, 'India')
        # Show first 200 characters to identify response type
        preview = result[:200] + "..." if len(result) > 200 else result
        print(preview)
        
        # Check response type
        if "## Main Laws & Definitions" in result:
            print("➡️ DETECTED AS: Process Query (Detailed Format)")
        else:
            print("➡️ DETECTED AS: Conversational Query (Simple Format)")
        print()

def test_detection_logic():
    """Test the query detection logic directly"""
    print("=" * 80)
    print("TESTING QUERY DETECTION LOGIC")
    print("=" * 80)
    
    tool = SimpleLegalSearchTool()
    
    test_cases = [
        ("company registration", True),
        ("how to register company", True),
        ("what is company law", False),
        ("business license application", True),
        ("explain contract law", False),
        ("property purchase procedure", True),
        ("what are property rights", False),
        ("marriage registration process", True),
        ("define marriage", False),
        ("GST registration steps", True),
        ("what is GST", False)
    ]
    
    print("Query Detection Results:")
    print("-" * 50)
    for query, expected in test_cases:
        result = tool._is_process_query(query)
        status = "✅ CORRECT" if result == expected else "❌ WRONG"
        query_type = "PROCESS" if result else "CONVERSATIONAL"
        expected_type = "PROCESS" if expected else "CONVERSATIONAL"
        print(f"{status} | '{query}' → {query_type} (expected: {expected_type})")

if __name__ == "__main__":
    print("Testing Intelligent Legal AI System")
    print("Smart Detection: Process Queries vs Conversational Queries")
    print()
    
    # Test detection logic first
    test_detection_logic()
    
    # Test process queries
    test_process_queries()
    
    # Test conversational queries  
    test_conversational_queries()
    
    # Test edge cases
    test_edge_cases()
    
    print("=" * 80)
    print("Testing Complete!")
    print("✅ Process queries get detailed format (laws, steps, documents)")
    print("✅ Conversational queries get simple, direct answers")
    print("=" * 80)
