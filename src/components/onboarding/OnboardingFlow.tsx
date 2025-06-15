import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useWallet } from "@solana/wallet-adapter-react";
import { motion, AnimatePresence } from "framer-motion";
import { UserCheck } from "lucide-react";
import { OnboardingData } from "../../types";
import { UserTypeSelection } from "./UserTypeSelection";
import { DoctorOnboarding } from "./DoctorOnboarding";
import { PatientOnboarding } from "./PatientOnboarding";
import { useAuthStore } from "../../store/useAuthStore";
import { supabaseAdmin } from "../../lib/supabase";
import { toast } from "react-hot-toast";

export const OnboardingFlow: React.FC = () => {
  const [step, setStep] = useState(0);
  const [onboardingData, setOnboardingData] = useState<Partial<OnboardingData>>(
    {}
  );
  const [isLoading, setIsLoading] = useState(false);
  const { publicKey } = useWallet();
  const { setUser, setOnboarded } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("OnboardingFlow: Current step:", step);
    console.log("OnboardingFlow: Current onboarding data:", onboardingData);
  }, [step, onboardingData]);

  const handleUserTypeSelect = (userType: "DOCTOR" | "PATIENT") => {
    console.log("OnboardingFlow: handleUserTypeSelect called with", userType);

    // Update the onboarding data first
    setOnboardingData((prev) => ({
      ...prev,
      userType,
    }));

    // Then update the step
    setStep(1);
  };

  const handleComplete = async (data: OnboardingData) => {
    if (!publicKey) {
      toast.error("Please connect your wallet first");
      return;
    }

    setIsLoading(true);

    try {
      console.log("Starting account creation with data:", data);

      // First, create an auth user
      const { data: authData, error: authError } =
        await supabaseAdmin.auth.admin.createUser({
          email: data.email,
          password: data.password,
          email_confirm: true,
          user_metadata: {
            wallet_address: publicKey.toString(),
            name: data.name,
            role: data.userType,
          },
        });

      if (authError) {
        console.error("Error creating auth user:", authError);
        if (authError.message.includes("already been registered")) {
          toast.error(
            "This email is already registered. Please use a different email or sign in."
          );
        } else {
          toast.error(`Failed to create account: ${authError.message}`);
        }
        return;
      }

      if (!authData?.user?.id) {
        console.error("No user ID returned from auth creation");
        toast.error("Failed to create account: No user ID returned");
        return;
      }

      console.log("Auth user created successfully:", authData);

      // Then create the user record
      const { data: userData, error: userError } = await supabaseAdmin
        .from("users")
        .insert({
          id: authData.user.id,
          wallet_address: publicKey.toString(),
          name: data.name,
          email: data.email,
          role: data.userType,
        })
        .select()
        .single();

      if (userError) {
        console.error("Error creating user record:", userError);
        toast.error(`Failed to create user record: ${userError.message}`);
        return;
      }

      if (!userData) {
        console.error("No user data returned from user creation");
        toast.error("Failed to create user record: No data returned");
        return;
      }

      console.log("User record created successfully:", userData);

      // Create profile based on user type
      if (data.userType === "DOCTOR") {
        const { error: profileError } = await supabaseAdmin
          .from("doctor_profiles")
          .insert({
            user_id: userData.id,
            specialty: data.specialty!,
            experience: data.experience!,
            location: data.location!,
            bio: data.bio || "",
            education: data.education || "",
            consultation_fee: data.consultationFee!,
            is_verified: false,
          });

        if (profileError) {
          console.error("Error creating doctor profile:", profileError);
          toast.error(
            `Failed to create doctor profile: ${profileError.message}`
          );
          return;
        }
      } else {
        const { error: profileError } = await supabaseAdmin
          .from("patient_profiles")
          .insert({
            user_id: userData.id,
            date_of_birth: data.dateOfBirth?.toISOString(),
            gender: data.gender || "",
            blood_type: data.bloodType || "",
            allergies: data.allergies || "",
            medications: data.medications || "",
          });

        if (profileError) {
          console.error("Error creating patient profile:", profileError);
          toast.error(
            `Failed to create patient profile: ${profileError.message}`
          );
          return;
        }
      }

      console.log("Profile created successfully");

      // Don't set user state here, let them sign in first
      // setUser({
      //   id: userData.id,
      //   walletAddress: userData.wallet_address,
      //   name: userData.name,
      //   email: userData.email,
      //   role: userData.role,
      // });
      // setOnboarded(true);

      // Show success message and redirect after a short delay
      toast.success("Account created successfully! Redirecting to sign in...");
      setTimeout(() => {
        navigate("/signin");
      }, 2000);
    } catch (error: any) {
      console.error("Onboarding failed:", error);
      toast.error(
        `Failed to create account: ${error.message || "Unknown error"}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-4xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center mb-6">
            <UserCheck className="w-12 h-12 text-blue-500" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome to TeleHealthSol
          </h1>
          <p className="text-gray-400">Let's get you set up</p>
        </motion.div>

        <AnimatePresence mode="wait">
          {step === 0 ? (
            <motion.div
              key="user-type"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="bg-gray-800 rounded-lg p-6 border border-gray-700"
            >
              <UserTypeSelection onSelect={handleUserTypeSelect} />
            </motion.div>
          ) : (
            <motion.div
              key="onboarding-form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-gray-800 rounded-lg p-6 border border-gray-700"
            >
              {onboardingData.userType === "DOCTOR" ? (
                <DoctorOnboarding
                  initialData={onboardingData}
                  onComplete={handleComplete}
                  isLoading={isLoading}
                />
              ) : (
                <PatientOnboarding
                  initialData={onboardingData}
                  onComplete={handleComplete}
                  isLoading={isLoading}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
