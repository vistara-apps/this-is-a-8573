import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Code, Vote, Zap } from 'lucide-react';

function Header() {
  const location = useLocation();

  return (
    <header className="bg-black/20 backdrop-blur-sm border-b border-white/10">
      <div className="container mx-auto px-4 py-4 max-w-7xl">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-purple-400 to-pink-400 p-2 rounded-lg">
              <Vote className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">VerifyVote</h1>
              <p className="text-sm text-gray-300">Deploy verified Solana poll dApps</p>
            </div>
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              to="/" 
              className={`text-sm font-medium transition-colors ${
                location.pathname === '/' ? 'text-white' : 'text-gray-300 hover:text-white'
              }`}
            >
              Dashboard
            </Link>
            <Link 
              to="/create" 
              className={`text-sm font-medium transition-colors ${
                location.pathname === '/create' ? 'text-white' : 'text-gray-300 hover:text-white'
              }`}
            >
              Create Poll
            </Link>
          </nav>

          <ConnectButton />
        </div>
      </div>
    </header>
  );
}

export default Header;