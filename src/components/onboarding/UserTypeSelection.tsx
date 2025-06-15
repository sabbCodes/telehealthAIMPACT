import { motion } from "framer-motion";
import { Stethoscope, User, ArrowRight } from "lucide-react";

interface UserTypeSelectionProps {
  onSelect: (userType: "DOCTOR" | "PATIENT") => void;
}

export const UserTypeSelection: React.FC<UserTypeSelectionProps> = ({ onSelect }) => {
  const handleSelect = (userType: "DOCTOR" | "PATIENT") => {
    console.log("UserTypeSelection: handleSelect called with", userType);
    onSelect(userType);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Choose Your Role</h2>
        <p className="text-gray-400">
          Are you a healthcare provider or seeking medical care?
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <button
          onClick={() => handleSelect("DOCTOR")}
          className="w-full bg-gray-800 rounded-lg p-8 border-2 border-transparent hover:border-blue-500 transition-all text-left group"
          >
          <div className="text-center">
            <div className="bg-blue-600/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-600/30 transition-colors">
                <Stethoscope className="w-10 h-10 text-blue-400" />
              </div>
            <h3 className="text-2xl font-semibold text-white mb-3">
              I'm a Doctor
            </h3>
            <p className="text-gray-400 mb-6">
              Provide medical consultations and connect with patients
              worldwide
              </p>
              <div className="flex items-center justify-center text-blue-400 group-hover:text-blue-300">
                <span className="mr-2">Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
        </button>

        <button
          onClick={() => handleSelect("PATIENT")}
          className="w-full bg-gray-800 rounded-lg p-8 border-2 border-transparent hover:border-green-500 transition-all text-left group"
          >
          <div className="text-center">
            <div className="bg-green-600/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-green-600/30 transition-colors">
                <User className="w-10 h-10 text-green-400" />
              </div>
            <h3 className="text-2xl font-semibold text-white mb-3">
              I'm a Patient
            </h3>
            <p className="text-gray-400 mb-6">
                Find qualified doctors and get medical care from anywhere
              </p>
              <div className="flex items-center justify-center text-green-400 group-hover:text-green-300">
                <span className="mr-2">Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
        </button>
      </div>
    </div>
  );
};
