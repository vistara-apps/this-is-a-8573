import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { usePoll } from '../context/PollContext';
import { ExternalLink, Users, Calendar, Shield, Code } from 'lucide-react';

function PollView() {
  const { pollId } = useParams();
  const { getPoll, votePoll } = usePoll();
  const [poll, setPoll] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const foundPoll = getPoll(pollId);
    if (foundPoll) {
      setPoll(foundPoll);
    }
    
    // Simulate wallet connection check
    setIsConnected(true);
  }, [pollId, getPoll]);

  const handleVote = () => {
    if (selectedOption !== null && !hasVoted && isConnected) {
      votePoll(pollId, poll.options[selectedOption], 'demo-voter-address');
      setHasVoted(true);
      
      // Refresh poll data
      const updatedPoll = getPoll(pollId);
      setPoll(updatedPoll);
    }
  };

  const connectPhantom = () => {
    // Simulate Phantom wallet connection
    setIsConnected(true);
  };

  const getVotePercentage = (optionIndex) => {
    if (!poll || poll.totalVotes === 0) return 0;
    const votes = poll.votes[poll.options[optionIndex]] || 0;
    return Math.round((votes / poll.totalVotes) * 100);
  };

  const getVoteCount = (optionIndex) => {
    if (!poll) return 0;
    return poll.votes[poll.options[optionIndex]] || 0;
  };

  if (!poll) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-8 text-center">
          <h2 className="text-xl font-semibold text-white mb-2">Poll Not Found</h2>
          <p className="text-gray-300">The poll you're looking for doesn't exist or hasn't been deployed yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Poll Header */}
      <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-6 mb-8">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">{poll.question}</h1>
            <div className="flex items-center space-x-4 text-sm text-gray-300">
              <span className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                {new Date(poll.createdAt).toLocaleDateString()}
              </span>
              <span className="flex items-center">
                <Users className="w-4 h-4 mr-1" />
                {poll.totalVotes} votes
              </span>
              {poll.status === 'deployed' && (
                <span className="flex items-center text-green-400">
                  <Shield className="w-4 h-4 mr-1" />
                  Verified
                </span>
              )}
            </div>
          </div>
          
          {poll.programId && (
            <div className="text-right text-sm text-gray-400">
              <p>Program ID: {poll.programId}</p>
              {poll.metadataHash && (
                <button className="flex items-center text-purple-400 hover:text-purple-300 mt-1">
                  <ExternalLink className="w-3 h-3 mr-1" />
                  View Metadata
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Voting Interface */}
        <div className="lg:col-span-2">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Cast Your Vote</h2>
            
            {!isConnected ? (
              <div className="text-center py-8">
                <div className="bg-gradient-to-r from-purple-400 to-pink-400 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Code className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Connect Your Phantom Wallet</h3>
                <p className="text-gray-300 mb-6">Connect your wallet to participate in this verified poll</p>
                <button
                  onClick={connectPhantom}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-6 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
                >
                  Connect Phantom Wallet
                </button>
              </div>
            ) : hasVoted ? (
              <div className="text-center py-8">
                <div className="bg-green-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Vote Recorded!</h3>
                <p className="text-gray-300">Your vote has been recorded on the Solana blockchain</p>
              </div>
            ) : (
              <div className="space-y-4">
                {poll.options.map((option, index) => (
                  <div key={index} className="space-y-2">
                    <button
                      onClick={() => setSelectedOption(index)}
                      className={`w-full text-left p-4 rounded-lg border transition-all duration-200 ${
                        selectedOption === index
                          ? 'bg-purple-500/20 border-purple-500 text-white'
                          : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{option}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm">
                            {getVoteCount(index)} votes ({getVotePercentage(index)}%)
                          </span>
                          <div className="w-16 h-2 bg-gray-600 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-purple-400 to-pink-400 transition-all duration-300"
                              style={{ width: `${getVotePercentage(index)}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </button>
                  </div>
                ))}
                
                <button
                  onClick={handleVote}
                  disabled={selectedOption === null}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-6 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                >
                  Submit Vote
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Poll Information */}
        <div className="space-y-6">
          {/* Verification Status */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Verification Status</h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Smart Contract</span>
                <span className="text-green-400 text-sm">✓ Verified</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Build Metadata</span>
                <span className="text-green-400 text-sm">✓ Pinned</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Source Code</span>
                <span className="text-green-400 text-sm">✓ Available</span>
              </div>
            </div>

            {poll.gitRepo && (
              <a
                href={poll.gitRepo}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-full mt-4 p-2 bg-white/5 rounded-lg text-purple-400 hover:text-purple-300 text-sm transition-colors"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                View Source Code
              </a>
            )}
          </div>

          {/* Poll Statistics */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Statistics</h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Total Votes</span>
                <span className="text-white font-semibold">{poll.totalVotes}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Created</span>
                <span className="text-white text-sm">
                  {new Date(poll.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Creator</span>
                <span className="text-white text-xs font-mono">
                  {poll.creatorAddress.substring(0, 8)}...
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PollView;