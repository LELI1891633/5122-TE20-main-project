import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="flex justify-between items-center bg-gray-900 p-3 px-6 text-white">
      <h1 className="font-bold">OfficeEase</h1>
      <ul className="list-none flex gap-4">
        <li><Link to="/" className="text-white transition-colors duration-300 hover:text-blue-400">Home</Link></li>
        <li><Link to="/healthy" className="text-white transition-colors duration-300 hover:text-blue-400">Healthy Space</Link></li>
        <li><Link to="/health-info" className="text-white transition-colors duration-300 hover:text-blue-400">Health Info</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
