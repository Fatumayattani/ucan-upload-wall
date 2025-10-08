import express from "express";
import cors from "cors";
import multer from "multer";
import dotenv from "dotenv";
import fs from "fs";
import * as Storacha from "@storacha/client";

dotenv.config();

const app = express();
const upload = multer({ dest: "uploads/" });
app.use(cors());
const port = process.env.PORT || 8080;

// Set this to your actual space DID (from `storacha space ls`)
const SPACE_DID = "did:key:z6MkkFGCMJoTCadz935aWH1xDoyhyUFq6aUtzpbU9BFWacpG";

// Path to your authorized agent identity file
const AGENT_PATH = "./agent.json";

// POST /api/upload
app.post("/api/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ ok: false, error: "No file uploaded" });
    }

    // Load previously authorized agent
    const agent = await Storacha.Agent.load(AGENT_PATH);
    const client = await Storacha.create({ agent });

    // Set the current space you already authorized
    await client.setCurrentSpace(SPACE_DID);

    // Read uploaded file
    const fileBuffer = fs.readFileSync(req.file.path);
    const blob = new Blob([fileBuffer]);

    // Upload
    const result = await client.uploadFile(blob);

    // Clean up temp file
    fs.unlinkSync(req.file.path);

    res.json({
      ok: true,
      cid: result.toString(),
    });
  } catch (err: any) {
    console.error("❌ Upload failed:", err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.listen(port, () => {
  console.log(`🚀 UCAN Upload Wall backend running on port ${port}`);
});
