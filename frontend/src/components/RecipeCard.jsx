// import { useState } from "react";
// import "./css/RecipeCard.css";
// import PropTypes from "prop-types";

// function RecipeCard({ recipeData, onRecipeDeleted }) {
//   const [isDeleting, setIsDeleting] = useState(false);
//   const [isAddToShoppingList, setIsAddToShoppingList] = useState(false);

//   const handleDeleteClick = async () => {
//     try {
//       setIsDeleting(true);

//       const response = await fetch(`/api/recipes/${recipeData._id}`, {
//         method: "DELETE",
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });

//       if (!response.ok) {
//         throw new Error("Failed to delete recipe");
//       }

//       if (onRecipeDeleted) {
//         onRecipeDeleted(recipeData._id);
//       }
//     } catch (error) {
//       console.error("Error deleting recipe:", error);
//     } finally {
//       setIsDeleting(false);
//     }
//   };

//   const handleAddToShoppingList = async () => {
//     try {
//       setIsAddToShoppingList(true);
//       const mealPlanResponse = await fetch("/api/mealplan/current");
//       if (!mealPlanResponse.ok) {
//         throw new Error("fail to fecth current meal plan");
//       }
//       const mealPlan = await mealPlanResponse.json();

//       const addResponse = await fetch(
//         `/api/mealplan/${mealPlan._id}/recipe/${recipeData._id}`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );
//       if (!addResponse.ok) {
//         throw new Error("Failed to add recipe to meal plan");
//       }
//       alert(`${recipeData.name} added to shopping list successfully!`);
//     } catch (error) {
//       console.error("Error adding recipe to shopping list:", error);
//       alert("Failed to add recipe to shopping list. Please try again.");
//     } finally {
//       setIsAddToShoppingList(false); // Reset the loading state
//     }
//   };

//   return (
//     <div className="recipe-card">
//       <div className="recipe-card-header">
//         <h3>{recipeData.name}</h3>
//         <div className="recipe-card-content">
//           <div className="recipe-image">
//             {recipeData.imageUrl ? (
//               <img src={recipeData.imageUrl} alt={recipeData.name} />
//             ) : (
//               <div className="placeholder-image">No image</div>
//             )}
//           </div>
//           <div className="recipe-details">
//             <p>{recipeData.description}</p>
//             <div className="recipe-meta">
//               <span>{recipeData.cookTime} mins</span>
//             </div>
//           </div>
//           <div className="recipe-ingredients">
//             <h4>Ingredients:</h4>
//             <ul>
//               {Array.isArray(recipeData.ingredients) &&
//               recipeData.ingredients.length > 0 ? (
//                 recipeData.ingredients.map((ingredient, index) => (
//                   <li key={index}>
//                     {ingredient.name} {ingredient.amount} {ingredient.unit}
//                   </li>
//                 ))
//               ) : (
//                 <li>No ingredients listed</li>
//               )}
//             </ul>
//             <div className="recipe-action-buttons">
//               <button
//                 className="add-to-shopping-list-btn"
//                 onClick={handleAddToShoppingList}
//                 disabled={isAddToShoppingList}
//               >
//                 {isAddToShoppingList ? "Adding..." : "Add To Shopping List"}
//               </button>
//               <button
//                 className="delete-recipe-btn"
//                 onClick={handleDeleteClick}
//                 disabled={isDeleting}
//               >
//                 {isDeleting ? "Deleting..." : "Delete Recipe"}
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// RecipeCard.propTypes = {
//   recipeData: PropTypes.shape({
//     _id: PropTypes.oneOfType([
//       PropTypes.string,
//       PropTypes.shape({
//         $oid: PropTypes.string,
//       }),
//     ]).isRequired,
//     name: PropTypes.string.isRequired,
//     imageUrl: PropTypes.string,
//     description: PropTypes.string,
//     cookTime: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
//       .isRequired,
//     ingredients: PropTypes.arrayOf(
//       PropTypes.shape({
//         name: PropTypes.string.isRequired,
//         amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
//         unit: PropTypes.string,
//       })
//     ), // Made ingredients optional
//   }).isRequired,
//   onRecipeDeleted: PropTypes.func,
// };

// export default RecipeCard;
// This is a specific update for RecipeCard.jsx to fix the scrollable region accessibility issue
// Replace the original ingredients section with this code

import { useState, useRef } from "react";
import "./css/RecipeCard.css";
import PropTypes from "prop-types";

function RecipeCard({ recipeData, onRecipeDeleted }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isAddToShoppingList, setIsAddToShoppingList] = useState(false);
  const ingredientsListRef = useRef(null);

  const handleDeleteClick = async () => {
    try {
      setIsDeleting(true);

      const response = await fetch(`/api/recipes/${recipeData._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete recipe");
      }

      if (onRecipeDeleted) {
        onRecipeDeleted(recipeData._id);
      }
    } catch (error) {
      console.error("Error deleting recipe:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleAddToShoppingList = async () => {
    try {
      setIsAddToShoppingList(true);
      const mealPlanResponse = await fetch("/api/mealplan/current");
      if (!mealPlanResponse.ok) {
        throw new Error("fail to fecth current meal plan");
      }
      const mealPlan = await mealPlanResponse.json();

      const addResponse = await fetch(
        `/api/mealplan/${mealPlan._id}/recipe/${recipeData._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      if (!addResponse.ok) {
        throw new Error("Failed to add recipe to meal plan");
      }
      alert(`${recipeData.name} added to shopping list successfully!`);
    } catch (error) {
      console.error("Error adding recipe to shopping list:", error);
      alert("Failed to add recipe to shopping list. Please try again.");
    } finally {
      setIsAddToShoppingList(false); // Reset the loading state
    }
  };

  // Handle keyboard navigation for the ingredients list
  const handleKeyDown = (e) => {
    if (!ingredientsListRef.current) return;

    const scrollAmount = 40; // Adjust as needed for your design

    if (e.key === "ArrowDown") {
      e.preventDefault();
      ingredientsListRef.current.scrollTop += scrollAmount;
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      ingredientsListRef.current.scrollTop -= scrollAmount;
    } else if (e.key === "Home") {
      e.preventDefault();
      ingredientsListRef.current.scrollTop = 0;
    } else if (e.key === "End") {
      e.preventDefault();
      ingredientsListRef.current.scrollTop =
        ingredientsListRef.current.scrollHeight;
    }
  };

  return (
    <div className="recipe-card">
      <div className="recipe-card-header">
        <h3>{recipeData.name}</h3>
        <div className="recipe-card-content">
          <div className="recipe-image">
            {recipeData.imageUrl ? (
              <img src={recipeData.imageUrl} alt={`${recipeData.name} dish`} />
            ) : (
              <div className="placeholder-image">No image</div>
            )}
          </div>
          <div className="recipe-details">
            <p>{recipeData.description}</p>
            <div className="recipe-meta">
              <span>{recipeData.cookTime} mins</span>
            </div>
          </div>
          <div className="recipe-ingredients">
            <h4 id={`ingredients-heading-${recipeData._id}`}>Ingredients:</h4>
            <ul
              ref={ingredientsListRef}
              tabIndex="0"
              className="ingredients-list"
              aria-labelledby={`ingredients-heading-${recipeData._id}`}
              onKeyDown={handleKeyDown}
              role="list"
            >
              {Array.isArray(recipeData.ingredients) &&
              recipeData.ingredients.length > 0 ? (
                recipeData.ingredients.map((ingredient, index) => (
                  <li key={index} role="listitem">
                    {ingredient.name} {ingredient.amount} {ingredient.unit}
                  </li>
                ))
              ) : (
                <li role="listitem">No ingredients listed</li>
              )}
            </ul>
            <div className="recipe-action-buttons">
              <button
                className="add-to-shopping-list-btn"
                onClick={handleAddToShoppingList}
                disabled={isAddToShoppingList}
                aria-busy={isAddToShoppingList}
              >
                {isAddToShoppingList ? "Adding..." : "Add To Shopping List"}
              </button>
              <button
                className="delete-recipe-btn"
                onClick={handleDeleteClick}
                disabled={isDeleting}
                aria-busy={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete Recipe"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

RecipeCard.propTypes = {
  recipeData: PropTypes.shape({
    _id: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        $oid: PropTypes.string,
      }),
    ]).isRequired,
    name: PropTypes.string.isRequired,
    imageUrl: PropTypes.string,
    description: PropTypes.string,
    cookTime: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired,
    ingredients: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        unit: PropTypes.string,
      }),
    ),
  }).isRequired,
  onRecipeDeleted: PropTypes.func,
};

export default RecipeCard;
