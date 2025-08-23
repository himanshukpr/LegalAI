import React from 'react';
import { motion, useInView } from 'framer-motion';

const About = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.4, 0.0, 0.2, 1],
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.4, 0.0, 0.2, 1],
      },
    },
  };

  const teamMembers = [
    {
      name: "Bismanjot Singh",
      role: "Co-Founder & Visionary",
      image: "BS",
      bio: "The visionary behind LegalAI, conceptualized the idea of making legal services accessible through AI. Manages frontend development and user experience design."
    },
    {
      name: "Himanshu Kapoor",
      role: "Co-Founder & Lead Developer",
      image: "HK",
      bio: "Full-stack developer who brought the vision to life. Developed the entire product through collaborative discussions and technical implementation."
    }
  ];

  const milestones = [
    {
      year: "2024",
      title: "Idea Conception",
      description: "Bismanjot Singh conceived the innovative idea of LegalAI to make legal research and assistance accessible through AI technology."
    },
    {
      year: "2024",
      title: "Collaborative Planning",
      description: "Bismanjot and Himanshu began collaborative discussions to shape the vision and plan the technical implementation."
    },
    {
      year: "2025",
      title: "Development Phase",
      description: "Himanshu developed the entire product with continuous collaboration and input from Bismanjot on frontend management and user experience."
    },
    {
      year: "2025",
      title: "Platform Launch",
      description: "Successfully launched the comprehensive LegalAI platform with advanced research capabilities and intuitive user interface."
    },
    {
      year: "2025",
      title: "Feature Enhancement",
      description: "Added legal news integration, modal functionality, and enhanced AI research capabilities through ongoing collaboration."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-20">
      {/* Hero Section */}
      <motion.section 
        className="py-20 bg-gradient-to-r from-blue-900/50 to-purple-900/50 relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute top-10 left-10 w-20 h-20 bg-blue-500/10 rounded-full blur-xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-10 right-10 w-32 h-32 bg-purple-500/10 rounded-full blur-xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.4, 0.7, 0.4],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
          />
        </div>
        
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <motion.h1 
            className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            About LegalAI
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            We're on a mission to revolutionize the legal industry through artificial intelligence, 
            making legal services more accessible, efficient, and affordable for everyone. Originally 
            conceptualized by Bismanjot Singh and brought to life through collaborative development 
            with Himanshu Kapoor, this platform represents innovative thinking and technical excellence.
          </motion.p>
        </div>
      </motion.section>

      {/* Mission & Vision */}
      <motion.section 
        className="py-20"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            className="grid grid-cols-1 lg:grid-cols-2 gap-12"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div 
              className="bg-gray-800 p-8 rounded-xl border border-gray-700 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20"
              variants={cardVariants}
              whileHover={{ 
                scale: 1.02,
                boxShadow: "0 10px 30px rgba(59, 130, 246, 0.3)"
              }}
            >
              <motion.div 
                className="text-4xl mb-6"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                🎯
              </motion.div>
              <h2 className="text-3xl font-bold text-white mb-4">Our Mission</h2>
              <p className="text-gray-300 text-lg leading-relaxed">
                To democratize access to legal expertise by leveraging cutting-edge AI technology. 
                We believe that everyone deserves high-quality legal assistance, regardless of their 
                resources or location. Born from Bismanjot Singh's vision and realized through 
                collaborative development, our platform empowers legal professionals to work more 
                efficiently while making legal services accessible to those who need them most.
              </p>
            </motion.div>

            <motion.div 
              className="bg-gray-800 p-8 rounded-xl border border-gray-700 hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20"
              variants={cardVariants}
              whileHover={{ 
                scale: 1.02,
                boxShadow: "0 10px 30px rgba(147, 51, 234, 0.3)"
              }}
            >
              <motion.div 
                className="text-4xl mb-6"
                whileHover={{ scale: 1.1, rotate: -5 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                🔮
              </motion.div>
              <h2 className="text-3xl font-bold text-white mb-4">Our Vision</h2>
              <p className="text-gray-300 text-lg leading-relaxed">
                A world where legal expertise is instantly accessible to anyone, anywhere. 
                We envision a future where AI-powered tools eliminate the barriers that prevent 
                people from understanding their rights and accessing justice. Through innovative 
                thinking and collaborative development, we're building the next generation of 
                legal services that combine visionary ideas with technical excellence.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>
      
      {/* Team Section */}
      <motion.section 
        className="py-20"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold text-white mb-4">Meet Our Team</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Visionary thinkers and technical innovators working together to transform the industry
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {teamMembers.map((member, index) => (
              <motion.div 
                key={index} 
                className="bg-gray-800 p-8 rounded-xl border border-gray-700 text-center hover:border-blue-500/50 transition-all duration-300"
                variants={cardVariants}
                whileHover={{ 
                  scale: 1.03,
                  boxShadow: "0 15px 35px rgba(59, 130, 246, 0.2)",
                  y: -5
                }}
              >
                <motion.div 
                  className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4"
                  whileHover={{ 
                    scale: 1.1,
                    rotate: 360,
                    boxShadow: "0 0 20px rgba(59, 130, 246, 0.5)"
                  }}
                  transition={{ duration: 0.6 }}
                >
                  {member.image}
                </motion.div>
                <motion.h3 
                  className="text-xl font-semibold text-white mb-2"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {member.name}
                </motion.h3>
                <motion.div 
                  className="text-blue-400 font-medium mb-3"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {member.role}
                </motion.div>
                <motion.p 
                  className="text-gray-300 text-sm leading-relaxed"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  {member.bio}
                </motion.p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Values Section */}
      <motion.section 
        className="py-20 bg-gray-800"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold text-white mb-4">Our Values</h2>
            <p className="text-xl text-gray-300">
              The principles that guide everything we do
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div 
              className="text-center group"
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
            >
              <motion.div 
                className="text-5xl mb-6"
                whileHover={{ 
                  scale: 1.2,
                  rotate: [0, -10, 10, -10, 0],
                }}
                transition={{ duration: 0.6 }}
              >
                🤝
              </motion.div>
              <h3 className="text-xl font-semibold text-white mb-4">Integrity</h3>
              <p className="text-gray-300">
                We maintain the highest ethical standards in everything we do, 
                ensuring trust and transparency in all our relationships.
              </p>
            </motion.div>

            <motion.div 
              className="text-center group"
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
            >
              <motion.div 
                className="text-5xl mb-6"
                whileHover={{ 
                  scale: 1.2,
                  y: [-5, 5, -5],
                }}
                transition={{ duration: 0.6 }}
              >
                🚀
              </motion.div>
              <h3 className="text-xl font-semibold text-white mb-4">Innovation</h3>
              <p className="text-gray-300">
                We continuously push the boundaries of what's possible with AI 
                and technology to solve real-world legal challenges.
              </p>
            </motion.div>

            <motion.div 
              className="text-center group"
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
            >
              <motion.div 
                className="text-5xl mb-6"
                whileHover={{ 
                  scale: 1.2,
                  rotate: 360,
                }}
                transition={{ duration: 0.8 }}
              >
                🌍
              </motion.div>
              <h3 className="text-xl font-semibold text-white mb-4">Accessibility</h3>
              <p className="text-gray-300">
                We believe legal services should be accessible to everyone, 
                regardless of their background or resources.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        className="py-20 bg-gradient-to-r from-blue-900 to-purple-900 relative overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        {/* Animated background particles */}
        <div className="absolute inset-0">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.2, 0.8, 0.2],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
        
        <div className="max-w-4xl mx-auto text-center px-6 relative z-10">
          <motion.h2 
            className="text-4xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Join Us in Transforming Legal Services
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-200 mb-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Whether you're a legal professional or someone seeking legal assistance, 
            we're here to help you navigate the complex world of law with confidence.
          </motion.p>
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <motion.a
              href="/contact"
              className="px-8 py-4 bg-white text-blue-900 font-semibold rounded-lg hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 10px 25px rgba(255, 255, 255, 0.3)"
              }}
              whileTap={{ scale: 0.95 }}
            >
              Get in Touch
            </motion.a>
            <motion.a
              href="/askai"
              className="px-8 py-4 border border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-900 transition-all duration-300"
              whileHover={{ 
                scale: 1.05,
                backgroundColor: "white",
                color: "#1e3a8a"
              }}
              whileTap={{ scale: 0.95 }}
            >
              Try Our Platform
            </motion.a>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default About;
