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
console.log("应用启动");
console.log(`运行环境: ${isVercel ? "Vercel" : "Local"}`);
console.log(`当前工作目录: ${process.cwd()}`);

// API 路由
app.use("/api", recipeRouter);
app.use("/api", mealplanRouter);
app.use("/api", suggestionRouter);

// 健康检查端点 - 这个端点可以用来验证API是否正常工作
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    environment: isVercel ? "Vercel" : "Local",
    timestamp: new Date().toISOString(),
  });
});

// 添加一个根路径响应，确保基本路由工作
app.get("/", (req, res) => {
  res.send(`
    <html>
      <head><title>CookBook API</title></head>
      <body>
        <h1>CookBook API 服务器运行中</h1>
        <p>当前时间: ${new Date().toISOString()}</p>
        <p>环境: ${isVercel ? "Vercel" : "Local"}</p>
        <p><a href="/api/health">健康检查端点</a></p>
      </body>
    </html>
  `);
});

// 解决 __dirname 在 ES 模块中的问题
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
console.log("__dirname:", __dirname);

// 确定静态文件路径 - 增加更多可能的路径
const possiblePaths = [
  // 针对嵌套项目结构的路径
  path.join(__dirname, "frontend/dist"),
  path.join(process.cwd(), "backend/frontend/dist"),
  path.join(process.cwd(), "frontend/dist"),

  // 针对Vercel部署的路径
  path.join(process.cwd(), "../frontend/dist"),
  path.join(process.cwd(), "../dist"),
  path.join(process.cwd(), "dist"),

  // 额外的可能路径
  path.join(__dirname, "../frontend/dist"),
  path.join(__dirname, "../dist"),
  path.join(__dirname, "dist"),
];

console.log("静态文件搜索路径:", possiblePaths);

let staticPath = null;
for (const testPath of possiblePaths) {
  try {
    console.log(`检查静态文件路径: ${testPath}`);
    if (fs.existsSync(testPath)) {
      staticPath = testPath;
      console.log(`找到有效的静态文件路径: ${staticPath}`);
      break;
    }
  } catch (error) {
    console.log(`检查路径出错 ${testPath}: ${error.message}`);
  }
}

// 使用找到的静态文件路径
if (staticPath) {
  console.log(`使用静态文件路径: ${staticPath}`);
  app.use(express.static(staticPath));

  const indexPath = path.join(staticPath, "index.html");
  if (fs.existsSync(indexPath)) {
    console.log(`找到index.html: ${indexPath}`);

    // 所有非API路由都返回index.html (SPA前端路由)
    app.get("*", (req, res) => {
      if (!req.path.startsWith("/api")) {
        res.sendFile(indexPath);
      }
    });
  } else {
    console.log(`警告: 找不到index.html: ${indexPath}`);
  }
} else {
  console.log("警告: 找不到任何有效的静态文件路径");

  // 添加404处理，避免返回Vercel默认的404
  app.get("*", (req, res) => {
    if (!req.path.startsWith("/api")) {
      res.status(200).send(`
        <html>
          <head><title>CookBook</title></head>
          <body>
            <h1>CookBook API 服务器已启动</h1>
            <p>前端文件未找到。请确保正确构建前端应用。</p>
            <p>请求路径: ${req.path}</p>
          </body>
        </html>
      `);
    }
  });
}

// 在Vercel环境中自动连接数据库
if (isVercel) {
  // 尝试连接数据库但不阻塞应用启动
  connectToDatabase()
    .then(() => console.log("数据库连接成功"))
    .catch((err) => console.error("数据库连接失败:", err));
}

export default app;
