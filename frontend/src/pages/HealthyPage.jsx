import React from "react";
import { useNavigate } from "react-router-dom";
import "./../styles/HealthyPage.css";

const HealthyPage = () => {
  const navigate = useNavigate();

  return (
    <div className="healthy-container">
      <div className="cards-container">
        <div className="card desk" onClick={() => navigate("/healthy-desk")}>
          <div className="overlay"><h2>Healthy Desk</h2></div>
        </div>

        <div className="card you" onClick={() => navigate("/healthy-you")}>
          <div className="overlay"><h2>Healthy You</h2></div>
        </div>
      </div>
    </div>
  );
};

export default HealthyPage;
