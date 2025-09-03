import React from 'react';
import { Link } from 'react-router-dom';
import { usePoll } from '../context/PollContext';
import { Plus, Code, ExternalLink, Calendar, Users } from 'lucide-react';

function Dashboard() {
  const { polls } = usePoll();

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center py-12">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
          Deploy Verified
          <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            {" "}Solana Poll dApps
          </span>
        </h1>
        <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
          Build trust with users through on-chain verified code and seamless Phantom wallet integration
        </p>
        <Link 
          to="/create"
          className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105"
        >
          <Plus className="w-5 h-5 mr-2" />
          Create New Poll dApp
        </Link>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {[
          {
            icon: Code,
            title: "Anchor Program Boilerplate",
            description: "Pre-built, auditable Rust smart contracts"
          },
          {
            icon: Users,
            title: "React UI Starter Kit",
            description: "Responsive frontend with Phantom integration"
          },
          {
            icon: ExternalLink,
            title: "Streamlined Deployment",
            description: "One-click deployment to Solana Devnet"
          },
          {
            icon: Calendar,
            title: "Verifiable Metadata",
            description: "IPFS/Arweave pinned build artifacts"
          }
        ].map((feature, index) => (
          <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <feature.icon className="w-8 h-8 text-purple-400 mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
            <p className="text-gray-300 text-sm">{feature.description}</p>
          </div>
        ))}
      </div>

      {/* Polls List */}
      <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Your Poll dApps</h2>
          <Link 
            to="/create"
            className="btn-primary"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Poll
          </Link>
        </div>

        {polls.length === 0 ? (
          <div className="text-center py-12">
            <Code className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-300 mb-2">No polls created yet</h3>
            <p className="text-gray-400 mb-6">Create your first verified poll dApp to get started</p>
            <Link 
              to="/create"
              className="btn-primary"
            >
              Create Your First Poll
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {polls.map((poll) => (
              <div key={poll.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{poll.question}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-300 mt-2">
                      <span className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(poll.createdAt).toLocaleDateString()}
                      </span>
                      <span className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        {poll.totalVotes} votes
                      </span>
                      <span className={`px-2 py-1 rounded text-xs ${
                        poll.status === 'deployed' 
                          ? 'bg-green-500/20 text-green-300' 
                          : poll.status === 'deploying'
                          ? 'bg-yellow-500/20 text-yellow-300'
                          : 'bg-gray-500/20 text-gray-300'
                      }`}>
                        {poll.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {poll.status === 'draft' && (
                      <Link 
                        to={`/deploy/${poll.id}`}
                        className="btn-primary text-sm"
                      >
                        Deploy
                      </Link>
                    )}
                    <Link 
                      to={`/poll/${poll.id}`}
                      className="btn-secondary text-sm"
                    >
                      View
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;