import { useState } from "react";
import { motion } from "framer-motion";
import { Save } from "lucide-react";
import { OnboardingData, PatientOnboardingProps } from "../../types";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { toast } from "react-hot-toast";

export const PatientOnboarding: React.FC<PatientOnboardingProps> = ({
  initialData,
  onComplete,
  isLoading,
}) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    email: initialData?.email || "",
    password: "",
    confirmPassword: "",
    dateOfBirth: initialData?.dateOfBirth || new Date(),
    gender: initialData?.gender || "",
    bloodType: initialData?.bloodType || "",
    allergies: initialData?.allergies || "",
    medications: initialData?.medications || "",
  });

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
      userType: "PATIENT",
      ...formData,
    });
  };

  return (
    <Card>
      <div className="p-6">
        <h2 className="text-2xl font-bold text-white mb-6">
          Patient Profile Setup
        </h2>
        
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
              label="Date of Birth"
                type="date"
              value={formData.dateOfBirth.toISOString().split("T")[0]}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  dateOfBirth: new Date(e.target.value),
                })
              }
              required
            />
            <Input
              label="Gender"
              type="select"
                value={formData.gender}
              onChange={(e) =>
                setFormData({ ...formData, gender: e.target.value })
              }
              options={[
                { value: "male", label: "Male" },
                { value: "female", label: "Female" },
                { value: "other", label: "Other" },
              ]}
            />
            <Input
              label="Blood Type"
              type="select"
                value={formData.bloodType}
              onChange={(e) =>
                setFormData({ ...formData, bloodType: e.target.value })
              }
              options={[
                { value: "A+", label: "A+" },
                { value: "A-", label: "A-" },
                { value: "B+", label: "B+" },
                { value: "B-", label: "B-" },
                { value: "AB+", label: "AB+" },
                { value: "AB-", label: "AB-" },
                { value: "O+", label: "O+" },
                { value: "O-", label: "O-" },
              ]}
            />
            <Input
              label="Allergies"
              type="textarea"
              value={formData.allergies}
              onChange={(e) =>
                setFormData({ ...formData, allergies: e.target.value })
              }
            />
            <Input
              label="Current Medications"
              type="textarea"
              value={formData.medications}
              onChange={(e) =>
                setFormData({ ...formData, medications: e.target.value })
              }
            />
          </div>

          <Button type="submit" disabled={isLoading} className="w-full">
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
