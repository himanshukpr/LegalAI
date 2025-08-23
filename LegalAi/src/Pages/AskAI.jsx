import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const AskAI = () => {

  const location = useLocation();
  const desc = location.state?.description;
  
  const [question, setQuestion] = useState(desc? desc : '');

  const [messages, setMessages] = useState([
    {
      type: 'ai',
      content: 'Hello! I\'m your AI legal assistant. I can help you with legal research, document analysis, case law, and general legal questions. How can I assist you today?'
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  // Get backend URL from environment variables
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:5000';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    // Add user message
    const newMessages = [...messages, { type: 'user', content: question }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      // Make API call to backend
      const response = await axios.post(`${BACKEND_URL}/api/ai_research`, {
        query: question.trim()
      });

      // Add AI response
      const aiResponse = response.data.response || response.data.result || 'I received your question but couldn\'t generate a proper response. Please try again.';
      setMessages([...newMessages, { type: 'ai', content: aiResponse, isMarkdown: true }]);
      
    } catch (error) {
      console.error('Error calling AI research API:', error);
      let errorMessage = 'Sorry, I\'m having trouble connecting to the AI service. ';
      
      if (error.response) {
        // Server responded with error status
        errorMessage += `Server responded with status ${error.response.status}. `;
      } else if (error.request) {
        // Request was made but no response received
        errorMessage += 'Please make sure the backend server is running on ' + BACKEND_URL + '. ';
      } else {
        // Something else happened
        errorMessage += 'An unexpected error occurred. ';
      }
      
      errorMessage += 'Please try again or contact support if the issue persists.';
      
      setMessages([...newMessages, { type: 'ai', content: errorMessage }]);
    } finally {
      setIsLoading(false);
    }

    setQuestion('');
  };

  // Function to render markdown content
  const renderMarkdown = (content) => {
    // Simple markdown parser for basic formatting
    let html = content
      // Headers
      .replace(/^### (.*$)/gm, '<h3 class="text-lg font-semibold text-white mt-4 mb-2">$1</h3>')
      .replace(/^## (.*$)/gm, '<h2 class="text-xl font-semibold text-white mt-4 mb-2">$1</h2>')
      .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold text-white mt-4 mb-2">$1</h1>')
      
      // Bold text
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-white">$1</strong>')
      
      // Italic text
      .replace(/\*(.*?)\*/g, '<em class="italic text-gray-200">$1</em>')
      
      // Code blocks
      .replace(/```([\s\S]*?)```/g, '<pre class="bg-gray-800 p-3 rounded-lg mt-2 mb-2 overflow-x-auto"><code class="text-green-400 text-sm">$1</code></pre>')
      
      // Inline code
      .replace(/`(.*?)`/g, '<code class="bg-gray-800 px-2 py-1 rounded text-green-400 text-sm">$1</code>')
      
      // Links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:text-blue-300 underline">$1</a>')
      
      // Line breaks
      .replace(/\n\n/g, '</p><p class="mb-2">')
      .replace(/\n/g, '<br>')
      
      // Lists
      .replace(/^[\*\-] (.*$)/gm, '<li class="ml-4 mb-1">• $1</li>')
      
      // Wrap in paragraph tags
      .replace(/^(?!<[h1-6]|<li|<pre|<code)(.+)/gm, '<p class="mb-2">$1</p>');

    return html;
  };

  const sampleQuestions = [
    "What are the elements of a valid contract?",
    "Explain the difference between negligence and gross negligence",
    "What is intellectual property law?",
    "How does the discovery process work in litigation?",
    "What are my rights as a tenant?"
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-20">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Ask AI Legal Assistant
          </h1>
          <p className="text-gray-300 text-lg">
            Get instant answers to your legal questions powered by advanced AI
          </p>
        </motion.div>

        {/* Chat Container */}
        <motion.div 
          className="bg-gray-800 rounded-xl border border-gray-700 shadow-xl"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Chat Messages */}
          <div className="h-96 overflow-y-auto p-6 space-y-4">
            <AnimatePresence>
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  initial={{ opacity: 0, y: 20, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <motion.div
                    className={`max-w-3xl p-4 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 text-gray-100'
                    }`}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <div className="flex items-start space-x-3">
                      {message.type === 'ai' && (
                        <motion.div 
                          className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0"
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.5 }}
                        >
                          <span className="text-sm font-bold">AI</span>
                        </motion.div>
                      )}
                      <div className="flex-1">
                        {message.isMarkdown ? (
                          <div 
                            className="text-sm leading-relaxed prose prose-invert max-w-none"
                            dangerouslySetInnerHTML={{ __html: renderMarkdown(message.content) }}
                          />
                        ) : (
                          <p className="text-sm leading-relaxed">{message.content}</p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            <AnimatePresence>
              {isLoading && (
                <motion.div 
                  className="flex justify-start"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="bg-gray-700 text-gray-100 max-w-3xl p-4 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold">AI</span>
                      </div>
                      <div className="flex space-x-1">
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            className="w-2 h-2 bg-gray-400 rounded-full"
                            animate={{ y: [0, -10, 0] }}
                            transition={{
                              duration: 0.6,
                              repeat: Infinity,
                              delay: i * 0.1,
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Input Form */}
          <div className="border-t border-gray-700 p-6">
            <form onSubmit={handleSubmit} className="flex space-x-4">
              <motion.input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask your legal question here..."
                className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isLoading}
                whileFocus={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400 }}
              />
              <motion.button
                type="submit"
                disabled={isLoading || !question.trim()}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isLoading ? 'Thinking...' : 'Ask AI'}
              </motion.button>
            </form>
          </div>
        </motion.div>

        {/* Sample Questions */}
        <motion.div 
          className="mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h3 className="text-xl font-semibold text-white mb-4">Sample Questions</h3>
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1, delayChildren: 0.5 }}
          >
            {sampleQuestions.map((sampleQ, index) => (
              <motion.button
                key={index}
                onClick={() => setQuestion(sampleQ)}
                className="text-left p-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 hover:bg-gray-700 hover:border-blue-500 transition-all duration-300"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ scale: 1.02, x: 5 }}
                whileTap={{ scale: 0.98 }}
              >
                {sampleQ}
              </motion.button>
            ))}
          </motion.div>
        </motion.div>

        {/* Disclaimer */}
        <motion.div 
          className="mt-8 p-4 bg-gray-800 border border-gray-700 rounded-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h4 className="text-sm font-semibold text-yellow-400 mb-2">⚠️ Important Disclaimer</h4>
          <p className="text-xs text-gray-400">
            This AI assistant provides general legal information for educational purposes only. 
            It does not constitute legal advice and should not be relied upon as a substitute for 
            consultation with a qualified attorney. For specific legal matters, please consult 
            with a licensed legal professional.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default AskAI;
