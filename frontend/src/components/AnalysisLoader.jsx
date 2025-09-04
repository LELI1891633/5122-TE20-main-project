import React from "react";
import { motion } from "framer-motion";
import { Monitor, Brain, CheckCircle } from "lucide-react";

const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center space-x-1">
      <motion.div
        className="w-2 h-2 bg-sky-600 rounded-full"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
      />
      <motion.div
        className="w-2 h-2 bg-sky-600 rounded-full"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
      />
      <motion.div
        className="w-2 h-2 bg-sky-600 rounded-full"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
      />
    </div>
  );
};

const AnalysisLoader = ({ step = 0 }) => {
  const steps = [
    { icon: Monitor, text: "Analyzing your setup...", color: "text-blue-600" },
    { icon: Brain, text: "Processing ergonomic data...", color: "text-purple-600" },
    { icon: CheckCircle, text: "Generating recommendations...", color: "text-green-600" }
  ];

  const currentStep = steps[step] || steps[0];
  const Icon = currentStep.icon;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-lg p-8">
      <div className="text-center space-y-6">
        {/* Animated Icon */}
        <motion.div
          className="flex justify-center"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <div className={`p-4 rounded-full bg-slate-100 ${currentStep.color}`}>
            <Icon size={32} />
          </div>
        </motion.div>

        {/* Progress Steps */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-slate-800">
            Analyzing Your Workspace
          </h3>
          
          {/* Step Indicator */}
          <div className="flex justify-center space-x-2 mb-4">
            {steps.map((_, index) => (
              <motion.div
                key={index}
                className={`w-3 h-3 rounded-full ${
                  index <= step ? 'bg-sky-600' : 'bg-slate-200'
                }`}
                initial={{ scale: 0.8 }}
                animate={{ 
                  scale: index === step ? [0.8, 1.2, 0.8] : 0.8,
                  backgroundColor: index <= step ? '#0ea5e9' : '#e2e8f0'
                }}
                transition={{ 
                  duration: index === step ? 1 : 0.3,
                  repeat: index === step ? Infinity : 0
                }}
              />
            ))}
          </div>

          {/* Current Step Text */}
          <motion.p
            key={step}
            className="text-slate-600"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {currentStep.text}
          </motion.p>

          {/* Loading Spinner */}
          <LoadingSpinner />
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-200 rounded-full h-2">
          <motion.div
            className="bg-gradient-to-r from-sky-500 to-blue-600 h-2 rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: `${((step + 1) / steps.length) * 100}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </div>

        {/* Estimated Time */}
        <p className="text-sm text-slate-500">
          This will take just a moment...
        </p>
      </div>
    </div>
  );
};

export default AnalysisLoader;
