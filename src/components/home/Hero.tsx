import { motion } from 'framer-motion';
import { ArrowRight, Shield, Globe, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';
import { useAuthStore } from '../../store/useAuthStore';

export const Hero: React.FC = () => {
  const navigate = useNavigate();
  const { isConnected, isOnboarded } = useAuthStore();

  const handleFindDoctor = () => {
    if (!isConnected) {
      // Scroll to connect wallet section or show wallet modal
      document.querySelector('#features')?.scrollIntoView({ behavior: 'smooth' });
    } else if (!isOnboarded) {
      navigate('/onboarding');
    } else {
      navigate('/doctors');
    }
  };

  const handleJoinAsDoctor = () => {
    if (!isConnected) {
      document.querySelector('#features')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/onboarding');
    }
  };

  const features = [
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'End-to-end encrypted consultations with blockchain security'
    },
    {
      icon: Globe,
      title: 'Global Access',
      description: 'Connect with doctors worldwide, especially for underserved regions'
    },
    {
      icon: Zap,
      title: 'Instant Payments',
      description: 'Solana-powered escrow ensures fair and fast transactions'
    }
  ];

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-blue-900/20 to-purple-900/20">
      {/* Background Animation */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold mb-6"
          >
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Healthcare
            </span>
            <br />
            <span className="text-white">Without Borders</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto"
          >
            Connect with qualified doctors worldwide through our secure, blockchain-powered telemedicine platform. 
            Get quality healthcare regardless of your location.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            <Button size="lg" className="group" onClick={handleFindDoctor}>
              Find a Doctor
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="outline" size="lg" onClick={handleJoinAsDoctor}>
              Join as Doctor
            </Button>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                className="text-center"
              >
                <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};
