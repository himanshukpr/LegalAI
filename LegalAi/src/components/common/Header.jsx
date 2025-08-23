import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Header = () => {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Ask AI', href: '/askai' },
    { name: 'News', href: '/news' },
    { name: 'About Us', href: '/about' },
  ];

  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollTop = window.scrollY;
          setIsScrolled(scrollTop > 50);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll); 
  }, []);

  // Smooth spring animation configurations
  const springConfig = {
    type: "spring",
    stiffness: 300,
    damping: 30,
    mass: 0.8
  };

  const smoothEasing = [0.25, 0.46, 0.45, 0.94];

  return (
    <motion.header 
      className={`fixed top-0 left-0 right-0 z-50 ${
        isScrolled 
          ? 'bg-gray-900/95 backdrop-blur-md border-b border-gray-700' 
          : 'bg-transparent'
      }`}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ 
        duration: 0.8, 
        ease: smoothEasing,
        delay: 0.1
      }}
      style={{
        transition: 'background-color 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94), border-color 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
      }}
    >
      <motion.div 
        className={`${
          isScrolled 
            ? 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8' 
            : 'max-w-4xl mx-auto px-6 mt-4'
        }`}
        animate={{
          maxWidth: isScrolled ? '80rem' : '56rem',
          paddingLeft: isScrolled ? '2rem' : '1.5rem',
          paddingRight: isScrolled ? '2rem' : '1.5rem',
          marginTop: isScrolled ? '0rem' : '1rem'
        }}
        transition={springConfig}
      >
        <motion.div 
          className={`flex justify-between items-center ${
            isScrolled 
              ? 'h-16 bg-transparent' 
              : 'h-14 bg-gray-800/40 backdrop-blur-xl rounded-full border border-gray-600/30 shadow-lg px-6'
          }`}
          animate={{
            height: isScrolled ? '4rem' : '3.5rem',
            paddingLeft: isScrolled ? '0rem' : '1.5rem',
            paddingRight: isScrolled ? '0rem' : '1.5rem',
            borderRadius: isScrolled ? '0rem' : '9999px',
            backgroundColor: isScrolled ? 'transparent' : 'rgba(31, 41, 55, 0.4)'
          }}
          transition={springConfig}
          style={{
            backdropFilter: isScrolled ? 'none' : 'blur(12px)',
            transition: 'backdrop-filter 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
          }}
        >
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0">
              <motion.div 
                className="flex items-center"
                whileHover={{ scale: 1.05 }}
                transition={springConfig}
              >
                <motion.div 
                  className={`bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center ${
                    isScrolled ? 'w-10 h-10' : 'w-8 h-8'
                  }`}
                  whileHover={{
                    scale: 1.1,
                    boxShadow: "0 10px 30px rgba(59, 130, 246, 0.4)"
                  }}
                  animate={{
                    width: isScrolled ? '2.5rem' : '2rem',
                    height: isScrolled ? '2.5rem' : '2rem'
                  }}
                  transition={{ 
                    ...springConfig,
                    rotate: { duration: 0.8, ease: smoothEasing }
                  }}
                >
                  <motion.span 
                    className={`text-white font-bold ${
                      isScrolled ? 'text-lg' : 'text-sm'
                    }`}
                    animate={{
                      fontSize: isScrolled ? '1.125rem' : '0.875rem'
                    }}
                    transition={springConfig}
                  >
                    ⚖️
                  </motion.span>
                </motion.div>
                <AnimatePresence mode="wait">
                  {isScrolled && (
                    <motion.div 
                      className="ml-3 overflow-hidden"
                      initial={{ opacity: 0, width: 0, x: -20 }}
                      animate={{ opacity: 1, width: "auto", x: 0 }}
                      exit={{ opacity: 0, width: 0, x: -20 }}
                      transition={{
                        duration: 0.5,
                        ease: smoothEasing,
                        width: { duration: 0.4 }
                      }}
                    >
                      <motion.h1 
                        className="text-xl font-bold text-white whitespace-nowrap"
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2, ...springConfig }}
                      >
                        Legal<span className="text-blue-400">AI</span>
                      </motion.h1>
                      <motion.p 
                        className="text-xs text-gray-400 whitespace-nowrap"
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3, ...springConfig }}
                      >
                        AI-Powered Legal Solutions
                      </motion.p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className={`hidden md:flex ${
            isScrolled ? 'space-x-8' : 'space-x-6'
          }`}>
            {navigation.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.1 + 0.3,
                  ease: smoothEasing
                }}
              >
                <Link
                  to={item.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 relative group ${
                    location.pathname === item.href
                      ? 'text-blue-400'
                      : isScrolled 
                        ? 'text-gray-300 hover:text-blue-400'
                        : 'text-white/90 hover:text-white'
                  }`}
                >
                  <motion.span
                    whileHover={{ 
                      scale: 1.05,
                      y: -1
                    }}
                    whileTap={{ scale: 0.95 }}
                    transition={springConfig}
                    className="relative z-10"
                  >
                    {item.name}
                  </motion.span>
                  
                  {/* Hover background */}
                  <motion.div
                    className="absolute inset-0 bg-blue-500/10 rounded-md"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileHover={{ opacity: 1, scale: 1 }}
                    transition={springConfig}
                  />
                  
                  {/* Active indicator */}
                  {location.pathname === item.href && (
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"
                      layoutId="activeTab"
                      initial={{ opacity: 0, scaleX: 0 }}
                      animate={{ opacity: 1, scaleX: 1 }}
                      transition={{ 
                        type: "spring", 
                        stiffness: 500, 
                        damping: 30,
                        opacity: { duration: 0.3 }
                      }}
                    />
                  )}
                </Link>
              </motion.div>
            ))}
          </nav>

          {/* Action Button */}
          <div className="flex items-center space-x-4">
            {/* Mobile menu button */}
            <motion.button
              className="md:hidden p-2 text-white rounded-lg"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              whileHover={{ 
                scale: 1.05,
                backgroundColor: "rgba(59, 130, 246, 0.1)"
              }}
              whileTap={{ scale: 0.95 }}
              transition={springConfig}
            >
              <motion.div
                animate={{ rotate: isMobileMenuOpen ? 180 : 0 }}
                transition={{ duration: 0.3, ease: smoothEasing }}
              >
                <AnimatePresence mode="wait">
                  {isMobileMenuOpen ? (
                    <motion.svg 
                      key="close"
                      className="w-6 h-6" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                      initial={{ opacity: 0, rotate: -90 }}
                      animate={{ opacity: 1, rotate: 0 }}
                      exit={{ opacity: 0, rotate: 90 }}
                      transition={{ duration: 0.2 }}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </motion.svg>
                  ) : (
                    <motion.svg 
                      key="menu"
                      className="w-6 h-6" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                      initial={{ opacity: 0, rotate: -90 }}
                      animate={{ opacity: 1, rotate: 0 }}
                      exit={{ opacity: 0, rotate: 90 }}
                      transition={{ duration: 0.2 }}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </motion.svg>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.button>

          <Link to="/testimonials"> 
            <motion.button
              className={`px-4 py-2 rounded-lg text-sm font-medium relative overflow-hidden ${
                isScrolled
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm'
              }`}
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 10px 25px rgba(59, 130, 246, 0.3)"
              }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ 
                duration: 0.6, 
                delay: 0.5,
                ease: smoothEasing
              }}
            >
              <motion.span
                className="relative z-10"
                whileHover={{ y: -1 }}
                transition={springConfig}
              >
                Testimonials
              </motion.span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500"
                initial={{ scale: 0, opacity: 0 }}
                whileHover={{ scale: 1, opacity: 1 }}
                transition={springConfig}
              />
            </motion.button>
            </Link>
          </div>
        </motion.div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              className="md:hidden mt-4 bg-gray-800/95 backdrop-blur-md rounded-lg border border-gray-700"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="p-4 space-y-2">
                {navigation.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Link
                      to={item.href}
                      className={`block px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                        location.pathname === item.href
                          ? 'text-blue-400 bg-blue-500/20'
                          : 'text-white hover:text-blue-400 hover:bg-gray-700'
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.header>
  );
};

export default Header;
