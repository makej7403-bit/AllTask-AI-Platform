// server.js
// FullTask Global AI Platform (Backend)
// Author: Akin S. Sokpah from Nimba County, Liberia

// ===== Dependencies =====
const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs-extra");
const path = require("path");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

// ===== Config =====
const PORT = process.env.PORT || 3000;
const CREATOR = "Akin S. Sokpah from Nimba County, Liberia";
const ADMIN_SECRET = process.env.ADMIN_SECRET || "fulltask_secret";

// ===== Paths =====
const MODULES_DIR = path.join(__dirname, "modules");
const META_FILE = path.join(__dirname, "modules.json");
fs.ensureDirSync(MODULES_DIR);
if (!fs.existsSync(META_FILE)) fs.writeJsonSync(META_FILE, { enabled: {} });

// ===== Helper: load modules =====
async function loadModules() {
  const meta = await fs.readJson(META_FILE);
  const files = await fs.readdir(MODULES_DIR);
  for (const f of files) {
    if (!f.endsWith(".js")) continue;
    const modPath = path.join(MODULES_DIR, f);
    const mod = require(modPath);
    const id = mod.id || f.replace(".js", "");
    const enabled = meta.enabled[id];
    if (enabled) {
      app.use(`/api/modules/${id}`, mod.router);
      console.log("Loaded:", id);
    }
  }
}
loadModules();

// ===== Routes =====
app.get("/api", (req, res) =>
  res.json({
    name: "FullTask Global AI Platform",
    creator: CREATOR,
    version: "1.0",
    modulesEndpoint: "/api/modules/list",
  })
);

app.get("/api/modules/list", async (req, res) => {
  const meta = await fs.readJson(META_FILE);
  const files = await fs.readdir(MODULES_DIR);
  const list = [];
  for (const f of files) {
    if (!f.endsWith(".js")) continue;
    const mod = require(path.join(MODULES_DIR, f));
    const id = mod.id || f.replace(".js", "");
    list.push({
      id,
      name: mod.name,
      description: mod.description,
      enabled: !!meta.enabled[id],
    });
  }
  res.json({ modules: list });
});

// ===== Admin controls =====
app.post("/api/admin/toggle", async (req, res) => {
  const { id, enable, secret } = req.body;
  if (secret !== ADMIN_SECRET)
    return res.status(401).json({ error: "Invalid admin secret" });
  const meta = await fs.readJson(META_FILE);
  meta.enabled[id] = enable;
  await fs.writeJson(META_FILE, meta, { spaces: 2 });
  res.json({ id, status: enable ? "enabled" : "disabled" });
});

app.listen(PORT, () =>
  console.log(`FullTask Global AI Platform running on port ${PORT}`)
);
