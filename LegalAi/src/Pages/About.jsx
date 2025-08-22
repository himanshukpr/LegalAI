import React from 'react';

const About = () => {
  const teamMembers = [
    {
      name: "Dr. Sarah Chen",
      role: "CEO & Co-Founder",
      image: "SC",
      bio: "Former BigLaw partner with 15+ years in corporate law. PhD in Computer Science from Stanford."
    },
    {
      name: "Michael Rodriguez",
      role: "CTO & Co-Founder",
      image: "MR",
      bio: "AI researcher with expertise in natural language processing. Former Google AI team lead."
    },
    {
      name: "Jennifer Park",
      role: "Chief Legal Officer",
      image: "JP",
      bio: "Constitutional law expert with Supreme Court clerkship. Harvard Law School JD."
    },
    {
      name: "David Kim",
      role: "Head of Product",
      image: "DK",
      bio: "Legal tech veteran with 10+ years building lawyer-focused software solutions."
    }
  ];

  const milestones = [
    {
      year: "2021",
      title: "Company Founded",
      description: "LegalAI was founded by legal and AI experts with a vision to democratize legal services."
    },
    {
      year: "2022",
      title: "Product Launch",
      description: "Launched our first AI-powered legal research platform serving 100+ law firms."
    },
    {
      year: "2023",
      title: "Series A Funding",
      description: "Raised $25M Series A to expand our AI capabilities and team."
    },
    {
      year: "2024",
      title: "Global Expansion",
      description: "Expanded to serve legal professionals in 15+ countries worldwide."
    },
    {
      year: "2025",
      title: "AI Innovation",
      description: "Leading the industry with next-generation legal AI technology."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-20">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-blue-900/50 to-purple-900/50">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            About LegalAI
          </h1>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            We're on a mission to revolutionize the legal industry through artificial intelligence, 
            making legal services more accessible, efficient, and affordable for everyone.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-gray-800 p-8 rounded-xl border border-gray-700">
              <div className="text-4xl mb-6">🎯</div>
              <h2 className="text-3xl font-bold text-white mb-4">Our Mission</h2>
              <p className="text-gray-300 text-lg leading-relaxed">
                To democratize access to legal expertise by leveraging cutting-edge AI technology. 
                We believe that everyone deserves high-quality legal assistance, regardless of their 
                resources or location. Our platform empowers legal professionals to work more 
                efficiently while making legal services more accessible to those who need them most.
              </p>
            </div>

            <div className="bg-gray-800 p-8 rounded-xl border border-gray-700">
              <div className="text-4xl mb-6">🔮</div>
              <h2 className="text-3xl font-bold text-white mb-4">Our Vision</h2>
              <p className="text-gray-300 text-lg leading-relaxed">
                A world where legal expertise is instantly accessible to anyone, anywhere. 
                We envision a future where AI-powered tools eliminate the barriers that prevent 
                people from understanding their rights and accessing justice. Through innovation 
                and technology, we're building the next generation of legal services.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 bg-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Our Story</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              From a simple idea to a platform trusted by thousands of legal professionals worldwide
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-px h-full w-0.5 bg-gradient-to-b from-blue-500 to-purple-600"></div>
            
            {milestones.map((milestone, index) => (
              <div key={index} className={`relative flex items-center mb-12 ${
                index % 2 === 0 ? 'justify-start' : 'justify-end'
              }`}>
                <div className={`w-full max-w-md ${
                  index % 2 === 0 ? 'mr-auto pr-8' : 'ml-auto pl-8'
                }`}>
                  <div className="bg-gray-900 p-6 rounded-xl border border-gray-600">
                    <div className="text-blue-400 font-bold text-lg mb-2">{milestone.year}</div>
                    <h3 className="text-xl font-semibold text-white mb-2">{milestone.title}</h3>
                    <p className="text-gray-300">{milestone.description}</p>
                  </div>
                </div>
                
                <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full border-4 border-gray-900"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Meet Our Team</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Legal experts and AI innovators working together to transform the industry
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-gray-800 p-6 rounded-xl border border-gray-700 text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
                  {member.image}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{member.name}</h3>
                <div className="text-blue-400 font-medium mb-3">{member.role}</div>
                <p className="text-gray-300 text-sm leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Our Values</h2>
            <p className="text-xl text-gray-300">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-5xl mb-6">🤝</div>
              <h3 className="text-xl font-semibold text-white mb-4">Integrity</h3>
              <p className="text-gray-300">
                We maintain the highest ethical standards in everything we do, 
                ensuring trust and transparency in all our relationships.
              </p>
            </div>

            <div className="text-center">
              <div className="text-5xl mb-6">🚀</div>
              <h3 className="text-xl font-semibold text-white mb-4">Innovation</h3>
              <p className="text-gray-300">
                We continuously push the boundaries of what's possible with AI 
                and technology to solve real-world legal challenges.
              </p>
            </div>

            <div className="text-center">
              <div className="text-5xl mb-6">🌍</div>
              <h3 className="text-xl font-semibold text-white mb-4">Accessibility</h3>
              <p className="text-gray-300">
                We believe legal services should be accessible to everyone, 
                regardless of their background or resources.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-900 to-purple-900">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-4xl font-bold text-white mb-6">
            Join Us in Transforming Legal Services
          </h2>
          <p className="text-xl text-gray-200 mb-8">
            Whether you're a legal professional or someone seeking legal assistance, 
            we're here to help you navigate the complex world of law with confidence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="px-8 py-4 bg-white text-blue-900 font-semibold rounded-lg hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Get in Touch
            </a>
            <a
              href="/askai"
              className="px-8 py-4 border border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-900 transition-all duration-300"
            >
              Try Our Platform
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
