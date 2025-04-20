import express from 'express';
import campaignModel from '../models/campaign-model';
import { Request, Response } from 'express';

const router = express.Router();

router.get('/', async (req, res) => {
  const campaigns = await campaignModel.find({ status: { $ne: 'DELETED' } });
  res.json(campaigns);
});

// @ts-ignore
router.get('/:id', async (req: Request, res: Response) => {
  const campaign = await campaignModel.findById(req.params.id);
  if (!campaign || campaign.status === 'DELETED') return res.status(404).json({ error: 'Not found' });
  res.json(campaign);
});

// POST create new campaign
router.post('/', async (req, res) => {
  try {
    const newCampaign = new campaignModel(req.body);
    await newCampaign.save();
    res.status(201).json(newCampaign);
  } catch (err) {
    res.status(400).json({ error: err instanceof Error ? err.message : 'An unknown error occurred' });
  }
});

// PUT update campaign
router.put('/:id', async (req, res) => {
  try {
    const updated = await campaignModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err instanceof Error ? err.message : 'An unknown error occurred' });
  }
});

// DELETE (soft delete) campaign
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await campaignModel.findByIdAndUpdate(req.params.id, { status: 'DELETED' }, { new: true });
    res.json(deleted);
  } catch (err) {
    res.status(400).json({ error: err instanceof Error ? err.message : 'An unknown error occurred' });
  }
});

export default router;