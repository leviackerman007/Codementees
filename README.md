# OnboardAI — AI-Powered Corporate Onboarding SaaS Platform

**OnboardAI** is a modern, enterprise-grade corporate onboarding SaaS platform designed to streamline new hire training, centralize company policies, and deliver instant, hallucination-free assistance using a database-backed Retrieval-Augmented Generation (RAG) pipeline.

---

## 👥 Demo Login Credentials (For Recruiters)

To quickly test the platform without signing up, use these seeded credentials:

| Role | Email | Password | Dashboard Features |
|---|---|---|---|
| **Admin** | `admin@onboardai.com` | `password123` | Analytics, approve/publish paths, view users |
| **Manager** | `manager@onboardai.com` | `password123` | Build onboarding paths, upload knowledge docs |
| **Employee** | `employee@onboardai.com` | `password123` | Study area, progress checklist, AI chatbot |

---

## 🚀 Key Features

*   **RAG AI Assistant**: Contextual chatbot powered by **Google Gemini 2.5 Flash** API, matching employee queries to uploaded corporate document indexes using MongoDB full-text search. Features prompt guardrails to restrict replies to company context and avoid hallucinations.
*   **Structured Onboarding Paths**: Modular training roadmaps (e.g., *Engineering Team Boot Camp*, *HR & Benefits Hub*) with syllabus chapters, embedded video lessons (YouTube/Vimeo auto-embeds), text guides, and reference resource attachments.
*   **Dynamic Progress Tracking**: Real-time progress bar calculation based on self-paced completion checkboxes, stored securely in client-side storage to minimize database query overhead.
*   **Three Workspace Dashboards (RBAC)**:
    *   **Employee Dashboard**: Enrolled paths list, learning pathways, and floating AI chat widget.
    *   **Manager Dashboard**: Onboarding path builder, curriculum editors, and custom knowledge document indexer (.txt and .md upload support).
    *   **Admin Dashboard**: Overview charts, pathway publishing approvals, and user management lists.
*   **Modern Aesthetics**: Styled using **TailwindCSS v4** and **Framer Motion** animations. Full Light/Dark theme switching, responsive layouts, and scrollbar-hidden overlays.
*   **Hardened REST APIs**: Secured with JWT verification, bcrypt password hashing, Joi validation schemas, Helmet headers, express-rate-limit throttling, and developer-friendly CORS policy.

---

## 📦 Technology Stack

### **Frontend**
*   **React 19** & **Vite 7**
*   **React Router v7** (Nested routing, protective route gates)
*   **TailwindCSS v4** (Utility styling, dark theme properties)
*   **Framer Motion** (Smooth transitions and interactive micro-animations)

### **Backend**
*   **Node.js** & **Express 4**
*   **MongoDB Atlas** & **Mongoose 9** (M0 Free Cluster support)
*   **jsonwebtoken** (HS256 JWT signing)
*   **bcryptjs** (10 salt rounds encryption)
*   **joi** (JSON schema validators)
*   **express-fileupload** & **cloudinary** (Cloud media storage)

---

## 🔧 Environment Variables Setup

Create a `.env` file inside the `backend/` directory based on the following keys:

### **Backend (`backend/.env`)**
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Connection
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/onboardai?retryWrites=true&w=majority

# Authentication Secrets
JWT_SECRET=your_32_byte_secure_hex_key
JWT_EXPIRES_IN=7d

# Google Gemini API (Get from Google AI Studio)
GEMINI_API_KEY=AIzaSy...

# Cloudinary Integration (Optional)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# CORS Whitelist Configuration
FRONTEND_URL=http://localhost:5173
CORS_ORIGIN=http://localhost:5173
```

---

## ⚙️ Quick Start

### **1. Clone & Install Dependencies**
```bash
git clone <your-repo-url>
cd Codementees

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### **2. Seed the Database**
Populate your MongoDB Atlas cluster with default users (Admin, Manager, Employee), onboarding paths, and knowledge base documents:
```bash
cd backend
npm run db:seed
```

### **3. Start the Development Servers**

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
# Starts on http://localhost:5000
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
# Starts on http://localhost:5173
```



---

## 📁 Repository Directory Structure

```
Codementees/
├── backend/
│   ├── src/
│   │   ├── controllers/      # RAG Chat, Auth, Course CRUD handlers
│   │   ├── middleware/       # JWT gate, validation schema wraps
│   │   ├── models/           # User, Course, Knowledge schemas
│   │   ├── routes/           # REST endpoints
│   │   ├── utils/            # Seeding scripts, token tools
│   │   └── validators/       # Joi schemas
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/       # AI Assistant widget, Modals, Cards
    │   ├── context/          # Auth context, Theme toggles
    │   ├── data/             # Static onboarding course fallbacks
    │   ├── layouts/          # Dashboard & Main frames
    │   ├── pages/            # Login, Signup, Study view, Contact
    │   ├── services/         # Axios API connection modules
    │   └── index.css         # Design tokens & no-scrollbar classes
    └── package.json
```
