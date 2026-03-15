const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// In-memory data store
let healthData = [];
let idCounter = 1;

// Create
app.post('/api/data', (req, res) => {
  const record = { id: idCounter++, ...req.body };
  healthData.push(record);
  res.status(201).json(record);
});

// Read all
app.get('/api/data', (req, res) => {
  res.json(healthData);
});

// Read by id
app.get('/api/data/:id', (req, res) => {
  const record = healthData.find(r => r.id === parseInt(req.params.id));
  if (!record) return res.status(404).json({ error: 'Not found' });
  res.json(record);
});

// Update
app.put('/api/data/:id', (req, res) => {
  const idx = healthData.findIndex(r => r.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  healthData[idx] = { ...healthData[idx], ...req.body };
  res.json(healthData[idx]);
});

// Delete
app.delete('/api/data/:id', (req, res) => {
  const idx = healthData.findIndex(r => r.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  const deleted = healthData.splice(idx, 1);
  res.json(deleted[0]);
});

app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}`);
});
