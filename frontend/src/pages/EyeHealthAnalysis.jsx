import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Eye, 
  ArrowLeft, 
  CheckCircle, 
  AlertTriangle,
  Info,
  Activity,
  Clock,
  Monitor,
  Sun,
  Zap
} from "lucide-react";
import { AnimatedAssistant } from "../components/AnimatedAssistant";

const EyeHealthAnalysis = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [assistantOpen, setAssistantOpen] = useState(true);
  const [formData, setFormData] = useState({
    ageGroup: "",
    sex: "",
    state: "",
    remotenessArea: ""
  });
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const ageGroups = [
    "0–14", "15–24", "25–34", "35–44", "45–54", "55–64", "65–74", "75–84", "85+"
  ];

  const sexes = ["Male", "Female", "Persons"];
  
  const states = [
    "NSW", "VIC", "QLD", "SA", "WA", "TAS", "NT", "ACT"
  ];

  const remotenessAreas = [
    "Major Cities", "Inner Regional", "Outer Regional", "Remote", "Very Remote"
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };


  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:3001/api/eye-health/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (result.success) {
        setAnalysisResult(result.data);
        setCurrentStep(2);
      } else {
        throw new Error(result.error || 'Analysis failed');
      }
    } catch (error) {
      console.error('Analysis error:', error);
      alert('Analysis failed, please try again later');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
          <Eye className="text-blue-600" size={32} />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Eye Health Assessment</h2>
        <p className="text-slate-600">Please provide your basic information for personalized eye health analysis</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Age Group</label>
          <select
            value={formData.ageGroup}
            onChange={(e) => handleInputChange('ageGroup', e.target.value)}
            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select age group</option>
            {ageGroups.map(age => (
              <option key={age} value={age}>{age}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Sex</label>
          <select
            value={formData.sex}
            onChange={(e) => handleInputChange('sex', e.target.value)}
            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select sex</option>
            {sexes.map(sex => (
              <option key={sex} value={sex}>{sex}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">State/Territory</label>
          <select
            value={formData.state}
            onChange={(e) => handleInputChange('state', e.target.value)}
            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select state/territory</option>
            {states.map(state => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Remoteness Area</label>
          <select
            value={formData.remotenessArea}
            onChange={(e) => handleInputChange('remotenessArea', e.target.value)}
            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select remoteness area</option>
            {remotenessAreas.map(area => (
              <option key={area} value={area}>{area}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );


  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="bg-green-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
          <CheckCircle className="text-green-600" size={32} />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Analysis Results</h2>
        <p className="text-slate-600">Based on your information, we have generated a personalized eye health analysis report</p>
      </div>

      {analysisResult && (
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                <Eye className="text-blue-600" size={24} />
              </div>
              <h3 className="font-semibold text-slate-800 mb-1">Eye Health Risk</h3>
              <p className="text-2xl font-bold text-blue-600">{analysisResult.eye_risk?.toFixed(1) || 'N/A'}%</p>
            </div>
            
            <div className="text-center">
              <div className="bg-yellow-100 p-4 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                <AlertTriangle className="text-yellow-600" size={24} />
              </div>
              <h3 className="font-semibold text-slate-800 mb-1">Risk Level</h3>
              <p className="text-lg font-bold text-yellow-600">
                {analysisResult.risk_level || 'Medium'}
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 p-4 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                <Activity className="text-green-600" size={24} />
              </div>
              <h3 className="font-semibold text-slate-800 mb-1">Confidence</h3>
              <p className="text-lg font-bold text-green-600">
                {analysisResult.confidence || 'High'}
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
                <Info className="text-blue-600" size={20} />
                Personalized Recommendations
              </h3>
              <div className="bg-blue-50 rounded-lg p-4">
                <ul className="space-y-2">
                  {analysisResult.recommendations?.map((rec, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="text-blue-600 mt-0.5 flex-shrink-0" size={16} />
                      <span className="text-slate-700">{rec}</span>
                    </li>
                  )) || [
                    "遵循20-20-20规则：每20分钟看20英尺外的物体20秒",
                    "调整显示器亮度与周围环境匹配",
                    "保持显示器距离眼睛50-70厘米",
                    "定期进行眼部检查"
                  ].map((rec, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="text-blue-600 mt-0.5 flex-shrink-0" size={16} />
                      <span className="text-slate-700">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
                <Clock className="text-green-600" size={20} />
                Preventive Measures
              </h3>
              <div className="bg-green-50 rounded-lg p-4">
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <Zap className="text-green-600 mt-0.5 flex-shrink-0" size={16} />
                    <span className="text-slate-700">Use blue light filtering glasses or screen filters</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Sun className="text-green-600 mt-0.5 flex-shrink-0" size={16} />
                    <span className="text-slate-700">Ensure adequate natural lighting in your workspace</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Activity className="text-green-600 mt-0.5 flex-shrink-0" size={16} />
                    <span className="text-slate-700">Practice regular eye relaxation exercises</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const isStep1Valid = formData.ageGroup && formData.sex && formData.state && formData.remotenessArea;

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-sky-50 py-6 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 right-1/3 w-80 h-80 bg-gradient-to-br from-orange-200/30 to-pink-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-gradient-to-br from-sky-200/30 to-purple-200/30 rounded-full blur-3xl"></div>
      </div>
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-8 relative z-10">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate('/healthy-you')}
            className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md hover:bg-white/30 text-slate-700 font-medium px-4 py-2 rounded-lg border border-white/30 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <ArrowLeft size={16} />
            Back to Health Tips
          </button>
        </div>
        
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-2">Eye Health Analysis</h1>
          <p className="text-lg text-slate-600">Professional eye health assessment and personalized recommendations</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="flex items-center justify-center space-x-4">
          {[1, 2].map((step) => (
            <div key={step} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep >= step 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-slate-200 text-slate-600'
              }`}>
                {step}
              </div>
              {step < 2 && (
                <div className={`w-16 h-1 mx-2 ${
                  currentStep > step ? 'bg-blue-600' : 'bg-slate-200'
                }`} />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-2">
          <p className="text-sm text-slate-600">
            {currentStep === 1 && "Basic Information"}
            {currentStep === 2 && "Analysis Results"}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="bg-white/20 backdrop-blur-md rounded-3xl shadow-xl border border-white/30 p-8 hover:bg-white/30 transition-all duration-300">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep3()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <button
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
            className="px-6 py-3 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>

          {currentStep === 2 && (
            <button
              onClick={() => {
                setCurrentStep(1);
                setFormData({
                  ageGroup: "",
                  sex: "",
                  state: "",
                  remotenessArea: ""
                });
                setAnalysisResult(null);
              }}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              New Assessment
            </button>
          )}
        </div>

        {currentStep === 1 && (
          <div className="flex justify-center mt-4">
            <button
              onClick={handleSubmit}
              disabled={!isStep1Valid || isLoading}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Eye size={20} />
                  Start Analysis
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Animated Assistant */}
      <AnimatedAssistant
        open={assistantOpen}
        name="Eye Health Assistant"
        position="bottom-right"
        accent="sky"
        steps={[
          { text: "Welcome to your eye health assessment! 👁️" },
          { text: "I'll guide you through the analysis process step by step." },
          { text: "Fill out the form with your information to get personalized recommendations." },
          { text: "Your eye health is important - let's keep your vision sharp! 🔍" }
        ]}
        onClose={() => setAssistantOpen(false)}
        onFinish={() => setAssistantOpen(false)}
        width={380}
        typingSpeed={25}
      />
    </div>
  );
};

export default EyeHealthAnalysis;
