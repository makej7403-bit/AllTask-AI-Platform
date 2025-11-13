// ======================
// FullTask Global AI Platform Backend
// Created by: Akin S. Sokpah from Nimba County, Liberia
// ======================

const express = require("express");
const cors = require("cors");
const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ======================
// SERVE FRONTEND
// ======================

// Serve static frontend files
app.use(express.static(path.join(__dirname, "../frontend/public")));

// Main page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/public/index.html"));
});

// Health route (Render check)
app.get("/health", (req, res) => {
  res.json({ status: "ok", creator: "Akin S. Sokpah from Nimba County, Liberia" });
});

// ======================
// AI Chat Endpoint (example)
// ======================
app.post("/api/chat", async (req, res) => {
  try {
    const userMessage = req.body.message || "";

    // Example AI response
    const response = {
      reply: `Hello, I am FullTask Global AI created by Akin S. Sokpah from Nimba County, Liberia. You said: ${userMessage}`
    };

    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "AI engine error" });
  }
});

// ======================
// 400 + 1000 + 1500 Feature Modules Loader
// ======================

const modulesDir = path.join(__dirname, "modules");

// Auto-create module directory if missing
fs.ensureDirSync(modulesDir);

// Auto-load all feature modules
app.get("/api/features", async (req, res) => {
  try {
    const files = await fs.readdir(modulesDir);
    res.json({
      count: files.length,
      creator: "Akin S. Sokpah from Nimba County, Liberia",
      modules: files
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to load modules" });
  }
});

// ======================
// START SERVER
// ======================

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log("FullTask Global AI Platform online.");
});
