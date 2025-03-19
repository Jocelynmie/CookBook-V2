import { useState } from "react";
import "./css/AddRecipeForm.css";
import PropTypes from "prop-types";
import IngredientInput from "./IngredientInput.jsx";

function AddRecipeForm({ onRecipeAdded }) {
  const [recipeData, setRecipeData] = useState({
    name: "",
    description: "",
    cookTime: 30,
    ingredients: [{ name: "", amount: "", unit: "" }],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });
  const [imageFile, setImageFile] = useState(null);

  const handleIngredientChange = (index, e) => {
    const { name, value } = e.target;
    const updatedIngredients = [...recipeData.ingredients];
    updatedIngredients[index] = {
      ...updatedIngredients[index],
      [name]: value,
    };
    setRecipeData({
      ...recipeData,
      ingredients: updatedIngredients,
    });
  };

  const addIngredient = () => {
    setRecipeData({
      ...recipeData,
      ingredients: [
        ...recipeData.ingredients,
        { name: "", amount: "", unit: "" },
      ],
    });
  };

  const removeIngredient = (index) => {
    if (recipeData.ingredients.length <= 1) {
      return;
    }

    const updatedIngredients = recipeData.ingredients.filter(
      (_, i) => i !== index
    );

    setRecipeData({
      ...recipeData,
      ingredients: updatedIngredients,
    });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleCancel = () => {
    //reset
    setRecipeData({
      name: "",
      description: "",
      cookTime: 30,
      ingredients: [{ name: "", amount: "", unit: "" }],
    });
    setImageFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const recipeToSubmit = {
        ...recipeData,
        cookTime: parseInt(recipeData.cookTime, 10) || 0,
      };

      if (imageFile) {
        const formData = new FormData();
        formData.append("image", imageFile);

        const imageResponse = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!imageResponse.ok) {
          throw new Error("Failed to upload image");
        }

        const imageResult = await imageResponse.json();
        recipeToSubmit.imageUrl = imageResult.imageUrl;
      }

      const response = await fetch("/api/recipes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(recipeToSubmit),
      });

      if (!response.ok) {
        throw new Error("Failed to add recipe");
      }

      const result = await response.json();
      console.log("Recipe added successfully:", result);

      setRecipeData({
        name: "",
        description: "",
        cookTime: 30,
        ingredients: [{ name: "", amount: "", unit: "" }],
      });
      setImageFile(null);

      setNotification({
        show: true,
        message: "Recipe added successfully!",
        type: "success",
      });

      //!!! tell parents component -> recipe Page
      if (onRecipeAdded) {
        onRecipeAdded();
      }

      setTimeout(() => {
        setNotification({ show: false, message: "", type: "" });
      }, 3000);
    } catch (error) {
      console.error("Error submitting recipe:", error);

      setNotification({
        show: true,
        message: `Failed to add recipe: ${error.message}`,
        type: "error",
      });

      setTimeout(() => {
        setNotification({ show: false, message: "", type: "" });
      }, 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="add-recipe-form-container">
      {notification.show && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}

      <div className="add-recipe-form-header">
        <h3>Add New Recipe</h3>
      </div>

      <form className="recipe-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name:*</label>
          <input
            type="text"
            id="name"
            name="name"
            value={recipeData.name}
            onChange={(e) =>
              setRecipeData({ ...recipeData, name: e.target.value })
            }
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            rows="3"
            value={recipeData.description}
            onChange={(e) =>
              setRecipeData({ ...recipeData, description: e.target.value })
            }
          />
        </div>

        <div className="form-group">
          <label htmlFor="cookTime">CookTime (mins)*</label>
          <input
            type="number"
            id="cookTime"
            name="cookTime"
            min="1"
            value={recipeData.cookTime}
            onChange={(e) =>
              setRecipeData({ ...recipeData, cookTime: e.target.value })
            }
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="image">Recipe Image</label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
          />
          {imageFile && (
            <div className="image-preview">
              <p>Selected image: {imageFile.name}</p>
            </div>
          )}
        </div>

        <div className="form-group ingredients-section">
          <label>Ingredients*</label>

          {recipeData.ingredients.map((ingredient, index) => (
            <div key={index} className="ingredient-row">
              <IngredientInput
                ingredient={ingredient}
                index={index}
                onChange={handleIngredientChange}
              />
              {recipeData.ingredients.length > 1 && (
                <button
                  type="button"
                  className="remove-ingredient-btn"
                  onClick={() => removeIngredient(index)}
                >
                  -
                </button>
              )}
            </div>
          ))}

          <button
            type="button"
            className="add-ingredient-btn"
            onClick={addIngredient}
          >
            + Add Ingredient
          </button>
        </div>

        <div className="form-actions">
          <button type="button" className="cancel-btn" onClick={handleCancel}>
            Cancel
          </button>
          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            {isSubmitting ? "Adding..." : "Add Recipe"}
          </button>
        </div>
      </form>
    </div>
  );
}

AddRecipeForm.propTypes = {
  onRecipeAdded: PropTypes.func,
};

export default AddRecipeForm;
