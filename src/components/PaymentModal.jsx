import React, { useState } from 'react';
import { X, CreditCard, Wallet, Check } from 'lucide-react';
import Modal from './ui/Modal';
import Button from './ui/Button';
import { useWalletContext } from '../context/WalletContext';

function PaymentModal({ isOpen, onClose, amount, description, onPaymentComplete }) {
  const { connected, connectWallet, publicKey, signTransaction } = useWalletContext();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  // Handle payment
  const handlePayment = async () => {
    if (!connected) {
      await connectWallet();
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Show success state
      setSuccess(true);
      
      // Wait a moment before closing
      setTimeout(() => {
        onPaymentComplete({ success: true });
      }, 1500);
    } catch (err) {
      console.error('Payment error:', err);
      setError('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={!loading ? onClose : undefined}>
      <div className="relative">
        <button
          onClick={onClose}
          disabled={loading}
          className="absolute top-2 right-2 text-gray-400 hover:text-white p-1 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-white">Complete Payment</h3>
          <p className="text-gray-300 mt-1">{description}</p>
        </div>
        
        {success ? (
          <div className="flex flex-col items-center justify-center py-6">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
              <Check className="w-8 h-8 text-green-400" />
            </div>
            <h4 className="text-lg font-semibold text-white mb-1">Payment Successful</h4>
            <p className="text-gray-400">Your deployment is being processed...</p>
          </div>
        ) : (
          <>
            <div className="bg-white/5 border border-white/10 rounded-lg p-4 mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-300">Amount</span>
                <span className="text-xl font-bold text-white">{amount}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">Wallet</span>
                <span className="text-gray-300 truncate max-w-[200px]">
                  {publicKey ? publicKey.toString().slice(0, 6) + '...' + publicKey.toString().slice(-4) : 'Not connected'}
                </span>
              </div>
            </div>
            
            <div className="space-y-3 mb-6">
              <button
                onClick={handlePayment}
                disabled={loading}
                className="w-full flex items-center justify-between bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg p-4 transition-colors"
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center mr-3">
                    <Wallet className="w-5 h-5 text-purple-400" />
                  </div>
                  <div className="text-left">
                    <p className="text-white font-medium">Pay with Wallet</p>
                    <p className="text-xs text-gray-400">Phantom Wallet</p>
                  </div>
                </div>
                <div className="w-5 h-5 border-2 border-white/30 rounded-full"></div>
              </button>
              
              <button
                disabled={true}
                className="w-full flex items-center justify-between bg-white/5 border border-white/10 rounded-lg p-4 opacity-50 cursor-not-allowed"
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-500/20 rounded-full flex items-center justify-center mr-3">
                    <CreditCard className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="text-left">
                    <p className="text-white font-medium">Pay with Card</p>
                    <p className="text-xs text-gray-400">Coming soon</p>
                  </div>
                </div>
                <div className="w-5 h-5 border-2 border-white/30 rounded-full"></div>
              </button>
            </div>
            
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-4">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}
            
            <Button
              onClick={handlePayment}
              loading={loading}
              disabled={loading}
              fullWidth
            >
              {connected ? 'Pay Now' : 'Connect Wallet'}
            </Button>
            
            <p className="text-xs text-gray-400 text-center mt-4">
              By proceeding, you agree to our Terms of Service and Privacy Policy.
            </p>
          </>
        )}
      </div>
    </Modal>
  );
}

export default PaymentModal;

