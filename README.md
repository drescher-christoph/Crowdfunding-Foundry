# Crowdfunding-Foundry

A fullstack project for a crowdfunding platform on Ethereum, featuring a Solidity backend (Foundry) and a modern React frontend (Vite).

## Live-Preview: https://crowdfunding-foundry.vercel.app/

---

## Project Structure

```
Crowdfunding-Foundry/
│
├── backend/
│   ├── src/           # Solidity smart contracts
│   ├── script/        # Deployment & interaction scripts
│   ├── test/          # Unit and integration tests
│   ├── lib/           # Dependencies (OpenZeppelin, forge-std, foundry-devops)
│   ├── foundry.toml   # Foundry configuration
│   └── README.md      # Backend-specific notes
│
└── frontend/
    ├── src/           # React components, hooks, contexts, assets
    ├── public/        # Static files
    ├── index.html
    ├── vite.config.js # Vite configuration
    └── README.md      # (this document)
```

---

## Features

- **Smart Contracts:**  
  - Crowdfunding campaigns using the Factory pattern
  - Backers can fund projects and receive rewards
  - OpenZeppelin contracts for security and standardization

- **Frontend:**  
  - Modern UI with React, TailwindCSS, and Vite
  - Overview of campaigns, funding, rewards, and personal contributions
  - Wallet integration (e.g., MetaMask)

- **Testing & Development:**  
  - Foundry for fast compiling, testing, and deployment
  - Extensive unit and integration tests
  - Scripts for deployment and interaction

---

## Quick Start

### Prerequisites

- Node.js (recommended: >=18)
- npm or yarn
- [Foundry](https://book.getfoundry.sh/getting-started/installation)
- Git

### Backend (Smart Contracts)

```sh
cd backend
forge install
forge build
forge test
```

### Deployment

Adjust environment variables in `.env` and run:

```sh
forge script script/DeployCrowdfunding.s.sol --rpc-url <RPC_URL> --private-key <PRIVATE_KEY>
```

### Frontend (React)

```sh
cd frontend
npm install
npm run dev
```

Frontend runs by default at http://localhost:5173.

## Key Files & Folders

### `backend/src/`
Contains the Solidity smart contracts (`Crowdfunding.sol`, `CrowdfundingFactory.sol`).

### `backend/script/`
Deployment and interaction scripts (e.g., `DeployCrowdfunding.s.sol`).

### `frontend/src/`
React components, hooks, contexts, and assets.

### `frontend/constants.js`
Contains important addresses and configuration values for blockchain interaction.

## Useful Commands

### Backend

**Compile:**
```sh
forge build
```

**Test:**
```sh
forge test
```

**Format:**
```sh
forge fmt
```

**Local blockchain:**
```sh
anvil
```

### Frontend

**Start development:**
```sh
npm run dev
```

**Build for production:**
```sh
npm run build
```

**Linting:**
```sh
npm run lint
```

## Security & Best Practices

- Smart contracts use OpenZeppelin libraries for audited standards.
- Tests cover critical functions.
- Frontend validates user input and interacts securely with wallets.

## Further Links

- [Foundry Book](https://book.getfoundry.sh/)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts)
- [Vite](https://vitejs.dev/)
- [React](https://reactjs.org/)
