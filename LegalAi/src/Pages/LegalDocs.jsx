import React, { useState } from 'react';

const LegalDocs = () => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedFile(file);
      setAnalysisResult(null);
    }
  };

  const analyzeDocument = () => {
    if (!uploadedFile) return;
    
    setIsAnalyzing(true);
    
    // Simulate document analysis
    setTimeout(() => {
      setAnalysisResult({
        summary: "This contract appears to be a standard service agreement with favorable terms for the service provider.",
        keyPoints: [
          "Contract duration: 12 months with auto-renewal clause",
          "Payment terms: Net 30 days",
          "Termination clause allows 30-day notice",
          "Liability is limited to contract value",
          "No non-compete restrictions found"
        ],
        riskLevel: "Low",
        recommendations: [
          "Consider adding a force majeure clause",
          "Review the indemnification terms",
          "Clarify intellectual property ownership"
        ]
      });
      setIsAnalyzing(false);
    }, 3000);
  };

  const documentTemplates = [
    {
      name: "Non-Disclosure Agreement",
      description: "Protect confidential information",
      category: "Business"
    },
    {
      name: "Service Agreement",
      description: "Contract for professional services",
      category: "Business"
    },
    {
      name: "Employment Contract",
      description: "Standard employment agreement",
      category: "Employment"
    },
    {
      name: "Lease Agreement",
      description: "Residential or commercial lease",
      category: "Real Estate"
    },
    {
      name: "Partnership Agreement",
      description: "Business partnership contract",
      category: "Business"
    },
    {
      name: "Purchase Agreement",
      description: "Agreement for sale of goods",
      category: "Commercial"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-20">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Legal Document Center
          </h1>
          <p className="text-gray-300 text-lg max-w-3xl mx-auto">
            Analyze, generate, and manage your legal documents with AI-powered tools
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Document Analysis Section */}
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
            <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
              <span className="text-2xl mr-3">📄</span>
              Document Analysis
            </h2>
            
            {/* File Upload */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Upload Document for Analysis
              </label>
              <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
                <input
                  type="file"
                  onChange={handleFileUpload}
                  accept=".pdf,.doc,.docx,.txt"
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <div className="text-4xl text-gray-400 mb-4">📁</div>
                  <p className="text-gray-300 mb-2">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-sm text-gray-500">
                    PDF, DOC, DOCX, TXT files supported
                  </p>
                </label>
              </div>
            </div>

            {uploadedFile && (
              <div className="mb-6 p-4 bg-gray-700 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">{uploadedFile.name}</p>
                    <p className="text-sm text-gray-400">
                      {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <button
                    onClick={analyzeDocument}
                    disabled={isAnalyzing}
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50"
                  >
                    {isAnalyzing ? 'Analyzing...' : 'Analyze Document'}
                  </button>
                </div>
              </div>
            )}

            {/* Analysis Results */}
            {analysisResult && (
              <div className="space-y-4">
                <div className="p-4 bg-gray-700 rounded-lg">
                  <h3 className="text-lg font-semibold text-white mb-2">Summary</h3>
                  <p className="text-gray-300">{analysisResult.summary}</p>
                </div>

                <div className="p-4 bg-gray-700 rounded-lg">
                  <h3 className="text-lg font-semibold text-white mb-2">Key Points</h3>
                  <ul className="space-y-2">
                    {analysisResult.keyPoints.map((point, index) => (
                      <li key={index} className="text-gray-300 flex items-start">
                        <span className="text-blue-400 mr-2">•</span>
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-700 rounded-lg">
                    <h3 className="text-lg font-semibold text-white mb-2">Risk Level</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      analysisResult.riskLevel === 'Low' ? 'bg-green-500/20 text-green-400' :
                      analysisResult.riskLevel === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {analysisResult.riskLevel} Risk
                    </span>
                  </div>

                  <div className="p-4 bg-gray-700 rounded-lg">
                    <h3 className="text-lg font-semibold text-white mb-2">Recommendations</h3>
                    <ul className="space-y-1">
                      {analysisResult.recommendations.map((rec, index) => (
                        <li key={index} className="text-sm text-gray-300">
                          • {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Document Templates Section */}
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
            <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
              <span className="text-2xl mr-3">📋</span>
              Document Templates
            </h2>
            
            <div className="space-y-4">
              {documentTemplates.map((template, index) => (
                <div key={index} className="p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-white font-medium">{template.name}</h3>
                      <p className="text-sm text-gray-400">{template.description}</p>
                      <span className="text-xs text-blue-400 mt-1 inline-block">
                        {template.category}
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors">
                        Preview
                      </button>
                      <button className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors">
                        Generate
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-lg border border-blue-700/50">
              <h3 className="text-white font-semibold mb-2">Custom Document Generation</h3>
              <p className="text-gray-300 text-sm mb-3">
                Need a specific document? Our AI can generate custom legal documents based on your requirements.
              </p>
              <button className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300">
                Create Custom Document
              </button>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <div className="text-3xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-white mb-2">Smart Analysis</h3>
            <p className="text-gray-300">
              AI-powered document analysis identifies key clauses, risks, and recommendations.
            </p>
          </div>

          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <div className="text-3xl mb-4">⚡</div>
            <h3 className="text-xl font-semibold text-white mb-2">Quick Generation</h3>
            <p className="text-gray-300">
              Generate professional legal documents in minutes with our template library.
            </p>
          </div>

          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <div className="text-3xl mb-4">🔒</div>
            <h3 className="text-xl font-semibold text-white mb-2">Secure & Confidential</h3>
            <p className="text-gray-300">
              Your documents are processed securely with enterprise-grade encryption.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegalDocs;
