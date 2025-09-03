import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';

// Import components
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import PollCreator from './components/PollCreator';
import DeploymentFlow from './components/DeploymentFlow';
import PollView from './components/PollView';

// Import contexts
import { WalletProvider as CustomWalletProvider } from './context/WalletContext';
import { PollProvider } from './context/PollContext';
import { PaymentProvider } from './hooks/usePaymentContext';

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
          <CustomWalletProvider>
            <PollProvider>
              <PaymentProvider>
                <Router>
                  <div className="min-h-screen bg-gradient-to-br from-gray-900 to-purple-900">
                    <Header />
                    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                      <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/create" element={<PollCreator />} />
                        <Route path="/deploy/:pollId" element={<DeploymentFlow />} />
                        <Route path="/poll/:pollId" element={<PollView />} />
                      </Routes>
                    </main>
                    <footer className="border-t border-white/10 py-6">
                      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <p className="text-center text-gray-400 text-sm">
                          &copy; {new Date().getFullYear()} VerifyVote. All rights reserved.
                        </p>
                      </div>
                    </footer>
                  </div>
                </Router>
              </PaymentProvider>
            </PollProvider>
          </CustomWalletProvider>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default App;

