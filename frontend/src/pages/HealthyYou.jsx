import React from "react";
import { useNavigate } from "react-router-dom";
import { 
  Info, 
  Eye, 
  Sun, 
  Coffee, 
  Timer, 
  Heart,
  ArrowRight,
  CheckCircle,
  Users,
  Lightbulb
} from "lucide-react";

const HealthyYou = () => {
  const navigate = useNavigate();

  const healthTips = [
    {
      icon: Eye,
      title: "Eye Health",
      description: "Follow the 20-20-20 rule for healthy vision",
      tips: [
        "Every 20 minutes, look at something 20 feet away for 20 seconds",
        "Adjust screen brightness to match your surroundings",
        "Use artificial tears if your eyes feel dry",
        "Position your screen arm's length away"
      ],
      color: "blue"
    },
    {
      icon: Sun,
      title: "Vitamin D",
      description: "Essential for bone health and immune function",
      tips: [
        "Spend 10-15 minutes in sunlight daily",
        "Consider supplements if you work indoors all day",
        "Take lunch breaks outside when possible",
        "Open blinds to let natural light in"
      ],
      color: "yellow"
    },
    {
      icon: Coffee,
      title: "Regular Breaks",
      description: "Movement and rest for better productivity",
      tips: [
        "Take a 5-minute break every 30 minutes",
        "Stand and stretch hourly",
        "Walk around during phone calls",
        "Do simple desk exercises"
      ],
      color: "green"
    },
    {
      icon: Heart,
      title: "Mental Wellness",
      description: "Maintain your psychological health",
      tips: [
        "Practice deep breathing exercises",
        "Maintain work-life boundaries",
        "Stay connected with colleagues",
        "Take proper lunch breaks away from your desk"
      ],
      color: "purple"
    }
  ];

  const colorClasses = {
    blue: "from-sky-500 to-sky-600 bg-sky-50 border-sky-200 text-sky-800",
    yellow: "from-yellow-500 to-yellow-600 bg-yellow-50 border-yellow-200 text-yellow-800",
    green: "from-green-500 to-green-600 bg-green-50 border-green-200 text-green-800",
    purple: "from-purple-500 to-purple-600 bg-purple-50 border-purple-200 text-purple-800"
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-6 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <header className="max-w-6xl mx-auto mb-12">
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="bg-green-600 p-3 rounded-2xl">
              <Users className="text-white" size={32} />
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-800">Healthy You</h1>
          </div>
          <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Essential health tips and practices for office workers and remote professionals. 
            Take care of your body and mind while working.
          </p>
          
          {/* Quick Info Button */}
          <div className="mt-6">
            <button
              onClick={() => navigate("/health-info")}
              className="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white font-medium px-6 py-3 rounded-xl transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              <Info size={20} />
              Official Health Guidelines
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* Health Tips Grid */}
      <main className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {healthTips.map(({ icon: Icon, title, description, tips, color }, index) => (
            <div 
              key={title}
              className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
            >
              {/* Card Header */}
              <div className={`bg-gradient-to-r ${colorClasses[color].split(' ')[0]} ${colorClasses[color].split(' ')[1]} p-6 text-white`}>
                <div className="flex items-center gap-4">
                  <div className="bg-white/20 p-3 rounded-xl">
                    <Icon size={28} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{title}</h2>
                    <p className="text-white/90 mt-1">{description}</p>
                  </div>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-6">
                <div className="space-y-3">
                  {tips.map((tip, tipIndex) => (
                    <div key={tipIndex} className="flex items-start gap-3">
                      <CheckCircle className="text-green-500 mt-0.5 flex-shrink-0" size={16} />
                      <p className="text-slate-700 text-sm leading-relaxed">{tip}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Resources */}
        <section className="mt-16">
          <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8 sm:p-12 text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Lightbulb className="text-sky-600" size={32} />
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">Need More Guidance?</h2>
            </div>
            
            <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              For comprehensive workplace health standards and official guidelines, 
              visit our health information section with trusted government resources.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate("/health-info")}
                className="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white font-medium px-8 py-4 rounded-xl transition-colors duration-200 shadow-lg hover:shadow-xl"
              >
                <Info size={20} />
                Official Guidelines
                <ArrowRight size={16} />
              </button>
              
              <button
                onClick={() => navigate("/healthy-desk")}
                className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium px-8 py-4 rounded-xl border border-slate-200 transition-colors duration-200"
              >
                <Timer size={20} />
                Assess Your Workspace
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default HealthyYou;
