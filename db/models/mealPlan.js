import { ObjectId } from "mongodb";
import { collections } from "../connect.js";

export async function getMealPlanById(id) {
  return await collections.mealPlans.findOne({ _id: new ObjectId(id) });
}

export async function getCurrentMealPlan() {
  return await collections.mealPlans.findOne({}, { sort: { createdAt: -1 } });
}

export async function createMealPlan(name = "THIS WEEK RECIPE") {
  const newPlan = {
    name,
    recipeIds: [],
    createdAt: new Date(),
  };
  return await collections.mealPlans.insertOne(newPlan);
}

export async function addRecipeToMealPlan(mealPlanId, recipeId) {
  return await collections.mealPlans.updateOne(
    { _id: new ObjectId(mealPlanId) },
    {
      $addToSet: { recipeIds: new ObjectId(recipeId) },
      $set: { updatedAt: new Date() },
    },
  );
}

export async function deleteRecipeToMealPlan(mealPlanId, recipeId) {
  return await collections.mealPlans.updateOne(
    { _id: new ObjectId(mealPlanId) },
    {
      $pull: { recipeIds: new ObjectId(recipeId) },
      $set: { updatedAt: new Date() },
    },
  );
}
export async function getAllRecipesInMealPlan(mealPlanId) {
  const mealPlan = await getMealPlanById(mealPlanId);
  if (!mealPlan || !mealPlan.recipeIds) {
    return [];
  }
  return await collections.recipes
    .find({
      _id: { $in: mealPlan.recipeIds.map((id) => new ObjectId(id)) },
    })
    .toArray();
}

export async function generateShoppingList(mealPlanId) {
  const recipes = await getAllRecipesInMealPlan(mealPlanId);
  if (!recipes || recipes.length === 0) {
    return [];
  }

  const ingredientMap = {};

  recipes.forEach((recipe) => {
    if (!recipe.ingredients) return;

    recipe.ingredients.forEach((ingredient) => {
      const key = `${ingredient.name}_${ingredient.unit}`;

      if (!ingredientMap[key]) {
        ingredientMap[key] = {
          name: ingredient.name,
          totalAmount: 0,
          unit: ingredient.unit,
          checked: false,
        };
      }

      ingredientMap[key].totalAmount += ingredient.amount;
    });
  });

  return Object.values(ingredientMap);
}

export async function clearMealPlan(mealPlanId) {
  return await collections.mealPlans.updateOne(
    { _id: new ObjectId(mealPlanId) },
    {
      $set: {
        recipeIds: [],
        updatedAt: new Date(),
      },
    },
  );
}

export async function clearShoppingListOnly(mealPlanId) {
  return await collections.mealPlans.updateOne(
    { _id: new ObjectId(mealPlanId) },
    {
      $set: {
        shoppingList: [],
        updatedAt: new Date(),
      },
    },
  );
}
