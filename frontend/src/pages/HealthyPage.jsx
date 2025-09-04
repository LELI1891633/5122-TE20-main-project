import React from "react";
import { useNavigate } from "react-router-dom";

const HealthyPage = () => {
  const navigate = useNavigate();

  return (
    <div className="p-10 flex justify-center gap-5">
      <div className="cards-container">
        <div className="w-70 h-45 rounded-xl bg-cover bg-center relative cursor-pointer overflow-hidden transition-transform duration-300 hover:scale-105" style={{ backgroundImage: "url('/images/desk.jpg')" }} onClick={() => navigate("/healthy-desk")}>
          <div className="absolute inset-0 bg-black bg-opacity-40 text-white flex justify-center items-center text-xl font-bold">
            <h2>Healthy Desk</h2>
          </div>
        </div>

        <div className="w-70 h-45 rounded-xl bg-cover bg-center relative cursor-pointer overflow-hidden transition-transform duration-300 hover:scale-105" style={{ backgroundImage: "url('/images/health.jpg')" }} onClick={() => navigate("/healthy-you")}>
          <div className="absolute inset-0 bg-black bg-opacity-40 text-white flex justify-center items-center text-xl font-bold">
            <h2>Healthy You</h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthyPage;