use anchor_lang::prelude::*;
use std::collections::BTreeMap;

declare_id!("VoTExxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");

#[program]
pub mod verify_vote {
    use super::*;

    // Initialize a new poll with a question and options
    pub fn initialize_poll(
        ctx: Context<InitializePoll>,
        question: String,
        options: Vec<String>,
        metadata_hash: Option<String>,
    ) -> Result<()> {
        // Validate inputs
        if question.is_empty() {
            return Err(PollError::EmptyQuestion.into());
        }

        if options.len() < 2 {
            return Err(PollError::InsufficientOptions.into());
        }

        if options.len() > 10 {
            return Err(PollError::TooManyOptions.into());
        }

        // Initialize poll account
        let poll = &mut ctx.accounts.poll;
        poll.question = question;
        poll.options = options;
        poll.creator = ctx.accounts.creator.key();
        poll.votes = vec![0; poll.options.len()];
        poll.total_votes = 0;
        poll.creation_timestamp = Clock::get()?.unix_timestamp;
        poll.metadata_hash = metadata_hash;

        Ok(())
    }

    // Cast a vote for a specific option in a poll
    pub fn vote(ctx: Context<Vote>, option_index: u8) -> Result<()> {
        let poll = &mut ctx.accounts.poll;
        let vote_record = &mut ctx.accounts.vote_record;

        // Validate option index
        if option_index as usize >= poll.options.len() {
            return Err(PollError::InvalidOption.into());
        }

        // Initialize vote record
        vote_record.voter = ctx.accounts.voter.key();
        vote_record.poll = poll.key();
        vote_record.option_index = option_index;
        vote_record.timestamp = Clock::get()?.unix_timestamp;

        // Update poll vote count
        poll.votes[option_index as usize] += 1;
        poll.total_votes += 1;

        Ok(())
    }

    // Update the metadata hash for a poll
    pub fn update_metadata(
        ctx: Context<UpdateMetadata>,
        metadata_hash: String,
    ) -> Result<()> {
        let poll = &mut ctx.accounts.poll;
        
        // Only the poll creator can update metadata
        if poll.creator != ctx.accounts.creator.key() {
            return Err(PollError::Unauthorized.into());
        }
        
        poll.metadata_hash = Some(metadata_hash);
        
        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializePoll<'info> {
    #[account(init, payer = creator, space = 8 + Poll::MAX_SIZE)]
    pub poll: Account<'info, Poll>,
    #[account(mut)]
    pub creator: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Vote<'info> {
    #[account(mut)]
    pub poll: Account<'info, Poll>,
    pub voter: Signer<'info>,
    #[account(
        init,
        payer = voter,
        space = 8 + VoteRecord::SIZE,
        seeds = [b"vote", poll.key().as_ref(), voter.key().as_ref()],
        bump
    )]
    pub vote_record: Account<'info, VoteRecord>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateMetadata<'info> {
    #[account(mut)]
    pub poll: Account<'info, Poll>,
    pub creator: Signer<'info>,
}

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

impl Poll {
    // Maximum size calculation for account allocation
    pub const MAX_SIZE: usize = 
        4 + 256 +                // question (String)
        4 + 10 * (4 + 32) +      // options (Vec<String>)
        32 +                     // creator (Pubkey)
        4 + 10 * 8 +             // votes (Vec<u64>)
        8 +                      // total_votes (u64)
        8 +                      // creation_timestamp (i64)
        1 + 4 + 64;              // metadata_hash (Option<String>)
}

#[account]
pub struct VoteRecord {
    pub voter: Pubkey,
    pub poll: Pubkey,
    pub option_index: u8,
    pub timestamp: i64,
}

impl VoteRecord {
    // Size calculation for account allocation
    pub const SIZE: usize = 
        32 +    // voter (Pubkey)
        32 +    // poll (Pubkey)
        1 +     // option_index (u8)
        8;      // timestamp (i64)
}

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

