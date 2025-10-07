import { useState } from "react";
import storachaLogo from "./assets/logo.webp";
import "./App.css";

function App() {
  const [files, setFiles] = useState<File[]>([]);
  const [cids, setCids] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFiles(Array.from(e.target.files));
  };

  const handleUpload = async () => {
    if (!files.length) return;
    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", files[0]);

      const response = await fetch("http://localhost:8080/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.ok && data.cid) {
        setCids((prev) => [data.cid, ...prev]);
        setFiles([]);
      } else throw new Error(data.error || "Upload failed");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <header className="topbar">
        <img src={storachaLogo} alt="Storacha Logo" className="logo" />
        <h1>UCAN Upload Wall</h1>
        <p className="subtitle">
          A minimal dApp powered by <strong>Storacha</strong> and{" "}
          <strong>UCAN</strong> — upload files without API keys, just delegated
          capabilities.
        </p>
      </header>

      <main className="main-section">
        <div className="upload-box">
          <div className="drop-area">
            <input type="file" onChange={handleFileChange} />
          </div>

          <button
            onClick={handleUpload}
            disabled={!files.length || loading}
            className="upload-btn"
          >
            {loading ? "⏳ Uploading..." : "🚀 Upload to Storacha"}
          </button>

          {error && <p className="error">{error}</p>}

          {cids.length > 0 && (
            <div className="results">
              <h3>Uploaded Files</h3>
              {cids.map((cid, i) => (
                <a
                  key={i}
                  href={`https://storacha.link/ipfs/${cid}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {cid}
                </a>
              ))}
            </div>
          )}
        </div>
      </main>

      <footer className="footer">
        <p>
          Built with 💜 by <strong>Fatuma Yattani</strong> · Powered by{" "}
          <strong>Storacha Network</strong> · UCAN Authorization
        </p>
      </footer>
    </div>
  );
}

export default App;
