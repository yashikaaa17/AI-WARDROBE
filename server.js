require('dotenv').config();

const express  = require('express');
const cors     = require('cors');
const fs       = require('fs');
const path     = require('path');
const mongoose = require('mongoose');

const app       = express();
const PORT      = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'wardrobeData.json');

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));   // serves existing HTML/CSS/JS frontend

// ── MongoDB Connection ────────────────────────────────────────────────────────
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err.message));

// ── Mongoose Schema & Model ───────────────────────────────────────────────────
const wardrobeSchema = new mongoose.Schema(
  {
    name:     { type: String, required: true },
    category: { type: String },
    color:    { type: String },
    season:   { type: String },
  },
  { timestamps: true }
);

const WardrobeItem = mongoose.model('WardrobeItem', wardrobeSchema);

// ── JSON File Helpers (kept for /api/json/* routes) ───────────────────────────
function readData() {
  const raw = fs.readFileSync(DATA_FILE, 'utf-8');
  return JSON.parse(raw);
}

function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// ── JSON File Routes ──────────────────────────────────────────────────────────

// GET  /api/json/wardrobe  → return all items from wardrobeData.json
app.get('/api/json/wardrobe', (req, res) => {
  const items = readData();
  res.json(items);
});

// POST /api/json/wardrobe  → append a new item to wardrobeData.json
app.post('/api/json/wardrobe', (req, res) => {
  const items   = readData();
  const newItem = { id: Date.now(), ...req.body };
  items.push(newItem);
  writeData(items);
  res.status(201).json(newItem);
});

// ── MongoDB CRUD Routes ───────────────────────────────────────────────────────

// POST /api/wardrobe  → Create a new item
app.post('/api/wardrobe', async (req, res) => {
  try {
    const item = await WardrobeItem.create(req.body);
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/wardrobe  → Fetch all items
app.get('/api/wardrobe', async (req, res) => {
  try {
    const items = await WardrobeItem.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/wardrobe/:id  → Update an item by ID, return updated document
app.put('/api/wardrobe/:id', async (req, res) => {
  try {
    const updated = await WardrobeItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }   // new:true → returns updated doc
    );
    if (!updated) return res.status(404).json({ error: 'Item not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/wardrobe/:id  → Delete an item by ID
app.delete('/api/wardrobe/:id', async (req, res) => {
  try {
    const deleted = await WardrobeItem.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Item not found' });
    res.json({ message: 'Item deleted successfully', item: deleted });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ── Start ─────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 AI-Wardrobe server running at http://localhost:${PORT}`);
});
