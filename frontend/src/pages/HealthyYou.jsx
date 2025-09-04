import React from "react";
import { useNavigate } from "react-router-dom";

const HealthyYou = () => {
  const navigate = useNavigate();

  return (
    <div className="p-4">
      <header className="flex justify-between items-center">
        <h1>Healthy You</h1>
        <button className="text-2xl" onClick={() => navigate("/health-info")}>ℹ️</button>
      </header>
      <p>Learn about eye health, breaks, and Vitamin D for office workers.</p>
    </div>
  );
};

export default HealthyYou;
