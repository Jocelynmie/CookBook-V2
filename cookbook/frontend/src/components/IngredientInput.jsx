import PropTypes from "prop-types";
import "./IngredientInput.css";

function IngredientInput({ ingredient, index, onChange }) {
  return (
    <div className="ingredient-input">
      <div className="ingredient-name">
        <input
          type="text"
          name="name"
          placeholder="Ingredient name"
          value={ingredient.name}
          onChange={(e) => onChange(index, e)}
          required
        />
      </div>
      <div className="ingredient-amount">
        <input
          type="text"
          name="amount"
          placeholder="Amount"
          value={ingredient.amount}
          onChange={(e) => onChange(index, e)}
        />
      </div>
      <div className="ingredient-unit">
        <input
          type="text"
          name="unit"
          placeholder="Unit (g, kg, etc.)"
          value={ingredient.unit}
          onChange={(e) => onChange(index, e)}
        />
      </div>
    </div>
  );
}

IngredientInput.propTypes = {
  ingredient: PropTypes.shape({
    name: PropTypes.string.isRequired,
    amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    unit: PropTypes.string,
  }).isRequired,
  index: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default IngredientInput;
