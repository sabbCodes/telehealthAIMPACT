import { motion } from 'framer-motion';
import { ArrowRight, Shield, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';
import { useAuthStore } from '../../store/useAuthStore';

export const CTA: React.FC = () => {
  const navigate = useNavigate();
  const { isConnected, isOnboarded } = useAuthStore();

  const handleGetStarted = () => {
    if (!isConnected) {
      // Trigger wallet connection
      document.querySelector('[data-wallet-button]')?.click();
    } else if (!isOnboarded) {
      navigate('/onboarding');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <section className="py-20 bg-gradient-to-r from-blue-900/20 to-purple-900/20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Healthcare?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of patients and doctors already using teleHealthSol for secure, 
            accessible, and affordable healthcare worldwide.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="group" onClick={handleGetStarted}>
              Get Started Now
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="outline" size="lg" onClick={() => navigate('/doctors')}>
              Browse Doctors
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            <div className="flex items-center justify-center space-x-3">
              <Shield className="w-6 h-6 text-blue-400" />
              <span className="text-gray-300">Blockchain Secured</span>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <Zap className="w-6 h-6 text-purple-400" />
              <span className="text-gray-300">Instant Payments</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
