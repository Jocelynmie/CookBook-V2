import { useState, useEffect } from "react";
import RecipeCard from "./RecipeCard.jsx";
import PropTypes from "prop-types";

function RecipeList({ recipes: propRecipes, onRecipeDeleted }) {
  const [localRecipes, setLocalRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/recipes");
      if (!response.ok) {
        throw new Error("Failed to fetch recipes");
      }
      const data = await response.json();
      setLocalRecipes(data);
    } catch (error) {
      console.error("Error fetching recipes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!propRecipes) {
      fetchRecipes();
    } else {
      setLoading(false);
    }
  }, [propRecipes]);

  const handleRecipeDeleted = (recipeId) => {
    if (onRecipeDeleted) {
      onRecipeDeleted(recipeId);
    } else {
      setLocalRecipes((currentRecipes) =>
        currentRecipes.filter((recipe) => recipe._id !== recipeId)
      );
    }
  };

  const recipesToDisplay = propRecipes || localRecipes;

  if (loading) return <p>Loading recipes...</p>;

  return (
    <div className="recipe-list">
      <h2>Recipe List</h2>
      {recipesToDisplay.length === 0 ? (
        <p>No recipes yet. Add your first recipe!</p>
      ) : (
        recipesToDisplay.map((recipe) => (
          <RecipeCard
            key={recipe._id ? recipe._id.$oid || recipe._id : Math.random()}
            recipeData={recipe}
            onRecipeDeleted={handleRecipeDeleted}
          />
        ))
      )}
    </div>
  );
}

RecipeList.propTypes = {
  recipes: PropTypes.array,
  onRecipeDeleted: PropTypes.func,
};

export default RecipeList;
