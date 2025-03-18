import { collections } from "../connect.js";
import { ObjectId } from "mongodb";
// import conenctToDatabase from "../connect.js";

export async function getAllRecipes() {
  return await collections.recipes.find({}).toArray();
}

//get recipe by id
export async function getRecipeById(id) {
  // string to objid
  return await collections.recipes.findOne({ _id: new ObjectId(id) });
}

// add new recipe
export async function addRecipe(recipe) {
  if (!recipe.name || typeof recipe.name !== "string") {
    throw new Error("name of recipe is invalid");
  }

  let normalizedIngredients = [];
  if (Array.isArray(recipe.ingredients)) {
    normalizedIngredients = recipe.ingredients
      .map((ingredient) => {
        if (typeof ingredient === "object" && ingredient !== null) {
          return {
            name: ingredient.name,
            amount: parseFloat(ingredient.amount) || 0,
            unit: ingredient.unit || "each",
          };
        }
        return null;
      })
      .filter(Boolean);
  }

  const newRecipe = {
    name: recipe.name,
    description: recipe.description || "",
    cookTime: recipe.cookTime || 0,
    imageUrl: recipe.imageUrl || "",
    ingredients: normalizedIngredients,
    createdAt: new Date(),
  };

  return await collections.recipes.insertOne(newRecipe);
}

//update recipe
// export async function updateRecipe(id, recipe) {
//   return await collections.recipes.updateOne(
//     {
//       _id: new ObjectId(id),
//     },
//     {
//       $set: {
//         ...recipe,
//         updateAt: new Date(),
//       },
//     }
//   );
// }

// export async function deleteRecipe(id) {
//   const objectId = new ObjectId(id);
//   const recipe = await collections.recipes.findOne({ _id: objectId });
//   if (!recipe) {
//     throw new Error("Recipe not found");
//   }
//   return await collections.recipes.deleteOne({ _id: objectId });
// }
// Add transaction support for critical operations

// export async function deleteRecipe(id) {
//   const objectId = new ObjectId(id);
//   const session = cachedClient.startSession();

//   try {
//     session.startTransaction();

//     // First check if recipe exists
//     const recipe = await collections.recipes.findOne(
//       { _id: objectId },
//       { session }
//     );
//     if (!recipe) {
//       throw new Error("Recipe not found");
//     }

//     // Remove recipe from any meal plans that reference it
//     await collections.mealPlans.updateMany(
//       { recipeIds: objectId },
//       { $pull: { recipeIds: objectId } },
//       { session }
//     );

//     // Delete the recipe
//     await collections.recipes.deleteOne({ _id: objectId }, { session });

//     await session.commitTransaction();
//     return true;
//   } catch (error) {
//     await session.abortTransaction();
//     throw error;
//   } finally {
//     session.endSession();
//   }
// }

// 修改deleteRecipe函数，不使用事务
export async function deleteRecipe(id) {
  try {
    const objectId = new ObjectId(id);

    // 首先检查食谱是否存在
    const recipe = await collections.recipes.findOne({ _id: objectId });
    if (!recipe) {
      throw new Error("Recipe not found");
    }

    // 从任何引用它的餐食计划中移除食谱
    await collections.mealPlans.updateMany(
      { recipeIds: objectId },
      { $pull: { recipeIds: objectId } }
    );

    // 删除食谱
    return await collections.recipes.deleteOne({ _id: objectId });
  } catch (error) {
    console.error("Error deleting recipe:", error);
    throw error;
  }
}

export async function searchRecipesByName(name) {
  return await collections.recipes
    .find({
      name: { $regex: name, $options: "i" },
    })
    .toArray();
}
