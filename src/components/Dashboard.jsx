import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Vote, ExternalLink, Clock, User, BarChart } from 'lucide-react';
import Card from './ui/Card';
import Button from './ui/Button';
import VerificationBadge from './VerificationBadge';
import { usePoll } from '../context/PollContext';
import { useWalletContext } from '../context/WalletContext';

function Dashboard() {
  const { polls, loading, error } = usePoll();
  const { connected, connectWallet } = useWalletContext();
  const [filter, setFilter] = useState('all'); // 'all', 'draft', 'deployed'

  // Filter polls based on selected filter
  const filteredPolls = polls.filter(poll => {
    if (filter === 'all') return true;
    if (filter === 'draft') return poll.status === 'draft';
    if (filter === 'deployed') return poll.status === 'deployed';
    return true;
  });

  // If not connected, show connect prompt
  if (!connected) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-8 max-w-md w-full text-center">
          <Vote className="w-16 h-16 text-purple-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Welcome to VerifyVote</h2>
          <p className="text-gray-300 mb-6">
            Connect your wallet to create and manage verified Solana poll dApps.
          </p>
          <Button onClick={connectWallet} size="lg" fullWidth>
            Connect Wallet
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Your Polls</h1>
          <p className="text-gray-300">Create, deploy, and manage your Solana poll dApps</p>
        </div>
        <Link to="/create">
          <Button icon={<Plus className="w-4 h-4" />}>
            Create New Poll
          </Button>
        </Link>
      </div>

      <div className="flex space-x-2 mb-6">
        <Button
          variant={filter === 'all' ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => setFilter('all')}
        >
          All
        </Button>
        <Button
          variant={filter === 'draft' ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => setFilter('draft')}
        >
          Drafts
        </Button>
        <Button
          variant={filter === 'deployed' ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => setFilter('deployed')}
        >
          Deployed
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          <p className="text-red-400">{error}</p>
        </div>
      ) : filteredPolls.length === 0 ? (
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-8 text-center">
          <Vote className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No polls found</h3>
          <p className="text-gray-300 mb-6">
            {filter === 'all'
              ? "You haven't created any polls yet."
              : filter === 'draft'
              ? "You don't have any draft polls."
              : "You don't have any deployed polls."}
          </p>
          <Link to="/create">
            <Button>Create Your First Poll</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPolls.map(poll => (
            <Link
              key={poll.id}
              to={poll.status === 'deployed' ? `/poll/${poll.id}` : `/deploy/${poll.id}`}
              className="block"
            >
              <Card className="h-full transition-transform hover:scale-[1.02]">
                <Card.Header className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-white truncate">{poll.question}</h3>
                    <p className="text-sm text-gray-400">
                      {poll.options.length} options • {poll.totalVotes} votes
                    </p>
                  </div>
                  {poll.status === 'deployed' && (
                    <VerificationBadge isVerified={true} metadata={{ ipfsHash: poll.metadataHash }} />
                  )}
                </Card.Header>
                <Card.Content>
                  <div className="space-y-2 mb-4">
                    {poll.options.slice(0, 3).map(option => (
                      <div key={option} className="flex items-center">
                        <div className="w-full bg-white/5 rounded-full h-2 mr-2">
                          <div
                            className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                            style={{ width: `${poll.getOptionPercentage(option)}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-300 w-8 text-right">
                          {poll.getOptionPercentage(option)}%
                        </span>
                      </div>
                    ))}
                    {poll.options.length > 3 && (
                      <p className="text-xs text-gray-400 text-center">
                        +{poll.options.length - 3} more options
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <div className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      <span>
                        {poll.status === 'deployed'
                          ? `Deployed ${new Date(poll.deployedAt).toLocaleDateString()}`
                          : `Created ${new Date(poll.createdAt).toLocaleDateString()}`}
                      </span>
                    </div>
                    <div className="flex items-center">
                      {poll.status === 'deployed' ? (
                        <>
                          <BarChart className="w-3 h-3 mr-1" />
                          <span>{poll.totalVotes} votes</span>
                        </>
                      ) : (
                        <>
                          <User className="w-3 h-3 mr-1" />
                          <span>Draft</span>
                        </>
                      )}
                    </div>
                  </div>
                </Card.Content>
                <Card.Footer>
                  <Button
                    variant={poll.status === 'deployed' ? 'secondary' : 'primary'}
                    fullWidth
                    size="sm"
                    icon={
                      poll.status === 'deployed' ? (
                        <ExternalLink className="w-4 h-4" />
                      ) : (
                        <Vote className="w-4 h-4" />
                      )
                    }
                  >
                    {poll.status === 'deployed' ? 'View Poll' : 'Deploy Poll'}
                  </Button>
                </Card.Footer>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;

