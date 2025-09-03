import PollService from './pollService';
import DeploymentService from './deploymentService';
import VerificationService from './verificationService';
import PaymentService from './paymentService';

/**
 * API service manager that initializes and provides access to all API services
 */
class API {
  constructor() {
    this.initialized = false;
    this.services = {
      poll: null,
      deployment: null,
      verification: null,
      payment: null,
    };
  }

  /**
   * Initialize all API services
   * @param {Object} config - Configuration options
   * @param {string} config.endpoint - API endpoint URL
   * @param {Object} config.connection - Solana connection object
   * @returns {API} - The initialized API instance
   */
  initialize(config = {}) {
    // Initialize services
    this.services.poll = new PollService(config);
    this.services.deployment = new DeploymentService(config);
    this.services.verification = new VerificationService(config);
    this.services.payment = new PaymentService(config);
    
    this.initialized = true;
    return this;
  }

  /**
   * Get the poll service
   * @returns {PollService} - The poll service
   */
  getPollService() {
    this._checkInitialized();
    return this.services.poll;
  }

  /**
   * Get the deployment service
   * @returns {DeploymentService} - The deployment service
   */
  getDeploymentService() {
    this._checkInitialized();
    return this.services.deployment;
  }

  /**
   * Get the verification service
   * @returns {VerificationService} - The verification service
   */
  getVerificationService() {
    this._checkInitialized();
    return this.services.verification;
  }

  /**
   * Get the payment service
   * @returns {PaymentService} - The payment service
   */
  getPaymentService() {
    this._checkInitialized();
    return this.services.payment;
  }

  /**
   * Check if the API is initialized
   * @private
   * @throws {Error} - If the API is not initialized
   */
  _checkInitialized() {
    if (!this.initialized) {
      throw new Error('API not initialized. Call initialize() first.');
    }
  }
}

// Create and export a singleton instance
const api = new API();

// Auto-initialize with default config
api.initialize({
  endpoint: process.env.REACT_APP_API_ENDPOINT || 'https://api.verifyvote.com',
});

export default api;

