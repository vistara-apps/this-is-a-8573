/**
 * Poll model representing a poll in the system
 * This matches the on-chain Poll account structure
 */
export class Poll {
  /**
   * Create a new Poll instance
   * @param {Object} data - Poll data
   * @param {string} data.id - Unique identifier for the poll
   * @param {string} data.question - The poll question
   * @param {string[]} data.options - Available options for the poll
   * @param {string} data.creatorAddress - Solana address of the creator
   * @param {Object} data.votes - Vote counts for each option
   * @param {number} data.totalVotes - Total number of votes
   * @param {string} data.status - Poll status (draft, deploying, deployed)
   * @param {string|null} data.programId - Solana program ID (if deployed)
   * @param {string|null} data.metadataHash - Metadata hash (if deployed)
   * @param {Date} data.createdAt - When the poll was created
   * @param {Date|null} data.deployedAt - When the poll was deployed
   */
  constructor(data) {
    this.id = data.id;
    this.question = data.question;
    this.options = data.options;
    this.creatorAddress = data.creatorAddress;
    this.votes = data.votes || {};
    this.totalVotes = data.totalVotes || 0;
    this.status = data.status || 'draft';
    this.programId = data.programId || null;
    this.metadataHash = data.metadataHash || null;
    this.createdAt = data.createdAt instanceof Date ? data.createdAt : new Date(data.createdAt);
    this.deployedAt = data.deployedAt ? (data.deployedAt instanceof Date ? data.deployedAt : new Date(data.deployedAt)) : null;
  }

  /**
   * Create a new poll from user input
   * @param {Object} data - Poll data
   * @param {string} data.question - The poll question
   * @param {string[]} data.options - Available options for the poll
   * @param {string|null} data.gitRepo - Optional Git repository URL
   * @param {string} creatorAddress - Creator's wallet address
   * @returns {Poll} - New Poll instance
   */
  static create(data, creatorAddress) {
    const id = `poll_${Math.random().toString(36).substring(2, 11)}`;
    
    // Initialize votes object
    const votes = {};
    data.options.forEach(option => {
      votes[option] = 0;
    });
    
    return new Poll({
      id,
      question: data.question,
      options: data.options,
      creatorAddress,
      votes,
      totalVotes: 0,
      status: 'draft',
      programId: null,
      metadataHash: null,
      createdAt: new Date(),
      deployedAt: null,
      gitRepo: data.gitRepo || null,
    });
  }

  /**
   * Convert Poll to format needed for on-chain storage
   * @returns {Object} - On-chain format
   */
  toOnChainFormat() {
    // Convert votes object to array format expected by the contract
    const votesArray = this.options.map(option => this.votes[option] || 0);
    
    return {
      question: this.question,
      options: this.options,
      creator: this.creatorAddress,
      votes: votesArray,
      totalVotes: this.totalVotes,
      creationTimestamp: Math.floor(this.createdAt.getTime() / 1000),
      metadataHash: this.metadataHash,
    };
  }

  /**
   * Create Poll from on-chain data
   * @param {Object} onChainData - Data from blockchain
   * @param {string} pollId - Poll ID
   * @returns {Poll} - Poll instance
   */
  static fromOnChainData(onChainData, pollId) {
    // Convert votes array to object format
    const votes = {};
    onChainData.options.forEach((option, index) => {
      votes[option] = onChainData.votes[index].toNumber();
    });
    
    return new Poll({
      id: pollId,
      question: onChainData.question,
      options: onChainData.options,
      creatorAddress: onChainData.creator.toString(),
      votes,
      totalVotes: onChainData.totalVotes.toNumber(),
      status: 'deployed',
      programId: pollId, // In Solana, the account address is the poll ID
      metadataHash: onChainData.metadataHash,
      createdAt: new Date(onChainData.creationTimestamp * 1000),
      deployedAt: new Date(onChainData.creationTimestamp * 1000),
    });
  }

  /**
   * Get the percentage of votes for a specific option
   * @param {string} option - The option to get percentage for
   * @returns {number} - Percentage of votes (0-100)
   */
  getOptionPercentage(option) {
    if (!this.totalVotes || !this.votes[option]) return 0;
    return Math.round((this.votes[option] / this.totalVotes) * 100);
  }

  /**
   * Check if a poll is deployed
   * @returns {boolean} - Whether the poll is deployed
   */
  isDeployed() {
    return this.status === 'deployed' && !!this.programId;
  }

  /**
   * Check if a poll is being deployed
   * @returns {boolean} - Whether the poll is being deployed
   */
  isDeploying() {
    return this.status === 'deploying';
  }

  /**
   * Get the leading option(s) in the poll
   * @returns {string[]} - Array of leading options (can be multiple in case of a tie)
   */
  getLeadingOptions() {
    if (this.totalVotes === 0) return [];
    
    // Find the maximum vote count
    const maxVotes = Math.max(...Object.values(this.votes));
    
    // Find all options with the maximum vote count
    return Object.entries(this.votes)
      .filter(([_, count]) => count === maxVotes)
      .map(([option]) => option);
  }
}

export default Poll;

