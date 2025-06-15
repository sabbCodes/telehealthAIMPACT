import { motion } from "framer-motion";
import { Shield, Globe, Zap, Lock, Clock, Heart } from "lucide-react";

export const Features: React.FC = () => {
  const features = [
    {
      icon: Shield,
      title: "Secure & Private",
      description:
        "End-to-end encrypted consultations with blockchain security ensuring your medical data remains private and secure.",
    },
    {
      icon: Globe,
      title: "Global Access",
      description:
        "Connect with doctors worldwide, breaking geographical barriers and bringing quality healthcare to underserved regions.",
    },
    {
      icon: Zap,
      title: "Instant Payments",
      description:
        "Solana-powered escrow system ensures fair and fast transactions between patients and healthcare providers.",
    },
    {
      icon: Lock,
      title: "Blockchain Records",
      description:
        "Your medical records are securely stored on the blockchain, giving you complete control over your health data.",
    },
    {
      icon: Clock,
      title: "24/7 Availability",
      description:
        "Access healthcare services anytime, anywhere with our global network of doctors across different time zones.",
    },
    {
      icon: Heart,
      title: "AI-Powered Triage",
      description:
        "Smart AI system helps assess your symptoms and connects you with the most appropriate specialist.",
    },
  ];

  return (
    <section id="features" className="py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-white mb-4">
            Why Choose TeleHealthSol?
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Experience the future of healthcare with our innovative
            blockchain-powered platform
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-blue-500/50 transition-all duration-300"
            >
              <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <feature.icon className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
