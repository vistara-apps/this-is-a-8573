import React, { createContext, useContext, useState } from 'react';

const PollContext = createContext();

export function usePoll() {
  const context = useContext(PollContext);
  if (!context) {
    throw new Error('usePoll must be used within a PollProvider');
  }
  return context;
}

export function PollProvider({ children }) {
  const [polls, setPolls] = useState([]);
  const [currentPoll, setCurrentPoll] = useState(null);

  const createPoll = (pollData) => {
    const newPoll = {
      id: Date.now().toString(),
      ...pollData,
      createdAt: new Date(),
      votes: {},
      totalVotes: 0,
      status: 'draft',
      programId: null,
      metadataHash: null,
    };
    setPolls(prev => [...prev, newPoll]);
    setCurrentPoll(newPoll);
    return newPoll;
  };

  const updatePoll = (pollId, updates) => {
    setPolls(prev => 
      prev.map(poll => 
        poll.id === pollId ? { ...poll, ...updates } : poll
      )
    );
    if (currentPoll?.id === pollId) {
      setCurrentPoll(prev => ({ ...prev, ...updates }));
    }
  };

  const votePoll = (pollId, option, voterAddress) => {
    setPolls(prev => 
      prev.map(poll => {
        if (poll.id === pollId) {
          const newVotes = { ...poll.votes };
          if (!newVotes[option]) newVotes[option] = 0;
          newVotes[option]++;
          
          return {
            ...poll,
            votes: newVotes,
            totalVotes: poll.totalVotes + 1,
          };
        }
        return poll;
      })
    );
  };

  const getPoll = (pollId) => {
    return polls.find(poll => poll.id === pollId);
  };

  return (
    <PollContext.Provider value={{
      polls,
      currentPoll,
      setCurrentPoll,
      createPoll,
      updatePoll,
      votePoll,
      getPoll,
    }}>
      {children}
    </PollContext.Provider>
  );
}