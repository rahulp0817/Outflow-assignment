# 🚀 OutFlo-Assignment

A full-stack campaign management and lead outreach system built with:
- **Backend**: Node.js + Express + TypeScript + MongoDB
- **Frontend**: React + TypeScript
- **AI Integration**: OpenAI (GPT-3.5)
- **Bonus**: LinkedIn Scraping with Puppeteer

---

## 📁 Project Structure
```
OutFlo-Assignment/
├── backend/       # Node.js backend APIs
├── frontend/      # React + TS frontend
├── scraping/      # Puppeteer script for LinkedIn leads
```

---

## 📝 Images 
<img width="1094" alt="outflow1" src="https://github.com/user-attachments/assets/22ed49e1-0d92-48b1-9af9-aaae82fb5b49" />

<img width="1086" alt="outflow2" src="https://github.com/user-attachments/assets/0b1ae449-1f10-4915-8e8b-5b29f7dc5552" />

<img width="810" alt="outflow3" src="https://github.com/user-attachments/assets/361d1282-f96d-4d05-a3a0-70520cf0fc58" />

## 🧠 Features
- Campaign CRUD (Create, Read, Update, Delete)
- Personalized outreach message generation using AI
- Dashboard for campaign management
- Lead scraping from LinkedIn
- View all scraped leads in frontend UI

---

## ⚙️ Backend Setup (MongoDB, Express, OpenAI)
```bash
cd backend
npm install
```

### 🧪 Environment Variables
Create a `.env` file:
```
MONGO_URI=mongodb://localhost:27017/outflo
OPENAI_API_KEY=your_openai_api_key
```

### 🔧 Run Server
```bash
npm run dev
```

---

## 🌐 Frontend Setup (React + TypeScript)
```bash
cd frontend
npm install
npm start
```

If backend is running locally, add this to `frontend/package.json`:
```json
"proxy": "http://localhost:5000"
```

---

## 🔍 Scraping Leads from LinkedIn (Bonus)
> Scrape 20+ founder profiles from a LinkedIn search page.

### 📦 Setup Puppeteer
```bash
cd scraping
npm init -y
npm install puppeteer
```

### ✨ Run the Scraper
```bash
node scrape.js
```
1. Logs in via browser
2. After manual login, press ENTER in terminal
3. Data is saved to `scraping/scraped-leads.json`

### 📤 Import Leads to DB
```bash
POST http://localhost:5000/leads/import
```

---

## 🖥️ API Reference
### Campaign Endpoints
```
GET    /campaigns
GET    /campaigns/:id
POST   /campaigns
PUT    /campaigns/:id
DELETE /campaigns/:id   # Soft delete
```

### Message API
```
POST /personalized-message
Payload:
{
  name, job_title, company, location, summary
}
```

### Leads API
```
GET  /leads
POST /leads/import
```

---

## 🎨 UI Overview
- **Dashboard**: View, create, delete, and toggle campaigns
- **Message Generator**: Input LinkedIn data and generate message
- **Leads Viewer**: See all scraped LinkedIn profiles

---

## ✅ Final Checklist
- [x] GitHub Repo (public)
- [x] Deployed Frontend (Vercel/Netlify)
- [x] Deployed Backend (Render/Railway)
- [x] Loom video of scraping (bonus)
- [x] Submit via form ✅

---

✨ Built with ❤️ for OutFlo by Rahul Pradhan

