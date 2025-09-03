# VerifyVote Verification System Documentation

This document provides detailed information about the VerifyVote verification system, including how it works, how to use it, and best practices.

## Overview

The VerifyVote verification system ensures that deployed Solana programs match their source code, providing transparency and trust for users. The system:

1. Generates build metadata during deployment
2. Stores this metadata on IPFS and Arweave
3. Links the metadata to the deployed program
4. Provides verification badges and tools for users to verify the code

## How It Works

### Build Metadata Generation

When a poll is deployed, the system:

1. Compiles the Anchor program from source code
2. Generates a hash of the build artifacts
3. Records the Git commit hash (if available)
4. Creates a metadata record with this information

### Metadata Storage

The metadata is stored in two decentralized storage systems:

1. **IPFS**: For fast, content-addressed retrieval
2. **Arweave**: For permanent, immutable storage

This dual approach ensures both accessibility and permanence.

### On-Chain Linking

The metadata hash is stored in the Poll account on the Solana blockchain, creating a verifiable link between the deployed program and its source code.

### Verification Process

Users can verify a program by:

1. Viewing the verification badge on a poll
2. Accessing the metadata via IPFS or Arweave
3. Optionally rebuilding the program from source to verify the hash matches

## Metadata Format

The verification metadata includes:

```json
{
  "programId": "VoTExxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "gitRepo": "https://github.com/username/repo",
  "gitCommit": "git_abc123",
  "buildArtifactsHash": "build_def456",
  "buildTimestamp": "2023-09-01T13:00:00Z",
  "buildCommand": "anchor build",
  "rustVersion": "1.68.0",
  "anchorVersion": "0.28.0",
  "solanaVersion": "1.16.0"
}
```

## Using the Verification System

### As a Developer

#### 1. Link Your Git Repository

When creating a poll, provide your Git repository URL:

```javascript
const poll = await pollService.createPoll({
  question: "What is your favorite color?",
  options: ["Red", "Blue", "Green", "Yellow"],
  gitRepo: "https://github.com/username/repo"
});
```

#### 2. Deploy with Verification

When deploying a poll, the system automatically generates and stores verification metadata:

```javascript
const metadata = await deploymentService.deployPoll(pollId, {
  creatorAddress: wallet.publicKey.toString(),
  gitRepo: "https://github.com/username/repo"
});

console.log("Verification IPFS hash:", metadata.ipfsHash);
console.log("Verification Arweave ID:", metadata.arweaveTxId);
```

#### 3. Update Verification Metadata

If you update your program, you can update the verification metadata:

```javascript
const updatedMetadata = await verificationService.generateBuildMetadata({
  programId: poll.programId,
  gitRepo: "https://github.com/username/repo",
  gitCommit: "newCommitHash"
});

const ipfsHash = await verificationService.storeMetadataOnIPFS(updatedMetadata);
```

### As a User

#### 1. Check Verification Badge

Look for the verification badge on a poll:

```jsx
<VerificationBadge isVerified={true} metadata={{ ipfsHash: poll.metadataHash }} />
```

#### 2. View Verification Details

Click on the verification badge to view detailed information:

```jsx
<Modal isOpen={showVerificationModal} onClose={closeModal}>
  <h2>Verification Details</h2>
  <p>Program ID: {metadata.programId}</p>
  <p>Git Repository: {metadata.gitRepo}</p>
  <p>Git Commit: {metadata.gitCommit}</p>
  <p>Build Timestamp: {metadata.buildTimestamp}</p>
  <a href={`https://ipfs.io/ipfs/${metadata.ipfsHash}`} target="_blank">
    View on IPFS
  </a>
</Modal>
```

#### 3. Verify Source Code

To manually verify the source code:

1. Clone the Git repository: `git clone {metadata.gitRepo}`
2. Checkout the specific commit: `git checkout {metadata.gitCommit}`
3. Build the program: `anchor build`
4. Compare the build artifacts hash with `metadata.buildArtifactsHash`

## Verification API

The verification system provides API endpoints for programmatic verification:

### Generate Build Metadata

```http
POST /api/verification/generate
Content-Type: application/json

{
  "programId": "VoTExxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "gitRepo": "https://github.com/username/repo",
  "gitCommit": "git_abc123"
}
```

### Store Metadata on IPFS

```http
POST /api/verification/store/ipfs
Content-Type: application/json

{
  "metadata": {
    "programId": "VoTExxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    "gitRepo": "https://github.com/username/repo",
    "gitCommit": "git_abc123",
    "buildArtifactsHash": "build_def456",
    "buildTimestamp": "2023-09-01T13:00:00Z",
    "buildCommand": "anchor build",
    "rustVersion": "1.68.0",
    "anchorVersion": "0.28.0",
    "solanaVersion": "1.16.0"
  }
}
```

### Verify Program

```http
POST /api/verification/verify
Content-Type: application/json

{
  "programId": "VoTExxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "gitRepo": "https://github.com/username/repo",
  "gitCommit": "git_abc123"
}
```

## Best Practices

### For Developers

1. **Use Version Control**: Always use Git or another version control system for your code
2. **Tag Releases**: Create Git tags for each release to make verification easier
3. **Document Build Environment**: Document your Rust and Anchor versions
4. **Keep Dependencies Locked**: Use a lockfile to ensure consistent builds
5. **Automate Verification**: Integrate verification into your CI/CD pipeline

### For Users

1. **Check Verification Badge**: Always look for the verification badge on polls
2. **View Metadata**: Click on the badge to view detailed verification information
3. **Check Source Code**: For critical applications, verify the source code manually
4. **Report Issues**: Report any verification issues to the developer or VerifyVote team

## Security Considerations

### Trusted Build Environment

The verification system relies on a trusted build environment. To ensure security:

1. The build environment is isolated and containerized
2. All dependencies are pinned to specific versions
3. The build process is logged and auditable
4. The system uses deterministic builds where possible

### Metadata Integrity

To ensure metadata integrity:

1. Metadata is stored on both IPFS and Arweave for redundancy
2. The metadata hash is stored on-chain for verification
3. All metadata is signed by the VerifyVote service

### Limitations

The verification system has some limitations:

1. It cannot verify private repositories without access
2. It cannot guarantee that the source code is free of vulnerabilities
3. It relies on the security of IPFS and Arweave for metadata storage

## Troubleshooting

### Common Issues

1. **Verification Failed**: The build artifacts hash doesn't match
   - Check if you're using the correct Git commit
   - Ensure your build environment matches the original

2. **Metadata Not Found**: The IPFS or Arweave link is broken
   - Try accessing the metadata through the alternative storage
   - Contact the VerifyVote team for assistance

3. **Badge Not Showing**: The verification badge is not displayed
   - Check if the poll has been deployed with verification
   - Refresh the page and clear cache

### Support

For verification issues, contact the VerifyVote team at verification@verifyvote.com.

## Future Enhancements

The verification system roadmap includes:

1. **Automated Auditing**: Integrate with code auditing tools
2. **Multi-Signature Verification**: Allow multiple parties to verify a program
3. **Verification History**: Track changes to verification metadata over time
4. **Enhanced Badges**: More detailed verification badges with security ratings
5. **Cross-Chain Verification**: Support for verification across multiple blockchains

