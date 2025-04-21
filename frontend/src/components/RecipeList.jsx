// import { useState, useEffect } from "react";
// import RecipeCard from "./RecipeCard.jsx";
// import PropTypes from "prop-types";

// function RecipeList({ recipes: propRecipes, onRecipeDeleted }) {
//   const [localRecipes, setLocalRecipes] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const fetchRecipes = async () => {
//     try {
//       setLoading(true);
//       const response = await fetch("/api/recipes");
//       if (!response.ok) {
//         throw new Error("Failed to fetch recipes");
//       }
//       const data = await response.json();
//       setLocalRecipes(data);
//     } catch (error) {
//       console.error("Error fetching recipes:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (!propRecipes) {
//       fetchRecipes();
//     } else {
//       setLoading(false);
//     }
//   }, [propRecipes]);

//   const handleRecipeDeleted = (recipeId) => {
//     if (onRecipeDeleted) {
//       onRecipeDeleted(recipeId);
//     } else {
//       setLocalRecipes((currentRecipes) =>
//         currentRecipes.filter((recipe) => recipe._id !== recipeId)
//       );
//     }
//   };

//   const recipesToDisplay = propRecipes || localRecipes;

//   if (loading) return <p>Loading recipes...</p>;

//   return (
//     <div className="recipe-list">
//       <h2>Recipe List</h2>
//       {recipesToDisplay.length === 0 ? (
//         <p>No recipes yet. Add your first recipe!</p>
//       ) : (
//         recipesToDisplay.map((recipe) => (
//           <RecipeCard
//             key={recipe._id ? recipe._id.$oid || recipe._id : Math.random()}
//             recipeData={recipe}
//             onRecipeDeleted={handleRecipeDeleted}
//           />
//         ))
//       )}
//     </div>
//   );
// }

// RecipeList.propTypes = {
//   recipes: PropTypes.array,
//   onRecipeDeleted: PropTypes.func,
// };

// export default RecipeList;

import { useState, useEffect } from "react";
import RecipeCard from "./RecipeCard.jsx";
import PropTypes from "prop-types";

function RecipeList({ recipes: propRecipes, onRecipeDeleted }) {
  const [localRecipes, setLocalRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("Fetching recipes from API...");
      const response = await fetch("/api/recipes");

      if (!response.ok) {
        throw new Error(
          `Server returned ${response.status}: ${response.statusText}`,
        );
      }

      const data = await response.json();

      // Validate the data is an array before setting state
      if (!Array.isArray(data)) {
        console.error("API returned non-array data:", data);
        throw new Error("Invalid data format: expected an array of recipes");
      }

      console.log(`Successfully fetched ${data.length} recipes`);
      setLocalRecipes(data);
    } catch (error) {
      console.error("Error fetching recipes:", error);
      setError(error.message || "Failed to fetch recipes");
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
        currentRecipes.filter((recipe) => recipe._id !== recipeId),
      );
    }
  };

  // Use the provided recipes or fall back to locally fetched ones
  const recipesToDisplay = propRecipes || localRecipes;

  if (loading) return <p>Loading recipes...</p>;

  if (error) {
    return (
      <div className="recipe-list-error">
        <h2>Error Loading Recipes</h2>
        <p>{error}</p>
        <button
          onClick={fetchRecipes}
          style={{
            padding: "8px 16px",
            background: "#f0f0f0",
            border: "1px solid #ccc",
            borderRadius: "4px",
            cursor: "pointer",
            marginTop: "10px",
          }}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="recipe-list">
      <h2>Recipe List</h2>
      {!Array.isArray(recipesToDisplay) ? (
        <p>Error: Invalid recipe data received</p>
      ) : recipesToDisplay.length === 0 ? (
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
