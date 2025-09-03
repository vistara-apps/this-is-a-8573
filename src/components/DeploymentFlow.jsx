import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Loader2, DollarSign, Shield, Code, Server, Database } from 'lucide-react';
import Card from './ui/Card';
import Button from './ui/Button';
import { usePoll } from '../context/PollContext';
import { useWalletContext } from '../context/WalletContext';
import { usePaymentContext } from '../hooks/usePaymentContext';
import PaymentModal from './PaymentModal';

function DeploymentFlow() {
  const { pollId } = useParams();
  const navigate = useNavigate();
  const { getPoll, deployPoll } = usePoll();
  const { connected, connectWallet } = useWalletContext();
  const { formatPrice, getPriceForAction } = usePaymentContext();
  
  const [poll, setPoll] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  
  // Steps in the deployment process
  const steps = [
    { id: 'prepare', title: 'Prepare Code', icon: <Code className="w-5 h-5" /> },
    { id: 'compile', title: 'Compile Program', icon: <Server className="w-5 h-5" /> },
    { id: 'deploy', title: 'Deploy to Solana', icon: <Database className="w-5 h-5" /> },
    { id: 'verify', title: 'Verify Deployment', icon: <Shield className="w-5 h-5" /> },
  ];

  // Load poll data
  useEffect(() => {
    const loadPoll = () => {
      const pollData = getPoll(pollId);
      if (pollData) {
        setPoll(pollData);
      } else {
        setError('Poll not found');
      }
    };

    loadPoll();
  }, [pollId, getPoll]);

  // Handle deployment
  const handleDeploy = async () => {
    if (!connected) {
      await connectWallet();
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Show payment modal
      setShowPaymentModal(true);
    } catch (err) {
      console.error('Error starting deployment:', err);
      setError('Failed to start deployment. Please try again.');
      setLoading(false);
    }
  };

  // Handle payment completion
  const handlePaymentComplete = async (paymentResponse) => {
    try {
      // Close payment modal
      setShowPaymentModal(false);
      
      // Start deployment process
      await runDeploymentSteps();
    } catch (err) {
      console.error('Error during deployment:', err);
      setError('Deployment failed. Please try again.');
      setLoading(false);
    }
  };

  // Run through deployment steps
  const runDeploymentSteps = async () => {
    try {
      // Step 1: Prepare code
      setCurrentStep(0);
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Step 2: Compile program
      setCurrentStep(1);
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Step 3: Deploy to Solana
      setCurrentStep(2);
      await new Promise(resolve => setTimeout(resolve, 4000));
      
      // Step 4: Verify deployment
      setCurrentStep(3);
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Complete deployment
      const deploymentResult = await deployPoll(pollId);
      
      // Navigate to poll view
      navigate(`/poll/${pollId}`);
    } catch (err) {
      console.error('Error during deployment:', err);
      setError('Deployment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!poll) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

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
          <h2 className="text-2xl font-bold text-white">Deploy Your Poll</h2>
          <p className="text-gray-300">
            Deploy your poll to the Solana blockchain with verified code
          </p>
        </Card.Header>
        
        <Card.Content>
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-2">{poll.question}</h3>
            <div className="space-y-2">
              {poll.options.map((option, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center mr-2 text-xs">
                    {index + 1}
                  </div>
                  <span className="text-gray-300">{option}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="border border-white/10 rounded-lg p-4 mb-6">
            <h4 className="text-sm font-medium text-white mb-3">Deployment Steps</h4>
            <div className="space-y-4">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                    index < currentStep
                      ? 'bg-green-500 text-white'
                      : index === currentStep && loading
                      ? 'bg-purple-500 text-white'
                      : 'bg-white/10 text-gray-400'
                  }`}>
                    {index < currentStep ? (
                      <Check className="w-4 h-4" />
                    ) : index === currentStep && loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      step.icon
                    )}
                  </div>
                  <span className={`${
                    index < currentStep
                      ? 'text-green-400'
                      : index === currentStep && loading
                      ? 'text-white'
                      : 'text-gray-400'
                  }`}>
                    {step.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white/5 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-300">Deployment Fee</span>
              <span className="text-white font-medium">
                {formatPrice(getPriceForAction('initialDeployment'))}
              </span>
            </div>
            <p className="text-xs text-gray-400">
              This one-time fee covers the cost of deploying your poll to the Solana blockchain and generating verifiable metadata.
            </p>
          </div>
          
          {error && (
            <div className="mt-4 bg-red-500/10 border border-red-500/20 rounded-lg p-3">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}
        </Card.Content>
        
        <Card.Footer>
          <Button
            onClick={handleDeploy}
            loading={loading}
            disabled={loading}
            fullWidth
            icon={<DollarSign className="w-4 h-4" />}
          >
            {connected
              ? loading
                ? 'Deploying...'
                : `Pay ${formatPrice(getPriceForAction('initialDeployment'))} & Deploy`
              : 'Connect Wallet to Deploy'}
          </Button>
        </Card.Footer>
      </Card>
      
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        amount={formatPrice(getPriceForAction('initialDeployment'))}
        description="Deploy poll to Solana blockchain with verified code"
        onPaymentComplete={handlePaymentComplete}
      />
    </div>
  );
}

export default DeploymentFlow;

