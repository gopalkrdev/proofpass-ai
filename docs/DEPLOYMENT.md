# Deployment checklist

## A. GitHub

1. Create a new public repository named `proofpass-ai`.
2. Upload the contents of this folder.
3. Keep `.env` out of GitHub.
4. Add a good README screenshot/GIF later.

Suggested repo description:

> AI-powered evidence verification with cryptographic proofs and optional blockchain anchoring.

## B. Backend

Recommended beginner path: Render.

1. Create a new Web Service from the GitHub repo.
2. Set the root directory to `backend`.
3. Build command: `npm install`
4. Start command: `npm start`
5. Add environment variables.

For first deployment, keep:
`DEMO_MODE=true`

After the backend is live, test:
`https://YOUR-BACKEND/api/health`

## C. Frontend

Recommended beginner path: Vercel.

1. Import the GitHub repository.
2. Set root directory to `frontend`.
3. Build command: `npm run build`
4. Output directory: `dist`
5. Add:
`VITE_API_URL=https://YOUR-BACKEND`

Redeploy.

## D. AI

After the app works in demo mode, add a Gemini API key in the backend environment variables and set:
`DEMO_MODE=false`

Never expose the key as a `VITE_...` variable.

## E. Blockchain

Deploy `contracts/ProofPassRegistry.sol` to a testnet using a dedicated test wallet.

Then add to backend:
- `CHAIN_RPC_URL`
- `CHAIN_PRIVATE_KEY`
- `PROOFPASS_CONTRACT_ADDRESS`
- `CHAIN_NAME`

Test with a tiny/non-production value first.

## F. Portfolio proof

Once live, create a proof claiming:

> "ProofPass is a working AI-assisted verification prototype."

Use your own GitHub repo as evidence. This makes the portfolio story consistent.

## G. Application

Only paste the live link / GitHub link into an application if it is genuinely your work and you can explain:
- architecture
- AI flow
- hashing
- blockchain contract
- deployment
- limitations
