# OnboardAI Production Deployment & CI/CD Setup Guide

This guide provides step-by-step instructions for deploying the **OnboardAI** full-stack corporate onboarding application completely for free, and setting up automated CI/CD workflows using GitHub Actions.

---

## Architecture Overview

OnboardAI consists of:
1. **Frontend**: A React/Vite application styled with TailwindCSS, deployed to **Vercel** (Free Tier).
2. **Backend**: A Node.js/Express REST API, deployed to **Render** (Free Web Service Tier).
3. **Database**: A **MongoDB Atlas** database (Free M0 Shared Cluster Tier).
4. **AI Capabilities**: Google **Gemini 2.5 Flash** REST API via a free API key from Google AI Studio.

---

## Step 1: Database Setup (MongoDB Atlas)

1. Sign up/log in at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a new project, click **Create a Cluster**, and select the **M0 (Shared)** Free Tier.
3. In the security settings:
   - Create a database user (e.g. `db_user`) and set a strong password.
   - Go to **Network Access**, click **Add IP Address**, and add `0.0.0.0/0` (Allow access from anywhere). This is required since hosting providers like Render dynamic IPs change frequently.
4. Go to the Database Deployment tab, click **Connect > Drivers**, and copy your **connection string**.
   - It will look like: `mongodb+srv://<username>:<password>@cluster.xxxx.mongodb.net/?retryWrites=true&w=majority`
   - Replace `<username>` and `<password>` with your created DB user credentials.

---

## Step 2: Backend Deployment (Render)

1. Sign up/log in at [Render](https://render.com).
2. Click **New +** and select **Web Service**.
3. Connect your GitHub repository containing the OnboardAI project.
4. In the settings, configure the following:
   - **Name**: `onboardai-backend` (or any unique name)
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`
5. Click **Advanced** to add **Environment Variables**:
   - `MONGO_URI` = `<Your MongoDB Atlas connection string from Step 1>`
   - `JWT_SECRET` = `<Generate a long random string>` (e.g., run `openssl rand -hex 32` in your terminal)
   - `JWT_EXPIRES_IN` = `7d`
   - `GEMINI_API_KEY` = `<Your Gemini API key from Google AI Studio>`
   - `CORS_ORIGIN` = `https://your-frontend.vercel.app` (You can update this after Vercel deployment)
   - `NODE_ENV` = `production`
6. Click **Create Web Service**.
7. Once successfully deployed, note down the backend URL (e.g. `https://onboardai-backend.onrender.com`). We will need this for the frontend configuration.

---

## Step 3: Seed the Database

Before using the application, run the database seed script to populate onboarding paths, default manager roles, and knowledge base documents:
1. Open your terminal locally in the `backend` directory.
2. Ensure your local `.env` file matches the production credentials or set `MONGO_URI` in the terminal environment.
3. Run:
   ```bash
   npm run db:seed
   ```
4. This will clear the target database and seed default paths and users:
   - **Admin**: `admin@onboardai.com` (pass: `password123`)
   - **Manager**: `manager@onboardai.com` (pass: `password123`)
   - **Employee**: `employee@onboardai.com` (pass: `password123`)

---

## Step 4: Frontend Deployment (Vercel)

1. Sign up/log in at [Vercel](https://vercel.com).
2. Click **Add New > Project**, and import your GitHub repository.
3. In the project configuration:
   - **Project Name**: `onboardai-frontend` (or any name)
   - **Root Directory**: `frontend` (Click edit and select `frontend`)
   - **Framework Preset**: `Vite` (detected automatically)
   - **Build & Development Settings**: Keep defaults (Build Command: `vite build`, Output Directory: `dist`).
4. Under **Environment Variables**, add:
   - `VITE_API_URL` = `https://onboardai-backend.onrender.com/api` (Replace with your actual Render backend URL from Step 2, appending `/api` at the end).
5. Click **Deploy**. Vercel will build the frontend and provide a live URL (e.g. `https://onboardai-frontend.vercel.app`).
6. *Optional*: Go back to Render's Environment Variables dashboard and update `CORS_ORIGIN` to match your new Vercel domain URL.

---

## Step 5: Automate CI/CD Workflows (GitHub Actions)

We have configured two workflows in `.github/workflows` to automate linting, building, and deployment whenever you push changes to your production branch (`main` or `master`).

### A. Setup Render CD Webhook
1. Go to your Render Dashboard and select your `onboardai-backend` service.
2. In the **Settings** page, scroll down to the **Deploy Hook** section.
3. Copy the **Deploy Hook URL** (looks like `https://api.render.com/deploy/srv-xxxxxxxxxxxxx?key=yyyyyy`).
4. Go to your GitHub repository: **Settings > Secrets and variables > Actions**.
5. Click **New repository secret** and add:
   - **Name**: `RENDER_DEPLOY_HOOK_URL`
   - **Value**: (Paste the Render Deploy Hook URL)

### B. Setup Vercel CD Secrets
1. Install Vercel CLI locally (if you haven't already):
   ```bash
   npm install -g vercel
   ```
2. Log in and link the project:
   ```bash
   vercel login
   cd frontend
   vercel link
   ```
   Follow the prompts to link the local repository folder to your Vercel project.
3. Once linked, open the `.vercel/project.json` file created inside the `frontend` folder. You will find:
   - `orgId`
   - `projectId`
4. Go to your Vercel dashboard account settings, click **Tokens**, and generate a new token (e.g. name it `GitHub Actions Token`).
5. Go to your GitHub repository: **Settings > Secrets and variables > Actions**.
6. Click **New repository secret** and add:
   - **Name**: `VERCEL_TOKEN` ➔ **Value**: (Paste the Vercel Token you generated)
   - **Name**: `VERCEL_ORG_ID` ➔ **Value**: (Paste the `orgId` from `.vercel/project.json`)
   - **Name**: `VERCEL_PROJECT_ID` ➔ **Value**: (Paste the `projectId` from `.vercel/project.json`)

---

## Step 6: Testing the Pipeline

Once the secrets are set:
1. Push any commit to your `main` (or `master`) branch.
2. Go to the **Actions** tab in your GitHub repository.
3. You will see both **Backend CI** and **Frontend CI** jobs running.
4. After successful linting and testing, they will automatically deploy:
   - Backend changes will trigger a redeploy on Render.
   - Frontend changes will compile and deploy directly to Vercel.
