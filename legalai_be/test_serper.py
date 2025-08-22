#!/usr/bin/env python3
"""
Test script for Serper API integration in Legal AI Assistant
"""

import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def test_serper_setup():
    """Test if Serper API is properly configured"""
    print("🔍 Testing Serper API Setup...\n")
    
    # Check if API key is available
    serper_api_key = os.getenv('SERPER_API_KEY')
    
    if not serper_api_key:
        print("❌ SERPER_API_KEY not found in environment variables")
        print("\n📝 To set up Serper API:")
        print("1. Visit https://serper.dev")
        print("2. Sign up for a free account")
        print("3. Get your API key")
        print("4. Add it to your .env file:")
        print("   SERPER_API_KEY=your_api_key_here")
        return False
    
    if serper_api_key == "your_serper_api_key_here":
        print("⚠️  Please replace the placeholder API key with your actual Serper API key")
        print("\n📝 To get your Serper API key:")
        print("1. Visit https://serper.dev")
        print("2. Sign up for a free account")
        print("3. Copy your API key")
        print("4. Replace 'your_serper_api_key_here' in .env file")
        return False
    
    print("✅ Serper API key found!")
    print(f"   Key: {serper_api_key[:8]}...{serper_api_key[-4:]}")
    
    # Test importing SerperLegalSearchTool
    try:
        from src.legalai_be.tools.custom_tool import SerperLegalSearchTool
        print("✅ SerperLegalSearchTool imported successfully!")
        
        # Test creating the tool
        tool = SerperLegalSearchTool()
        print("✅ SerperLegalSearchTool created successfully!")
        
        return True
        
    except ImportError as e:
        print(f"❌ Failed to import SerperLegalSearchTool: {e}")
        return False
    except Exception as e:
        print(f"❌ Error creating SerperLegalSearchTool: {e}")
        return False

def test_basic_search():
    """Test basic legal search functionality"""
    print("\n🔍 Testing Basic Legal Search...\n")
    
    try:
        from src.legalai_be.tools.custom_tool import SerperLegalSearchTool
        
        # Create tool instance
        search_tool = SerperLegalSearchTool()
        
        # Test search
        print("🔍 Searching for: 'contract law basics'")
        result = search_tool._run(
            query="contract law basics",
            jurisdiction="India",
            legal_area="contract"
        )
        
        print("✅ Search completed!")
        print(f"📝 Result length: {len(result)} characters")
        
        # Show first 500 characters of result
        print(f"\n📄 Sample output:\n{result[:500]}...")
        
        return True
        
    except Exception as e:
        print(f"❌ Search test failed: {e}")
        return False

def main():
    """Main test function"""
    print("🏛️  Legal AI Assistant - Serper Integration Test")
    print("=" * 50)
    
    # Test setup
    setup_ok = test_serper_setup()
    
    if setup_ok:
        # Test basic search if setup is OK
        search_ok = test_basic_search()
        
        if search_ok:
            print("\n🎉 All tests passed! Serper integration is working correctly.")
            print("\n📋 Next steps:")
            print("1. Run your main Legal AI Assistant: python main.py")
            print("2. Ask legal questions to test the full system")
            print("3. The system will use Serper API for comprehensive legal research")
        else:
            print("\n⚠️  Setup OK but search test failed. Check your API key validity.")
    else:
        print("\n⚠️  Please complete the Serper API setup before proceeding.")
    
    print("\n🔗 Useful Links:")
    print("   - Serper API: https://serper.dev")
    print("   - API Documentation: https://serper.dev/api-key")
    print("   - Free tier: 2,500 searches per month")

if __name__ == "__main__":
    main()
