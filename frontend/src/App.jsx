// import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import ShoppingListPage from "./pages/ShoppingListPage.jsx";
import Navbar from "./components/Navbar.jsx";
import RecipePage from "./pages/RecipePage.jsx";
import SuggestionPage from "./pages/SuggestionPage.jsx";
import "./App.css";

function App() {
  return (
    <Router basename="/">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/recipes-page" element={<RecipePage />} />
          <Route path="/shopping-list-page" element={<ShoppingListPage />} />
          <Route path="/suggestions" element={<SuggestionPage />} />
        </Routes>
      </main>
      <footer className="footer">
        <div className="footer-content">
          <p>Made by Jocelyn Yang © {new Date().getFullYear()}</p>
        </div>
      </footer>
    </Router>
  );
}

export default App;
