import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X, Heart, Wallet } from 'lucide-react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Button } from '../ui/Button';
import { useAuthStore } from '../../store/useAuthStore';

export const LandingHeader: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { connected } = useWallet();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (connected && user) {
      const dashboardPath = user.role === 'DOCTOR' ? '/dashboard/doctor' : '/dashboard/patient';
      navigate(dashboardPath);
    } else if (connected) {
      navigate('/signup');
    } else {
      // Wallet connection will be handled by WalletMultiButton
    }
  };

  return (
    <header className="bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Heart className="w-8 h-8 text-blue-500" />
            <span className="text-xl font-bold text-white">TeleHealthSol</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-300 hover:text-white transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="text-gray-300 hover:text-white transition-colors">
              How It Works
            </a>
            <a href="#doctors" className="text-gray-300 hover:text-white transition-colors">
              Doctors
            </a>
            <a href="#testimonials" className="text-gray-300 hover:text-white transition-colors">
              Testimonials
            </a>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <Button onClick={handleGetStarted}>
                Go to Dashboard
              </Button>
            ) : (
              <>
                <Link to="/signin">
                  <Button variant="outline">Sign In</Button>
                </Link>
                {connected ? (
                  <Button onClick={handleGetStarted}>
                    Get Started
                  </Button>
                ) : (
                  <WalletMultiButton className="!bg-blue-600 !rounded-lg !text-white hover:!bg-blue-700" />
                )}
              </>
            )}
          </div>

          <button
            className="md:hidden text-gray-300 hover:text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden py-4 border-t border-gray-800"
          >
            <nav className="flex flex-col space-y-4">
              <a href="#features" className="text-gray-300 hover:text-white transition-colors">
                Features
              </a>
              <a href="#how-it-works" className="text-gray-300 hover:text-white transition-colors">
                How It Works
              </a>
              <a href="#doctors" className="text-gray-300 hover:text-white transition-colors">
                Doctors
              </a>
              <a href="#testimonials" className="text-gray-300 hover:text-white transition-colors">
                Testimonials
              </a>
              <div className="flex flex-col space-y-2 pt-4">
                {user ? (
                  <Button onClick={handleGetStarted} className="w-full">
                    Go to Dashboard
                  </Button>
                ) : (
                  <>
                    <Link to="/signin" className="w-full">
                      <Button variant="outline" className="w-full">Sign In</Button>
                    </Link>
                    {connected ? (
                      <Button onClick={handleGetStarted} className="w-full">
                        Get Started
                      </Button>
                    ) : (
                      <WalletMultiButton className="!w-full !bg-blue-600 !rounded-lg !text-white hover:!bg-blue-700" />
                    )}
                  </>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </div>
    </header>
  );
};
