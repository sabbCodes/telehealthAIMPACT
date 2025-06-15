import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { motion } from 'framer-motion';
import { Heart, ArrowLeft } from 'lucide-react';
import { OnboardingFlow } from '../components/onboarding/OnboardingFlow';
import { Button } from '../components/ui/Button';
import { useAuthStore } from '../store/useAuthStore';

export const SignUpPage: React.FC = () => {
  const { connected, publicKey } = useWallet();
  const { user, setConnected } = useAuthStore();
  const navigate = useNavigate();
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    setConnected(connected);
    if (connected && publicKey && !user) {
      setShowOnboarding(true);
    }
  }, [connected, publicKey, user, setConnected]);

  useEffect(() => {
    if (user) {
      navigate('/signin');
    }
  }, [user, navigate]);

  if (showOnboarding && connected && publicKey) {
    return <OnboardingFlow />;
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center mb-6">
            <Heart className="w-12 h-12 text-blue-500" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Join TeleHealthSol</h1>
          <p className="text-gray-400">Connect your wallet to get started</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-800 rounded-lg p-6 border border-gray-700"
        >
          <div className="text-center">
            <h2 className="text-xl font-semibold text-white mb-4">Connect Your Wallet</h2>
            <p className="text-gray-400 mb-6">
              Your wallet address will serve as your unique TeleHealthSol ID
            </p>
            
            <div className="space-y-4">
              <WalletMultiButton className="!w-full !bg-blue-600 !rounded-lg !text-white hover:!bg-blue-700 !h-12" />
              
              {connected && publicKey && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-4 bg-green-900/20 border border-green-700 rounded-lg"
                >
                  <p className="text-green-400 text-sm">
                    Wallet connected successfully!
                  </p>
                  <p className="text-gray-400 text-xs mt-1 break-all">
                    {publicKey.toString()}
                  </p>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mt-6"
        >
          <Button
            variant="outline"
            onClick={() => navigate('/')}
            className="inline-flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </motion.div>
      </div>
    </div>
  );
};
