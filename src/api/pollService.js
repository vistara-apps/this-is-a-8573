import { Poll } from '../models/Poll';
import { Vote } from '../models/Vote';

/**
 * Service for interacting with polls
 */
class PollService {
  constructor(config = {}) {
    this.endpoint = config.endpoint || 'https://api.verifyvote.com';
    this.connection = config.connection;
    
    // Mock data for development
    this._mockPolls = [];
    this._mockVotes = [];
  }

  /**
   * Create a new poll
   * @param {Object} pollData - Poll data
   * @returns {Promise<Poll>} - The created poll
   */
  async createPoll(pollData) {
    try {
      // In a real implementation, this would make an API call
      // For now, we'll just create a local Poll object
      const poll = Poll.create(pollData, pollData.creatorAddress);
      
      // Add to mock data
      this._mockPolls.push(poll);
      
      return poll;
    } catch (error) {
      console.error('Error creating poll:', error);
      throw error;
    }
  }

  /**
   * Fetch a poll by ID
   * @param {string} pollId - Poll ID
   * @returns {Promise<Poll|null>} - The poll or null if not found
   */
  async fetchPoll(pollId) {
    try {
      // In a real implementation, this would make an API call
      // For now, we'll just return from mock data
      const poll = this._mockPolls.find(p => p.id === pollId);
      return poll || null;
    } catch (error) {
      console.error('Error fetching poll:', error);
      throw error;
    }
  }

  /**
   * Fetch polls created by a specific user
   * @param {string} creatorAddress - Creator's wallet address
   * @returns {Promise<Poll[]>} - Array of polls
   */
  async fetchPollsByCreator(creatorAddress) {
    try {
      // In a real implementation, this would make an API call
      // For now, we'll just filter mock data
      return this._mockPolls.filter(p => p.creatorAddress === creatorAddress);
    } catch (error) {
      console.error('Error fetching polls by creator:', error);
      throw error;
    }
  }

  /**
   * Vote on a poll
   * @param {string} pollId - Poll ID
   * @param {string} voterAddress - Voter's wallet address
   * @param {string} option - Selected option
   * @returns {Promise<Vote>} - The created vote
   */
  async vote(pollId, voterAddress, option) {
    try {
      // In a real implementation, this would make an API call
      // For now, we'll just create a local Vote object
      const poll = await this.fetchPoll(pollId);
      if (!poll) {
        throw new Error('Poll not found');
      }
      
      // Check if user has already voted
      const hasVoted = await this.hasVoted(pollId, voterAddress);
      if (hasVoted) {
        throw new Error('User has already voted on this poll');
      }
      
      // Create vote
      const optionIndex = poll.options.indexOf(option);
      if (optionIndex === -1) {
        throw new Error('Invalid option');
      }
      
      const vote = Vote.create(pollId, voterAddress, option, optionIndex);
      
      // Update poll
      poll.votes[option] = (poll.votes[option] || 0) + 1;
      poll.totalVotes += 1;
      
      // Add to mock data
      this._mockVotes.push(vote);
      
      return vote;
    } catch (error) {
      console.error('Error voting:', error);
      throw error;
    }
  }

  /**
   * Check if a user has voted on a poll
   * @param {string} pollId - Poll ID
   * @param {string} voterAddress - Voter's wallet address
   * @returns {Promise<boolean>} - Whether the user has voted
   */
  async hasVoted(pollId, voterAddress) {
    try {
      // In a real implementation, this would make an API call
      // For now, we'll just check mock data
      return this._mockVotes.some(v => v.pollId === pollId && v.voterAddress === voterAddress);
    } catch (error) {
      console.error('Error checking vote status:', error);
      throw error;
    }
  }

  /**
   * Get votes for a poll
   * @param {string} pollId - Poll ID
   * @returns {Promise<Vote[]>} - Array of votes
   */
  async getVotes(pollId) {
    try {
      // In a real implementation, this would make an API call
      // For now, we'll just filter mock data
      return this._mockVotes.filter(v => v.pollId === pollId);
    } catch (error) {
      console.error('Error getting votes:', error);
      throw error;
    }
  }
}

export default PollService;

