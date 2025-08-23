#!/usr/bin/env python3

"""
Test script for the updated legal AI system with law definitions and detailed steps
"""

from src.legalai_be.tools.simple_legal_tool import SimpleLegalSearchTool
from src.legalai_be.crew import LegalaiBe
from datetime import datetime

def test_simple_tool():
    """Test the SimpleLegalSearchTool directly"""
    print("=" * 80)
    print("TESTING SimpleLegalSearchTool (Direct)")
    print("=" * 80)
    
    tool = SimpleLegalSearchTool()
    result = tool._run('business registration', 'India')
    print(result)
    print("\n")

def test_crew_system():
    """Test the crew system"""
    print("=" * 80)
    print("TESTING CrewAI System (Complete)")
    print("=" * 80)
    
    try:
        crew_instance = LegalaiBe().crew()
        current_year = datetime.now().year
        
        result = crew_instance.kickoff(inputs={
            'topic': 'property registration',
            'current_year': current_year
        })
        
        print("CREW RESULT:")
        print(str(result))
        print("\n")
        
    except Exception as e:
        print(f"Crew system failed: {e}")
        print("This is expected if crew dependencies are missing\n")

def test_different_queries():
    """Test different types of legal queries"""
    print("=" * 80)
    print("TESTING Different Query Types")
    print("=" * 80)
    
    tool = SimpleLegalSearchTool()
    
    queries = [
        "marriage registration",
        "property purchase",
        "divorce procedure"
    ]
    
    for query in queries:
        print(f"\n--- Testing: {query} ---")
        result = tool._run(query, 'India')
        print(result[:500] + "..." if len(result) > 500 else result)
        print()

if __name__ == "__main__":
    print("Testing Updated Legal AI System")
    print("Features: Law Definitions + Detailed Online/Offline Steps")
    print()
    
    # Test direct tool
    test_simple_tool()
    
    # Test different queries
    test_different_queries()
    
    # Test crew system (optional)
    test_crew_system()
    
    print("=" * 80)
    print("Testing Complete!")
    print("=" * 80)
