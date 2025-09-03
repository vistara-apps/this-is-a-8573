/**
 * Utilities for build verification
 */

/**
 * Generate a hash for source code
 * @param {string} sourceCode - Source code content
 * @returns {string} - Hash of the source code
 */
export const generateSourceHash = (sourceCode) => {
  // In a real implementation, we would use a cryptographic hash function
  // For now, we'll simulate this
  return 'source_' + Math.random().toString(36).substring(7);
};

/**
 * Generate a hash for build artifacts
 * @param {Object} buildArtifacts - Build artifacts
 * @returns {string} - Hash of the build artifacts
 */
export const generateBuildHash = (buildArtifacts) => {
  // In a real implementation, we would use a cryptographic hash function
  // For now, we'll simulate this
  return 'build_' + Math.random().toString(36).substring(7);
};

/**
 * Verify a program against its metadata
 * @param {string} programId - Program ID
 * @param {Object} metadata - Metadata object
 * @returns {boolean} - Whether the program is verified
 */
export const verifyProgram = (programId, metadata) => {
  // In a real implementation, we would:
  // 1. Fetch the program bytecode
  // 2. Rebuild from source
  // 3. Compare hashes
  
  // For now, we'll simulate this with a 95% success rate
  return Math.random() < 0.95;
};

/**
 * Get verification status text
 * @param {boolean} isVerified - Whether the program is verified
 * @returns {string} - Status text
 */
export const getVerificationStatusText = (isVerified) => {
  return isVerified ? 'Verified' : 'Unverified';
};

/**
 * Get verification status color
 * @param {boolean} isVerified - Whether the program is verified
 * @returns {string} - Status color (for CSS)
 */
export const getVerificationStatusColor = (isVerified) => {
  return isVerified ? 'text-green-400' : 'text-red-400';
};

/**
 * Format metadata for display
 * @param {Object} metadata - Metadata object
 * @returns {Object} - Formatted metadata
 */
export const formatMetadata = (metadata) => {
  if (!metadata) return null;
  
  return {
    programId: metadata.programId,
    gitCommit: metadata.gitCommit ? metadata.gitCommit.substring(0, 8) : 'N/A',
    buildArtifactsHash: metadata.buildArtifactsHash ? metadata.buildArtifactsHash.substring(0, 8) : 'N/A',
    ipfsHash: metadata.ipfsHash || 'N/A',
    arweaveTxId: metadata.arweaveTxId || 'N/A',
    timestamp: metadata.timestamp ? new Date(metadata.timestamp).toLocaleString() : 'N/A',
    gitRepo: metadata.gitRepo || 'N/A',
  };
};

/**
 * Get verification URL
 * @param {Object} metadata - Metadata object
 * @returns {string|null} - Verification URL
 */
export const getVerificationUrl = (metadata) => {
  if (!metadata) return null;
  
  if (metadata.ipfsHash) {
    return `https://ipfs.io/ipfs/${metadata.ipfsHash}`;
  }
  
  if (metadata.arweaveTxId) {
    return `https://viewblock.io/arweave/tx/${metadata.arweaveTxId}`;
  }
  
  return null;
};

/**
 * Get explorer URL for a program
 * @param {string} programId - Program ID
 * @param {string} network - Solana network (mainnet-beta, devnet, testnet)
 * @returns {string} - Explorer URL
 */
export const getExplorerUrl = (programId, network = 'devnet') => {
  return `https://explorer.solana.com/address/${programId}?cluster=${network}`;
};

export default {
  generateSourceHash,
  generateBuildHash,
  verifyProgram,
  getVerificationStatusText,
  getVerificationStatusColor,
  formatMetadata,
  getVerificationUrl,
  getExplorerUrl,
};

