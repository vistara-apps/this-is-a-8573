/**
 * Vote model representing a vote on a poll
 * This matches the on-chain VoteRecord account structure
 */
export class Vote {
  /**
   * Create a new Vote instance
   * @param {Object} data - Vote data
   * @param {string} data.id - Unique identifier for the vote
   * @param {string} data.pollId - ID of the poll this vote belongs to
   * @param {string} data.voterAddress - Solana address of the voter
   * @param {string} data.option - The selected option
   * @param {number} data.optionIndex - Index of the selected option
   * @param {Date} data.timestamp - When the vote was cast
   */
  constructor(data) {
    this.id = data.id;
    this.pollId = data.pollId;
    this.voterAddress = data.voterAddress;
    this.option = data.option;
    this.optionIndex = data.optionIndex;
    this.timestamp = data.timestamp instanceof Date ? data.timestamp : new Date(data.timestamp);
  }

  /**
   * Create a new vote from user input
   * @param {string} pollId - ID of the poll
   * @param {string} voterAddress - Voter's wallet address
   * @param {string} option - Selected option
   * @param {number} optionIndex - Index of the selected option
   * @returns {Vote} - New Vote instance
   */
  static create(pollId, voterAddress, option, optionIndex) {
    const id = `vote_${Math.random().toString(36).substring(2, 11)}`;
    
    return new Vote({
      id,
      pollId,
      voterAddress,
      option,
      optionIndex,
      timestamp: new Date(),
    });
  }

  /**
   * Convert Vote to format needed for on-chain storage
   * @returns {Object} - On-chain format
   */
  toOnChainFormat() {
    return {
      voter: this.voterAddress,
      poll: this.pollId,
      optionIndex: this.optionIndex,
      timestamp: Math.floor(this.timestamp.getTime() / 1000),
    };
  }

  /**
   * Create Vote from on-chain data
   * @param {Object} onChainData - Data from blockchain
   * @param {string} voteId - Vote ID
   * @param {string} option - The selected option text
   * @returns {Vote} - Vote instance
   */
  static fromOnChainData(onChainData, voteId, option) {
    return new Vote({
      id: voteId,
      pollId: onChainData.poll.toString(),
      voterAddress: onChainData.voter.toString(),
      option: option,
      optionIndex: onChainData.optionIndex,
      timestamp: new Date(onChainData.timestamp * 1000),
    });
  }
}

export default Vote;

