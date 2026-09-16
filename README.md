# ProofPass AI 🔐

ProofPass is a portfolio MVP that combines **AI evidence analysis + cryptographic hashing + optional blockchain anchoring** to create verifiable proofs for digital claims.

> **Important:** ProofPass is a verification/provenance demo, not a guarantee that a document is authentic. AI produces an assessment from the evidence supplied by the user. Blockchain proves that a specific hash was anchored at a specific time.

## What it does

1. User enters a claim.
2. User adds supporting evidence and an optional source URL.
3. Backend asks an AI model to analyze the evidence.
4. Backend creates a SHA-256 fingerprint of the submitted evidence.
5. If blockchain mode is configured, the fingerprint is anchored on-chain.
6. A public verification page shows the claim, AI assessment, hash, and transaction.

## Stack

- Frontend: React + Vite
- Backend: Node.js + Express
- AI: Google Gemini REST API (optional; demo mode works without a key)
- Crypto: SHA-256 + ethers.js
- Smart contract: Solidity
- Styling: plain CSS

## Run locally

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

The API runs on `http://localhost:4000`.

### 2. Frontend

In a second terminal:

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Open the URL printed by Vite (normally `http://localhost:5173`).

### 3. Demo mode

The app works without an AI key or blockchain wallet. Leave:

```env
DEMO_MODE=true
```

in the backend `.env`.

### 4. Real AI

Create a Gemini API key and set:

```env
GEMINI_API_KEY=your_key_here
GEMINI_MODEL=gemini-2.5-flash
DEMO_MODE=false
```

Do not commit `.env`.

### 5. Blockchain

The blockchain integration is optional. Deploy the contract in `contracts/` to a testnet, then set:

```env
CHAIN_RPC_URL=...
CHAIN_PRIVATE_KEY=...
PROOFPASS_CONTRACT_ADDRESS=...
CHAIN_NAME=Your Testnet
```

Never put a private key in the frontend or GitHub.

## Deployment

### Backend
Deploy `backend` to Render/Railway/Fly.io or another Node hosting provider.

Build/install:
```bash
npm install
```

Start:
```bash
npm start
```

Set the environment variables from `backend/.env.example`.

### Frontend
Deploy `frontend` to Vercel/Netlify.

Set:
```env
VITE_API_URL=https://YOUR-BACKEND-DOMAIN
```

Then redeploy.

## Suggested portfolio demo

Use a harmless claim such as:

> "This project repository contains a working ProofPass prototype."

Evidence:

> "ProofPass accepts a claim, analyzes supporting evidence, creates a SHA-256 fingerprint, and can anchor that fingerprint on a blockchain."

Use a public GitHub URL as the source URL after you publish the repository.

## Hackathon note

This repository is intended as a portfolio/learning MVP. If a hackathon prohibits pre-built work for the event itself, do not submit this exact code as the hackathon's event-built implementation. Follow the event's rules.
