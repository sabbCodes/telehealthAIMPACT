import { useState } from "react";
import { motion } from "framer-motion";
import { Save, AlertCircle } from "lucide-react";
import { OnboardingData, DoctorOnboardingProps } from "../../types";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { toast } from "react-hot-toast";

export const DoctorOnboarding: React.FC<DoctorOnboardingProps> = ({
  initialData,
  onComplete,
  isLoading,
}) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    email: initialData?.email || "",
    password: "",
    confirmPassword: "",
    specialty: initialData?.specialty || "",
    experience: initialData?.experience || 0,
    location: initialData?.location || "",
    bio: initialData?.bio || "",
    education: initialData?.education || "",
    consultationFee: initialData?.consultationFee || 0,
  });

  const specialties = [
    "Cardiology",
    "Dermatology",
    "Pediatrics",
    "Neurology",
    "Orthopedics",
    "Psychiatry",
    "Radiology",
    "Surgery",
    "Internal Medicine",
    "Family Medicine",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    await onComplete({
      userType: "DOCTOR",
      ...formData,
    });
  };

  return (
    <Card>
      <div className="p-6">
        <h2 className="text-2xl font-bold text-white mb-6">
          Doctor Profile Setup
        </h2>

        <div className="bg-blue-900/20 border border-blue-500/50 rounded-lg p-4 mb-6">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5" />
            <div>
              <h3 className="text-blue-400 font-semibold mb-1">Verification Process</h3>
              <p className="text-gray-300 text-sm">
                Your profile will be reviewed by our medical team within 2-3 business days. 
                During this time, you can complete your profile setup, but you won't be able to 
                receive consultation requests until your account is verified. We'll notify you 
                via email once the verification is complete.
              </p>
            </div>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <Input
              label="Full Name"
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
            <Input
              label="Password"
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
            />
            <Input
              label="Confirm Password"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              required
            />
            <Input
              label="Specialty"
              type="select"
              value={formData.specialty}
              onChange={(e) =>
                setFormData({ ...formData, specialty: e.target.value })
              }
              required
              options={specialties.map(s => ({ value: s, label: s }))}
            />
            <Input
              label="Years of Experience"
              type="number"
              value={formData.experience}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  experience: parseInt(e.target.value),
                })
              }
              required
            />
            <Input
              label="Location"
              type="text"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              required
            />
            <Input
              label="Bio"
              type="textarea"
              value={formData.bio}
              onChange={(e) =>
                setFormData({ ...formData, bio: e.target.value })
              }
            />
            <Input
              label="Education"
              type="textarea"
              value={formData.education}
              onChange={(e) =>
                setFormData({ ...formData, education: e.target.value })
              }
            />
            <Input
              label="Consultation Fee (SOL)"
              type="number"
              value={formData.consultationFee}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  consultationFee: parseFloat(e.target.value),
                })
              }
              required
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Creating Account...
              </div>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Create Account
              </>
            )}
          </Button>
        </form>
      </div>
    </Card>
  );
};
