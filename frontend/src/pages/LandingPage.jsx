import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Heart, Shield, Zap } from "lucide-react";
import { AnimatedAssistant } from "../components/AnimatedAssistant";

const LandingPage = () => {
  const navigate = useNavigate();
  const [assistantOpen, setAssistantOpen] = useState(true);

  const features = [
    {
      icon: Heart,
      title: "Health First",
      description: "Prioritize your wellbeing with personalized workspace recommendations"
    },
    {
      icon: Shield,
      title: "Safe Work",
      description: "Follow government standards for ergonomic office setups"
    },
    {
      icon: Zap,
      title: "Quick Assessment",
      description: "Get instant feedback on your workspace in just minutes"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Hero Section */}
      <section className="relative px-4 pt-16 pb-20 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Hero Content */}
          <div className="bg-gradient-to-br from-sky-600 to-sky-800 text-white rounded-3xl p-8 sm:p-12 lg:p-16 shadow-2xl border border-sky-200/20">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-sky-500/20 text-sky-100 px-4 py-2 rounded-full text-sm font-medium">
                <Heart size={16} />
                Welcome to OfficeEase
              </div>
              
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
                Hi, welcome to{" "}
                <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                  OfficeEase
                </span>{" "}
                👋
              </h1>
              
              <p className="text-lg sm:text-xl text-sky-100 max-w-2xl mx-auto leading-relaxed">
                I am your assistant and I'll guide you to a healthier workspace. 
                Transform your office setup with personalized recommendations.
              </p>
              
              <div className="pt-4">
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                  <button 
                    onClick={() => navigate("/healthy")}
                    className="inline-flex items-center gap-3 bg-white text-sky-600 font-semibold px-8 py-4 rounded-xl hover:bg-sky-50 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                  >
                    Let's Start
                    <ArrowRight size={20} />
                  </button>
                  
                  <button 
                    onClick={() => setAssistantOpen(true)}
                    className="inline-flex items-center gap-2 bg-sky-500/20 text-sky-100 border border-sky-400/30 font-medium px-6 py-3 rounded-xl hover:bg-sky-400/30 transition-all duration-300"
                  >
                    <Heart size={18} />
                    Get Help
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, description }, index) => (
              <div 
                key={title}
                className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="bg-sky-100 p-3 rounded-full">
                    <Icon className="text-sky-600" size={24} />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 pb-16 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">
              Ready to optimize your workspace?
            </h2>
            <p className="text-slate-600 mb-6">
              Join thousands of professionals who've improved their office health and productivity.
            </p>
            <button 
              onClick={() => navigate("/healthy")}
              className="inline-flex items-center gap-2 bg-sky-600 text-white font-medium px-6 py-3 rounded-lg hover:bg-sky-700 transition-colors duration-200"
            >
              Get Started Now
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* Animated Assistant */}
      <AnimatedAssistant
        open={assistantOpen}
        name="OfficeEase Assistant"
        position="bottom-right"
        accent="sky"
        steps={[
          { text: "Hi! I'm your OfficeEase assistant. Let me help you get started! 👋" },
          { text: "I'll guide you through creating a healthier workspace environment." },
          { text: "Click 'Let's Start' above to begin your ergonomic assessment!" },
          { text: "Feel free to explore our features or ask me anything about workspace health." }
        ]}
        onClose={() => setAssistantOpen(false)}
        onFinish={() => setAssistantOpen(false)}
        width={380}
        typingSpeed={25}
      />
    </div>
  );
};

export default LandingPage;