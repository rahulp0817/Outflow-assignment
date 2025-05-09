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
const lead_model_1 = __importDefault(require("../models/lead-model"));
const fs_1 = __importDefault(require("fs"));
const router = express_1.default.Router();
router.post('/import', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = JSON.parse(fs_1.default.readFileSync('scraping/scraped-leads.json', 'utf-8'));
        const result = yield lead_model_1.default.insertMany(data);
        res.json(result);
    }
    catch (err) {
        res.status(500).json({ error: err instanceof Error ? err.message : 'An unknown error occurred' });
    }
}));
// Get all leads
router.get('/', (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const leads = yield lead_model_1.default.find();
    res.json(leads);
}));
exports.default = router;
