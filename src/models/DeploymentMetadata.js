/**
 * DeploymentMetadata model representing metadata for a deployed poll
 */
export class DeploymentMetadata {
  /**
   * Create a new DeploymentMetadata instance
   * @param {Object} data - Metadata data
   * @param {string} data.id - Unique identifier for the metadata
   * @param {string} data.pollId - ID of the poll this metadata belongs to
   * @param {string} data.programId - Solana program ID
   * @param {string|null} data.gitCommit - Git commit hash (if available)
   * @param {string} data.buildArtifactsHash - Hash of build artifacts
   * @param {string} data.ipfsHash - IPFS hash for metadata
   * @param {string|null} data.arweaveTxId - Arweave transaction ID (if available)
   * @param {string} data.creatorAddress - Solana address of the creator
   * @param {Date} data.timestamp - When the metadata was created
   */
  constructor(data) {
    this.id = data.id;
    this.pollId = data.pollId;
    this.programId = data.programId;
    this.gitCommit = data.gitCommit || null;
    this.buildArtifactsHash = data.buildArtifactsHash;
    this.ipfsHash = data.ipfsHash;
    this.arweaveTxId = data.arweaveTxId || null;
    this.creatorAddress = data.creatorAddress;
    this.timestamp = data.timestamp instanceof Date ? data.timestamp : new Date(data.timestamp);
  }

  /**
   * Create a new metadata record
   * @param {Object} data - Metadata data
   * @param {string} data.pollId - ID of the poll
   * @param {string} data.programId - Solana program ID
   * @param {string|null} data.gitCommit - Git commit hash (if available)
   * @param {string} data.buildArtifactsHash - Hash of build artifacts
   * @param {string} data.ipfsHash - IPFS hash for metadata
   * @param {string|null} data.arweaveTxId - Arweave transaction ID (if available)
   * @param {string} data.creatorAddress - Creator's wallet address
   * @returns {DeploymentMetadata} - New DeploymentMetadata instance
   */
  static create(data) {
    const id = `metadata_${Math.random().toString(36).substring(2, 11)}`;
    
    return new DeploymentMetadata({
      id,
      pollId: data.pollId,
      programId: data.programId,
      gitCommit: data.gitCommit || null,
      buildArtifactsHash: data.buildArtifactsHash,
      ipfsHash: data.ipfsHash,
      arweaveTxId: data.arweaveTxId || null,
      creatorAddress: data.creatorAddress,
      timestamp: new Date(),
    });
  }

  /**
   * Get the verification URL for this metadata
   * @returns {string} - Verification URL
   */
  getVerificationUrl() {
    return `https://verify.verifyvote.com/metadata/${this.ipfsHash}`;
  }

  /**
   * Get the IPFS URL for this metadata
   * @returns {string} - IPFS URL
   */
  getIpfsUrl() {
    return `https://ipfs.io/ipfs/${this.ipfsHash}`;
  }

  /**
   * Get the Arweave URL for this metadata (if available)
   * @returns {string|null} - Arweave URL or null if not available
   */
  getArweaveUrl() {
    return this.arweaveTxId ? `https://arweave.net/${this.arweaveTxId}` : null;
  }

  /**
   * Get the Solana Explorer URL for this program
   * @returns {string} - Solana Explorer URL
   */
  getSolanaExplorerUrl() {
    return `https://explorer.solana.com/address/${this.programId}?cluster=devnet`;
  }

  /**
   * Get the Git commit URL (if available)
   * @param {string} gitRepoUrl - Git repository URL
   * @returns {string|null} - Git commit URL or null if not available
   */
  getGitCommitUrl(gitRepoUrl) {
    if (!this.gitCommit || !gitRepoUrl) {
      return null;
    }
    
    // Handle GitHub URLs
    if (gitRepoUrl.includes('github.com')) {
      return `${gitRepoUrl}/commit/${this.gitCommit}`;
    }
    
    // Handle GitLab URLs
    if (gitRepoUrl.includes('gitlab.com')) {
      return `${gitRepoUrl}/-/commit/${this.gitCommit}`;
    }
    
    return null;
  }
}

export default DeploymentMetadata;

