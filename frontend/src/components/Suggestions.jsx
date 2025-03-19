import { useState, useEffect } from "react";
import SuggestionList from "./SuggestionList.jsx";
import "./css/Suggestions.css";

function Suggestions() {
  const [name, setName] = useState("");
  const [newSuggestion, setNewSuggestion] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  // Fetch suggestions from the API
  const fetchSuggestions = async () => {
    try {
      const response = await fetch("/api/suggestions");
      const data = await response.json();
      setSuggestions(data);
    } catch (error) {
      console.error(error);
    }
  };

  // Fetch suggestions on component mount
  useEffect(() => {
    fetchSuggestions();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const suggestionData = {
      name,
      content: newSuggestion,
    };

    try {
      const response = await fetch("/api/suggestions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(suggestionData),
      });

      if (response.ok) {
        // Clear the form fields
        setName("");
        setNewSuggestion("");
        // Refresh the suggestions list
        fetchSuggestions();
      } else {
        console.error("Failed to submit suggestion");
      }
    } catch (error) {
      console.error("Error submitting suggestion:", error);
    }
  };

  return (
    <div>
      <h1>Suggestions</h1>
      <div className="suggestions-form-container">
        <h2>Please Submit Your Suggestions</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Your name:</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <label htmlFor="suggestion">Suggestion:</label>
            <textarea
              id="suggestion"
              value={newSuggestion}
              onChange={(e) => setNewSuggestion(e.target.value)}
              rows="4"
              required
            />
          </div>
          <button type="submit" className="submit-button">
            Submit
          </button>
        </form>
      </div>
      <SuggestionList suggestions={suggestions} />
    </div>
  );
}

export default Suggestions;
