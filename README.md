# 🔐 UCAN Upload Wall

A modern, decentralized file upload application powered by **User-Controlled Authorization Networks (UCANs)** and the **Storacha Network**. This project demonstrates how to build secure, token-free file storage using capability-based authorization instead of traditional API keys.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/react-18.3.1-61dafb.svg)
![TypeScript](https://img.shields.io/badge/typescript-5.5.3-3178c6.svg)
![Vite](https://img.shields.io/badge/vite-5.4.2-646cff.svg)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [How It Works](#how-it-works)
- [UCAN Flow Diagram](#ucan-flow-diagram)
- [Component Architecture](#component-architecture)
- [Development](#development)
- [Security](#security)
- [Contributing](#contributing)
- [Resources](#resources)
- [License](#license)

---

## 🌐 Overview

UCAN Upload Wall is a demonstration of decentralized file storage using **User-Controlled Authorization Networks (UCANs)**. Instead of relying on centralized API keys or bearer tokens, this application uses cryptographic capabilities to securely delegate upload permissions.

Files uploaded through this interface are stored on **Filecoin** via the **Storacha Network**, ensuring permanent, verifiable, and decentralized storage.

### What Makes This Different?

- **No API Keys**: Authorization is handled through UCAN proofs
- **Decentralized**: Files are stored on Filecoin via Storacha
- **Capability-Based**: Fine-grained permission delegation
- **Content Addressing**: Each file gets a unique CID (Content Identifier)
- **Cryptographically Secure**: All permissions are verified through UCAN chains

---

## ✨ Key Features

- 🎯 **Drag & Drop Upload**: Intuitive file upload interface
- 🔗 **Content Addressing**: Every file gets a unique CID
- 📋 **Upload History**: Track all uploaded files
- 📎 **Easy Sharing**: Copy CID or view files via IPFS gateway
- 🎨 **Modern UI**: Clean, responsive design with Tailwind CSS
- ⚡ **Fast**: Built with Vite for optimal performance
- 🔒 **UCAN Authorization**: Secure, token-free authentication
- 📱 **Responsive**: Works seamlessly on all devices

---

## 🏗️ Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        User Browser                         │
│                     (React + Vite App)                      │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ HTTP Request (FormData)
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                    Backend Server                           │
│              (Express + TypeScript)                         │
│                                                             │
│  ┌──────────────────────────────────────────────┐          │
│  │         UCAN Agent (DID + Private Key)        │          │
│  └──────────────────────────────────────────────┘          │
│                       │                                     │
│  ┌──────────────────────────────────────────────┐          │
│  │      Delegation Proof (space-proof.car)      │          │
│  │    Grants upload capabilities to agent      │          │
│  └──────────────────────────────────────────────┘          │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ UCAN Invocation
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                   Storacha Network                          │
│                                                             │
│  ┌────────────────────────────────────┐                    │
│  │   1. Validate UCAN Proof           │                    │
│  │   2. Verify Delegation Chain       │                    │
│  │   3. Check Capabilities            │                    │
│  └────────────────────────────────────┘                    │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ Store File
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                   Filecoin Storage                          │
│              (Permanent, Decentralized)                     │
│                                                             │
│           Returns: CID (Content Identifier)                 │
└─────────────────────────────────────────────────────────────┘
```

### UCAN Authorization Flow

```
┌──────────────┐
│  User Space  │  (Your Storacha namespace)
│   (DID:key)  │
└──────┬───────┘
       │
       │ Creates Delegation
       │ (storacha space create)
       ▼
┌─────────────────────────────────────────┐
│      UCAN Delegation Proof (.car)       │
│                                         │
│  Capabilities:                          │
│  - space/blob/add                       │
│  - store/add                            │
│  - upload/add                           │
│                                         │
│  Audience: Backend Agent DID            │
│  Expiration: Time-limited               │
└──────────────┬──────────────────────────┘
               │
               │ Agent Reads Proof
               ▼
┌─────────────────────────────────────────┐
│         Backend Agent                   │
│   Authorized to Upload on Your Behalf  │
└──────────────┬──────────────────────────┘
               │
               │ Invokes Upload
               ▼
┌─────────────────────────────────────────┐
│       Storacha Network                  │
│   Validates UCAN Chain & Executes       │
└─────────────────────────────────────────┘
```

---


## 📁 Project Structure

```
ucan-upload-wall/
├── src/
│   ├── components/
│   │   ├── Alert.tsx           # Toast notifications
│   │   ├── FileList.tsx        # Display uploaded files
│   │   ├── Header.tsx          # App header
│   │   └── UploadZone.tsx      # Drag & drop upload UI
│   │
│   ├── hooks/
│   │   └── useFileUpload.ts    # Upload logic & state
│   │
│   ├── types/
│   │   └── upload.ts           # TypeScript interfaces
│   │
│   ├── App.tsx                 # Main application
│   ├── main.tsx                # Entry point
│   └── index.css               # Global styles
│
├── public/                      # Static assets
├── dist/                        # Production build
│
├── .env                         # Environment variables
├── package.json                 # Dependencies
├── tsconfig.json                # TypeScript config
├── tailwind.config.js           # Tailwind config
├── vite.config.ts               # Vite config
└── README.md                    # This file
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18.x
- **npm** or **yarn**
- Backend server running on `http://localhost:8787`

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/Fatumayattani/ucan-upload-wall.git
cd ucan-upload-wall
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

The project uses Supabase for potential data persistence (optional):

```bash
# .env

```

4. **Start development server**

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Backend Setup

This frontend requires a backend server.

```bash
cd ../server
npm install
npm run dev  # Runs on http://localhost:8787
```

---

## 🔄 How It Works

### 1. User Interaction

The user drags and drops a file or clicks to select one from their device.

### 2. Frontend Preparation

The `useFileUpload` hook prepares the file and sends it to the backend via `FormData`:

```typescript
const formData = new FormData();
formData.append('file', file);

const response = await fetch('http://localhost:8787/api/upload', {
  method: 'POST',
  body: formData,
});
```

### 3. Backend Processing

The backend server:
1. Receives the file
2. Loads the UCAN delegation proof
3. Creates a Storacha client with the proof
4. Invokes the upload capability
5. Returns the CID (Content Identifier)

### 4. UCAN Validation

Storacha Network validates:
- The UCAN proof signature
- The delegation chain
- The requested capability (upload permission)
- The proof expiration

### 5. Storage

If validated, the file is:
- Stored on Filecoin
- Assigned a unique CID
- Made available via IPFS gateways

### 6. Response

The frontend receives the CID and:
- Displays it in the file list
- Provides copy and view options
- Shows success notification

---

## 📊 UCAN Flow Diagram

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Backend
    participant Storacha
    participant Filecoin

    User->>Frontend: Select/Drop File
    Frontend->>Frontend: Validate File
    Frontend->>Backend: POST /api/upload (FormData)
    Backend->>Backend: Load UCAN Proof
    Backend->>Backend: Initialize Storacha Client
    Backend->>Storacha: Invoke Upload (with UCAN)
    Storacha->>Storacha: Validate UCAN Chain
    Storacha->>Storacha: Verify Capabilities
    Storacha->>Filecoin: Store File
    Filecoin-->>Storacha: Return CID
    Storacha-->>Backend: Upload Success + CID
    Backend-->>Frontend: { ok: true, cid: "bafybeig..." }
    Frontend->>Frontend: Add to Upload List
    Frontend->>User: Show Success + CID
```

---

## 🧩 Component Architecture

### Component Hierarchy

```
App
├── Header
├── UploadZone
│   ├── Drag & Drop Area
│   ├── File Preview
│   └── Upload Button
├── FileList
│   └── FileCard (multiple)
│       ├── File Info
│       ├── CID Display
│       ├── Copy Button
│       └── View Link
└── Alert (conditional)
```

### Component Responsibilities

#### `App.tsx`
- Main application state
- Coordinates file uploads
- Manages alert notifications
- Passes data to child components

#### `Header.tsx`
- Displays app title and description
- Consistent branding

#### `UploadZone.tsx`
- Handles drag & drop events
- File selection UI
- Upload trigger
- Loading states

#### `FileList.tsx`
- Displays uploaded files
- Shows CID with copy functionality
- Provides IPFS gateway links
- Formats file sizes and dates

#### `Alert.tsx`
- Toast notifications
- Success/error messages
- Auto-dismiss functionality

#### `useFileUpload.ts`
- Encapsulates upload logic
- Manages upload state
- Error handling
- API communication

---

## 💻 Development

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript type checking |

### Development Workflow

1. **Start the backend server** (port 8787)
2. **Start the frontend dev server** (`npm run dev`)
3. **Make changes** - Vite provides hot module replacement
4. **Type check** - `npm run typecheck`
5. **Build** - `npm run build`

### Environment Variables

Create a `.env` file in the root:

```bash
```

## 🔒 Security

### UCAN Benefits

- **No API Keys in Frontend**: All authorization is handled via UCAN proofs on the backend
- **Fine-Grained Permissions**: Delegate only specific capabilities (upload, read, etc.)
- **Time-Limited**: UCAN proofs can expire
- **Revocable**: Permissions can be revoked
- **Cryptographically Secure**: Based on public-key cryptography

### Best Practices

1. **Never expose private keys** in the frontend
2. **Keep UCAN proofs secure** on the backend
3. **Validate all file uploads** before sending to backend
4. **Use HTTPS** in production
5. **Implement rate limiting** on the backend
6. **Set appropriate CORS policies**

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style
- Write TypeScript with proper types
- Test your changes thoroughly
- Update documentation as needed
- Keep components small and focused

---

## 📚 Resources

### UCAN & Storacha

- [Storacha Documentation](https://docs.storacha.network/)
- [UCAN Specification](https://github.com/ucan-wg/spec)
- [Storacha GitHub](https://github.com/storacha)
- [UCAN Working Group](https://github.com/ucan-wg)

### Technologies

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [IPFS Documentation](https://docs.ipfs.tech/)
- [Filecoin Documentation](https://docs.filecoin.io/)

### Related Projects

- [w3up](https://github.com/web3-storage/w3up) - Storacha client libraries
- [ucanto](https://github.com/web3-storage/ucanto) - UCAN implementation

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Contributors

| Name | Role | GitHub |
|------|------|--------|
| **Fatuma Yattani** | Lead Developer | [@Fatumayattani](https://github.com/Fatumayattani) |
| Storacha PLDG Community | Support & Guidance | - |

---

## 🌟 Acknowledgments

- **Storacha Team** for building an amazing UCAN-based storage platform
- **UCAN Working Group** for the specification
- **IPFS & Filecoin** communities for decentralized storage infrastructure
- **React & Vite** teams for excellent developer tools

---

## 📧 Contact

For questions, feedback, or support:

- Open an issue on GitHub
- Join the [Storacha Discord](https://discord.gg/storacha)
- Follow [@Storacha on Twitter](https://twitter.com/storacha)

---

