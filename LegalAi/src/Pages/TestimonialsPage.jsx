import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const TestimonialsPage = () => {
  const testimonialCategories = [
    {
      id: 'eyewitness',
      title: 'Eyewitness Testimony',
      description: 'Direct accounts from legal professionals using our AI platform',
      icon: '👁️',
      bgColor: 'from-blue-600 to-indigo-600'
    },
    {
      id: 'character',
      title: 'Character Testimony',
      description: 'Long-term user experiences and success stories',
      icon: '👤',
      bgColor: 'from-purple-600 to-pink-600'
    },
    {
      id: 'expert',
      title: 'Expert Testimony',
      description: 'Technical insights from legal tech experts',
      icon: '⚖️',
      bgColor: 'from-green-600 to-teal-600'
    },
    {
      id: 'documentary',
      title: 'Documentary Evidence',
      description: 'Case studies and documented results',
      icon: '📄',
      bgColor: 'from-orange-600 to-red-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 pt-24">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-bold text-white mb-4">
            Testimonial Categories
          </h1>
          <p className="text-xl text-gray-300">
            Explore different perspectives on our AI-powered legal solutions
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {testimonialCategories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.3 }}
              whileHover={{ scale: 1.02 }}
              className="group cursor-pointer"
            >
              <Link to={`/testimonials/${category.id}`}>
                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-blue-500 transition-all duration-300">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${category.bgColor} flex items-center justify-center mb-4`}>
                    <span className="text-2xl">{category.icon}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
                    {category.title}
                  </h3>
                  <p className="text-gray-300">
                    {category.description}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default TestimonialsPage;