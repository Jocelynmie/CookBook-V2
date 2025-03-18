import express from "express";
import { getAllSuggestions } from "../db/models/suggestions.js";
import { createSuggestion } from "../db/models/suggestions.js";
const router = express.Router();

router.get("/suggestions", async (req, res) => {
  try {
    const suggestions = await getAllSuggestions();
    res.json(suggestions);
  } catch (error) {
    // console.log(error)
    res.status(500).json({ message: error.message });
  }
});

router.post("/suggestions", async (req, res) => {
  try {
    const { name, content } = req.body;
    const result = await createSuggestion(name, content);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
export default router;
