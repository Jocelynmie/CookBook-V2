// import { ObjectId } from "mongodb";
import { collections } from "../connect.js";

export async function getAllSuggestions() {
  return await collections.suggestions
    .find({})
    .sort({ createdAt: -1 })
    .toArray();
}

export async function createSuggestion(name, content) {
  if (!content) {
    throw new Error("Content can not be empty");
  }

  const newSuggestion = {
    name,
    content,
    createdAt: new Date().toISOString(),
  };

  return await collections.suggestions.insertOne(newSuggestion);
}
