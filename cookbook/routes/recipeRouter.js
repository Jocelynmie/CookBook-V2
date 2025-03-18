import express from "express";
import * as RecipeModel from "../db/models/recipes.js";

const router = express.Router();

router.get("/recipes", async (req, res) => {
  try {
    const recipes = await RecipeModel.getAllRecipes();
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//get one recipe by id (get id from req.params)
router.get("/recipes/:id", async (req, res) => {
  try {
    const recipe = await RecipeModel.getRecipeById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: "recipe not exist" });
    }

    res.json(recipe);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/recipes", async (req, res) => {
  try {
    const result = await RecipeModel.addRecipe(req.body);
    res
      .status(201)
      .json({ message: "successfully add one recipe", id: result.insertedId });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/recipes/:id", async (req, res) => {
  try {
    await RecipeModel.updateRecipe(req.params.id, req.body);
    res.json({ message: "successfully update" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/recipes/:id", async (req, res) => {
  try {
    await RecipeModel.deleteRecipe(req.params.id);
    res.json({ message: "successfully delete" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
