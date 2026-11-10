# LegalConnect

A modern, responsive, 100% frontend-only Legal Aid and Law Firm Web Application built with React, TypeScript, Vite, and Tailwind CSS.

## Overview

LegalConnect is designed to bridge the gap between citizens requiring legal representation and verified legal practitioners. The entire application runs client-side on localhost with zero external backend or cloud database dependencies, utilizing browser `localStorage` and `IndexedDB` for high-performance persistence and privacy.

---

## Key Features

- **Citizen Portal**:
  - Secure local registration and authentication using PBKDF2 cryptographic hashing.
  - Submit pro-bono assistance applications and paid legal retainer matters.
  - Multi-document attachment handling stored directly in browser IndexedDB.
  - Real-time case tracking with auto-generated reference codes (e.g., `LC-YYYY-XXXX`).
  - Personal case management with strict account separation.

- **Legal Practitioner (Advocate) Portal**:
  - Advocate registration with Supreme Court Enrollment Number (SCN) and practice specialty.
  - Bar credential verification workflows.
  - Case assignment triage, status workflow management (`Pending Assignment` → `Under Review` → `Assigned` → `In Progress` → `In Court` → `Completed`).

- **Executive Super Administrator Control**:
  - One-time initial setup wizard locked against duplicate initialization.
  - Centralized legal service intake triage and case routing.
  - Real-time cross-tab updates using native storage and focus synchronization.
  - Bar credentials oversight and advocate verification.
  - Encrypted anonymous whistleblower reporting oversight.

- **Anonymous Whistleblower Reporting**:
  - Secure report submission with encrypted tracking identifiers.
  - Status tracking without requiring user registration or identity disclosure.

- **Security & Privacy First**:
  - 100% Client-Side / Frontend-Only architecture.
  - No external tracking, APIs, cloud auth, or remote database storage.
  - Passwords hashed using PBKDF2 with unique salts.

---

## Tech Stack

- **Framework**: React 19 + TypeScript
- **Bundler**: Vite
- **Styling**: Tailwind CSS v4
- **Routing**: React Router v7
- **Storage**: Browser LocalStorage & IndexedDB

---

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/<your-username>/LegalConnect.git
   cd LegalConnect
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:5173
   ```

---

## Scripts

- `npm run dev` - Start Vite development server
- `npm run build` - Build production bundle
- `npm run lint` - Run ESLint checks
- `npx jiti test-suite.mjs` - Run the automated logic & storage verification suite

---

## License

MIT License.
