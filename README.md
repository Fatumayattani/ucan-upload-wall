# 🪶 UCAN Upload Wall  
**A simple, UCAN-powered upload wall built on the Storacha Network**

<p align="center">
  <img src="https://storacha.network/assets/logo.svg" width="180" alt="Storacha Logo" />
</p>

---

## 🌐 Overview  

**UCAN Upload Wall** is a demo that showcases **User-Controlled Authorization Networks (UCANs)** in action through the [Storacha Network](https://storacha.network).  
It demonstrates how users can securely upload files using delegated capabilities — no API keys, no centralized tokens.  

This project has two parts:  
- **Server:** Handles UCAN delegation and uploads using `@storacha/client`  
- **Web:** Frontend interface for file uploads and listing (coming next)

---

## 🧩 Tech Stack  

| Layer | Stack |
|-------|-------|
| Authorization | UCAN (User Controlled Authorization Networks) |
| Network | Storacha Network |
| Backend | Node.js (TypeScript + Express + dotenv) |
| Frontend | React + Vite (TypeScript) |
| Storage | Filecoin via Storacha |
| Architecture | UCAN Delegation Flow |

---

## ⚙️ Setup & Run

### 🪄 Prerequisites
- Node.js ≥ 18  
- Storacha CLI  
  ```bash
  npm install -g @storacha/cli
````

* Storacha account & space

  ```bash
  storacha login
  storacha space create
  storacha space ls
  ```

---

### 🧱 Folder Structure

```
ucan-upload-wall/
 ├── server/
 │   ├── src/
 │   │   └── index.ts
 │   ├── package.json
 │   ├── tsconfig.json
 │   └── .env
 └── web/
```

---

## 🖥️ Server Setup

```bash
cd server
npm install
npm run dev
```

**.env example:**

```
KEY=<your-agent-private-key>
PROOF_B64=<your-delegation-proof-string>
PORT=8787
```

---

## 🧪 Test Upload

```bash
curl -X POST http://localhost:8787/api/upload
```

Expected response:

```json
{"ok": true, "cid": "bafybeigdg..."}
```

That CID is your uploaded file stored on Storacha, verified through UCAN authorization 🎉

---

## 🧠 Architecture & Flow

### 🔁 End-to-End Flow

1. **Space Creation:**
   You create a Storacha space (`storacha space create`) that acts as your namespace for data.

2. **UCAN Delegation:**
   The space delegates upload permissions to your backend agent.
   This creates a signed UCAN proof (`space-proof.car`).

3. **Server Invocation:**
   The backend reads that proof and uses `@storacha/client` to perform an authorized upload.

4. **Frontend Upload:**
   The web client sends files to the backend’s `/api/upload` endpoint.

5. **Verification:**
   The backend’s UCAN proof is verified by the Storacha network before allowing the upload.

6. **File Storage:**
   The file is stored on Filecoin (via Storacha), and a **content address (CID)** is returned.

7. **Result Display:**
   The frontend displays the CID, linking users directly to their uploaded file.

---

### 🧭 Architecture Diagram

```mermaid
graph TD
  subgraph User
    A[User Browser / Web App]
  end

  subgraph Backend
    B[Express Server]
    B1[UCAN Proof (.car)]
  end

  subgraph Storacha
    C[Storacha Network]
    D[Filecoin Storage]
  end

  subgraph Identity
    E[UCAN Agent (DID)]
    F[Storacha Space (Namespace)]
  end

  A -->|Uploads File| B
  B -->|Uses Proof| B1
  B1 -->|Delegation Validation| C
  C -->|UCAN Authorized Upload| D
  D -->|Returns CID| C
  C -->|Response| B
  B -->|CID JSON| A

  E -->|Delegation| F
  F -->|Proof Stored| B1
```

---

## 🔑 Key Concepts

| Concept         | Description                                                             |
| --------------- | ----------------------------------------------------------------------- |
| **UCAN**        | User-Controlled Authorization Network – capability-based access control |
| **Delegation**  | A signed UCAN granting capabilities from one actor to another           |
| **Agent**       | Entity with a keypair authorized to invoke UCAN-based operations        |
| **Space**       | Your Storacha namespace where data lives                                |
| **Proof (CAR)** | Encoded UCAN chain proving capability delegation                        |

---

## 🚀 Features

* ✅ UCAN-based authentication (no bearer tokens)
* ✅ Storacha client integration
* ✅ Upload endpoint returning CIDs
* ✅ TypeScript + Express backend
* 🧩 Frontend (Upload Wall UI) coming next

---

## 🧰 Roadmap

* [x] Backend UCAN-enabled upload
* [ ] React frontend for uploads
* [ ] List uploaded CIDs per space
* [ ] Authentication via Storacha login
* [ ] Deploy demo on Netlify + Render

---

## 🧑‍💻 Contributors

| Name                                                   | Role                             |
| ------------------------------------------------------ | -------------------------------- |
| [**Fatuma Yattani**](https://github.com/Fatumayattani) | Lead Developer                   |
| Storacha PLDG Community                                | UCAN Debugging & Tooling Support |

---

## 🌍 Links

* [Storacha Documentation](https://docs.storacha.network/concepts/ucan/)
* [UCAN Specification](https://github.com/ucan-wg/spec)
* [Storacha GitHub](https://github.com/storacha)

---

## 🪴 License

MIT © 2025 [Fatuma Yattani](https://github.com/Fatumayattani)


