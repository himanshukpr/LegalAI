from crewai.tools import BaseTool
from typing import Type, Any, Dict, List
from pydantic import BaseModel, Field
import requests
import json
import os
from datetime import datetime
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Try to import SerpApi, fall back gracefully if not available
try:
    from serpapi import GoogleSearch
    SERPAPI_AVAILABLE = True
except ImportError:
    SERPAPI_AVAILABLE = False

class LegalSearchInput(BaseModel):
    """Input schema for legal search tools."""
    query: str = Field(..., description="The legal query or topic to search for")
    jurisdiction: str = Field(default="India", description="The jurisdiction (e.g., India, US, UK)")
    legal_area: str = Field(default="general", description="Area of law (e.g., contract, criminal, family, corporate)")

class SerperLegalSearchTool(BaseTool):
    """Enhanced legal search tool using Serper API for web-based legal information."""
    
    name: str = "Serper Legal Search Tool"
    description: str = (
        "Advanced legal search tool that uses Serper API to find comprehensive legal information "
        "including laws, regulations, court decisions, legal procedures, and recent legal updates "
        "from authoritative web sources."
    )
    args_schema: Type[BaseModel] = LegalSearchInput

    def _run(self, query: str, jurisdiction: str = "India", legal_area: str = "general") -> str:
        """
        Perform comprehensive legal search using Serper API and web sources.
        """
        try:
            if not SERPAPI_AVAILABLE:
                return self._fallback_search(query, jurisdiction, legal_area)
            
            serper_api_key = os.getenv('SERPER_API_KEY')
            if not serper_api_key:
                return "❌ **Error**: Serper API key not found. Please set SERPER_API_KEY in your .env file.\n\nTo get a Serper API key:\n1. Visit https://serper.dev\n2. Sign up for an account\n3. Get your API key\n4. Add it to your .env file as SERPER_API_KEY=your_key_here"
            
            # Perform multiple targeted searches
            search_results = {
                "general_legal": self._search_web_legal(query, jurisdiction, legal_area, serper_api_key),
                "procedures": self._search_procedures(query, jurisdiction, serper_api_key),
                "recent_updates": self._search_recent_updates(query, jurisdiction, serper_api_key),
                "case_law": self._search_case_law(query, jurisdiction, serper_api_key)
            }
            
            return self._format_comprehensive_results(search_results, query, jurisdiction)
            
        except Exception as e:
            return f"❌ **Error in legal search**: {str(e)}"
    
    def _search_web_legal(self, query: str, jurisdiction: str, legal_area: str, api_key: str) -> Dict:
        """Search for general legal information using Serper."""
        search_query = f"{query} law {jurisdiction} {legal_area} legal provisions acts regulations"
        
        params = {
            "engine": "google",
            "q": search_query,
            "api_key": api_key,
            "num": 10,
            "gl": "in" if jurisdiction.lower() == "india" else "us",
            "hl": "en"
        }
        
        try:
            search = GoogleSearch(params)
            return search.get_dict()
        except Exception as e:
            return {"error": f"Search failed: {str(e)}"}
    
    def _search_procedures(self, query: str, jurisdiction: str, api_key: str) -> Dict:
        """Search for legal procedures and steps."""
        search_query = f"{query} legal procedure steps process {jurisdiction} how to file application"
        
        params = {
            "engine": "google",
            "q": search_query,
            "api_key": api_key,
            "num": 8
        }
        
        try:
            search = GoogleSearch(params)
            return search.get_dict()
        except Exception as e:
            return {"error": f"Procedure search failed: {str(e)}"}
    
    def _search_recent_updates(self, query: str, jurisdiction: str, api_key: str) -> Dict:
        """Search for recent legal updates and amendments."""
        search_query = f"{query} legal update amendment 2024 2023 {jurisdiction} new law changes"
        
        params = {
            "engine": "google",
            "q": search_query,
            "api_key": api_key,
            "num": 8,
            "tbs": "qdr:y"  # Recent year
        }
        
        try:
            search = GoogleSearch(params)
            return search.get_dict()
        except Exception as e:
            return {"error": f"Updates search failed: {str(e)}"}
    
    def _search_case_law(self, query: str, jurisdiction: str, api_key: str) -> Dict:
        """Search for relevant case law and court decisions."""
        search_query = f"{query} case law court judgment precedent {jurisdiction} supreme court high court"
        
        params = {
            "engine": "google",
            "q": search_query,
            "api_key": api_key,
            "num": 8
        }
        
        try:
            search = GoogleSearch(params)
            return search.get_dict()
        except Exception as e:
            return {"error": f"Case law search failed: {str(e)}"}
    
    def _format_comprehensive_results(self, results: Dict, query: str, jurisdiction: str) -> str:
        """Format comprehensive legal search results."""
        response = f"""# 🏛️ Comprehensive Legal Information: {query}
**Jurisdiction**: {jurisdiction}
**Search Date**: {datetime.now().strftime("%Y-%m-%d")}

"""
        
        # Format general legal information
        general_results = results.get("general_legal", {})
        if "organic_results" in general_results:
            response += "## 📚 APPLICABLE LAWS AND REGULATIONS\n\n"
            for i, result in enumerate(general_results["organic_results"][:5], 1):
                title = result.get("title", "Legal Resource")
                snippet = result.get("snippet", "")
                link = result.get("link", "")
                
                response += f"### {i}. {title}\n"
                if snippet:
                    response += f"**Summary**: {snippet}\n"
                response += f"**Source**: [{link}]({link})\n\n"
        
        # Format procedures
        procedure_results = results.get("procedures", {})
        if "organic_results" in procedure_results:
            response += "## 📋 LEGAL PROCEDURES AND STEPS\n\n"
            for i, result in enumerate(procedure_results["organic_results"][:4], 1):
                title = result.get("title", "Procedure Guide")
                snippet = result.get("snippet", "")
                link = result.get("link", "")
                
                response += f"### Procedure {i}: {title}\n"
                if snippet:
                    response += f"**Process**: {snippet}\n"
                response += f"**Guide**: [{link}]({link})\n\n"
        
        # Format recent updates
        updates_results = results.get("recent_updates", {})
        if "organic_results" in updates_results:
            response += "## 🆕 RECENT LEGAL UPDATES\n\n"
            for i, result in enumerate(updates_results["organic_results"][:3], 1):
                title = result.get("title", "Legal Update")
                snippet = result.get("snippet", "")
                link = result.get("link", "")
                
                response += f"### Update {i}: {title}\n"
                if snippet:
                    response += f"**Details**: {snippet}\n"
                response += f"**Source**: [{link}]({link})\n\n"
        
        # Format case law
        case_results = results.get("case_law", {})
        if "organic_results" in case_results:
            response += "## ⚖️ RELEVANT CASE LAW\n\n"
            for i, result in enumerate(case_results["organic_results"][:3], 1):
                title = result.get("title", "Court Decision")
                snippet = result.get("snippet", "")
                link = result.get("link", "")
                
                response += f"### Case {i}: {title}\n"
                if snippet:
                    response += f"**Judgment Summary**: {snippet}\n"
                response += f"**Case Details**: [{link}]({link})\n\n"
        
        # Add standard legal framework
        response += """## 🎯 LEGAL COMPLIANCE FRAMEWORK

### Key Action Steps:
1. **Review Applicable Laws**: Study all relevant legal provisions identified above
2. **Understand Procedures**: Follow the step-by-step legal procedures outlined
3. **Check Recent Updates**: Stay informed about latest legal changes and amendments
4. **Document Everything**: Maintain comprehensive legal documentation
5. **Professional Consultation**: Seek advice from qualified legal practitioners

### Compliance Checklist:
- [ ] Identify all applicable laws and regulations
- [ ] Understand procedural requirements and timelines
- [ ] Gather required documentation and evidence
- [ ] Ensure compliance with recent legal updates
- [ ] Consult with legal professionals if needed
- [ ] Maintain proper legal records and documentation

## ⚠️ IMPORTANT LEGAL DISCLAIMERS

1. **Professional Legal Advice**: This information is for general guidance only
2. **Jurisdiction-Specific**: Laws and procedures vary significantly by location
3. **Current Information**: Legal requirements change frequently
4. **Individual Circumstances**: Each case requires specific legal analysis
5. **No Legal Responsibility**: This AI cannot provide formal legal advice

## 📞 NEXT STEPS AND RECOMMENDATIONS

### Immediate Actions:
- Consult with a qualified legal professional in your jurisdiction
- Research specific laws and regulations applicable to your situation
- Gather all relevant documentation and evidence
- Understand applicable deadlines and procedural requirements
- Develop a comprehensive legal compliance strategy

### Professional Resources:
- Local bar association lawyer referral services
- Legal aid organizations and pro bono services
- Specialized legal practitioners in relevant practice areas
- Government legal information and guidance services

---
*This information is compiled from web sources and should be verified with qualified legal professionals.*
"""
        
        return response
    
    def _fallback_search(self, query: str, jurisdiction: str, legal_area: str) -> str:
        """Fallback search when Serper API is not available."""
        return f"""# 🏛️ Legal Information: {query}
**Jurisdiction**: {jurisdiction}
**Legal Area**: {legal_area}

## ⚠️ Limited Search Mode
Serper API integration is not available. Install required packages using:
```bash
uv add google-search-results python-dotenv
```

## 📋 General Legal Guidance

### Typical Legal Research Steps:
1. **Identify Legal Framework**: Research applicable laws and regulations
2. **Review Procedures**: Understand required legal procedures and processes
3. **Check Recent Updates**: Look for recent amendments and legal changes
4. **Study Case Law**: Review relevant court decisions and precedents
5. **Professional Consultation**: Consult with qualified legal professionals

### Key Legal Resources for {jurisdiction}:
- Official government legal databases
- Court websites and judgment databases
- Legal information portals and repositories
- Professional legal publications and journals
- Bar association resources and guidelines

### Recommended Actions:
- Set up Serper API for comprehensive legal search
- Consult with legal professionals in your jurisdiction
- Research specific laws applicable to your situation
- Maintain proper legal documentation and records

*For enhanced legal search capabilities, please configure Serper API integration.*
"""

class LegalSearchTool(BaseTool):
    """Basic legal search tool for general legal guidance."""
    
    name: str = "Legal Search Tool"
    description: str = (
        "A comprehensive legal search tool that provides general legal guidance, "
        "legal concepts, definitions, procedures, and legal information framework."
    )
    args_schema: Type[BaseModel] = LegalSearchInput

    def _run(self, query: str, jurisdiction: str = "India", legal_area: str = "general") -> str:
        """
        Perform basic legal search and provide structured guidance.
        """
        try:
            # Provide structured legal guidance based on query
            legal_framework = self._analyze_legal_query(query, jurisdiction, legal_area)
            return self._format_legal_guidance(legal_framework, query, jurisdiction)
            
        except Exception as e:
            return f"Error in legal search: {str(e)}"
    
    def _analyze_legal_query(self, query: str, jurisdiction: str, legal_area: str) -> Dict:
        """Analyze the legal query and provide structured guidance."""
        return {
            "legal_categories": self._categorize_legal_query(query, legal_area),
            "applicable_areas": self._identify_legal_areas(query, jurisdiction),
            "procedural_steps": self._outline_general_procedure(query, legal_area),
            "documentation": self._identify_documentation_needs(query),
            "compliance_aspects": self._identify_compliance_requirements(query, jurisdiction)
        }
    
    def _categorize_legal_query(self, query: str, legal_area: str) -> List[str]:
        """Categorize the legal query into relevant legal areas."""
        categories = []
        
        # Add category based on legal_area
        if legal_area and legal_area != "general":
            categories.append(legal_area.title() + " Law")
        
        # Add general categories based on common legal terms
        legal_keywords = {
            "contract": "Contract Law",
            "property": "Property Law",
            "criminal": "Criminal Law",
            "family": "Family Law",
            "employment": "Employment Law",
            "corporate": "Corporate Law",
            "tax": "Tax Law",
            "intellectual": "Intellectual Property Law",
            "environmental": "Environmental Law",
            "constitutional": "Constitutional Law"
        }
        
        query_lower = query.lower()
        for keyword, category in legal_keywords.items():
            if keyword in query_lower:
                categories.append(category)
        
        if not categories:
            categories.append("General Legal Matter")
        
        return categories
    
    def _identify_legal_areas(self, query: str, jurisdiction: str) -> List[str]:
        """Identify applicable legal areas and jurisdictions."""
        areas = [f"{jurisdiction} Legal Framework"]
        
        # Add common legal areas
        if any(word in query.lower() for word in ["federal", "central", "national"]):
            areas.append("Federal/Central Law")
        if any(word in query.lower() for word in ["state", "provincial", "local"]):
            areas.append("State/Provincial Law")
        if any(word in query.lower() for word in ["municipal", "city", "local"]):
            areas.append("Municipal/Local Law")
        
        return areas
    
    def _outline_general_procedure(self, query: str, legal_area: str) -> List[str]:
        """Outline general legal procedure steps."""
        return [
            "Initial Legal Assessment and Consultation",
            "Legal Research and Analysis of Applicable Laws",
            "Documentation Gathering and Evidence Collection",
            "Legal Strategy Development and Planning",
            "Formal Application or Filing (if required)",
            "Compliance Verification and Review",
            "Implementation and Execution",
            "Monitoring and Follow-up Actions"
        ]
    
    def _identify_documentation_needs(self, query: str) -> List[str]:
        """Identify typical documentation requirements."""
        return [
            "Legal identification and authorization documents",
            "Relevant contracts, agreements, or legal instruments",
            "Supporting evidence and documentation",
            "Compliance certificates and permits (if applicable)",
            "Previous legal correspondence and records",
            "Financial documents (if relevant)",
            "Technical or expert reports (if required)"
        ]
    
    def _identify_compliance_requirements(self, query: str, jurisdiction: str) -> List[str]:
        """Identify general compliance requirements."""
        return [
            f"Compliance with {jurisdiction} legal framework",
            "Adherence to procedural requirements and timelines",
            "Proper documentation and record-keeping",
            "Regulatory compliance and reporting (if applicable)",
            "Professional consultation and legal advice",
            "Regular monitoring and legal updates"
        ]
    
    def _format_legal_guidance(self, framework: Dict, query: str, jurisdiction: str) -> str:
        """Format the legal guidance into a comprehensive response."""
        response = f"""# 🏛️ Legal Guidance for: {query}
**Jurisdiction**: {jurisdiction}
**Analysis Date**: {datetime.now().strftime("%Y-%m-%d")}

## 📚 LEGAL CATEGORIZATION

### Applicable Legal Areas:
"""
        
        for category in framework["legal_categories"]:
            response += f"- {category}\n"
        
        response += "\n### Jurisdictional Framework:\n"
        for area in framework["applicable_areas"]:
            response += f"- {area}\n"
        
        response += "\n## 📋 RECOMMENDED LEGAL PROCEDURE\n\n"
        for i, step in enumerate(framework["procedural_steps"], 1):
            response += f"### Step {i}: {step}\n"
            response += "- Review requirements and gather necessary information\n"
            response += "- Consult with legal professionals if needed\n"
            response += "- Document all actions and decisions\n\n"
        
        response += "## 📄 DOCUMENTATION REQUIREMENTS\n\n"
        for doc in framework["documentation"]:
            response += f"- **{doc}**\n"
        
        response += "\n## ✅ COMPLIANCE CHECKLIST\n\n"
        for req in framework["compliance_aspects"]:
            response += f"- [ ] {req}\n"
        
        response += """
## ⚖️ LEGAL FRAMEWORK CONSIDERATIONS

### Key Legal Principles:
1. **Due Process**: Ensure all legal procedures are followed correctly
2. **Legal Standing**: Verify authority and jurisdiction for legal actions
3. **Statutory Compliance**: Adhere to all applicable laws and regulations
4. **Procedural Fairness**: Follow established legal procedures and timelines
5. **Documentation**: Maintain comprehensive legal records

### Risk Management:
- Identify potential legal risks and liabilities
- Develop mitigation strategies and contingency plans
- Ensure proper legal representation and advice
- Maintain compliance monitoring and review processes

## ⚠️ IMPORTANT DISCLAIMERS

1. **Professional Legal Advice Required**: This is general guidance only
2. **Jurisdiction-Specific Laws**: Legal requirements vary by location and circumstances
3. **Current Legal Information**: Laws and regulations change frequently
4. **Individual Case Analysis**: Each situation requires specific legal evaluation
5. **No Attorney-Client Relationship**: This guidance does not constitute formal legal advice

## 📞 RECOMMENDED NEXT STEPS

### Immediate Actions:
1. **Legal Consultation**: Schedule consultation with qualified legal professional
2. **Legal Research**: Conduct detailed research on applicable laws and regulations
3. **Documentation**: Gather all relevant legal documents and evidence
4. **Timeline Planning**: Understand all applicable deadlines and requirements
5. **Strategy Development**: Develop comprehensive legal action plan

### Long-term Considerations:
- Establish ongoing legal compliance monitoring
- Maintain updated legal documentation and records
- Build relationships with qualified legal professionals
- Stay informed about legal changes and updates

---
*This guidance provides general legal framework information and should be supplemented with professional legal advice.*
"""
        
        return response


# Export the tools for use in crew
__all__ = ["SerperLegalSearchTool", "LegalSearchTool"]
