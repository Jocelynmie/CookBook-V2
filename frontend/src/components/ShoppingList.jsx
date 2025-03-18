import { useState, useEffect } from "react";
import "./ShoppingList.css";

const ShoppingList = () => {
  const [recipes, setRecipes] = useState([]);
  const [shoppingList, setShoppingList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMealPlanData();
  }, []);

  const fetchMealPlanData = async () => {
    try {
      setLoading(true);

      // 1. get cur meal plan
      const response = await fetch("/api/mealplan/current");
      if (!response.ok) {
        throw new Error("Failed to fetch meal plan");
      }
      const mealPlan = await response.json();

      // 2. get recipe
      const recipesResponse = await fetch(
        `/api/mealplan/${mealPlan._id}/recipes`
      );
      if (!recipesResponse.ok) {
        throw new Error("Failed to fetch recipes");
      }
      const recipesData = await recipesResponse.json();
      setRecipes(recipesData);

      // 3. get shopping list
      const shoppingListResponse = await fetch(
        `/api/mealplan/${mealPlan._id}/shopping-list`
      );
      if (!shoppingListResponse.ok) {
        throw new Error("Failed to fetch shopping list");
      }
      const shoppingListData = await shoppingListResponse.json();
      setShoppingList(shoppingListData);

      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading..</div>;
  }

  return (
    <div className="shopping-list-container">
      <h1 className="page-title">This Week Shopping List</h1>

      <div className="content-wrapper">
        <div className="recipe-section">
          <div className="section-card">
            <h2 className="section-title">This Week Recipes</h2>
            <hr className="divider" />

            {recipes.length === 0 ? (
              <div className="empty-message"></div>
            ) : (
              <ul className="recipe-list">
                {recipes.map((recipe) => (
                  <li key={recipe._id} className="recipe-item">
                    <div className="recipe-name">{recipe.name}</div>
                    <div className="recipe-description">
                      {recipe.description}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="shopping-section">
          <div className="section-card">
            <h2 className="section-title">Shopping List</h2>
            <hr className="divider" />

            {shoppingList.length === 0 ? (
              <div className="empty-message">Shopping List is Empty</div>
            ) : (
              <>
                <ul className="shopping-list">
                  {shoppingList.map((item, index) => (
                    <li key={index} className="shopping-item">
                      {item.name} - {item.totalAmount} {item.unit}
                    </li>
                  ))}
                </ul>

                <div className="total-count">
                  Total: {shoppingList.length} Type Ingredients
                </div>
              </>
            )}

            <button className="refresh-btn" onClick={fetchMealPlanData}>
              Refresh
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShoppingList;
