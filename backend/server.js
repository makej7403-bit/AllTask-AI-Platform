// server.js
// FullTask Global AI Platform - Modular feature loader + admin toggles
// Run: npm install express body-parser dotenv fs-extra cors
// Start: node server.js

const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs-extra');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 3000;
const CREATOR_NAME = process.env.CREATOR_NAME || 'Akin S. Sokpah from Nimba County, Liberia';
const ADMIN_SECRET = process.env.ADMIN_SECRET || 'change_admin_secret';

// where modules live
const MODULES_DIR = path.join(__dirname, 'modules');
const MODULES_META = path.join(__dirname, 'modules.json');

// ensure directories/files
fs.ensureDirSync(MODULES_DIR);
if (!fs.existsSync(MODULES_META)) fs.writeJsonSync(MODULES_META, { enabled: {}, createdAt: new Date().toISOString() });

// helper: load enabled modules and mount their routers
async function loadModules() {
  const meta = await fs.readJson(MODULES_META);
  const files = await fs.readdir(MODULES_DIR);
  // Remove previous dynamic routers: we will mount under /api/modules/<id>
  // (Express doesn't unmount, so for simplicity we keep idempotent behavior and avoid re-mounting same routes multiple times on restart)
  for (const file of files) {
    if (!file.endsWith('.js')) continue;
    const modPath = path.join(MODULES_DIR, file);
    try {
      delete require.cache[require.resolve(modPath)];
      const mod = require(modPath);
      const id = mod.id || file.replace('.js','');
      const enabled = meta.enabled && meta.enabled[id];
      if (enabled) {
        if (mod.router) {
          app.use(`/api/modules/${id}`, mod.router);
          console.log(`Mounted module: ${id}`);
        } else {
          // fallback route
          app.get(`/api/modules/${id}`, (req,res) => {
            res.json({ id, name: mod.name||id, message: mod.description||'Module placeholder', creator: CREATOR_NAME});
          });
        }
      } else {
        console.log(`Module ${id} is disabled (not mounted)`);
      }
    } catch (err) {
      console.error(`Failed to load module ${file}:`, err.message);
    }
  }
}

// Initial load
loadModules().catch(e => console.error(e));

// Basic platform endpoints
app.get('/api/info', (req,res) => {
  res.json({
    name: 'FullTask Global AI Platform',
    owner: CREATOR_NAME,
    modulesEndpoint: '/api/modules/list',
    generatedAt: new Date().toISOString()
  });
});

// List modules with status
app.get('/api/modules/list', async (req,res) => {
  const meta = await fs.readJson(MODULES_META);
  const files = await fs.readdir(MODULES_DIR);
  const list = [];
  for (const file of files) {
    if (!file.endsWith('.js')) continue;
    const modPath = path.join(MODULES_DIR, file);
    try {
      const mod = require(modPath);
      const id = mod.id || file.replace('.js','');
      list.push({
        id,
        name: mod.name || id,
        description: mod.description || '',
        enabled: !!(meta.enabled && meta.enabled[id])
      });
    } catch (err) {
      list.push({ id: file.replace('.js',''), name: file, description: 'load error', enabled: false });
    }
  }
  res.json({ modules: list, count: list.length });
});

// Admin: enable a module
app.post('/api/admin/enable', async (req,res) => {
  const secret = req.headers['x-admin-secret'] || req.body.adminSecret;
  if (secret !== ADMIN_SECRET) return res.status(401).json({error:'Unauthorized'});
  const { id } = req.body;
  if (!id) return res.status(400).json({error:'Module id required'});
  const meta = await fs.readJson(MODULES_META);
  meta.enabled = meta.enabled || {};
  meta.enabled[id] = true;
  await fs.writeJson(MODULES_META, meta, { spaces: 2 });
  // mount immediately if possible
  const modPath = path.join(MODULES_DIR, `${id}.js`);
  if (fs.existsSync(modPath)) {
    try {
      delete require.cache[require.resolve(modPath)];
      const mod = require(modPath);
      if (mod.router) app.use(`/api/modules/${id}`, mod.router);
    } catch(e){ /* ignore mount errors for admin enable */ }
  }
  res.json({status:'enabled', id});
});

// Admin: disable a module (requires restart to fully unmount)
app.post('/api/admin/disable', async (req,res) => {
  const secret = req.headers['x-admin-secret'] || req.body.adminSecret;
  if (secret !== ADMIN_SECRET) return res.status(401).json({error:'Unauthorized'});
  const { id } = req.body;
  if (!id) return res.status(400).json({error:'Module id required'});
  const meta = await fs.readJson(MODULES_META);
  meta.enabled = meta.enabled || {};
  meta.enabled[id] = false;
  await fs.writeJson(MODULES_META, meta, { spaces: 2 });
  res.json({status:'disabled', id, note: 'restart server to unmount routes (simple safe approach)'});
});

// Admin: get modules metadata file
app.get('/api/admin/meta', async (req,res) => {
  const secret = req.headers['x-admin-secret'];
  if (secret !== ADMIN_SECRET) return res.status(401).json({error:'Unauthorized'});
  const meta = await fs.readJson(MODULES_META);
  res.json(meta);
});

// Simple health
app.get('/api/health', (req,res) => res.json({status:'ok', time: new Date().toISOString()}));

// Start server
app.listen(PORT, () => {
  console.log(`FullTask modular server listening on port ${PORT}`);
});
