from crewai.tools import BaseTool
from typing import Type
from pydantic import BaseModel, Field
import os
from dotenv import load_dotenv
import requests
import json

# Load environment variables
load_dotenv()

# Try to import SerpApi
try:
    from serpapi import GoogleSearch
    SERPAPI_AVAILABLE = True
except ImportError:
    SERPAPI_AVAILABLE = False

class SimpleLegalInput(BaseModel):
    """Input for Simple Legal Search Tool"""
    query: str = Field(..., description="The legal query to search for")
    jurisdiction: str = Field(default="India", description="Legal jurisdiction (India, US, UK)")

class SimpleLegalSearchTool(BaseTool):
    """Simple Legal Search Tool that provides short, easy-to-read legal information"""
    
    name: str = "Simple Legal Search Tool"
    description: str = "Get short, easy-to-read legal information with laws, procedures, and documents"
    args_schema: Type[BaseModel] = SimpleLegalInput
    
    def _run(self, query: str, jurisdiction: str = "India") -> str:
        """
        Get simple, easy-to-read legal information using Serper API
        """
        try:
            # First check if this is a process/procedure query
            if not self._is_process_query(query):
                return self._create_conversational_response(query, jurisdiction)
            
            # Get Serper API key
            serper_api_key = os.getenv('SERPER_API_KEY')
            
            if not serper_api_key or serper_api_key == "your_serper_api_key_here":
                return self._create_simple_fallback_response(query, jurisdiction)
            
            # Search for legal information
            search_results = self._search_legal_info(query, jurisdiction, serper_api_key)
            
            # Format into simple, readable response
            return self._format_simple_response(search_results, query, jurisdiction)
            
        except Exception as e:
            return self._create_simple_fallback_response(query, jurisdiction)
    
    def _search_legal_info(self, query: str, jurisdiction: str, api_key: str) -> dict:
        """Search for legal information using Serper API"""
        if not SERPAPI_AVAILABLE:
            return {"error": "SerpAPI not available"}
        
        try:
            # Enhanced legal search query
            search_query = f"{query} law legal procedure {jurisdiction} steps documentation requirements"
            
            params = {
                "engine": "google",
                "q": search_query,
                "api_key": api_key,
                "num": 8,
                "gl": "in" if jurisdiction.lower() == "india" else "us",
                "hl": "en"
            }
            
            search = GoogleSearch(params)
            results = search.get_dict()
            
            return {
                "organic_results": results.get("organic_results", []),
                "people_also_ask": results.get("people_also_ask", []),
                "related_searches": results.get("related_searches", [])
            }
            
        except Exception as e:
            return {"error": f"Search failed: {str(e)}"}
    
    def _is_process_query(self, query: str) -> bool:
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
    
    def _create_conversational_response(self, query: str, jurisdiction: str) -> str:
        """Create a conversational response for non-process queries"""
        try:
            # Get Serper API key for web search
            serper_api_key = os.getenv('SERPER_API_KEY')
            
            if serper_api_key and serper_api_key != "your_serper_api_key_here":
                # Try to get some web information
                search_results = self._search_legal_info(query, jurisdiction, serper_api_key)
                
                if "error" not in search_results:
                    organic_results = search_results.get("organic_results", [])
                    if organic_results:
                        # Extract some key information from search results
                        info_snippets = []
                        for result in organic_results[:3]:
                            title = result.get("title", "")
                            snippet = result.get("snippet", "")
                            if snippet:
                                info_snippets.append(snippet[:150] + "...")
                        
                        response = f"Based on current information about '{query}' in {jurisdiction}:\n\n"
                        for i, snippet in enumerate(info_snippets, 1):
                            response += f"{i}. {snippet}\n\n"
                        
                        response += "If you need specific process steps or document requirements, please ask about the procedure or registration process."
                        return response
            
            # Fallback conversational response
            return self._create_basic_conversational_response(query, jurisdiction)
            
        except Exception as e:
            return self._create_basic_conversational_response(query, jurisdiction)
    
    def _create_basic_conversational_response(self, query: str, jurisdiction: str) -> str:
        """Create a basic conversational response"""
        query_lower = query.lower()
        
        # General legal topics responses
        if any(word in query_lower for word in ["law", "legal", "right", "rule"]):
            if any(word in query_lower for word in ["company", "business"]):
                return f"In {jurisdiction}, business and company matters are primarily governed by the Companies Act 2013 and various regulatory frameworks. For specific procedures like registration, licensing, or compliance requirements, please ask about the specific process you need help with."
            
            elif any(word in query_lower for word in ["property", "land", "real estate"]):
                return f"Property laws in {jurisdiction} are governed by the Registration Act 1908, Transfer of Property Act 1882, and various state regulations. If you're looking to buy, sell, or register property, please ask about the specific procedure."
            
            elif any(word in query_lower for word in ["marriage", "divorce", "family"]):
                return f"Family and marriage laws in {jurisdiction} include the Hindu Marriage Act 1955, Special Marriage Act 1954, and various personal laws. For specific procedures like marriage registration or divorce filing, please ask about the process."
            
            elif any(word in query_lower for word in ["tax", "income", "gst"]):
                return f"Tax laws in {jurisdiction} are governed by the Income Tax Act 1961, GST laws, and various tax regulations. For specific procedures like tax filing or GST registration, please ask about the process."
            
            else:
                return f"I can help you with legal information for {jurisdiction}. If you're looking for specific procedures, documents, or step-by-step processes, please ask about the particular legal process you need help with (e.g., 'company registration process' or 'property purchase procedure')."
        
        # General questions
        elif any(word in query_lower for word in ["what is", "define", "meaning", "explain"]):
            return f"I can provide information about legal topics in {jurisdiction}. For detailed procedures with step-by-step guidance and required documents, please ask about specific legal processes or registrations."
        
        # Default response
        else:
            return f"I can help you with legal information and procedures for {jurisdiction}. If you need step-by-step guidance for a specific legal process (like registration, filing, or applications), please ask about the procedure or process you're interested in."
    
    def _format_simple_response(self, search_results: dict, query: str, jurisdiction: str) -> str:
        """Format search results into very short format with Indian links"""
        
        if "error" in search_results:
            return self._create_simple_fallback_response(query, jurisdiction)
        
        response = f"""# {query.title()} (India)

## Main Laws & Definitions
"""
        
        # Extract just 2-3 key laws with definitions
        organic_results = search_results.get("organic_results", [])
        law_count = 0
        if organic_results:
            for result in organic_results[:4]:
                title = result.get("title", "")
                if any(keyword in title.lower() for keyword in ["act", "law", "rule"]) and law_count < 2:
                    law_count += 1
                    clean_title = title.split("|")[0].split("-")[0].strip()[:60]
                    definition = self._get_law_definition(clean_title, query)
                    response += f"• **{clean_title}**\n  {definition}\n\n"
        
        if law_count == 0:
            response += self._get_default_laws_with_definitions(query)
        
        response += "\n## Online Process (Detailed Steps)\n"
        online_steps = self._get_detailed_online_steps(query)
        for i, step in enumerate(online_steps, 1):
            response += f"{i}. **{step['title']}**\n   - {step['details']}\n   - Portal: {step['portal']}\n\n"
        
        response += "## Offline Process (Detailed Steps)\n"
        offline_steps = self._get_detailed_offline_steps(query)
        for i, step in enumerate(offline_steps, 1):
            response += f"{i}. **{step['title']}**\n   - {step['details']}\n   - Location: {step['location']}\n\n"
        
        response += f"\n## Documents\n"
        docs = self._get_short_documents(query)
        for doc in docs[:5]:
            response += f"• {doc}\n"
        
        response += f"\n## Official Links\n"
        links = self._get_indian_govt_links(query)
        for link in links:
            response += f"• {link}\n"
        
        response += f"\n**Timeline:** {self._get_timeline(query)}\n"
        response += f"**Fees:** {self._get_fees(query)}\n"
        
        return response
    
    def _get_default_laws_with_definitions(self, query: str) -> str:
        """Get default laws with definitions for common queries"""
        query_lower = query.lower()
        if any(word in query_lower for word in ["company", "business"]):
            return """• **Companies Act 2013**
  Governs incorporation, management, and dissolution of companies in India. Regulates corporate governance, director duties, and shareholder rights.

• **LLP Act 2008**
  Provides framework for Limited Liability Partnerships. Combines benefits of partnership flexibility with company's limited liability protection.

"""
        elif any(word in query_lower for word in ["property", "land"]):
            return """• **Registration Act 1908**
  Mandates registration of property documents and maintains public records. Ensures legal validity of property transactions and ownership transfers.

• **Transfer of Property Act 1882**
  Defines rules for property transfer, sale, mortgage, and lease. Establishes legal framework for immovable property transactions.

"""
        elif any(word in query_lower for word in ["marriage"]):
            return """• **Hindu Marriage Act 1955**
  Governs marriage, divorce, and related matters for Hindus. Defines valid marriage conditions, grounds for divorce, and maintenance rights.

• **Special Marriage Act 1954**
  Provides civil marriage framework for all religions. Allows inter-faith marriages and special registration procedures for all citizens.

"""
        else:
            return """• **Relevant Central/State Acts**
  Various laws apply depending on the subject matter. Central acts provide nationwide framework while state acts handle local implementation.

• **Constitutional Provisions**
  Fundamental rights and directive principles guide all legal procedures. Article 21 ensures due process and fair treatment under law.

"""

    def _get_law_definition(self, law_title: str, query: str) -> str:
        """Get 2-3 line definition for a specific law"""
        law_lower = law_title.lower()
        if "companies act" in law_lower:
            return "Governs incorporation, management, and dissolution of companies in India. Regulates corporate governance, director duties, and shareholder rights."
        elif "llp act" in law_lower:
            return "Provides framework for Limited Liability Partnerships. Combines benefits of partnership flexibility with company's limited liability protection."
        elif "registration act" in law_lower:
            return "Mandates registration of property documents and maintains public records. Ensures legal validity of property transactions and ownership transfers."
        elif "marriage act" in law_lower:
            return "Governs marriage, divorce, and related matters. Defines valid marriage conditions, grounds for divorce, and maintenance rights."
        else:
            return "Provides legal framework and procedures for the specified matter. Ensures compliance with constitutional principles and regulatory requirements."

    def _get_default_laws(self, query: str) -> str:
        """Get default laws for common queries"""
        query_lower = query.lower()
        if any(word in query_lower for word in ["company", "business"]):
            return "• Companies Act 2013\n• LLP Act 2008\n"
        elif any(word in query_lower for word in ["property", "land"]):
            return "• Registration Act 1908\n• Transfer of Property Act 1882\n"
        elif any(word in query_lower for word in ["marriage"]):
            return "• Hindu Marriage Act 1955\n• Special Marriage Act 1954\n"
        else:
            return "• Relevant Central/State Acts apply\n• Check latest amendments\n"
    
    def _get_detailed_online_steps(self, query: str) -> list:
        """Get detailed online process steps with portal information"""
        query_lower = query.lower()
        if any(word in query_lower for word in ["company", "business"]):
            return [
                {
                    "title": "Get Digital Signature Certificate (DSC)",
                    "details": "Apply for Class II DSC from licensed Certifying Authority. Required for all digital filings with MCA.",
                    "portal": "mca.gov.in → Services → DSC"
                },
                {
                    "title": "Obtain Director Identification Number (DIN)",
                    "details": "File Form DIR-3 online with required documents. Each proposed director needs unique DIN.",
                    "portal": "mca.gov.in → Services → DIN"
                },
                {
                    "title": "Reserve Company Name",
                    "details": "File Form INC-1 with 2 proposed names. Check availability using name search tool first.",
                    "portal": "mca.gov.in → Services → Name Reservation"
                },
                {
                    "title": "File Incorporation Documents",
                    "details": "Submit Form INC-2, MOA, AOA with required attachments. Pay government fees online.",
                    "portal": "mca.gov.in → Services → Company Incorporation"
                },
                {
                    "title": "Get Certificate of Incorporation",
                    "details": "Download certificate once approved. Apply for PAN, TAN, and GST registration next.",
                    "portal": "mca.gov.in → View Public Documents"
                }
            ]
        elif any(word in query_lower for word in ["property"]):
            return [
                {
                    "title": "Visit State Registration Portal",
                    "details": "Access your state's sub-registrar online portal. Create account with mobile/email verification.",
                    "portal": "State Registration Portal (varies by state)"
                },
                {
                    "title": "Book Appointment Online",
                    "details": "Select convenient date, time, and sub-registrar office. Pay appointment fees online.",
                    "portal": "Online Appointment System"
                },
                {
                    "title": "Upload Required Documents",
                    "details": "Scan and upload sale deed, ID proofs, property documents in specified format and size.",
                    "portal": "Document Upload Section"
                },
                {
                    "title": "Pay Stamp Duty & Registration Fees",
                    "details": "Calculate fees using online calculator. Make payment through netbanking/card.",
                    "portal": "Online Payment Gateway"
                },
                {
                    "title": "Visit Office on Appointment Date",
                    "details": "Appear with original documents and parties. Complete biometric verification and get registered deed.",
                    "portal": "Sub-Registrar Office"
                }
            ]
        elif any(word in query_lower for word in ["marriage"]):
            return [
                {
                    "title": "Access Marriage Registration Portal",
                    "details": "Visit state/UT marriage registration website. Register with mobile number and email ID.",
                    "portal": "State Marriage Registration Portal"
                },
                {
                    "title": "Fill Application Form Online",
                    "details": "Complete Form-1 with personal details, witness information, and marriage details.",
                    "portal": "Online Application Form"
                },
                {
                    "title": "Upload Required Documents",
                    "details": "Upload age proof, ID proof, address proof, photos, and marriage photos in PDF format.",
                    "portal": "Document Upload Section"
                },
                {
                    "title": "Pay Registration Fees",
                    "details": "Pay prescribed fees online through payment gateway. Keep payment receipt for records.",
                    "portal": "Online Payment System"
                },
                {
                    "title": "Book Appointment",
                    "details": "Schedule appointment with marriage registrar after 30-day notice period completion.",
                    "portal": "Appointment Booking System"
                }
            ]
        else:
            return [
                {
                    "title": "Access Government Portal",
                    "details": "Visit relevant department's official website. Create account with required credentials.",
                    "portal": "india.gov.in or Department Portal"
                },
                {
                    "title": "Fill Application Form",
                    "details": "Complete online form with accurate information. Save draft for later editing if needed.",
                    "portal": "Online Application System"
                },
                {
                    "title": "Upload Documents",
                    "details": "Scan and upload all required documents in specified format. Ensure clear, readable copies.",
                    "portal": "Document Management System"
                },
                {
                    "title": "Submit and Pay Fees",
                    "details": "Review application thoroughly before submission. Pay prescribed fees through online gateway.",
                    "portal": "Payment and Submission Portal"
                }
            ]
    
    def _get_detailed_offline_steps(self, query: str) -> list:
        """Get detailed offline process steps with office locations"""
        query_lower = query.lower()
        if any(word in query_lower for word in ["company", "business"]):
            return [
                {
                    "title": "Prepare Physical Documents",
                    "details": "Print all forms, get them signed and notarized. Prepare multiple sets of attachments.",
                    "location": "Home/Office preparation"
                },
                {
                    "title": "Visit ROC Office",
                    "details": "Go to Registrar of Companies office with complete documents. Check office timings beforehand.",
                    "location": "ROC Office (state-wise addresses on mca.gov.in)"
                },
                {
                    "title": "Submit Documents at Counter",
                    "details": "Submit application with required fees by DD/cash. Get acknowledgment receipt with SRN.",
                    "location": "ROC Filing Counter"
                },
                {
                    "title": "Track Application Status",
                    "details": "Monitor progress using SRN on MCA portal. Respond to queries if raised by ROC.",
                    "location": "Online tracking or ROC office"
                },
                {
                    "title": "Collect Certificate",
                    "details": "Download certificate from portal or collect from ROC office once approved.",
                    "location": "ROC Office or Online Download"
                }
            ]
        elif any(word in query_lower for word in ["property"]):
            return [
                {
                    "title": "Prepare Documents",
                    "details": "Get sale deed drafted by lawyer. Ensure all parties' signatures and witness signatures.",
                    "location": "Lawyer's office or home"
                },
                {
                    "title": "Visit Sub-Registrar Office",
                    "details": "Go to jurisdictional sub-registrar office with all parties and witnesses present.",
                    "location": "Sub-Registrar Office (area-wise)"
                },
                {
                    "title": "Get Documents Verified",
                    "details": "Submit documents for verification. Officials will check authenticity and completeness.",
                    "location": "Document Verification Counter"
                },
                {
                    "title": "Pay Stamp Duty and Fees",
                    "details": "Pay stamp duty based on property value and registration fees at designated counter.",
                    "location": "Payment Counter at Sub-Registrar Office"
                },
                {
                    "title": "Complete Registration Process",
                    "details": "Sign documents before registrar, get biometric verification done, and receive registered deed.",
                    "location": "Registrar's Chamber"
                }
            ]
        elif any(word in query_lower for word in ["marriage"]):
            return [
                {
                    "title": "Prepare Application and Documents",
                    "details": "Fill Form-1, get photos attested, prepare all required documents with notarization.",
                    "location": "Home preparation"
                },
                {
                    "title": "Submit Application",
                    "details": "Visit marriage registrar office with both parties, submit application with 30-day notice.",
                    "location": "Marriage Registrar Office"
                },
                {
                    "title": "Wait for Notice Period",
                    "details": "Wait for 30-day objection period. Notice will be displayed publicly during this time.",
                    "location": "Registrar Office Notice Board"
                },
                {
                    "title": "Appear for Registration",
                    "details": "Both parties appear with 3 witnesses before registrar after notice period completion.",
                    "location": "Marriage Registrar Chamber"
                },
                {
                    "title": "Get Marriage Certificate",
                    "details": "Complete registration ceremony, sign register, and collect marriage certificate immediately.",
                    "location": "Marriage Registrar Office"
                }
            ]
        else:
            return [
                {
                    "title": "Prepare Application",
                    "details": "Fill application form completely, attach all required documents with proper attestation.",
                    "location": "Home/Office preparation"
                },
                {
                    "title": "Visit Government Office",
                    "details": "Go to relevant department office during working hours with complete application.",
                    "location": "Concerned Government Office"
                },
                {
                    "title": "Submit at Designated Counter",
                    "details": "Submit application at reception/filing counter, pay fees as prescribed by department.",
                    "location": "Filing/Reception Counter"
                },
                {
                    "title": "Track and Follow Up",
                    "details": "Keep receipt safe, track status online or visit office for updates on application progress.",
                    "location": "Online or Government Office"
                }
            ]

    def _get_online_steps(self, query: str) -> list:
        """Get online process steps"""
        query_lower = query.lower()
        if any(word in query_lower for word in ["company", "business"]):
            return [
                "Visit MCA portal (mca.gov.in)",
                "Get DSC and DIN",
                "Apply for name reservation",
                "File incorporation documents"
            ]
        elif any(word in query_lower for word in ["property"]):
            return [
                "Visit state registration portal",
                "Book appointment online",
                "Upload documents",
                "Pay fees online"
            ]
        elif any(word in query_lower for word in ["marriage"]):
            return [
                "Visit state marriage portal",
                "Fill application online",
                "Book appointment",
                "Submit documents"
            ]
        else:
            return [
                "Visit relevant government portal",
                "Create account/login",
                "Fill application form",
                "Submit documents and pay fees"
            ]
    
    def _get_offline_steps(self, query: str) -> list:
        """Get offline process steps"""
        query_lower = query.lower()
        if any(word in query_lower for word in ["company", "business"]):
            return [
                "Visit ROC office",
                "Submit physical documents",
                "Pay fees at counter",
                "Get receipt and track status"
            ]
        elif any(word in query_lower for word in ["property"]):
            return [
                "Visit Sub-Registrar office",
                "Get documents verified",
                "Pay stamp duty and fees",
                "Complete registration"
            ]
        elif any(word in query_lower for word in ["marriage"]):
            return [
                "Visit marriage registrar office",
                "Submit application with documents",
                "Appear with witnesses",
                "Get marriage certificate"
            ]
        else:
            return [
                "Visit relevant government office",
                "Submit application with documents",
                "Pay fees at counter",
                "Collect receipt and track"
            ]
    
    def _get_short_documents(self, query: str) -> list:
        """Get short document list"""
        query_lower = query.lower()
        if any(word in query_lower for word in ["company", "business"]):
            return ["PAN card", "Aadhaar", "Address proof", "Photos", "NOC"]
        elif any(word in query_lower for word in ["property"]):
            return ["Property papers", "ID proof", "PAN card", "Address proof", "Photos"]
        elif any(word in query_lower for word in ["marriage"]):
            return ["Age proof", "ID proof", "Address proof", "Photos", "Affidavit"]
        else:
            return ["ID proof", "Address proof", "PAN card", "Photos", "Application"]
    
    def _get_indian_govt_links(self, query: str) -> list:
        """Get official Indian government links"""
        query_lower = query.lower()
        if any(word in query_lower for word in ["company", "business"]):
            return [
                "MCA Portal: mca.gov.in",
                "Udyog Aadhaar: udyogaadhaar.gov.in",
                "GST Portal: gst.gov.in"
            ]
        elif any(word in query_lower for word in ["property"]):
            return [
                "State Registration Portal",
                "Property Search: webland.ap.gov.in",
                "Stamp Duty: stamps.gov.in"
            ]
        elif any(word in query_lower for word in ["marriage"]):
            return [
                "Marriage Registration Portal",
                "Government Services: india.gov.in",
                "State Civil Registration"
            ]
        else:
            return [
                "India.gov.in",
                "Digital India Portal",
                "State Government Portal"
            ]
    
    def _get_timeline(self, query: str) -> str:
        """Get typical timeline"""
        query_lower = query.lower()
        if any(word in query_lower for word in ["company", "business"]):
            return "15-30 days"
        elif any(word in query_lower for word in ["property"]):
            return "1-7 days"
        elif any(word in query_lower for word in ["marriage"]):
            return "30 days notice + 1 day"
        else:
            return "7-30 days"
    
    def _get_fees(self, query: str) -> str:
        """Get typical fees"""
        query_lower = query.lower()
        if any(word in query_lower for word in ["company", "business"]):
            return "₹10,000-50,000"
        elif any(word in query_lower for word in ["property"]):
            return "1-8% of property value"
        elif any(word in query_lower for word in ["marriage"]):
            return "₹100-500"
        else:
            return "Varies by state"
    
    def _get_common_documents(self, query: str) -> list:
        """Get common documents based on query type"""
        query_lower = query.lower()
        
        if any(word in query_lower for word in ["company", "business", "registration"]):
            return [
                "Identity proof (Aadhaar, PAN card)",
                "Address proof documents", 
                "Business plan and details",
                "NOC from property owner",
                "Application form (filled)",
                "Passport size photographs"
            ]
        elif any(word in query_lower for word in ["property", "land", "registration"]):
            return [
                "Property documents and title deeds",
                "Identity and address proof",
                "Sale agreement/deed",
                "Encumbrance certificate",
                "Property tax receipts",
                "Survey settlement records"
            ]
        elif any(word in query_lower for word in ["marriage", "divorce", "family"]):
            return [
                "Identity proof documents",
                "Age proof certificates",
                "Address proof documents",
                "Passport size photographs",
                "Marriage certificate (if applicable)",
                "Witness documents"
            ]
        elif any(word in query_lower for word in ["employment", "labor", "job"]):
            return [
                "Employment contract/offer letter",
                "Identity and address proof",
                "Educational certificates",
                "Experience certificates",
                "Salary slips/bank statements",
                "Form 16 or tax documents"
            ]
        else:
            return [
                "Identity proof (Aadhaar, PAN card)",
                "Address proof documents",
                "Relevant certificates/licenses",
                "Application form (duly filled)",
                "Passport size photographs",
                "Supporting documents as required"
            ]
    
    def _create_simple_fallback_response(self, query: str, jurisdiction: str) -> str:
        """Create simple fallback response when Serper API is not available"""
        
        return f"""# {query.title()} (India)

## Main Laws & Definitions
{self._get_default_laws_with_definitions(query)}

## Online Process (Detailed Steps)
1. **Visit Government Portal**
   - Access relevant department's official website through india.gov.in
   - Portal: india.gov.in → Services

2. **Create Account/Login**
   - Register with mobile number and email verification
   - Portal: Registration/Login Section

3. **Fill Application Form**
   - Complete online form with accurate personal and case details
   - Portal: Online Application System

4. **Submit Documents and Pay**
   - Upload required documents and pay fees through secure gateway
   - Portal: Document Upload & Payment Section

## Offline Process (Detailed Steps)
1. **Prepare Application**
   - Fill forms manually, get documents notarized and attested
   - Location: Home/Lawyer's office

2. **Visit Government Office**
   - Go to concerned department during working hours with complete paperwork
   - Location: Relevant Government Office

3. **Submit at Counter**
   - Submit application at designated counter with prescribed fees
   - Location: Filing/Reception Counter

4. **Track and Follow Up**
   - Keep receipt safe and track progress online or through office visits
   - Location: Online portal or Government Office

## Documents
• ID proof (Aadhaar/PAN)
• Address proof
• Application form
• Photos
• Relevant certificates

## Official Links
• India.gov.in
• Digital India Portal
• State Government Portal

**Timeline:** 7-30 days
**Fees:** Varies by state

*Set up Serper API for detailed information*
"""


class LegalDocumentTool(BaseTool):
    """Tool for finding legal document templates and requirements"""
    
    name: str = "Legal Document Tool"
    description: str = "Find legal document templates and requirements for specific legal processes"
    args_schema: Type[BaseModel] = SimpleLegalInput
    
    def _run(self, query: str, jurisdiction: str = "India") -> str:
        """Find legal documents and templates"""
        
        # Document templates based on common legal needs
        doc_templates = self._get_document_templates(query, jurisdiction)
        
        response = f"""# 📄 Legal Documents for: {query.title()}

## 📋 REQUIRED DOCUMENTS CHECKLIST

"""
        
        for category, docs in doc_templates.items():
            response += f"### {category}\n"
            for doc in docs:
                response += f"• {doc}\n"
            response += "\n"
        
        response += """## 📝 DOCUMENT PREPARATION TIPS

**✅ Before You Start:**
• Make multiple copies of all documents
• Get documents notarized if required
• Ensure all signatures are clear and valid
• Check expiry dates on certificates

**✅ Common Mistakes to Avoid:**
• Incomplete or incorrect information
• Missing signatures or stamps
• Using outdated forms or templates
• Not keeping copies for your records

**✅ Where to Get Official Forms:**
• Government department websites
• Local government offices
• Legal aid centers
• Lawyer's offices

## 🔍 DOCUMENT VERIFICATION
Always verify document requirements with:
• Official government websites
• Local authorities
• Legal professionals
• Recent legal updates

---
*💡 Document requirements may change. Always verify with current official sources.*
"""
        
        return response
    
    def _get_document_templates(self, query: str, jurisdiction: str) -> dict:
        """Get document templates based on query"""
        
        query_lower = query.lower()
        
        if any(word in query_lower for word in ["company", "business"]):
            return {
                "🏢 Business Registration": [
                    "Memorandum of Association (MOA)",
                    "Articles of Association (AOA)", 
                    "Form INC-1 (Application for name reservation)",
                    "Form INC-2 (Application for incorporation)",
                    "Directors' consent and declaration",
                    "Registered office proof"
                ],
                "📝 Supporting Documents": [
                    "PAN card of directors",
                    "Address proof of directors",
                    "Digital signature certificates",
                    "Professional certificate (if applicable)"
                ]
            }
        elif any(word in query_lower for word in ["property", "land"]):
            return {
                "🏠 Property Documents": [
                    "Sale deed/agreement",
                    "Title documents",
                    "Encumbrance certificate",
                    "Survey settlement records",
                    "Property tax receipts"
                ],
                "👥 Personal Documents": [
                    "Identity proof of buyer/seller",
                    "Address proof documents",
                    "PAN cards",
                    "Bank statements"
                ]
            }
        else:
            return {
                "📋 General Documents": [
                    "Application form (relevant authority)",
                    "Identity proof documents",
                    "Address proof documents",
                    "Supporting certificates",
                    "Affidavit (if required)"
                ],
                "💼 Professional Documents": [
                    "Qualification certificates",
                    "Experience certificates", 
                    "NOC from relevant authorities",
                    "Fee payment receipts"
                ]
            }


# Export tools
__all__ = ["SimpleLegalSearchTool", "LegalDocumentTool"]
