# VerifyVote

Deploy verified Solana poll dApps and build trust with users.

## Overview

VerifyVote is a tool for developers to quickly deploy a Solana-powered poll dApp with on-chain verified code and a user-friendly React interface, connecting to Phantom wallets.

## Features

- **Anchor Program Boilerplate for Polls**: A pre-built, auditable Anchor (Rust) program for creating and managing polls, including voting mechanisms.
- **React UI Starter Kit with Phantom Integration**: A responsive React frontend that seamlessly connects to the Anchor program and integrates with the Phantom wallet for user interactions.
- **Streamlined Program Deployment**: A guided process for deploying the Anchor program to Solana Devnet, including generating necessary build metadata.
- **Verifiable Build Metadata Generation**: Generates metadata (e.g., Git commit hash, build artifacts) and pins it to IPFS/Arweave, linking it to the deployed program ID.
- **Phantom Wallet Integration**: Facilitates easy connection and transaction signing with the user's Phantom wallet.

## Getting Started

### Prerequisites

- Node.js (v16+)
- Rust and Solana CLI tools
- Phantom wallet browser extension

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/your-username/verify-vote.git
   cd verify-vote
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

## Usage

### Creating a Poll

1. Connect your Phantom wallet
2. Navigate to the "Create Poll" page
3. Enter your poll question and options
4. Click "Create Poll"

### Deploying a Poll

1. Select a poll from your dashboard
2. Click "Deploy Poll"
3. Follow the deployment steps
4. Pay the deployment fee
5. Share the poll URL with users

### Voting on a Poll

1. Open the poll URL
2. Connect your Phantom wallet
3. Select your preferred option
4. Click "Vote"
5. Approve the transaction in Phantom

## Architecture

VerifyVote consists of the following components:

- **Anchor Program**: Solana smart contract for poll creation and voting
- **React Frontend**: User interface for interacting with the program
- **Verification System**: Ensures the deployed code matches the source code
- **Wallet Integration**: Connects to Phantom wallet for transactions

## Business Model

- **Pay-per-deployment**: $5 for initial deployment, $2 for each subsequent verified code update
- **Optional Analytics**: $10/month for advanced analytics on poll engagement

## Documentation

For more detailed documentation, see the following:

- [API Documentation](docs/api.md)
- [Anchor Program Documentation](docs/anchor-program.md)
- [Wallet Integration Documentation](docs/wallet-integration.md)
- [Verification System Documentation](docs/verification-system.md)

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- Solana Foundation
- Anchor Framework
- Phantom Wallet
- IPFS and Arweave for decentralized storage

