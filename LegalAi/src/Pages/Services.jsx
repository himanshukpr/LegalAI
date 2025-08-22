import React from 'react';
import { Link } from 'react-router-dom';

const Services = () => {
  const services = [
    {
      icon: "🔍",
      title: "AI Legal Research",
      description: "Advanced AI-powered legal research that searches through millions of cases, statutes, and legal documents in seconds.",
      features: [
        "Natural language search queries",
        "Relevance ranking and filtering",
        "Citation analysis and verification",
        "Real-time legal updates"
      ],
      pricing: "Starting at $99/month"
    },
    {
      icon: "📄",
      title: "Document Analysis",
      description: "Intelligent document review and analysis that identifies key clauses, risks, and compliance issues automatically.",
      features: [
        "Contract risk assessment",
        "Clause extraction and analysis",
        "Compliance checking",
        "Redlining suggestions"
      ],
      pricing: "Starting at $149/month"
    },
    {
      icon: "⚖️",
      title: "Case Management",
      description: "Comprehensive case management platform with AI-driven insights, deadline tracking, and workflow automation.",
      features: [
        "Automated deadline tracking",
        "Case outcome prediction",
        "Client communication tools",
        "Document organization"
      ],
      pricing: "Starting at $199/month"
    },
    {
      icon: "📋",
      title: "Contract Generation",
      description: "AI-powered contract generation and customization based on your specific requirements and industry standards.",
      features: [
        "Template library access",
        "Custom clause generation",
        "Industry-specific contracts",
        "Version control and tracking"
      ],
      pricing: "Starting at $79/month"
    },
    {
      icon: "🤖",
      title: "Legal Chatbot",
      description: "24/7 AI assistant that answers legal questions, provides guidance, and helps with routine legal tasks.",
      features: [
        "24/7 availability",
        "Multi-language support",
        "Context-aware responses",
        "Integration with your systems"
      ],
      pricing: "Starting at $49/month"
    },
    {
      icon: "📊",
      title: "Legal Analytics",
      description: "Powerful analytics and reporting tools that provide insights into legal trends, case outcomes, and performance metrics.",
      features: [
        "Performance analytics",
        "Trend analysis",
        "Outcome predictions",
        "Custom reporting"
      ],
      pricing: "Starting at $129/month"
    }
  ];

  const industries = [
    {
      name: "Corporate Law",
      description: "Mergers, acquisitions, corporate governance, and compliance solutions.",
      icon: "🏢"
    },
    {
      name: "Litigation",
      description: "Case research, document discovery, and trial preparation tools.",
      icon: "⚖️"
    },
    {
      name: "Real Estate",
      description: "Property law, contract analysis, and due diligence automation.",
      icon: "🏠"
    },
    {
      name: "Intellectual Property",
      description: "Patent research, trademark analysis, and IP portfolio management.",
      icon: "💡"
    },
    {
      name: "Employment Law",
      description: "HR compliance, employment contracts, and workplace policy analysis.",
      icon: "👥"
    },
    {
      name: "Healthcare Law",
      description: "HIPAA compliance, medical malpractice, and healthcare regulations.",
      icon: "🏥"
    }
  ];

  const pricingPlans = [
    {
      name: "Starter",
      price: "$99",
      period: "per month",
      description: "Perfect for solo practitioners and small firms",
      features: [
        "AI Legal Research",
        "Basic Document Analysis",
        "5GB Storage",
        "Email Support",
        "Up to 3 users"
      ],
      popular: false
    },
    {
      name: "Professional",
      price: "$299",
      period: "per month",
      description: "Ideal for growing law firms and teams",
      features: [
        "All Starter features",
        "Advanced Document Analysis",
        "Case Management",
        "Contract Generation",
        "50GB Storage",
        "Priority Support",
        "Up to 15 users"
      ],
      popular: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "pricing",
      description: "Tailored solutions for large organizations",
      features: [
        "All Professional features",
        "Legal Analytics",
        "Custom integrations",
        "Unlimited storage",
        "Dedicated support",
        "Unlimited users",
        "On-premise deployment"
      ],
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-20">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-blue-900/50 to-purple-900/50">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Our Services
          </h1>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Comprehensive AI-powered legal solutions designed to streamline your practice, 
            enhance efficiency, and deliver better outcomes for your clients.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Complete Legal AI Solutions
            </h2>
            <p className="text-xl text-gray-300">
              Everything you need to modernize your legal practice
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-gray-800 p-8 rounded-xl border border-gray-700 hover:border-blue-500 transition-all duration-300 group">
                <div className="text-4xl mb-6 group-hover:scale-110 transition-transform duration-300">
                  {service.icon}
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  {service.title}
                </h3>
                <p className="text-gray-300 mb-6 leading-relaxed">
                  {service.description}
                </p>
                
                <div className="space-y-2 mb-6">
                  {service.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center text-gray-300">
                      <span className="text-blue-400 mr-2">✓</span>
                      {feature}
                    </div>
                  ))}
                </div>
                
                <div className="pt-4 border-t border-gray-700">
                  <div className="text-blue-400 font-semibold mb-4">
                    {service.pricing}
                  </div>
                  <button className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300">
                    Learn More
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries Section */}
      <section className="py-20 bg-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Industries We Serve
            </h2>
            <p className="text-xl text-gray-300">
              Specialized solutions for every legal practice area
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {industries.map((industry, index) => (
              <div key={index} className="bg-gray-900 p-6 rounded-xl border border-gray-700 hover:border-blue-500 transition-all duration-300">
                <div className="text-3xl mb-4">{industry.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  {industry.name}
                </h3>
                <p className="text-gray-300">
                  {industry.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Choose Your Plan
            </h2>
            <p className="text-xl text-gray-300">
              Flexible pricing options to fit your practice size and needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <div key={index} className={`bg-gray-800 p-8 rounded-xl border-2 transition-all duration-300 relative ${
                plan.popular 
                  ? 'border-blue-500 transform scale-105' 
                  : 'border-gray-700 hover:border-blue-500'
              }`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {plan.name}
                  </h3>
                  <div className="text-4xl font-bold text-blue-400 mb-2">
                    {plan.price}
                    <span className="text-lg text-gray-400 font-normal">
                      /{plan.period}
                    </span>
                  </div>
                  <p className="text-gray-300">
                    {plan.description}
                  </p>
                </div>

                <div className="space-y-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center text-gray-300">
                      <span className="text-blue-400 mr-3">✓</span>
                      {feature}
                    </div>
                  ))}
                </div>

                <button className={`w-full px-6 py-3 font-semibold rounded-lg transition-all duration-300 ${
                  plan.popular
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
                    : 'bg-gray-700 text-white hover:bg-gray-600'
                }`}>
                  {plan.name === 'Enterprise' ? 'Contact Sales' : 'Get Started'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-900 to-purple-900">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Legal Practice?
          </h2>
          <p className="text-xl text-gray-200 mb-8">
            Join thousands of legal professionals who are already using AI to work smarter and deliver better results.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="px-8 py-4 bg-white text-blue-900 font-semibold rounded-lg hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Schedule Demo
            </Link>
            <Link
              to="/askai"
              className="px-8 py-4 border border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-900 transition-all duration-300"
            >
              Try For Free
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
