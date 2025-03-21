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
//     } catch {
//       console.error("Error adding recipe to shopping list:");
//       alert("Failed to add recipe to shopping list. Please try again.");
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
//               {recipeData.ingredients && recipeData.ingredients.length > 0 ? (
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
//                 Add To Shopping List
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
import { useState } from "react";
import "./css/RecipeCard.css";
import PropTypes from "prop-types";

function RecipeCard({ recipeData, onRecipeDeleted }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isAddToShoppingList, setIsAddToShoppingList] = useState(false);

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
        }
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

  return (
    <div className="recipe-card">
      <div className="recipe-card-header">
        <h3>{recipeData.name}</h3>
        <div className="recipe-card-content">
          <div className="recipe-image">
            {recipeData.imageUrl ? (
              <img src={recipeData.imageUrl} alt={recipeData.name} />
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
            <h4>Ingredients:</h4>
            <ul>
              {Array.isArray(recipeData.ingredients) &&
              recipeData.ingredients.length > 0 ? (
                recipeData.ingredients.map((ingredient, index) => (
                  <li key={index}>
                    {ingredient.name} {ingredient.amount} {ingredient.unit}
                  </li>
                ))
              ) : (
                <li>No ingredients listed</li>
              )}
            </ul>
            <div className="recipe-action-buttons">
              <button
                className="add-to-shopping-list-btn"
                onClick={handleAddToShoppingList}
                disabled={isAddToShoppingList}
              >
                {isAddToShoppingList ? "Adding..." : "Add To Shopping List"}
              </button>
              <button
                className="delete-recipe-btn"
                onClick={handleDeleteClick}
                disabled={isDeleting}
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
      })
    ), // Made ingredients optional
  }).isRequired,
  onRecipeDeleted: PropTypes.func,
};

export default RecipeCard;
