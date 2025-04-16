import express from 'express';
import leadModel from '../models/lead-model';
import fs from 'fs';

const router = express.Router();

router.post('/import', async (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync('scraping/scraped-leads.json', 'utf-8'));
    const result = await leadModel.insertMany(data);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'An unknown error occurred' });
  }
});

// Get all leads
router.get('/', async (_req, res) => {
  const leads = await leadModel.find();
  res.json(leads);
});

export default router;
