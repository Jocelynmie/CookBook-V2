import { useState, useCallback, useEffect } from "react";
import AddRecipeForm from "../components/AddRecipeForm";
import RecipeList from "../components/RecipeList";

function RecipePage() {
  const [recipes, setRecipes] = useState([]);
  // const [loading, setLoading] = useState(true);

  // use call back to avoid creating fetchRecipe every time when component render
  const fetchRecipes = useCallback(async () => {
    try {
      // setLoading(true);
      const response = await fetch("/api/recipes");
      if (!response.ok) {
        throw new Error("Failed to fetch recipes");
      }
      const data = await response.json();
      setRecipes(data); //reset recipes
    } catch (error) {
      console.error("Error fetching recipes:", error);
    } finally {
      // setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  const handleRecipeChange = useCallback(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  return (
    <div>
      <AddRecipeForm onRecipeAdded={handleRecipeChange} />
      <RecipeList recipes={recipes} onRecipeDeleted={handleRecipeChange} />
    </div>
  );
}
export default RecipePage;
