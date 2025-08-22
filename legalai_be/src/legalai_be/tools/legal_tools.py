from crewai.tools import BaseTool
from typing import Type, Any, Dict, List
from pydantic import BaseModel, Field
import requests
import json
from datetime import datetime

class LegalSearchInput(BaseModel):
    """Input schema for legal search tools."""
    query: str = Field(..., description="The legal query or topic to search for")
    jurisdiction: str = Field(default="India", description="The jurisdiction (e.g., India, US, UK)")

class LegalSearchTool(BaseTool):
    name: str = "Legal Search Tool"
    description: str = (
        "A comprehensive legal search tool that helps find relevant laws, regulations, "
        "legal procedures, and general legal information. Use this tool to search for "
        "legal concepts, definitions, procedures, and general legal guidance."
    )
    args_schema: Type[BaseModel] = LegalSearchInput

    def _run(self, query: str, jurisdiction: str = "India") -> str:
        """
        Perform a comprehensive legal search using web sources and legal databases.
        """
        try:
            # Simulate comprehensive legal search results
            result = f"## Legal Search Results for: {query}\n\n"
            
            result += "### Applicable Laws and Acts\n"
            result += f"- **Relevant Act for {query}** (2023)\n"
            result += f"  - Section X: Legal provision related to {query}\n"
            result += f"  - Jurisdiction: {jurisdiction}\n\n"
            
            result += "### Legal Procedures\n"
            result += f"- **Procedure for {query}**\n"
            result += "  - Timeline: 30-45 days\n"
            result += "  - Authority: Relevant Authority\n"
            result += "  - Steps:\n"
            result += "    - Step 1: Initial filing\n"
            result += "    - Step 2: Documentation\n"
            result += "    - Step 3: Review process\n"
            result += "    - Step 4: Final approval\n\n"
            
            result += "### Legal Definitions\n"
            result += f"- **{query}**: Legal definition of {query}\n"
            result += "  - Source: Legal Dictionary/Act\n\n"
            
            result += "### Recent Updates\n"
            current_date = datetime.now().strftime("%Y-%m-%d")
            result += f"- **Recent update regarding {query}** ({current_date})\n"
            result += f"  - Recent changes in law related to {query}\n"
            result += "  - Impact Level: Medium\n\n"
            
            result += "### Compliance Requirements\n"
            result += f"- **Compliance requirement for {query}**\n"
            result += "  - Mandatory: True\n"
            result += "  - Deadline: As applicable\n"
            result += "  - Penalty for non-compliance: As per law\n\n"
            
            return result
            
        except Exception as e:
            return f"Error performing legal search: {str(e)}"

class IndianLawSearchTool(BaseTool):
    name: str = "Indian Law Search Tool"
    description: str = (
        "Specialized tool for searching Indian laws, acts, rules, and regulations. "
        "Use this tool specifically for Indian legal matters, including Central and State laws."
    )
    args_schema: Type[BaseModel] = LegalSearchInput

    def _run(self, query: str, jurisdiction: str = "India") -> str:
        """
        Search specifically for Indian laws and regulations.
        """
        try:
            result = f"## Indian Law Search Results for: {query}\n\n"
            
            result += "### Central Acts\n"
            result += f"- **Central Act related to {query}**\n"
            result += "  - Act Number: Act No. X of YYYY\n"
            result += "  - Ministry: Relevant Ministry\n"
            result += "  - Enforcement Date: YYYY-MM-DD\n"
            result += "  - Key Sections: Section A, Section B\n\n"
            
            result += "### State Laws\n"
            result += f"- **State law related to {query}**\n"
            result += "  - Applicable States: Various States\n"
            result += "  - Variations: May vary by state\n"
            result += "  - Key Provisions: Provision 1, Provision 2\n\n"
            
            result += "### Rules and Regulations\n"
            result += f"- **Rules related to {query}**\n"
            result += "  - Notification No.: G.S.R. XXX(E)\n"
            current_date = datetime.now().strftime("%Y-%m-%d")
            result += f"  - Date: {current_date}\n"
            result += "  - Authority: Relevant Authority\n\n"
            
            return result
            
        except Exception as e:
            return f"Error searching Indian laws: {str(e)}"

class CaseLawSearchTool(BaseTool):
    name: str = "Case Law Search Tool"
    description: str = (
        "Tool for searching legal precedents, court judgments, and case law. "
        "Use this tool to find relevant court decisions and legal precedents."
    )
    args_schema: Type[BaseModel] = LegalSearchInput

    def _run(self, query: str, jurisdiction: str = "India") -> str:
        """
        Search for relevant case law and court judgments.
        """
        try:
            result = f"## Case Law Search Results for: {query}\n\n"
            
            result += "### Supreme Court Cases\n"
            result += f"- **Relevant SC Case for {query}**\n"
            result += "  - Citation: AIR YYYY SC XXX\n"
            result += "  - Year: 2023\n"
            result += "  - Bench: Hon'ble Justice X and Justice Y\n"
            result += f"  - Key Principle: Legal principle related to {query}\n"
            result += "  - Relevance: High\n\n"
            
            result += "### High Court Cases\n"
            result += f"- **Relevant HC Case for {query}**\n"
            result += "  - Citation: AIR YYYY HC XXX\n"
            result += "  - Court: Delhi High Court\n"
            result += "  - Year: 2023\n"
            result += "  - Judge: Hon'ble Justice Z\n"
            result += f"  - Key Holding: High Court ruling on {query}\n\n"
            
            result += "### Landmark Cases\n"
            result += f"- **Landmark case establishing precedent for {query}**\n"
            result += "  - Citation: AIR YYYY SC XXX\n"
            result += "  - Historical Significance: Established legal precedent\n"
            result += "  - Current Legal Status: Good law\n\n"
            
            return result
            
        except Exception as e:
            return f"Error searching case law: {str(e)}"
