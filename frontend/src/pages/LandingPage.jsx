import React from "react";
import { useNavigate } from "react-router-dom";
import "./../styles/LandingPage.css";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <section className="hero">
        <h2>Hi, welcome to OfficeEase 👋</h2>
        <p>I am your assistant and I’ll guide you to a healthier workspace.</p>
      </section>

      <button className="start-btn" onClick={() => navigate("/healthy")}>
        Let’s Start →
      </button>
    </div>
  );
};

export default LandingPage;
