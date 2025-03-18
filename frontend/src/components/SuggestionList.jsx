import PropTypes from "prop-types";
import "./SuggestionList.css";

export default function SuggestionList({ suggestions = [] }) {
  if (!suggestions || suggestions.length === 0) {
    return (
      <div className="suggestion-list-container container">
        <h2>Community Suggestions</h2>
        <div className="no-suggestions">
          <p>No suggestions yet. Be the first to contribute!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="suggestion-list-container container">
      <h2>Community Suggestions</h2>

      <div className="suggestions-list">
        {suggestions.map((suggestion) => (
          <div key={suggestion._id} className="suggestion-card">
            <div className="suggestion-header">
              <span className="suggestion-author">
                {suggestion.name || "Anonymous"}
              </span>
              <span className="suggestion-date">
                {new Date(suggestion.createdAt).toLocaleDateString()}
              </span>
            </div>
            <p className="suggestion-content">{suggestion.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

SuggestionList.propTypes = {
  suggestions: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string,
      content: PropTypes.string.isRequired,
      createdAt: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.instanceOf(Date),
      ]).isRequired,
    })
  ),
};

SuggestionList.defaultProps = {
  suggestions: [],
};
