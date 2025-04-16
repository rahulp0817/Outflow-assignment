import express from 'express';
import OpenAI from 'openai';

const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || ''
});

router.post('/', async (req, res) => {
  const { name, job_title, company, location, summary } = req.body;
  try {
    const prompt = `Generate a short personalized outreach message for someone named ${name}, a ${job_title} at ${company} based in ${location}. Summary: ${summary}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }]
    });

    const message = completion.choices[0].message.content;
    res.json({ message });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'An unknown error occurred' });
  }
});

export default router;