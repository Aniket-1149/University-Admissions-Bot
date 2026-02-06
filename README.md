# University Admissions Bot 🎓🤖

An intelligent, AI-powered assistant designed to simplify the complex process of understanding university admission guidelines. This application extracts structured data from chaos, answering student questions with precision using Google's Gemini 2.5 Flash model and robust fallback systems.

![React](https://img.shields.io/badge/React-19-61dafb?logo=react&style=flat-square)
![Vite](https://img.shields.io/badge/Vite-6-646cff?logo=vite&style=flat-square)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?logo=tailwindcss&style=flat-square)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&style=flat-square)
![Gemini AI](https://img.shields.io/badge/Google-Gemini_2.5_Flash-8E75B2?logo=google&style=flat-square)

## 🌟 Features

### 🧠 Intelligent Processing
- **Smart Compression**: Converts lengthy, messy admission documents into structured JSON data (Fees, Deadlines, Requirements, Programs).
- **Multi-Model AI**: 
  - Primary: **Gemini 2.5 Flash** for high-speed, high-quality extraction.
  - Fallback 1: **Gemini 1.5 Flash** (Auto-switch on API rate limits).
  - Fallback 2: **ScaleDown API** (Third-layer backup for robust uptime).
- **Heuristic Recovery**: Custom parsing engine to structure raw text even if the AI model returns unstructured data.

### 📄 Document Support
- **PDF Scanning**: Built-in PDF text extraction using `pdfjs-dist`.
- **Text & Raw Input**: Paste guidelines directly or upload text files.
- **Visual Feedback**: "Document Attached" cards in chat history.

### 💬 Interactive Chat
- **Context-Aware Q&A**: Ask questions specifically about the uploaded document. The bot won't hallucinate outside the provided context.
- **Markdown Rendering**: Beautifully formatted responses with lists, bold text, and headers.
- **Persistent History**: Chat history saved locally with sidebar navigation.

## 🦄 Unique Technical Highlights

This application implements several advanced patterns to ensure reliability and accuracy:

- **🛡️ Triple-Layer Robustness Strategy**:
  Unlike standard bots that crash on rate limits, this API employs a waterfall fallback architecture:
  1.  **Primary**: Gemini 2.5 Flash (Best capabilities).
  2.  **Secondary**: Gemini 1.5 Flash (Auto-switch on 429/500 errors).
  3.  **Tertiary**: ScaleDown API (External backup provider).

- **🧩 Hybrid Heuristic Engine**:
  AI models differ in output stability. If the AI returns raw text instead of JSON, our **Custom Heuristic Parser** kicks in. It uses regular expression pattern matching to extract Fees, Deadlines, and Requirements from unstructured text, ensuring the UI always renders data.

- **🧹 Anti-Hallucination & Marketing Filter**:
  University brochures are 50% marketing fluff. The system prompts are engineered to perform **Aggressive Filtering**—stripping out promotional language ("world-class campus", "vibrant community") to leave only hard data (GPA requirements, tuition costs, deadlines).

- **⚡ Client-Side PDF Pre-processing**:
  Uses `pdfjs-dist` to extract and sanitize text directly in the browser (React). This reduces server bandwidth and allows for immediate feedback to the user before the API call is even made.

## 🛠️ Tech Stack

### Frontend (`/frontend`)
- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS v4
- **PDF Processing**: `pdfjs-dist`
- **Markdown**: `react-markdown`
- **Icons**: `lucide-react` / Custom SVG Icons

### Backend (`/backend`)
- **Server**: Node.js + Express
- **AI Integration**: `@google/generative-ai` SDK
- **Resilience**: Custom 3-layer error handling and rate-limit management.
- **Utilities**: `dotenv`, `cors`, `node-fetch`.

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- Google Gemini API Key
- (Optional) ScaleDown API Key

### 1. Clone & Install
```bash
git clone <repository-url>
cd "project genz"
```

### 2. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` folder:
```properties
PORT=5000
GEMINI_API_KEY=your_gemini_api_key_here
SCALEDOWN_API_KEY=your_scaledown_api_key_here # Optional
SCALEDOWN_API_URL=https://api.scaledown.xyz/compress/raw/ # Optional
```
Start the server:
```bash
npm run dev
```

### 3. Frontend Setup
Open a new terminal:
```bash
cd frontend
npm install
```
Start the UI:
```bash
npm run dev
```

## 🏗️ Project Structure

```
project genz/
├── backend/                 # API Server
│   ├── server.js            # Main Express app & AI logic
│   ├── sample-admission...  # Test data
│   └── package.json
├── frontend/                # React Client
│   ├── src/
│   │   ├── components/      # UI Components (Chat, Sidebar, Header)
│   │   ├── App.jsx          # Main Logic (State, File Handling)
│   │   └── main.jsx         # Entry Point
│   ├── public/
│   └── package.json
└── README.md
```

## 🛡️ Robustness & Fallbacks

This project is built to handle API limitations gracefully:
1.  **Rate Limit Detection**: Captures `429` errors from Google.
2.  **Model Downgrade**: Automatically retries requests with lighter models.
3.  **Third-Party Failover**: Can route traffic to ScaleDown API.
4.  **Client-Side Recovery**: Simple heuristic parsing ensures formatting isn't lost if the model degrades to raw text.


