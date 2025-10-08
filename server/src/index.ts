import express from "express";
import cors from "cors";
import multer from "multer";
import dotenv from "dotenv";
import fs from "fs";
import * as Client from "@storacha/client";
import * as Proof from "@storacha/client/proof";
import * as Signer from "@storacha/client/principal/ed25519";
import { StoreMemory } from "@storacha/client/stores/memory";

dotenv.config();

const app = express();
const upload = multer({ dest: "uploads/" });
app.use(cors());
const port = Number(process.env.PORT || 8787);

const KEY = process.env.KEY;
const PROOF = process.env.PROOF;
const SPACE_DID = process.env.SPACE_DID;

if (!KEY || !PROOF || !SPACE_DID) {
  console.error("❌ Missing KEY, PROOF, or SPACE_DID in .env");
  process.exit(1);
}

let clientPromise: Promise<Client.Client> | null = null;

// Initialize Storacha client once
async function getClient() {
  if (!clientPromise) {
    const principal = Signer.parse(KEY);          // Load agent key
    const store = new StoreMemory();              // In-memory UCAN store
    const client = await Client.create({ principal, store });

    const proof = await Proof.parse(PROOF);       // Parse delegation proof
    const space = await client.addSpace(proof);   // Add authorized space
    await client.setCurrentSpace(space.did());    // Activate that space

    console.log(`✅ Connected to space: ${space.did()}`);
    clientPromise = Promise.resolve(client);
  }
  return clientPromise;
}

// API route for file uploads
app.post("/api/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ ok: false, error: "No file uploaded" });
    }

    const client = await getClient();

    // Convert file to Blob
    const fileBuffer = fs.readFileSync(req.file.path);
    const blob = new Blob([fileBuffer]);

    // Upload file to Storacha
    const cid = await client.uploadFile(blob);

    // Clean up temp file
    fs.unlinkSync(req.file.path);

    console.log(`📦 Uploaded ${req.file.originalname} → CID: ${cid.toString()}`);
    res.json({ ok: true, cid: cid.toString() });
  } catch (err: any) {
    console.error("❌ Upload failed:", err);
    res.status(500).json({ ok: false, error: err.message ?? "Upload failed" });
  }
});

app.listen(port, () => {
  console.log(`🚀 UCAN Upload Wall backend running on port ${port}`);
});
