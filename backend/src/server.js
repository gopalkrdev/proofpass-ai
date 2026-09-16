import "dotenv/config";
import express from "express";
import cors from "cors";
import crypto from "node:crypto";
import { analyzeEvidence } from "./ai.js";
import { anchorProof, blockchainEnabled } from "./blockchain.js";

const app = express();
const PORT = Number(process.env.PORT || 4000);

app.use(cors({
  origin: process.env.FRONTEND_ORIGIN
    ? process.env.FRONTEND_ORIGIN.split(",").map(s => s.trim())
    : true
}));
app.use(express.json({ limit: "1mb" }));

const proofs = new Map();

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    service: "ProofPass API",
    ai: process.env.DEMO_MODE === "true" || !process.env.GEMINI_API_KEY ? "demo" : "gemini",
    blockchain: blockchainEnabled() ? "enabled" : "demo"
  });
});

app.post("/api/verify", async (req, res) => {
  try {
    const { claim, evidence, sourceUrl = "" } = req.body || {};

    if (!claim?.trim() || !evidence?.trim()) {
      return res.status(400).json({ error: "Claim and supporting evidence are required." });
    }

    const normalized = JSON.stringify({
      claim: claim.trim(),
      evidence: evidence.trim(),
      sourceUrl: sourceUrl.trim()
    });

    const proofHash = "0x" + crypto.createHash("sha256").update(normalized).digest("hex");
    const analysis = await analyzeEvidence({
      claim: claim.trim(),
      evidence: evidence.trim(),
      sourceUrl: sourceUrl.trim()
    });

    const chain = await anchorProof({
      proofHash,
      claim: claim.trim()
    });

    const id = crypto.randomBytes(5).toString("hex").toUpperCase();

    const proof = {
      id,
      claim: claim.trim(),
      sourceUrl: sourceUrl.trim(),
      proofHash,
      analysis,
      chain,
      createdAt: new Date().toISOString()
    };

    proofs.set(id, proof);
    res.json(proof);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || "Verification failed." });
  }
});

app.get("/api/proofs/:id", (req, res) => {
  const proof = proofs.get(req.params.id?.toUpperCase());
  if (!proof) return res.status(404).json({ error: "Proof not found." });
  res.json(proof);
});

app.listen(PORT, () => {
  console.log(`ProofPass API running on http://localhost:${PORT}`);
});
