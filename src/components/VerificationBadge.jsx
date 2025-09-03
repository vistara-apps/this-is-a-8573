import React, { useState } from 'react';
import { Shield, ExternalLink, Info, X } from 'lucide-react';
import Tooltip from './ui/Tooltip';
import Modal from './ui/Modal';
import Button from './ui/Button';

function VerificationBadge({ isVerified, metadata }) {
  const [showModal, setShowModal] = useState(false);

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <div
        onClick={openModal}
        className={`flex items-center px-2 py-1 rounded-full cursor-pointer transition-colors ${
          isVerified
            ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
            : 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30'
        }`}
      >
        <Shield className="w-3 h-3 mr-1" />
        <span className="text-xs font-medium">
          {isVerified ? 'Verified' : 'Unverified'}
        </span>
      </div>

      <Modal isOpen={showModal} onClose={closeModal}>
        <div className="relative">
          <button
            onClick={closeModal}
            className="absolute top-2 right-2 text-gray-400 hover:text-white p-1 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <Shield className="w-6 h-6 text-green-400" />
            </div>
            <h3 className="text-xl font-bold text-white">Verified Deployment</h3>
            <p className="text-gray-300 mt-1">
              This poll has been verified on the Solana blockchain
            </p>
          </div>

          <div className="space-y-4 mb-6">
            <div className="bg-white/5 border border-white/10 rounded-lg p-4">
              <h4 className="text-sm font-medium text-white mb-3">Verification Details</h4>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400 text-sm">Status</span>
                  <span className="text-green-400 text-sm font-medium">Verified</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-400 text-sm">Deployment Date</span>
                  <span className="text-white text-sm">
                    {new Date().toLocaleDateString()}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-400 text-sm">Metadata Hash</span>
                  <span className="text-white text-sm font-mono">
                    {metadata?.ipfsHash?.substring(0, 8)}...
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-lg p-4">
              <h4 className="text-sm font-medium text-white mb-3">What This Means</h4>
              
              <div className="space-y-3 text-sm text-gray-300">
                <div className="flex">
                  <Info className="w-4 h-4 text-purple-400 mr-2 flex-shrink-0 mt-0.5" />
                  <p>
                    The code for this poll has been verified and matches the deployed program on the Solana blockchain.
                  </p>
                </div>
                
                <div className="flex">
                  <Info className="w-4 h-4 text-purple-400 mr-2 flex-shrink-0 mt-0.5" />
                  <p>
                    The build artifacts and source code have been pinned to IPFS/Arweave for permanent verification.
                  </p>
                </div>
                
                <div className="flex">
                  <Info className="w-4 h-4 text-purple-400 mr-2 flex-shrink-0 mt-0.5" />
                  <p>
                    You can trust that this poll operates exactly as described in the source code.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              onClick={closeModal}
              className="sm:flex-1"
            >
              Close
            </Button>
            
            <a
              href={`https://ipfs.io/ipfs/${metadata?.ipfsHash || ''}`}
              target="_blank"
              rel="noopener noreferrer"
              className="sm:flex-1"
            >
              <Button
                icon={<ExternalLink className="w-4 h-4" />}
                fullWidth
              >
                View Metadata
              </Button>
            </a>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default VerificationBadge;

