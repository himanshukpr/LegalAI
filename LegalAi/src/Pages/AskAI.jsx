import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    // Add user message
    const newMessages = [...messages, { type: 'user', content: question }];
    setMessages(newMessages);
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(question);
      setMessages([...newMessages, { type: 'ai', content: aiResponse }]);
      setIsLoading(false);
    }, 1500);

    setQuestion('');
  };

  const generateAIResponse = (userQuestion) => {
    const responses = [
      "Based on legal precedent, I can provide some insights on this matter. However, please note that this is for informational purposes only and doesn't constitute legal advice.",
      "This is an interesting legal question. Let me break down the key legal principles that apply to your situation.",
      "I've analyzed relevant case law and statutes related to your query. Here's what I found:",
      "From a legal perspective, there are several important factors to consider in this case.",
      "Thank you for your question. Let me provide you with some relevant legal information and guidance."
    ];
    return responses[Math.floor(Math.random() * responses.length)];
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
                    whileHover={{ scale: 1.02 }}
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
                        <p className="text-sm leading-relaxed">{message.content}</p>
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
