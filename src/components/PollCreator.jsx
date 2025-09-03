import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, ArrowLeft, GitBranch } from 'lucide-react';
import Card from './ui/Card';
import Button from './ui/Button';
import Input from './ui/Input';
import { usePoll } from '../context/PollContext';
import { useWalletContext } from '../context/WalletContext';

function PollCreator() {
  const navigate = useNavigate();
  const { createPoll } = usePoll();
  const { connected, connectWallet } = useWalletContext();
  
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [gitRepo, setGitRepo] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Add a new option
  const addOption = () => {
    if (options.length < 10) {
      setOptions([...options, '']);
    }
  };

  // Remove an option
  const removeOption = (index) => {
    if (options.length > 2) {
      const newOptions = [...options];
      newOptions.splice(index, 1);
      setOptions(newOptions);
    }
  };

  // Update an option
  const updateOption = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!question.trim()) {
      newErrors.question = 'Question is required';
    }
    
    const validOptions = options.filter(option => option.trim());
    if (validOptions.length < 2) {
      newErrors.options = 'At least 2 options are required';
    }
    
    // Check for duplicate options
    const uniqueOptions = new Set(options.map(opt => opt.trim()));
    if (uniqueOptions.size !== validOptions.length) {
      newErrors.options = 'Options must be unique';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!connected) {
      await connectWallet();
      return;
    }
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setLoading(true);
      
      // Filter out empty options
      const validOptions = options.filter(option => option.trim());
      
      // Create poll
      const poll = createPoll({
        question: question.trim(),
        options: validOptions,
        gitRepo: gitRepo.trim() || null,
      });
      
      // Navigate to deployment page
      navigate(`/deploy/${poll.id}`);
    } catch (error) {
      console.error('Error creating poll:', error);
      setErrors({ submit: 'Failed to create poll. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Button
        variant="ghost"
        onClick={() => navigate('/')}
        className="mb-6"
        icon={<ArrowLeft className="w-4 h-4" />}
      >
        Back to Dashboard
      </Button>
      
      <Card>
        <Card.Header>
          <h2 className="text-2xl font-bold text-white">Create a New Poll</h2>
          <p className="text-gray-300">
            Design your poll with a question and multiple options
          </p>
        </Card.Header>
        
        <Card.Content>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Input
                id="question"
                label="Poll Question"
                placeholder="What would you like to ask?"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                error={errors.question}
                fullWidth
                required
              />
            </div>
            
            <div className="space-y-4">
              <label className="block text-sm font-medium text-white">
                Poll Options <span className="text-red-400">*</span>
              </label>
              
              {options.map((option, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    placeholder={`Option ${index + 1}`}
                    value={option}
                    onChange={(e) => updateOption(index, e.target.value)}
                    fullWidth
                  />
                  {options.length > 2 && (
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => removeOption(index)}
                      className="text-red-400 hover:text-red-300"
                      aria-label="Remove option"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
              
              {errors.options && (
                <p className="text-xs text-red-400">{errors.options}</p>
              )}
              
              {options.length < 10 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={addOption}
                  icon={<Plus className="w-4 h-4" />}
                  fullWidth
                >
                  Add Option
                </Button>
              )}
            </div>
            
            <div>
              <Input
                id="gitRepo"
                label="Git Repository URL (Optional)"
                placeholder="https://github.com/username/repo"
                value={gitRepo}
                onChange={(e) => setGitRepo(e.target.value)}
                fullWidth
                icon={<GitBranch className="w-4 h-4 text-gray-400" />}
                helperText="Link your source code repository for better verification"
              />
            </div>
            
            {errors.submit && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                <p className="text-sm text-red-400">{errors.submit}</p>
              </div>
            )}
          </form>
        </Card.Content>
        
        <Card.Footer>
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <Button
              variant="outline"
              onClick={() => navigate('/')}
              className="sm:flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              onClick={handleSubmit}
              loading={loading}
              disabled={loading}
              className="sm:flex-1"
            >
              {connected ? 'Create Poll' : 'Connect Wallet'}
            </Button>
          </div>
        </Card.Footer>
      </Card>
    </div>
  );
}

export default PollCreator;

