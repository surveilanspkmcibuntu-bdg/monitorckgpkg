// Vercel Serverless API handler for /api/data
let healthData = [];
let idCounter = 1;

export default function handler(req, res) {
  if (req.method === 'GET') {
    if (req.query.id) {
      const record = healthData.find(r => r.id === parseInt(req.query.id));
      if (!record) return res.status(404).json({ error: 'Not found' });
      return res.json(record);
    }
    return res.json(healthData);
  }
  if (req.method === 'POST') {
    const record = { id: idCounter++, ...req.body };
    healthData.push(record);
    return res.status(201).json(record);
  }
  if (req.method === 'PUT') {
    const idx = healthData.findIndex(r => r.id === parseInt(req.query.id));
    if (idx === -1) return res.status(404).json({ error: 'Not found' });
    healthData[idx] = { ...healthData[idx], ...req.body };
    return res.json(healthData[idx]);
  }
  if (req.method === 'DELETE') {
    const idx = healthData.findIndex(r => r.id === parseInt(req.query.id));
    if (idx === -1) return res.status(404).json({ error: 'Not found' });
    const deleted = healthData.splice(idx, 1);
    return res.json(deleted[0]);
  }
  res.status(405).json({ error: 'Method not allowed' });
}
