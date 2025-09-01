import React from "react";
import { Link } from "react-router-dom";
import "./../styles/Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <h1 className="logo">OfficeEase</h1>
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/healthy">Healthy Space</Link></li>
        <li><Link to="/health-info">Health Info</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
