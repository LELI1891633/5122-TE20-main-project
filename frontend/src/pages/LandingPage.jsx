import React from "react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="text-center p-15">
      <section className="bg-gradient-to-br from-blue-400 to-blue-700 text-white p-20 rounded-xl mb-5">
        <h2>Hi, welcome to OfficeEase 👋</h2>
        <p>I am your assistant and I’ll guide you to a healthier workspace.</p>
      </section>

      <button className="fixed bottom-5 right-5 bg-blue-700 text-white border-none rounded-full p-3 cursor-pointer text-base transition-colors duration-300 hover:bg-blue-800" onClick={() => navigate("/healthy")}>
        Let’s Start →
      </button>
    </div>
  );
};

export default LandingPage;