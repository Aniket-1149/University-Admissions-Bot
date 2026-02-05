# College Admissions Assistant

An AI-powered web application that helps students navigate university admission guidelines by extracting structured information and answering questions about admission requirements.

![React](https://img.shields.io/badge/React-19.2.0-61dafb?logo=react)
![Vite](https://img.shields.io/badge/Vite-7.2.4-646cff?logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1.18-38bdf8?logo=tailwindcss)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js)
![Google Gemini](https://img.shields.io/badge/Google-Gemini%20AI-4285f4?logo=google)

## Features

- **Guideline Compression**: Paste or upload university admission guidelines and receive a structured, factual summary
- **Marketing Removal**: Automatically filters out promotional content, focusing only on hard requirements
- **Intelligent Q&A**: Ask follow-up questions based strictly on the compressed data
- **Modern UI**: Beautiful ChatGPT-like dark theme interface with responsive design
- **Mobile Friendly**: Fully responsive design that works on all devices
- **Conversation History**: Save and revisit previous guideline analyses
- **Real-time Processing**: Instant AI-powered responses using Google Gemini

## Tech Stack

### Frontend
- **React 19.2.0** - Modern UI library with latest features
- **Vite 7.2.4** - Lightning-fast build tool and dev server
- **Tailwind CSS 4.1.18** - Utility-first CSS framework
- **Axios** - HTTP client for API requests

### Backend
- **Node.js** - JavaScript runtime
- **Express 5.2.1** - Fast web framework
- **Google Generative AI** - Gemini 2.5 Flash model integration
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

## Prerequisites

Before you begin, ensure you have:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Google Gemini API Key** - [Get one here](https://aistudio.google.com/app/apikey)

## Installation

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd "project genz"
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file from example
copy .env.example .env

# Edit .env and add your Gemini API key
# GEMINI_API_KEY=your_actual_api_key_here
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install

# Create .env file from example
copy .env.example .env

# The default API URL should work (http://localhost:5000)
```

## Running the Application

### Start Backend Server

```bash
cd backend
npm start
```

Server will run on: `http://localhost:5000`

### Start Frontend Development Server

Open a new terminal:

```bash
cd frontend
npm run dev
```

Frontend will run on: `http://localhost:5173`

### Access the Application

Open your browser and navigate to:
```
http://localhost:5173
```

## Usage Guide

### 1. Compress Admission Guidelines

1. **Paste Text**: Copy admission guidelines and paste directly into the input area
2. **Upload File**: Drag & drop or click to upload `.txt` or `.pdf` files
3. **Click "Compress Guidelines"**: The AI will extract structured admission data
4. **View Results**: Get a clean, factual summary with:
   - General information
   - Eligibility criteria
   - Application requirements
   - Important dates and deadlines
   - Financial information
   - Program-specific details

### 2. Ask Follow-up Questions

After compression:
1. Type your question in the chat input
2. Press Enter or click Send
3. Get answers based strictly on the compressed data

### 3. Manage Conversations

- **New Conversation**: Click "+ New Chat" to start fresh
- **View History**: Access previous conversations from the sidebar
- **Toggle Sidebar**: Click the menu icon to show/hide conversation history

## API Endpoints

### Backend API

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Health check endpoint |
| `/api/compress` | POST | Compress admission guidelines |
| `/api/ask-question` | POST | Ask questions about compressed data |

### Request Examples

**Compress Guidelines:**
```json
POST /api/compress
{
  "guidelinesText": "Your admission guidelines text here..."
}
```

**Ask Question:**
```json
POST /api/ask-question
{
  "question": "What is the minimum GPA requirement?",
  "compressedData": { /* previously compressed data */ }
}
```

## UI Features

- **Dark Theme**: Easy on the eyes with professional gray-900 background
- **Emerald Accents**: Modern gradient highlights for important elements
- **Smooth Animations**: Typing indicators and message transitions
- **Responsive Layout**: Adapts seamlessly to different screen sizes
- **Custom Scrollbars**: Styled scrollbars for better aesthetics
- **Loading States**: Visual feedback during API processing

## Development

### Frontend Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### Backend Scripts

```bash
npm start        # Start server
npm run dev      # Start with auto-reload
```

## Project Structure

```
project genz/
├── frontend/
│   ├── src/
│   │   ├── App.jsx           # Main React component
│   │   ├── App.css           # Custom styles
│   │   ├── index.css         # Tailwind base styles
│   │   └── main.jsx          # Entry point
│   ├── public/               # Static assets
│   ├── .env                  # Environment variables
│   ├── package.json          # Dependencies
│   └── vite.config.js        # Vite configuration
│
├── backend/
│   ├── server.js             # Express server
│   ├── .env                  # Environment variables (API key)
│   └── package.json          # Dependencies
│
└── README.md                 # This file
```

## Environment Variables

### Backend (.env)
```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=5000
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000
```

## Troubleshooting

### Backend Issues

**Server won't start:**
- Check if port 5000 is available
- Verify `.env` file exists with valid `GEMINI_API_KEY`
- Run `npm install` to ensure dependencies are installed

**API errors:**
- Verify your Gemini API key is valid
- Check if you have internet connection
- Ensure you're using a supported model (gemini-2.5-flash)

### Frontend Issues

**Vite won't start:**
- Check if port 5173 is available
- Run `npm install` to install dependencies
- Clear browser cache and restart dev server

**API connection errors:**
- Verify backend is running on port 5000
- Check `VITE_API_URL` in frontend `.env`
- Ensure CORS is properly configured



Built for students navigating college admissions
