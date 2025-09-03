import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePoll } from '../context/PollContext';
import { usePaymentContext } from '../hooks/usePaymentContext';
import { Check, Clock, DollarSign, ExternalLink, Code, Package } from 'lucide-react';

function DeploymentFlow() {
  const { pollId } = useParams();
  const navigate = useNavigate();
  const { getPoll, updatePoll } = usePoll();
  const { createSession } = usePaymentContext();
  
  const [poll, setPoll] = useState(null);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [deploymentStep, setDeploymentStep] = useState(0);
  const [deploymentError, setDeploymentError] = useState(null);

  const deploymentSteps = [
    { name: 'Payment Processing', icon: DollarSign },
    { name: 'Generating Anchor Program', icon: Code },
    { name: 'Compiling Smart Contract', icon: Package },
    { name: 'Deploying to Solana Devnet', icon: ExternalLink },
    { name: 'Generating Metadata', icon: Check },
    { name: 'Pinning to IPFS', icon: Check },
  ];

  useEffect(() => {
    const foundPoll = getPoll(pollId);
    if (!foundPoll) {
      navigate('/');
      return;
    }
    setPoll(foundPoll);
  }, [pollId, getPoll, navigate]);

  const handlePayment = async () => {
    try {
      await createSession('$0.005'); // $5 deployment fee
      setPaymentCompleted(true);
      startDeployment();
    } catch (error) {
      console.error('Payment failed:', error);
      setDeploymentError('Payment failed. Please try again.');
    }
  };

  const startDeployment = async () => {
    // Simulate deployment process
    for (let i = 0; i < deploymentSteps.length; i++) {
      setDeploymentStep(i);
      await new Promise(resolve => setTimeout(resolve, 2000)); // 2 second delay per step
    }

    // Update poll with deployment data
    const deploymentData = {
      status: 'deployed',
      programId: `program_${Math.random().toString(36).substring(7)}`,
      metadataHash: `metadata_${Math.random().toString(36).substring(7)}`,
      deployedAt: new Date(),
    };

    updatePoll(pollId, deploymentData);
    setPoll(prev => ({ ...prev, ...deploymentData }));
    setDeploymentStep(deploymentSteps.length);
  };

  if (!poll) {
    return <div className="text-white">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Deploy Poll dApp</h1>
        <p className="text-gray-300">
          Deploy "{poll.question}" to Solana Devnet with verified metadata
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Deployment Progress */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-6">
          <h2 className="text-xl font-semibold text-white mb-6">Deployment Progress</h2>

          {!paymentCompleted ? (
            <div className="space-y-6">
              <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-2">Deployment Fee</h3>
                <p className="text-gray-300 mb-4">
                  Initial deployment: <span className="text-green-400 font-semibold">$5</span>
                </p>
                <ul className="text-sm text-gray-300 space-y-1 mb-6">
                  <li>• Anchor program generation & compilation</li>
                  <li>• Solana Devnet deployment</li>
                  <li>• IPFS metadata pinning</li>
                  <li>• Verifiable build artifacts</li>
                </ul>
                <button
                  onClick={handlePayment}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-6 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
                >
                  Pay $5 & Deploy
                </button>
              </div>
              
              {deploymentError && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                  <p className="text-red-400">{deploymentError}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {deploymentSteps.map((step, index) => {
                const isCompleted = index < deploymentStep;
                const isCurrent = index === deploymentStep;
                const isPending = index > deploymentStep;

                return (
                  <div key={index} className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isCompleted 
                        ? 'bg-green-500' 
                        : isCurrent 
                        ? 'bg-purple-500 animate-pulse' 
                        : 'bg-gray-600'
                    }`}>
                      {isCompleted ? (
                        <Check className="w-4 h-4 text-white" />
                      ) : isCurrent ? (
                        <Clock className="w-4 h-4 text-white animate-spin" />
                      ) : (
                        <step.icon className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                    <span className={`${
                      isCompleted 
                        ? 'text-green-400' 
                        : isCurrent 
                        ? 'text-white' 
                        : 'text-gray-400'
                    }`}>
                      {step.name}
                    </span>
                  </div>
                );
              })}

              {deploymentStep >= deploymentSteps.length && (
                <div className="mt-6 space-y-4">
                  <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                    <h3 className="text-green-400 font-semibold mb-2">Deployment Successful!</h3>
                    <p className="text-gray-300 text-sm">
                      Your poll dApp has been deployed and verified on Solana Devnet
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => navigate(`/poll/${pollId}`)}
                      className="btn-primary"
                    >
                      View dApp
                    </button>
                    <button
                      onClick={() => navigate('/')}
                      className="btn-secondary"
                    >
                      Dashboard
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Poll Preview */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-6">
          <h2 className="text-xl font-semibold text-white mb-6">Poll Preview</h2>
          
          <div className="bg-white/5 rounded-lg p-6 border border-white/10">
            <h3 className="text-lg font-semibold text-white mb-4">{poll.question}</h3>
            
            <div className="space-y-3">
              {poll.options.map((option, index) => (
                <button
                  key={index}
                  className="w-full text-left p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-gray-300"
                  disabled
                >
                  {option}
                </button>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-white/10">
              <div className="text-sm text-gray-400 space-y-1">
                <p>Creator: {poll.creatorAddress}</p>
                {poll.programId && <p>Program ID: {poll.programId}</p>}
                {poll.metadataHash && <p>Metadata: {poll.metadataHash}</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeploymentFlow;