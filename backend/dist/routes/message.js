"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const openai_1 = __importDefault(require("openai"));
const router = express_1.default.Router();
const openai = new openai_1.default({
    apiKey: process.env.OPENAI_API_KEY,
});
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, job_title, company, location, summary } = req.body;
    console.log('Received data:', req.body);
    try {
        const prompt = `Generate a short personalized outreach message for someone named ${name}, a ${job_title} at ${company} based in ${location}. Summary: ${summary}`;
        console.log('Prompt:', prompt);
        const completion = yield openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: prompt }]
        });
        console.log('OpenAI response:', completion);
        const message = completion.choices[0].message.content;
        res.json({ message });
    }
    catch (error) {
        console.error('Error calling OpenAI:', error);
        res.status(500).json({ error: error.message || 'An unknown error occurred' });
    }
}));
exports.default = router;
