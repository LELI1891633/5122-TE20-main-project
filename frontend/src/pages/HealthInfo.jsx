import React from "react";
import "./../styles/HealthInfo.css";

const HealthInfo = () => {
  return (
    <div className="info-container">
      <h1>Health Information</h1>
      <p>
        Here you’ll find workstation standards, eye health, and Vitamin D info from trusted government resources.
      </p>
      <ul>
        <li><a href="https://www.safeworkaustralia.gov.au/" target="_blank">Safe Work Australia</a></li>
        <li><a href="https://www.worksafe.vic.gov.au/" target="_blank">WorkSafe Victoria</a></li>
        <li><a href="https://www.health.gov.au/" target="_blank">Australian Government Health</a></li>
      </ul>
    </div>
  );
};

export default HealthInfo;
