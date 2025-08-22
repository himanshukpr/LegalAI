import React from 'react';
import { motion } from 'framer-motion';

const Layout = ({ children }) => {
  return (
    <motion.div 
      className="min-h-screen bg-gray-900 transition-colors duration-200"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
};

export default Layout;
