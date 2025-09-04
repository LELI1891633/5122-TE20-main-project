import React from "react";
import { ExternalLink } from "lucide-react";

const HealthInfo = () => {
  return (
    <div className="min-h-screen p-6 sm:p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-8 text-center">Health Information</h1>
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
          <p className="text-lg text-gray-600 mb-6 leading-relaxed">
            Here you'll find workstation standards, eye health, and Vitamin D info from trusted government resources.
          </p>
          <div className="space-y-4">
            <a
              href="https://www.safeworkaustralia.gov.au/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-300 group"
            >
              <ExternalLink className="text-blue-600 group-hover:scale-110 transition-transform" size={20} />
              <span className="text-gray-800 font-medium">Safe Work Australia</span>
            </a>
            <a
              href="https://www.worksafe.vic.gov.au/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-300 group"
            >
              <ExternalLink className="text-blue-600 group-hover:scale-110 transition-transform" size={20} />
              <span className="text-gray-800 font-medium">WorkSafe Victoria</span>
            </a>
            <a
              href="https://www.health.gov.au/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-300 group"
            >
              <ExternalLink className="text-blue-600 group-hover:scale-110 transition-transform" size={20} />
              <span className="text-gray-800 font-medium">Australian Government Health</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthInfo;
