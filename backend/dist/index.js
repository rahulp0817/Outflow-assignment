"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const campaign_1 = __importDefault(require("./routes/campaign"));
const message_1 = __importDefault(require("./routes/message"));
const leads_1 = __importDefault(require("./routes/leads"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/campaigns', campaign_1.default);
app.use('/personalized-message', message_1.default);
app.use('/leads', leads_1.default);
const PORT = 5000;
mongoose_1.default.connect(process.env.MONGO_URI || '', {}).then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(err => console.error(err));
