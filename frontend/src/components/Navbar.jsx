// components/Navbar.jsx
// import React from "react";
import "./css/Navbar.css";
import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="navbar-brand">CookBook 🍜</div>
      <ul className="navbar-nav">
        <li className={location.pathname === "/" ? "active" : ""}>
          <Link to="/">HomePage</Link>
        </li>
        <li className={location.pathname === "/recipes" ? "active" : ""}>
          <Link to="/recipes-page">Recipes Page</Link>
        </li>
        <li
          className={
            location.pathname === "/shopping-list-page" ? "active" : ""
          }
        >
          <Link to="/shopping-list-page">Shopping List Page</Link>
        </li>
        <li className={location.pathname === "/suggestions" ? "active" : ""}>
          <Link to="/suggestions">Suggestions</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
