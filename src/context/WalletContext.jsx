import React, { createContext, useContext, useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';

const WalletContext = createContext();

export function useWalletContext() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWalletContext must be used within a WalletProvider');
  }
  return context;
}

export function WalletProvider({ children }) {
  const { 
    wallet, 
    publicKey, 
    connected, 
    connecting, 
    disconnect, 
    select, 
    connect,
    signTransaction,
    signAllTransactions,
  } = useWallet();
  
  const [connection, setConnection] = useState(null);
  const [network, setNetwork] = useState(WalletAdapterNetwork.Devnet);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initialize connection
  useEffect(() => {
    const conn = new Connection(clusterApiUrl(network), 'confirmed');
    setConnection(conn);
  }, [network]);

  // Fetch balance when connected
  useEffect(() => {
    const fetchBalance = async () => {
      if (connected && publicKey && connection) {
        try {
          setLoading(true);
          const bal = await connection.getBalance(publicKey);
          setBalance(bal / 1000000000); // Convert lamports to SOL
          setError(null);
        } catch (err) {
          console.error('Error fetching balance:', err);
          setError('Failed to fetch wallet balance');
        } finally {
          setLoading(false);
        }
      } else {
        setBalance(0);
      }
    };

    fetchBalance();
    
    // Set up balance refresh interval when connected
    let intervalId;
    if (connected && publicKey) {
      intervalId = setInterval(fetchBalance, 30000); // Refresh every 30 seconds
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [connected, publicKey, connection]);

  // Handle wallet selection
  const selectWallet = (walletName) => {
    try {
      select(walletName);
    } catch (err) {
      console.error('Error selecting wallet:', err);
      setError(`Failed to select wallet: ${err.message}`);
    }
  };

  // Handle wallet connection
  const connectWallet = async () => {
    try {
      setLoading(true);
      setError(null);
      await connect();
    } catch (err) {
      console.error('Error connecting wallet:', err);
      setError(`Failed to connect wallet: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Handle wallet disconnection
  const disconnectWallet = async () => {
    try {
      await disconnect();
      setError(null);
    } catch (err) {
      console.error('Error disconnecting wallet:', err);
      setError(`Failed to disconnect wallet: ${err.message}`);
    }
  };

  // Get shortened address for display
  const getShortAddress = () => {
    if (!publicKey) return '';
    const address = publicKey.toString();
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  return (
    <WalletContext.Provider
      value={{
        wallet,
        publicKey,
        connected,
        connecting,
        loading,
        error,
        balance,
        network,
        connection,
        signTransaction,
        signAllTransactions,
        selectWallet,
        connectWallet,
        disconnectWallet,
        getShortAddress,
        setNetwork,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export default WalletContext;

