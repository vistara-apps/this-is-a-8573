# VerifyVote Anchor Program Documentation

This document provides detailed information about the VerifyVote Anchor program, including account structures, instructions, and usage examples.

## Overview

The VerifyVote Anchor program is a Solana smart contract that enables the creation and management of on-chain polls. It provides functionality for:

- Creating polls with customizable questions and options
- Casting votes on polls
- Storing verification metadata for deployed programs

## Account Structures

### Poll

The `Poll` account stores information about a poll:

```rust
#[account]
pub struct Poll {
    pub question: String,
    pub options: Vec<String>,
    pub creator: Pubkey,
    pub votes: Vec<u64>,
    pub total_votes: u64,
    pub creation_timestamp: i64,
    pub metadata_hash: Option<String>,
}
```

- `question`: The poll question
- `options`: Available options for the poll
- `creator`: Solana address of the poll creator
- `votes`: Vote counts for each option
- `total_votes`: Total number of votes
- `creation_timestamp`: Unix timestamp when the poll was created
- `metadata_hash`: Optional hash of verification metadata

### VoteRecord

The `VoteRecord` account stores information about a vote:

```rust
#[account]
pub struct VoteRecord {
    pub voter: Pubkey,
    pub poll: Pubkey,
    pub option_index: u8,
    pub timestamp: i64,
}
```

- `voter`: Solana address of the voter
- `poll`: Public key of the poll account
- `option_index`: Index of the selected option
- `timestamp`: Unix timestamp when the vote was cast

## Instructions

### Initialize Poll

Creates a new poll with a question and options.

```rust
pub fn initialize_poll(
    ctx: Context<InitializePoll>,
    question: String,
    options: Vec<String>,
    metadata_hash: Option<String>,
) -> Result<()>
```

**Parameters**:
- `question`: The poll question
- `options`: Available options for the poll
- `metadata_hash`: Optional hash of verification metadata

**Accounts**:
- `poll`: Poll account to initialize
- `creator`: Poll creator account (signer)
- `system_program`: System program

**Errors**:
- `EmptyQuestion`: Question cannot be empty
- `InsufficientOptions`: At least 2 options are required
- `TooManyOptions`: Maximum 10 options allowed

### Vote

Casts a vote for a specific option in a poll.

```rust
pub fn vote(ctx: Context<Vote>, option_index: u8) -> Result<()>
```

**Parameters**:
- `option_index`: Index of the selected option

**Accounts**:
- `poll`: Poll account to vote on
- `voter`: Voter account (signer)
- `vote_record`: Vote record account to initialize
- `system_program`: System program

**Errors**:
- `InvalidOption`: Invalid option selected
- `AlreadyVoted`: Voter has already voted on this poll

### Update Metadata

Updates the metadata hash for a poll.

```rust
pub fn update_metadata(
    ctx: Context<UpdateMetadata>,
    metadata_hash: String,
) -> Result<()>
```

**Parameters**:
- `metadata_hash`: New metadata hash

**Accounts**:
- `poll`: Poll account to update
- `creator`: Poll creator account (signer)

**Errors**:
- `Unauthorized`: Only the poll creator can update metadata

## Error Codes

The program defines the following error codes:

```rust
#[error_code]
pub enum PollError {
    #[msg("Invalid option selected")]
    InvalidOption,
    
    #[msg("Question cannot be empty")]
    EmptyQuestion,
    
    #[msg("At least 2 options are required")]
    InsufficientOptions,
    
    #[msg("Maximum 10 options allowed")]
    TooManyOptions,
    
    #[msg("You have already voted on this poll")]
    AlreadyVoted,
    
    #[msg("Unauthorized operation")]
    Unauthorized,
}
```

## Usage Examples

### Creating a Poll

```javascript
import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';
import { VerifyVote } from '../target/types/verify_vote';

// Initialize program
const program = anchor.workspace.VerifyVote as Program<VerifyVote>;

// Create poll account
const poll = anchor.web3.Keypair.generate();

// Initialize poll
await program.methods
  .initializePoll(
    "What is your favorite color?",
    ["Red", "Blue", "Green", "Yellow"],
    null
  )
  .accounts({
    poll: poll.publicKey,
    creator: wallet.publicKey,
    systemProgram: anchor.web3.SystemProgram.programId,
  })
  .signers([poll])
  .rpc();

console.log("Poll created:", poll.publicKey.toString());
```

### Voting on a Poll

```javascript
import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';
import { VerifyVote } from '../target/types/verify_vote';

// Initialize program
const program = anchor.workspace.VerifyVote as Program<VerifyVote>;

// Poll public key
const pollPublicKey = new anchor.web3.PublicKey("...");

// Derive vote record PDA
const [voteRecord] = await anchor.web3.PublicKey.findProgramAddress(
  [
    Buffer.from("vote"),
    pollPublicKey.toBuffer(),
    wallet.publicKey.toBuffer(),
  ],
  program.programId
);

// Vote on poll
await program.methods
  .vote(1) // Vote for "Blue" (index 1)
  .accounts({
    poll: pollPublicKey,
    voter: wallet.publicKey,
    voteRecord: voteRecord,
    systemProgram: anchor.web3.SystemProgram.programId,
  })
  .rpc();

console.log("Vote cast successfully");
```

### Updating Metadata

```javascript
import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';
import { VerifyVote } from '../target/types/verify_vote';

// Initialize program
const program = anchor.workspace.VerifyVote as Program<VerifyVote>;

// Poll public key
const pollPublicKey = new anchor.web3.PublicKey("...");

// Update metadata
await program.methods
  .updateMetadata("ipfs_abc123")
  .accounts({
    poll: pollPublicKey,
    creator: wallet.publicKey,
  })
  .rpc();

console.log("Metadata updated successfully");
```

## Testing

The program includes comprehensive tests to ensure correct functionality. To run the tests:

```bash
anchor test
```

## Deployment

To deploy the program to the Solana Devnet:

```bash
anchor deploy --provider.cluster devnet
```

## Security Considerations

- The program uses PDAs to ensure that each user can only vote once on a poll
- Only the poll creator can update the metadata hash
- The program validates all inputs to prevent invalid data

## Limitations

- Maximum 10 options per poll
- Question and option strings have size limits
- No support for multiple votes per user

## Future Enhancements

- Support for weighted voting
- Support for multiple votes per user
- Support for time-limited polls
- Support for private polls with access control

