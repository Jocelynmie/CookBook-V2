import express from "express";
import dotenv from "dotenv";
import { connectToDatabase } from "./db/connect.js";
import recipeRouter from "./routes/recipeRouter.js";
import mealplanRouter from "./routes/mealplanRouter.js";
import suggestionRouter from "./routes/suggestionRouter.js";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

dotenv.config();

const app = express();
app.use(express.json());

const isVercel = process.env.VERCEL === "1" || process.env.VERCEL === "true";

// API
app.use("/api", recipeRouter);
app.use("/api", mealplanRouter);
app.use("/api", suggestionRouter);

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    environment: isVercel ? "Vercel" : "Local",
    timestamp: new Date().toISOString(),
  });
});

// es module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
console.log("__dirname:", __dirname);

let staticPath = null;

if (isVercel) {
  staticPath = path.join(process.cwd(), "frontend/dist");
} else {
  staticPath = path.join(__dirname, "frontend/dist");
}

try {
  if (fs.existsSync(staticPath)) {
    console.log(`vaild static path: ${staticPath}`);
    app.use(express.static(staticPath));
  } else {
    console.log(`can not find static path: ${staticPath}`);

    const fallbackPaths = [
      path.join(process.cwd(), "dist"),
      path.join(__dirname, "dist"),
      path.join(process.cwd(), "../frontend/dist"),
    ];

    for (const testPath of fallbackPaths) {
      try {
        console.log(`check static path: ${testPath}`);
        if (fs.existsSync(testPath)) {
          staticPath = testPath;
          console.log(`find static path: ${staticPath}`);
          app.use(express.static(staticPath));
          break;
        }
      } catch (error) {
        console.log(`error ${testPath}: ${error.message}`);
      }
    }
  }
} catch (error) {
  console.log(`error: ${error.message}`);
}

//???
app.get("*", (req, res) => {
  if (!req.path.startsWith("/api")) {
    if (staticPath) {
      const indexPath = path.join(staticPath, "index.html");
      if (fs.existsSync(indexPath)) {
        console.log(`index.html: ${indexPath}`);
        return res.sendFile(indexPath);
      }
    }

    res.status(200).send(`
      <html>
        <head><title>CookBook</title></head>
        <body>
          <p> ${req.path}</p>
        </body>
      </html>
    `);
  }
});

if (isVercel) {
  connectToDatabase()
    .then(() => console.log("db was connected"))
    .catch((err) => console.error("error:", err));
}

export default app;
