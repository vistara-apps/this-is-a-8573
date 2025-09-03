# VerifyVote Wallet Integration Documentation

This document provides detailed information about integrating Phantom wallet with VerifyVote, including connection, transaction signing, and best practices.

## Overview

VerifyVote uses the Phantom wallet for Solana blockchain interactions. The wallet integration enables:

- User authentication
- Transaction signing for poll creation and voting
- Payment processing

## Setup

### Dependencies

To integrate Phantom wallet, you need to install the following dependencies:

```bash
npm install @solana/web3.js @solana/wallet-adapter-react @solana/wallet-adapter-react-ui @solana/wallet-adapter-wallets
```

### Initialization

Initialize the wallet adapter in your React application:

```jsx
import React from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';

// Import styles
import '@solana/wallet-adapter-react-ui/styles.css';

function App() {
  // Set up Solana network and wallet
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = clusterApiUrl(network);
  const wallets = [new PhantomWalletAdapter()];

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          {/* Your app content */}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default App;
```

## Wallet Context

VerifyVote provides a custom wallet context that wraps the Solana wallet adapter and adds additional functionality:

```jsx
import { useWalletContext } from '../context/WalletContext';

function MyComponent() {
  const {
    connected,
    connecting,
    publicKey,
    balance,
    connectWallet,
    disconnectWallet,
    signTransaction,
    getShortAddress,
  } = useWalletContext();

  return (
    <div>
      {connected ? (
        <div>
          <p>Connected as {getShortAddress()}</p>
          <p>Balance: {balance} SOL</p>
          <button onClick={disconnectWallet}>Disconnect</button>
        </div>
      ) : (
        <button onClick={connectWallet} disabled={connecting}>
          {connecting ? 'Connecting...' : 'Connect Wallet'}
        </button>
      )}
    </div>
  );
}
```

## Wallet Connection

### Connecting to Wallet

To connect to the Phantom wallet:

```jsx
const { connectWallet, connected, connecting } = useWalletContext();

// In your component
<button onClick={connectWallet} disabled={connecting || connected}>
  {connecting ? 'Connecting...' : 'Connect Wallet'}
</button>
```

### Disconnecting from Wallet

To disconnect from the Phantom wallet:

```jsx
const { disconnectWallet } = useWalletContext();

// In your component
<button onClick={disconnectWallet}>
  Disconnect
</button>
```

## Transaction Signing

### Signing a Transaction

To sign a transaction:

```jsx
import { Transaction, SystemProgram } from '@solana/web3.js';
import { useWalletContext } from '../context/WalletContext';

function TransactionComponent() {
  const { publicKey, connection, signTransaction } = useWalletContext();

  const handleTransaction = async () => {
    try {
      // Create a new transaction
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: destinationPublicKey,
          lamports: 1000000, // 0.001 SOL
        })
      );

      // Get the latest blockhash
      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;

      // Sign the transaction
      const signedTransaction = await signTransaction(transaction);

      // Send the transaction
      const signature = await connection.sendRawTransaction(
        signedTransaction.serialize()
      );

      // Confirm the transaction
      await connection.confirmTransaction(signature);

      console.log('Transaction confirmed:', signature);
    } catch (error) {
      console.error('Transaction error:', error);
    }
  };

  return (
    <button onClick={handleTransaction}>
      Send Transaction
    </button>
  );
}
```

### Signing Multiple Transactions

To sign multiple transactions:

```jsx
const { signAllTransactions } = useWalletContext();

// Sign multiple transactions
const signedTransactions = await signAllTransactions(transactions);
```

## Wallet Button Component

VerifyVote provides a pre-built `WalletConnectButton` component:

```jsx
import WalletConnectButton from './components/WalletConnectButton';

function Header() {
  return (
    <header>
      <div className="logo">VerifyVote</div>
      <nav>
        {/* Navigation links */}
      </nav>
      <WalletConnectButton />
    </header>
  );
}
```

## Wallet Events

You can listen for wallet events using the wallet context:

```jsx
import { useEffect } from 'react';
import { useWalletContext } from '../context/WalletContext';

function WalletListener() {
  const { connected, publicKey } = useWalletContext();

  useEffect(() => {
    if (connected && publicKey) {
      console.log('Wallet connected:', publicKey.toString());
      // Perform actions when wallet is connected
    } else {
      console.log('Wallet disconnected');
      // Perform actions when wallet is disconnected
    }
  }, [connected, publicKey]);

  return null;
}
```

## Error Handling

The wallet context provides error handling:

```jsx
const { error } = useWalletContext();

// In your component
{error && (
  <div className="error-message">
    {error}
  </div>
)}
```

## Balance Tracking

The wallet context automatically tracks the user's SOL balance:

```jsx
const { balance } = useWalletContext();

// In your component
<div className="balance">
  {balance.toFixed(2)} SOL
</div>
```

## Network Selection

You can change the Solana network:

```jsx
const { network, setNetwork } = useWalletContext();

// Change to mainnet
setNetwork(WalletAdapterNetwork.Mainnet);
```

## Best Practices

### Security

- Never store private keys or sensitive information in client-side code
- Always validate transactions on the server side
- Use PDAs (Program Derived Addresses) for secure account creation
- Implement proper error handling for wallet operations

### User Experience

- Provide clear feedback during wallet connection and transaction signing
- Display transaction details before requesting signature
- Show loading indicators during blockchain operations
- Handle wallet disconnection gracefully

### Performance

- Minimize the number of blockchain calls
- Use connection pooling for RPC requests
- Implement caching for frequently accessed data
- Use batch processing for multiple transactions

## Troubleshooting

### Common Issues

1. **Wallet not detected**
   - Ensure Phantom wallet extension is installed
   - Check if the wallet is unlocked

2. **Transaction errors**
   - Verify the user has sufficient SOL for the transaction
   - Check if the blockhash is recent
   - Ensure all required signers have signed the transaction

3. **Connection issues**
   - Verify the RPC endpoint is accessible
   - Check network connectivity
   - Try using a different RPC provider

### Debugging

Enable debug logging for wallet operations:

```javascript
// In your development environment
localStorage.setItem('debug', '@solana/wallet-adapter:*');
```

## Examples

### Complete Wallet Integration Example

```jsx
import React, { useEffect } from 'react';
import { useWalletContext } from '../context/WalletContext';

function WalletIntegration() {
  const {
    connected,
    connecting,
    publicKey,
    balance,
    error,
    connectWallet,
    disconnectWallet,
    getShortAddress,
  } = useWalletContext();

  useEffect(() => {
    if (connected && publicKey) {
      console.log('Wallet connected:', publicKey.toString());
      // Fetch user data or perform other actions
    }
  }, [connected, publicKey]);

  return (
    <div className="wallet-integration">
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {connected ? (
        <div className="wallet-info">
          <p>Connected as {getShortAddress()}</p>
          <p>Balance: {balance.toFixed(2)} SOL</p>
          <button onClick={disconnectWallet}>
            Disconnect
          </button>
        </div>
      ) : (
        <button
          onClick={connectWallet}
          disabled={connecting}
          className="connect-button"
        >
          {connecting ? 'Connecting...' : 'Connect Wallet'}
        </button>
      )}
    </div>
  );
}

export default WalletIntegration;
```

## Resources

- [Phantom Wallet Documentation](https://docs.phantom.app/)
- [Solana Wallet Adapter Documentation](https://github.com/solana-labs/wallet-adapter)
- [Solana Web3.js Documentation](https://solana-labs.github.io/solana-web3.js/)

