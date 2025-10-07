import express from "express";
import cors from "cors";
import multer from "multer";
import dotenv from "dotenv";
import fs from "fs";
import { Client, Agent, Delegation } from "@storacha/client";

dotenv.config();

const app = express();
app.use(cors());
const upload = multer({ dest: "uploads/" });
const port = process.env.PORT || 8080;

app.post("/api/upload", upload.single("file"), async (req, res) => {
  try {
    console.log("📤 Incoming upload request...");

    // 1️⃣ Validate env vars
    const key = process.env.KEY?.trim();
    const proofB64 = process.env.PROOF_B64?.trim();
    if (!key || !proofB64) {
      throw new Error("Missing KEY or PROOF_B64 in .env");
    }

    // 2️⃣ Decode UCAN proof
    const proofBytes = Buffer.from(proofB64, "base64");
    const delegation = await Delegation.extract(new Uint8Array(proofBytes));
    if (!delegation.ok) throw new Error(`Invalid proof: ${delegation.error}`);

    // 3️⃣ Create agent + client
    const agent = await Agent.fromSecret(key);
    const client = new Client({ agent });

    // 4️⃣ Attach proof
    await client.agent.addProofs([delegation.ok]);

    // 5️⃣ Upload file
    if (!req.file) throw new Error("No file uploaded");
    const fileBuffer = fs.readFileSync(req.file.path);
    const data = new Blob([fileBuffer]);
    const result = await client.uploadFile(data);

    console.log("✅ Uploaded CID:", result.toString());
    res.json({ ok: true, cid: result.toString() });
  } catch (err: any) {
    console.error("❌ Upload failed:", err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.listen(port, () => {
  console.log(`🚀 UCAN Upload Wall backend running on port ${port}`);
});
