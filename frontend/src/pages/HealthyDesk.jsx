import React from "react";
import { useNavigate } from "react-router-dom";
import "./../styles/HealthyDesk.css";

const HealthyDesk = () => {
  const navigate = useNavigate();

  return (
    <div className="page-container">
      <header className="page-header">
        <h1>Healthy Desk</h1>
        <button className="info-btn" onClick={() => navigate("/health-info")}>ℹ️</button>
      </header>
      <p>Answer some questions to check your workstation setup.</p>
    </div>
  );
};

export default HealthyDesk;
