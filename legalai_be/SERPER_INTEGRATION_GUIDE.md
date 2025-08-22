# 🏛️ Legal AI Assistant with Serper Integration

A comprehensive AI-powered legal assistant that provides accurate legal information, step-by-step procedures, and comprehensive guidance using advanced web search capabilities.

## 🚀 Features

### Enhanced Legal Search Capabilities
- **Serper API Integration**: Real-time web search for the latest legal information
- **Comprehensive Legal Research**: Access to current laws, regulations, and court decisions
- **Multi-Jurisdictional Support**: Support for Indian, US, UK, and other legal systems
- **Recent Legal Updates**: Automatic inclusion of latest legal changes and amendments

### Specialized Legal Agents
1. **Legal Researcher**: Finds relevant laws, regulations, and precedents
2. **Legal Analyst**: Provides detailed analysis and risk assessment
3. **Procedure Specialist**: Creates step-by-step procedural guides

### Web-Enhanced Features
- Real-time legal information from authoritative sources
- Recent court decisions and case law
- Updated regulatory information
- Professional legal resource integration

## 🛠️ Setup Instructions

### 1. Install Dependencies
```bash
# Install Serper API package and python-dotenv
uv add google-search-results python-dotenv

# Sync all dependencies
uv sync
```

### 2. Configure Serper API
1. Visit [Serper.dev](https://serper.dev)
2. Sign up for a free account (2,500 searches/month)
3. Get your API key
4. Add to `.env` file:
```env
SERPER_API_KEY=your_actual_api_key_here
```

### 3. Test the Integration
```bash
# Test Serper setup
python test_serper.py

# Run the legal assistant
python main.py
```

## 📋 Usage Examples

### Basic Legal Query
```python
# Ask about contract law
"What are the essential elements of a valid contract under Indian law?"

# The system will:
# 1. Search current Indian contract law using Serper API
# 2. Find relevant sections from Indian Contract Act
# 3. Include recent court decisions and updates
# 4. Provide step-by-step guidance with proper citations
```

### Specific Legal Procedure
```python
# Ask about legal procedures
"How to file a trademark application in India?"

# The system will:
# 1. Research current trademark laws and procedures
# 2. Find official government guidelines
# 3. Provide detailed step-by-step process
# 4. Include required documents, fees, and timelines
# 5. Cite recent updates and changes
```

## 🎯 Legal Assistant Capabilities

### Comprehensive Legal Research
- **Current Laws**: Real-time access to latest legal provisions
- **Case Law**: Recent court decisions and legal precedents
- **Regulatory Updates**: Latest amendments and regulatory changes
- **Procedural Guidance**: Step-by-step legal procedures

### Structured Output Format
- **Executive Summary**: Quick overview of legal position
- **Applicable Laws**: Detailed legal framework with citations
- **Step-by-Step Procedures**: Clear procedural guidance
- **Risk Assessment**: Potential legal risks and mitigation
- **Compliance Checklist**: Requirements and deadlines
- **Professional Recommendations**: Next steps and legal advice

### Enhanced Web Integration
- **Authoritative Sources**: Government websites, court databases
- **Professional Resources**: Legal publications and journals
- **Recent Updates**: Latest legal news and amendments
- **Cross-Referencing**: Multiple source verification

## 🔧 Advanced Configuration

### Serper API Features
- **Search Volume**: Up to 2,500 searches per month (free tier)
- **Search Types**: Web search, news search, image search
- **Geographic Targeting**: Country-specific legal information
- **Time-based Filtering**: Recent legal updates and news

### CrewAI Integration
- **Multi-Agent System**: Specialized legal agents working together
- **Sequential Processing**: Systematic legal research and analysis
- **Memory System**: Context retention across conversations
- **Verbose Logging**: Detailed process tracking

## 📚 Legal Domains Supported

### Indian Legal System
- Constitutional Law
- Contract Law
- Criminal Law
- Property Law
- Family Law
- Corporate Law
- Tax Law
- Employment Law
- Intellectual Property Law
- Environmental Law

### International Legal Systems
- US Federal and State Law
- UK Legal System
- European Union Law
- International Trade Law
- Human Rights Law

## ⚖️ Legal Disclaimers

### Important Notes
1. **AI-Generated Information**: This system provides AI-generated legal information
2. **Professional Consultation Required**: Always consult qualified legal professionals
3. **Jurisdiction-Specific**: Legal requirements vary by location
4. **Current Information**: Laws change frequently - verify current status
5. **No Attorney-Client Relationship**: This system does not create legal relationships

### Liability
- This system provides general legal information only
- Not a substitute for professional legal advice
- Users should verify all information with qualified attorneys
- No responsibility for decisions based on AI-generated content

## 🚀 Getting Started

### Quick Start Commands
```bash
# Set up environment
uv sync

# Test Serper integration
python test_serper.py

# Run legal assistant
python main.py

# Example legal query
# "What are the procedures for company registration in India?"
```

### Sample Queries
1. "What are the legal requirements for starting a business in India?"
2. "How to file a consumer complaint under Consumer Protection Act?"
3. "What are the procedures for property registration?"
4. "Employment law rights and obligations for employers"
5. "Intellectual property protection for software products"

## 📞 Support and Resources

### Official Resources
- [Serper API Documentation](https://serper.dev/api-key)
- [CrewAI Documentation](https://docs.crewai.com/)
- [Legal Information Sources](https://www.indiakanoon.org/)

### Professional Legal Resources
- Local Bar Association directories
- Legal aid organizations
- Government legal information portals
- Professional legal consultation services

---

*This Legal AI Assistant is designed to provide comprehensive legal guidance using advanced AI and web search capabilities. Always consult qualified legal professionals for specific legal advice.*
