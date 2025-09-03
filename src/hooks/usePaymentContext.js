import { useState, useEffect, createContext, useContext } from 'react';
import { useWalletContext } from '../context/WalletContext';
import api from '../api';

// Create context
const PaymentContext = createContext();

// Provider component
export function PaymentProvider({ children }) {
  const { connected, publicKey } = useWalletContext();
  const [pricing, setPricing] = useState(null);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load pricing when component mounts
  useEffect(() => {
    const loadPricing = async () => {
      try {
        setLoading(true);
        
        if (api.initialized) {
          const paymentService = api.getPaymentService();
          const pricingData = await paymentService.getPricing();
          setPricing(pricingData);
        }
      } catch (err) {
        console.error('Error loading pricing:', err);
        setError('Failed to load pricing information');
      } finally {
        setLoading(false);
      }
    };

    loadPricing();
  }, []);

  // Load payment history when wallet is connected
  useEffect(() => {
    const loadPaymentHistory = async () => {
      if (connected && publicKey && api.initialized) {
        try {
          setLoading(true);
          
          const paymentService = api.getPaymentService();
          const history = await paymentService.getPaymentHistory(publicKey.toString());
          
          setPaymentHistory(history);
          setError(null);
        } catch (err) {
          console.error('Error loading payment history:', err);
          setError('Failed to load payment history');
        } finally {
          setLoading(false);
        }
      } else {
        // Reset payment history when disconnected
        setPaymentHistory([]);
      }
    };

    loadPaymentHistory();
  }, [connected, publicKey]);

  // Create a payment session
  const createSession = async (amount) => {
    try {
      setLoading(true);
      setError(null);
      
      if (!connected) {
        throw new Error('Wallet not connected');
      }
      
      if (!api.initialized) {
        throw new Error('API not initialized');
      }
      
      const paymentService = api.getPaymentService();
      const session = await paymentService.createSession(amount);
      
      // Refresh payment history after successful payment
      const history = await paymentService.getPaymentHistory(publicKey.toString());
      setPaymentHistory(history);
      
      return session;
    } catch (err) {
      console.error('Error creating payment session:', err);
      setError(`Payment failed: ${err.message}`);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Format price for display
  const formatPrice = (price) => {
    return `$${price.toFixed(2)}`;
  };

  // Get price for a specific action
  const getPriceForAction = (action) => {
    if (!pricing) return null;
    
    switch (action) {
      case 'initialDeployment':
        return pricing.initialDeployment;
      case 'subsequentUpdate':
        return pricing.subsequentUpdate;
      case 'analyticsMonthly':
        return pricing.analyticsMonthly;
      default:
        return null;
    }
  };

  return (
    <PaymentContext.Provider
      value={{
        pricing,
        paymentHistory,
        loading,
        error,
        createSession,
        formatPrice,
        getPriceForAction,
      }}
    >
      {children}
    </PaymentContext.Provider>
  );
}

// Hook for using the payment context
export function usePaymentContext() {
  const context = useContext(PaymentContext);
  
  if (!context) {
    throw new Error('usePaymentContext must be used within a PaymentProvider');
  }
  
  return context;
}

export default usePaymentContext;

