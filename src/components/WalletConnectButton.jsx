import React, { useState } from 'react';
import { Wallet, LogOut, ChevronDown, ChevronUp, Copy, ExternalLink } from 'lucide-react';
import { useWalletContext } from '../context/WalletContext';

function WalletConnectButton() {
  const { 
    connected, 
    connecting, 
    loading, 
    error, 
    balance, 
    connectWallet, 
    disconnectWallet, 
    getShortAddress,
    publicKey
  } = useWalletContext();
  
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const copyAddress = () => {
    if (publicKey) {
      navigator.clipboard.writeText(publicKey.toString());
      // Could add a toast notification here
    }
  };

  const viewOnExplorer = () => {
    if (publicKey) {
      window.open(`https://explorer.solana.com/address/${publicKey.toString()}?cluster=devnet`, '_blank');
    }
  };

  if (!connected) {
    return (
      <button
        onClick={connectWallet}
        disabled={connecting || loading}
        className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-300 disabled:opacity-70"
      >
        {connecting || loading ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
            Connecting...
          </>
        ) : (
          <>
            <Wallet className="w-4 h-4 mr-2" />
            Connect Wallet
          </>
        )}
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-lg hover:bg-white/20 transition-colors"
      >
        <Wallet className="w-4 h-4 mr-2" />
        <span className="mr-2">{getShortAddress()}</span>
        <span className="text-xs bg-green-500/20 text-green-300 px-2 py-0.5 rounded mr-2">
          {balance.toFixed(2)} SOL
        </span>
        {dropdownOpen ? (
          <ChevronUp className="w-4 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        )}
      </button>

      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-10 overflow-hidden">
          <div className="p-3 border-b border-gray-700">
            <p className="text-sm text-gray-400">Connected as</p>
            <p className="text-white font-medium truncate">{getShortAddress()}</p>
          </div>
          
          <div className="p-2">
            <button
              onClick={copyAddress}
              className="flex items-center w-full px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded-md transition-colors"
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy Address
            </button>
            
            <button
              onClick={viewOnExplorer}
              className="flex items-center w-full px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded-md transition-colors"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              View on Explorer
            </button>
            
            <button
              onClick={disconnectWallet}
              className="flex items-center w-full px-3 py-2 text-sm text-red-400 hover:bg-gray-700 rounded-md transition-colors"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Disconnect
            </button>
          </div>
        </div>
      )}
      
      {error && (
        <div className="absolute right-0 mt-2 p-2 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}
    </div>
  );
}

export default WalletConnectButton;

