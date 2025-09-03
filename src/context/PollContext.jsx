import React, { createContext, useContext, useState, useEffect } from 'react';
import { Poll } from '../models/Poll';
import { Vote } from '../models/Vote';
import { useWalletContext } from './WalletContext';
import api from '../api';

const PollContext = createContext();

export function usePoll() {
  const context = useContext(PollContext);
  if (!context) {
    throw new Error('usePoll must be used within a PollProvider');
  }
  return context;
}

export function PollProvider({ children }) {
  const { connected, publicKey } = useWalletContext();
  const [polls, setPolls] = useState([]);
  const [currentPoll, setCurrentPoll] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load polls when wallet is connected
  useEffect(() => {
    const loadPolls = async () => {
      if (connected && publicKey && api.initialized) {
        try {
          setLoading(true);
          setError(null);
          
          const pollService = api.getPollService();
          const userPolls = await pollService.fetchPollsByCreator(publicKey.toString());
          
          setPolls(userPolls);
        } catch (err) {
          console.error('Error loading polls:', err);
          setError('Failed to load polls. Please try again.');
        } finally {
          setLoading(false);
        }
      } else {
        // Reset polls when disconnected
        setPolls([]);
        setCurrentPoll(null);
      }
    };

    loadPolls();
  }, [connected, publicKey]);

  const createPoll = (pollData) => {
    try {
      const creatorAddress = publicKey ? publicKey.toString() : 'demo-address';
      const newPoll = Poll.create(pollData, creatorAddress);
      
      setPolls(prev => [...prev, newPoll]);
      setCurrentPoll(newPoll);
      
      return newPoll;
    } catch (err) {
      console.error('Error creating poll:', err);
      setError('Failed to create poll. Please try again.');
      throw err;
    }
  };

  const updatePoll = (pollId, updates) => {
    try {
      setPolls(prev => 
        prev.map(poll => 
          poll.id === pollId ? { ...poll, ...updates } : poll
        )
      );
      
      if (currentPoll?.id === pollId) {
        setCurrentPoll(prev => ({ ...prev, ...updates }));
      }
    } catch (err) {
      console.error('Error updating poll:', err);
      setError('Failed to update poll. Please try again.');
      throw err;
    }
  };

  const votePoll = async (pollId, option, voterAddress) => {
    try {
      const poll = polls.find(p => p.id === pollId);
      if (!poll) throw new Error('Poll not found');
      
      const optionIndex = poll.options.indexOf(option);
      if (optionIndex === -1) throw new Error('Invalid option');
      
      // Create vote record
      const vote = Vote.create(pollId, voterAddress, option, optionIndex);
      
      // Update poll votes
      const newVotes = { ...poll.votes };
      if (!newVotes[option]) newVotes[option] = 0;
      newVotes[option]++;
      
      const updatedPoll = {
        ...poll,
        votes: newVotes,
        totalVotes: poll.totalVotes + 1,
      };
      
      // Update polls state
      setPolls(prev => 
        prev.map(p => p.id === pollId ? updatedPoll : p)
      );
      
      // If this is the current poll, update it too
      if (currentPoll?.id === pollId) {
        setCurrentPoll(updatedPoll);
      }
      
      return vote;
    } catch (err) {
      console.error('Error voting on poll:', err);
      setError('Failed to vote on poll. Please try again.');
      throw err;
    }
  };

  const getPoll = (pollId) => {
    return polls.find(poll => poll.id === pollId);
  };

  const deployPoll = async (pollId, gitRepo = null) => {
    try {
      const poll = getPoll(pollId);
      if (!poll) throw new Error('Poll not found');
      
      // Update poll status to deploying
      updatePoll(pollId, { status: 'deploying' });
      
      // In a real implementation, we would call the deployment service
      // For now, we'll simulate this with a delay
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      // Update poll with deployment data
      const deploymentData = {
        status: 'deployed',
        programId: `program_${Math.random().toString(36).substring(7)}`,
        metadataHash: `metadata_${Math.random().toString(36).substring(7)}`,
        deployedAt: new Date(),
      };
      
      updatePoll(pollId, deploymentData);
      
      return deploymentData;
    } catch (err) {
      console.error('Error deploying poll:', err);
      setError('Failed to deploy poll. Please try again.');
      
      // Reset poll status to draft
      updatePoll(pollId, { status: 'draft' });
      
      throw err;
    }
  };

  return (
    <PollContext.Provider value={{
      polls,
      currentPoll,
      loading,
      error,
      setCurrentPoll,
      createPoll,
      updatePoll,
      votePoll,
      getPoll,
      deployPoll,
    }}>
      {children}
    </PollContext.Provider>
  );
}

export default PollContext;

