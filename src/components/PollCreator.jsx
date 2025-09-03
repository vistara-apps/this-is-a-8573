import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePoll } from '../context/PollContext';
import { Plus, Trash2, Code, Eye } from 'lucide-react';
import CodeEditor from './CodeEditor';

function PollCreator() {
  const navigate = useNavigate();
  const { createPoll } = usePoll();
  
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [gitRepo, setGitRepo] = useState('');
  const [showCodePreview, setShowCodePreview] = useState(false);

  const addOption = () => {
    setOptions([...options, '']);
  };

  const removeOption = (index) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const updateOption = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!question.trim() || options.some(opt => !opt.trim())) {
      alert('Please fill in all fields');
      return;
    }

    const poll = createPoll({
      question: question.trim(),
      options: options.filter(opt => opt.trim()),
      gitRepo: gitRepo.trim(),
      creatorAddress: 'demo-address', // In real app, get from wallet
    });

    navigate(`/deploy/${poll.id}`);
  };

  const generateAnchorCode = () => {
    return `use anchor_lang::prelude::*;

declare_id!("${Math.random().toString(36).substring(7)}");

#[program]
pub mod poll_vote {
    use super::*;

    pub fn initialize_poll(
        ctx: Context<InitializePoll>,
        question: String,
        options: Vec<String>,
    ) -> Result<()> {
        let poll = &mut ctx.accounts.poll;
        poll.question = question;
        poll.options = options;
        poll.creator = ctx.accounts.creator.key();
        poll.votes = vec![0; poll.options.len()];
        poll.total_votes = 0;
        Ok(())
    }

    pub fn vote(ctx: Context<Vote>, option_index: u8) -> Result<()> {
        let poll = &mut ctx.accounts.poll;
        require!(
            (option_index as usize) < poll.options.len(),
            PollError::InvalidOption
        );
        
        poll.votes[option_index as usize] += 1;
        poll.total_votes += 1;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializePoll<'info> {
    #[account(
        init,
        payer = creator,
        space = 8 + 32 + 200 + 4 + (32 * 10) + 4 + (8 * 10) + 8
    )]
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
}

#[account]
pub struct Poll {
    pub question: String,
    pub options: Vec<String>,
    pub creator: Pubkey,
    pub votes: Vec<u64>,
    pub total_votes: u64,
}

#[error_code]
pub enum PollError {
    #[msg("Invalid option selected")]
    InvalidOption,
}`;
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Create New Poll dApp</h1>
        <p className="text-gray-300">Define your poll and we'll generate the Anchor program and React UI</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Poll Question *
              </label>
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="What's your favorite programming language?"
                className="input bg-white/5 border-white/20 text-white placeholder-gray-400"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Options *
              </label>
              <div className="space-y-2">
                {options.map((option, index) => (
                  <div key={index} className="flex space-x-2">
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => updateOption(index, e.target.value)}
                      placeholder={`Option ${index + 1}`}
                      className="flex-1 input bg-white/5 border-white/20 text-white placeholder-gray-400"
                      required
                    />
                    {options.length > 2 && (
                      <button
                        type="button"
                        onClick={() => removeOption(index)}
                        className="p-2 text-red-400 hover:text-red-300 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={addOption}
                className="mt-2 flex items-center text-sm text-purple-400 hover:text-purple-300 transition-colors"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Option
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Git Repository (Optional)
              </label>
              <input
                type="url"
                value={gitRepo}
                onChange={(e) => setGitRepo(e.target.value)}
                placeholder="https://github.com/username/repo"
                className="input bg-white/5 border-white/20 text-white placeholder-gray-400"
              />
              <p className="text-xs text-gray-400 mt-1">
                Link to your source code for verification
              </p>
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-6 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
              >
                Generate & Deploy
              </button>
              <button
                type="button"
                onClick={() => setShowCodePreview(!showCodePreview)}
                className="px-6 py-3 bg-white/10 text-white rounded-lg border border-white/20 hover:bg-white/20 transition-colors flex items-center"
              >
                <Code className="w-4 h-4 mr-2" />
                {showCodePreview ? 'Hide' : 'Preview'} Code
              </button>
            </div>
          </form>
        </div>

        {/* Code Preview Section */}
        <div className={`${showCodePreview ? 'block' : 'hidden lg:block'} bg-gray-900 rounded-lg overflow-hidden border border-gray-700`}>
          <div className="bg-gray-800 px-4 py-2 border-b border-gray-700">
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1">
                <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              </div>
              <span className="text-gray-300 text-sm">lib.rs</span>
            </div>
          </div>
          <CodeEditor 
            code={generateAnchorCode()}
            language="rust"
            readOnly={true}
            height="500px"
          />
        </div>
      </div>
    </div>
  );
}

export default PollCreator;