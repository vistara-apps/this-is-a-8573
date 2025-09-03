import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Share2, ExternalLink, Info, Check } from 'lucide-react';
import Card from './ui/Card';
import Button from './ui/Button';
import Tooltip from './ui/Tooltip';
import VerificationBadge from './VerificationBadge';
import { usePoll } from '../context/PollContext';
import { useWalletContext } from '../context/WalletContext';
import api from '../api';

function PollView() {
  const { pollId } = useParams();
  const navigate = useNavigate();
  const { getPoll, votePoll } = usePoll();
  const { connected, connectWallet, publicKey } = useWalletContext();
  
  const [poll, setPoll] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [voteSuccess, setVoteSuccess] = useState(false);
  const [error, setError] = useState(null);
  
  // Load poll data
  useEffect(() => {
    const loadPoll = () => {
      const pollData = getPoll(pollId);
      if (pollData) {
        setPoll(pollData);
      } else {
        setError('Poll not found');
      }
    };

    loadPoll();
  }, [pollId, getPoll]);

  // Check if user has voted
  useEffect(() => {
    const checkVoteStatus = async () => {
      if (connected && publicKey && poll && api.initialized) {
        try {
          const pollService = api.getPollService();
          const voted = await pollService.hasVoted(pollId, publicKey.toString());
          setHasVoted(voted);
        } catch (err) {
          console.error('Error checking vote status:', err);
        }
      }
    };

    checkVoteStatus();
  }, [connected, publicKey, poll, pollId]);

  // Handle option selection
  const handleOptionSelect = (option) => {
    if (!hasVoted && !loading) {
      setSelectedOption(option);
    }
  };

  // Handle vote submission
  const handleVote = async () => {
    if (!connected) {
      await connectWallet();
      return;
    }
    
    if (!selectedOption || hasVoted || loading) {
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Submit vote
      await votePoll(pollId, selectedOption, publicKey.toString());
      
      // Show success message
      setVoteSuccess(true);
      setHasVoted(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setVoteSuccess(false);
      }, 3000);
    } catch (err) {
      console.error('Error voting:', err);
      setError('Failed to submit vote. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle share
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: poll.question,
        text: `Vote on "${poll.question}" - VerifyVote Poll`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      // Could add a toast notification here
    }
  };

  if (!poll) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Button
        variant="ghost"
        onClick={() => navigate('/')}
        className="mb-6"
        icon={<ArrowLeft className="w-4 h-4" />}
      >
        Back to Dashboard
      </Button>
      
      <Card>
        <Card.Header className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">{poll.question}</h2>
            <p className="text-gray-400 mt-1">
              {poll.totalVotes} {poll.totalVotes === 1 ? 'vote' : 'votes'}
            </p>
          </div>
          <VerificationBadge isVerified={true} metadata={{ ipfsHash: poll.metadataHash }} />
        </Card.Header>
        
        <Card.Content>
          <div className="space-y-3 mb-6">
            {poll.options.map((option) => (
              <div
                key={option}
                className={`relative border rounded-lg p-4 transition-colors cursor-pointer ${
                  selectedOption === option
                    ? 'border-purple-500 bg-purple-500/10'
                    : hasVoted
                    ? 'border-white/10 bg-white/5'
                    : 'border-white/10 bg-white/5 hover:border-white/30'
                }`}
                onClick={() => handleOptionSelect(option)}
              >
                <div className="flex items-center justify-between">
                  <span className="text-white">{option}</span>
                  <span className="text-gray-400 text-sm">{poll.getOptionPercentage(option)}%</span>
                </div>
                
                <div className="mt-2 bg-white/10 rounded-full h-2 w-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${poll.getOptionPercentage(option)}%` }}
                  ></div>
                </div>
                
                {poll.votes[option] > 0 && (
                  <div className="absolute right-2 top-2 text-xs bg-white/10 rounded-full px-2 py-0.5 text-gray-300">
                    {poll.votes[option]} {poll.votes[option] === 1 ? 'vote' : 'votes'}
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {voteSuccess && (
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 mb-4 flex items-center">
              <Check className="w-4 h-4 text-green-400 mr-2" />
              <p className="text-sm text-green-400">Your vote has been recorded!</p>
            </div>
          )}
          
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-4">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}
          
          <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
            <div className="flex items-center">
              <Info className="w-4 h-4 mr-1" />
              <span>
                {hasVoted
                  ? 'You have already voted'
                  : 'Select an option to vote'}
              </span>
            </div>
            
            {poll.programId && (
              <Tooltip content="View on Solana Explorer" position="top">
                <a
                  href={`https://explorer.solana.com/address/${poll.programId}?cluster=devnet`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-400 hover:text-purple-300 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </Tooltip>
            )}
          </div>
        </Card.Content>
        
        <Card.Footer className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            onClick={handleShare}
            className="sm:flex-1"
            icon={<Share2 className="w-4 h-4" />}
          >
            Share Poll
          </Button>
          
          <Button
            onClick={handleVote}
            disabled={!selectedOption || hasVoted || loading}
            loading={loading}
            className="sm:flex-1"
          >
            {!connected
              ? 'Connect Wallet to Vote'
              : hasVoted
              ? 'Already Voted'
              : 'Submit Vote'}
          </Button>
        </Card.Footer>
      </Card>
    </div>
  );
}

export default PollView;

