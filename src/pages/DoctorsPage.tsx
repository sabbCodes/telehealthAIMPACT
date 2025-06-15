import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Filter,
  Star,
  MapPin,
  Clock,
  Brain,
  ArrowLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { AITriage } from "../components/triage/AITriage";
import { DoctorList } from "../components/doctors/DoctorList";
import { BookingModal } from "../components/scheduling/BookingModal";
import { Doctor, Session } from "../types";
import { supabase, supabaseAdmin } from "../lib/supabase";
import { useAuthStore } from "../store/useAuthStore";
import { toast } from "react-hot-toast";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
  clusterApiUrl,
} from "@solana/web3.js";

export const DoctorsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { publicKey, sendTransaction } = useWallet();
  const [activeTab, setActiveTab] = useState<"browse" | "triage">("browse");
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [isBooking, setIsBooking] = useState(false);

  const handleSelectDoctor = (doctor: Doctor) => {
    if (!user) {
      toast.error("Please sign in to book a consultation");
      navigate("/signin");
      return;
    }
    setSelectedDoctor(doctor);
    setShowBookingModal(true);
  };

  const handleBookConsultation = async (bookingData: {
    date: Date;
    duration: number;
    notes?: string;
  }) => {
    if (!user || !selectedDoctor || !publicKey) return;

    let toastId: string | undefined;

    try {
      setIsBooking(true);
      toastId = toast.loading("Preparing payment...");

      // Get doctor's wallet address
      const { data: doctorData, error: doctorError } = await supabaseAdmin
        .from("users")
        .select("wallet_address")
        .eq("id", selectedDoctor.id)
        .single();

      if (doctorError) {
        toast.error("Failed to get doctor's wallet address");
        throw doctorError;
      }

      if (!doctorData.wallet_address) {
        toast.error("Doctor's wallet address not found");
        throw new Error("Doctor's wallet address not found");
      }

      // Create Solana connection
      const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
      const doctorPublicKey = new PublicKey(doctorData.wallet_address);

      // Check sender's balance
      const balance = await connection.getBalance(publicKey);
      const requiredAmount =
        selectedDoctor.consultationFee * LAMPORTS_PER_SOL + 5000; // Add 5000 lamports for fees

      if (balance < requiredAmount) {
        toast.error(
          `Insufficient balance. Required: ${
            requiredAmount / LAMPORTS_PER_SOL
          } SOL`
        );
        throw new Error("Insufficient balance");
      }

      // Get the latest blockhash
      const { blockhash, lastValidBlockHeight } =
        await connection.getLatestBlockhash();

      // Create legacy transaction
      const transaction = new Transaction();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;

      // Add transfer instruction
      transaction.add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: doctorPublicKey,
          lamports: selectedDoctor.consultationFee * LAMPORTS_PER_SOL,
        })
      );

      // Log transaction details for debugging
      console.log("Transaction details:", {
        from: publicKey.toString(),
        to: doctorPublicKey.toString(),
        amount: selectedDoctor.consultationFee * LAMPORTS_PER_SOL,
        blockhash,
        balance,
        requiredAmount,
      });

      toast.loading("Please approve the transaction in your wallet...", {
        id: toastId,
      });

      try {
        // Send transaction
        const signature = await sendTransaction(transaction, connection);
        console.log("Transaction sent:", signature);

        toast.loading("Confirming payment...", { id: toastId });

        // Wait for confirmation with timeout
        const confirmation = await connection.confirmTransaction(
          {
            signature,
            blockhash,
            lastValidBlockHeight,
          },
          "confirmed"
        );

        console.log("Transaction confirmation:", confirmation);

        if (confirmation.value.err) {
          toast.error("Payment failed. Please try again.");
          throw new Error("Transaction failed");
        }

        // Verify the transaction and balance changes
        const tx = await connection.getTransaction(signature, {
          commitment: "confirmed",
        });

        if (!tx) {
          toast.error("Transaction not found. Please try again.");
          throw new Error("Transaction not found");
        }

        // Verify balance changes
        const newBalance = await connection.getBalance(publicKey);
        const doctorNewBalance = await connection.getBalance(doctorPublicKey);

        console.log("Balance changes:", {
          senderOldBalance: balance,
          senderNewBalance: newBalance,
          doctorOldBalance: 0, // We don't have this
          doctorNewBalance,
        });

        if (newBalance >= balance) {
          toast.error("Transaction did not complete. Please try again.");
          throw new Error("No balance change detected");
        }

        toast.loading("Creating your consultation...", { id: toastId });

        // Create a new session after successful payment using supabaseAdmin
        console.log("Creating session with data:", {
          doctor_id: selectedDoctor.id,
          patient_id: user.id,
          scheduled_at: bookingData.date.toISOString(),
          duration: bookingData.duration,
          status: "CONFIRMED",
          payment_amount: selectedDoctor.consultationFee,
          payment_signature: signature,
          notes: bookingData.notes,
        });

        // First verify the session doesn't already exist
        const { data: existingSession, error: checkError } = await supabaseAdmin
          .from("sessions")
          .select("*")
          .eq("patient_id", user.id)
          .eq("doctor_id", selectedDoctor.id)
          .eq("scheduled_at", bookingData.date.toISOString())
          .single();

        console.log("Check for existing session:", {
          existingSession,
          checkError,
        });

        if (existingSession) {
          console.log("Session already exists:", existingSession);
          toast.success("Consultation already booked!");
          setShowBookingModal(false);
          setSelectedDoctor(null);
          navigate("/dashboard/patient");
          return;
        }

        // Create the new session
        const { data: session, error: sessionError } = await supabaseAdmin
          .from("sessions")
          .insert({
            doctor_id: selectedDoctor.id,
            patient_id: user.id,
            scheduled_at: bookingData.date.toISOString(),
            duration: bookingData.duration,
            status: "CONFIRMED",
            payment_amount: selectedDoctor.consultationFee,
            payment_signature: signature,
            notes: bookingData.notes,
          })
          .select()
          .single();

        if (sessionError) {
          console.error("Error creating session:", sessionError);
          toast.error("Failed to create consultation");
          throw sessionError;
        }

        console.log("Session created successfully:", session);

        // Verify the session was created with a direct query
        const { data: verifySession, error: verifyError } = await supabaseAdmin
          .from("sessions")
          .select("*")
          .eq("id", session.id)
          .single();

        console.log("Verification query result:", {
          verifySession,
          verifyError,
          sessionId: session.id,
        });

        if (!verifySession) {
          console.error(
            "Session verification failed - session not found after creation"
          );
          toast.error("Failed to verify session creation");
          throw new Error("Session verification failed");
        }

        toast.success("Consultation booked successfully!");
        setShowBookingModal(false);
        setSelectedDoctor(null);

        // Navigate to the patient's dashboard
        navigate("/dashboard/patient");
      } catch (txError: any) {
        console.error("Transaction error:", txError);
        toast.error(txError.message || "Failed to process payment");
        throw txError;
      }
    } catch (error: any) {
      console.error("Error booking consultation:", error);
      toast.error(error.message || "Failed to book consultation");
    } finally {
      setIsBooking(false);
      if (toastId) {
        toast.dismiss(toastId);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate("/dashboard/patient")}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <h1 className="text-2xl font-bold text-white">Find Healthcare</h1>
            </div>

            <div className="flex space-x-2">
              <Button
                variant={activeTab === "browse" ? "primary" : "outline"}
                onClick={() => setActiveTab("browse")}
                size="sm"
              >
                Browse Doctors
              </Button>
              <Button
                variant={activeTab === "triage" ? "primary" : "outline"}
                onClick={() => setActiveTab("triage")}
                size="sm"
                className="flex items-center space-x-2"
              >
                <Brain className="w-4 h-4" />
                <span>AI Triage</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="py-8">
        {activeTab === "browse" ? (
          <DoctorList onSelectDoctor={handleSelectDoctor} />
        ) : (
          <AITriage />
        )}
      </div>

      {/* Booking Modal */}
      {selectedDoctor && (
        <BookingModal
          doctor={selectedDoctor}
          isOpen={showBookingModal}
          onClose={() => {
            setShowBookingModal(false);
            setSelectedDoctor(null);
          }}
          onBook={handleBookConsultation}
          isLoading={isBooking}
        />
      )}
    </div>
  );
};
