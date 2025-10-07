import express from "express";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import * as Client from "@storacha/client";
import * as Delegation from "@storacha/client/delegation";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 8787;

/**
 * POST /api/upload
 * Uploads a simple test blob to Storacha using your UCAN proof and agent.
 */
app.post("/api/upload", async (_req, res) => {
  try {
    // Load proof file (CAR UCAN delegation)
    const proofPath = path.resolve(process.env.HOME || ".", "space-proof.car");
    const proofBytes = fs.readFileSync(proofPath);

    // Parse UCAN delegation
    const delegation = await Delegation.extract(new Uint8Array(proofBytes));
    if (!delegation.ok) {
      throw new Error(`Failed to extract delegation: ${delegation.error}`);
    }

    // Create Storacha client (auto-generates local Agent)
    const client = await Client.create();

    // Attach the proof (UCAN delegation)
    await client.addProof(delegation.ok);

    // Upload a simple file
    c// Upload a simple file
const data = new Blob(["Hello from UCAN Upload Wall!"], { type: "text/plain" });

// Just upload the blob itself — the name isn’t passed here anymore
const result = await client.uploadFile(data);

res.json({
  ok: true,
  cid: result.toString(),
});


  } catch (err: any) {
    console.error("Upload failed:", err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

/**
 * Start server
 */
app.listen(PORT, () => {
  console.log(`🚀 UCAN Upload Wall backend running on port ${PORT}`);
});

