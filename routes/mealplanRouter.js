import express from "express";
import * as MealPlanModel from "../db/models/mealPlan.js";

const router = express.Router();

router.get("/mealplan/current", async (req, res) => {
  try {
    const mealPlan = await MealPlanModel.getCurrentMealPlan();
    if (!mealPlan) {
      const result = await MealPlanModel.createMealPlan();
      const newMealPlan = await MealPlanModel.getMealPlanById(
        result.insertedId
      );
      return res.json(newMealPlan);
    }
    res.json(mealPlan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/mealplan/:id/recipe/:recipeId", async (req, res) => {
  try {
    await MealPlanModel.addRecipeToMealPlan(req.params.id, req.params.recipeId);
    res.status(201).json({ message: "recipe added successful" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/mealplan/:id/recipe/:recipeId", async (req, res) => {
  try {
    await MealPlanModel.deleteRecipeToMealPlan(
      req.params.id,
      req.params.recipeId
    );
    res.json({ message: "recipe deleted successful" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/mealplan/:id/recipes", async (req, res) => {
  try {
    const recipes = await MealPlanModel.getAllRecipesInMealPlan(req.params.id);
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/mealplan/:id/shopping-list", async (req, res) => {
  try {
    const shoppingList = await MealPlanModel.generateShoppingList(
      req.params.id
    );
    res.json(shoppingList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
