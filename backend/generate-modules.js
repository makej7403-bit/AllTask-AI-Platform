// generate_modules.js
// Automatically creates 2900 placeholder modules
const fs = require("fs-extra");
const path = require("path");

const MODULES_DIR = path.join(__dirname, "modules");
fs.ensureDirSync(MODULES_DIR);

function pad(n, w = 4) {
  return String(n).padStart(w, "0");
}

(async () => {
  for (let i = 1; i <= 2900; i++) {
    const id = `feat${pad(i)}`;
    const file = path.join(MODULES_DIR, `${id}.js`);
    if (fs.existsSync(file)) continue;
    const code = `
const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    id: "${id}",
    name: "Feature ${i}",
    description: "Auto-generated feature placeholder ${i}",
    creator: "Akin S. Sokpah from Nimba County, Liberia",
  });
});

module.exports = { id: "${id}", name: "Feature ${i}", description: "Placeholder feature", router };
`;
    await fs.writeFile(file, code.trim());
    if (i % 100 === 0) console.log("Generated", i);
  }
  console.log("✅ 2900 feature modules created");
})();
