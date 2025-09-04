import React from "react";
import { useNavigate } from "react-router-dom";
import { Monitor, User, ArrowRight } from "lucide-react";

const HealthyPage = () => {
  const navigate = useNavigate();

  const healthyOptions = [
    {
      id: "healthy-desk",
      title: "Healthy Desk",
      description: "Optimize your workspace setup for better posture and productivity",
      icon: Monitor,
      route: "/healthy-desk",
      gradient: "from-sky-500 to-sky-700",
      features: ["Ergonomic assessment", "Posture guidance", "Equipment recommendations"]
    },
    {
      id: "healthy-you",
      title: "Healthy You",
      description: "Personal health tips for office workers and remote professionals",
      icon: User,
      route: "/healthy-you",
      gradient: "from-green-500 to-green-700",
      features: ["Eye health tips", "Break reminders", "Vitamin D guidance"]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-4">
            Choose Your Health Journey
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Select the area you'd like to focus on to get personalized recommendations 
            for a healthier work environment.
          </p>
        </div>

        {/* Options Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {healthyOptions.map(({ id, title, description, icon: Icon, route, gradient, features }) => (
            <div 
              key={id}
              className="group relative bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
            >
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-300`} />
              
              {/* Content */}
              <div className="relative p-8 sm:p-10">
                {/* Icon */}
                <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${gradient} rounded-2xl shadow-lg mb-6`}>
                  <Icon className="text-white" size={32} />
                </div>

                {/* Title & Description */}
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-4">
                  {title}
                </h2>
                <p className="text-slate-600 mb-6 leading-relaxed">
                  {description}
                </p>

                {/* Features List */}
                <ul className="space-y-2 mb-8">
                  {features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3 text-sm text-slate-600">
                      <div className={`w-2 h-2 bg-gradient-to-r ${gradient} rounded-full`} />
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <button
                  onClick={() => navigate(route)}
                  className={`w-full inline-flex items-center justify-center gap-3 bg-gradient-to-r ${gradient} text-white font-semibold py-4 px-6 rounded-xl hover:shadow-lg transition-all duration-300 group-hover:scale-105`}
                >
                  Get Started
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200 max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold text-slate-800 mb-3">
              Need guidance?
            </h3>
            <p className="text-slate-600 mb-4">
              Not sure where to start? Our assistant can help guide you through 
              the best options for your specific needs.
            </p>
            <p className="text-sm text-slate-500">
              💡 Look for the assistant button in the bottom-left corner for helpful tips!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthyPage;