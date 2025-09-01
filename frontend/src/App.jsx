import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Assistant from "./components/Assistant";
import LandingPage from "./pages/LandingPage";
import HealthyPage from "./pages/HealthyPage";
import HealthyDesk from "./pages/HealthyDesk";
import HealthyYou from "./pages/HealthyYou";
import HealthInfo from "./pages/HealthInfo";
import "./styles/global.css";

function App() {
  return (
    <Router>
      <Navbar />
      <Assistant />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/healthy" element={<HealthyPage />} />
        <Route path="/healthy-desk" element={<HealthyDesk />} />
        <Route path="/healthy-you" element={<HealthyYou />} />
        <Route path="/health-info" element={<HealthInfo />} />
      </Routes>
    </Router>
  );
}

export default App;
