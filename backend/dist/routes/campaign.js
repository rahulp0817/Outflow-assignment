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
const campaign_model_1 = __importDefault(require("../models/campaign-model"));
const router = express_1.default.Router();
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const campaigns = yield campaign_model_1.default.find({ status: { $ne: 'DELETED' } });
    res.json(campaigns);
}));
// @ts-ignore
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const campaign = yield campaign_model_1.default.findById(req.params.id);
    if (!campaign || campaign.status === 'DELETED')
        return res.status(404).json({ error: 'Not found' });
    res.json(campaign);
}));
// POST create new campaign
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newCampaign = new campaign_model_1.default(req.body);
        yield newCampaign.save();
        res.status(201).json(newCampaign);
    }
    catch (err) {
        res.status(400).json({ error: err instanceof Error ? err.message : 'An unknown error occurred' });
    }
}));
// PUT update campaign
router.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updated = yield campaign_model_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updated);
    }
    catch (err) {
        res.status(400).json({ error: err instanceof Error ? err.message : 'An unknown error occurred' });
    }
}));
// DELETE (soft delete) campaign
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deleted = yield campaign_model_1.default.findByIdAndUpdate(req.params.id, { status: 'DELETED' }, { new: true });
        res.json(deleted);
    }
    catch (err) {
        res.status(400).json({ error: err instanceof Error ? err.message : 'An unknown error occurred' });
    }
}));
exports.default = router;
