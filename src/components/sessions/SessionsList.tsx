import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, Clock, MessageCircle } from "lucide-react";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { supabase, supabaseAdmin } from "../../lib/supabase";
import { useAuthStore } from "../../store/useAuthStore";
import { toast } from "react-hot-toast";
import { format } from "date-fns";

interface Session {
  id: string;
  doctor_id: string;
  patient_id: string;
  scheduled_at: string;
  duration: number;
  status: "PENDING" | "CONFIRMED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  payment_amount: number;
  notes?: string;
  payment_signature?: string;
  doctor: {
    name: string;
    doctor_profiles: {
      specialty: string;
    }[];
  };
  patient: {
    name: string;
  };
}

interface UserData {
  id: string;
  name: string;
  patient_profiles?: { date_of_birth: string }[];
  doctor_profiles?: { specialty: string }[];
}

interface SessionsListProps {
  role: "DOCTOR" | "PATIENT";
}

export const SessionsList: React.FC<SessionsListProps> = ({ role }) => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchSessions();
  }, [user?.id]);

  const fetchSessions = async () => {
    if (!user?.id) return;

    try {
      console.log("Fetching sessions for user:", user.id, "role:", role);

      // First, get the sessions without joins using supabaseAdmin
      const { data: sessionsData, error: sessionsError } = await supabaseAdmin
        .from("sessions")
        .select("*")
        .eq(role === "DOCTOR" ? "doctor_id" : "patient_id", user.id)
        .order("scheduled_at", { ascending: false });

      if (sessionsError) {
        console.error("Error fetching sessions:", sessionsError);
        throw sessionsError;
      }

      console.log("Basic sessions query result:", sessionsData);

      if (!sessionsData || sessionsData.length === 0) {
        setSessions([]);
        return;
      }

      // Then, get the related doctor/patient data
      const userIds = sessionsData.map((session) =>
        role === "DOCTOR" ? session.patient_id : session.doctor_id
      );

      const { data: userData, error: userError } = await supabaseAdmin
        .from("users")
        .select(
          `
          id,
          name,
          ${role === "DOCTOR" ? "patient_profiles" : "doctor_profiles"} (
            ${role === "DOCTOR" ? "date_of_birth" : "specialty"}
          )
        `
        )
        .in("id", userIds);

      if (userError) {
        console.error("Error fetching user data:", userError);
        throw userError;
      }

      console.log("User data query result:", userData);

      // Combine the data
      const combinedSessions = sessionsData.map((session) => {
        const relatedUser = userData?.find(
          (user) =>
            user.id ===
            (role === "DOCTOR" ? session.patient_id : session.doctor_id)
        ) as UserData | undefined;

        const profiles =
          role === "DOCTOR"
            ? relatedUser?.patient_profiles || []
            : relatedUser?.doctor_profiles || [];

        return {
          ...session,
          [role === "DOCTOR" ? "patient" : "doctor"]: {
            id: relatedUser?.id,
            name: relatedUser?.name,
            [role === "DOCTOR" ? "patient_profiles" : "doctor_profiles"]:
              profiles,
          },
        };
      });

      console.log("Combined sessions data:", combinedSessions);
      setSessions(combinedSessions);
    } catch (error: any) {
      console.error("Error fetching sessions:", error);
      toast.error("Failed to load sessions");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: Session["status"]) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-500/20 text-yellow-400";
      case "CONFIRMED":
        return "bg-blue-500/20 text-blue-400";
      case "COMPLETED":
        return "bg-gray-500/20 text-gray-400";
      case "CANCELLED":
        return "bg-red-500/20 text-red-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  const handleStartChat = async (sessionId: string) => {
    try {
      console.log("Starting chat for session:", sessionId);
      // Navigate to chat with role-specific path
      const role = user?.role || "PATIENT";
      navigate(`/dashboard/${role.toLowerCase()}/chat/${sessionId}`);
    } catch (error: any) {
      console.error("Error starting chat:", error);
      toast.error("Failed to start chat session");
    }
  };

  const handleCompleteSession = async (sessionId: string) => {
    try {
      console.log("Completing session:", sessionId);

      const { error } = await supabaseAdmin
        .from("sessions")
        .update({ status: "COMPLETED" })
        .eq("id", sessionId);

      if (error) {
        console.error("Error completing session:", error);
        throw error;
      }

      console.log("Session marked as completed");
      toast.success("Session marked as completed");
      fetchSessions(); // Refresh the list
    } catch (error: any) {
      console.error("Error completing session:", error);
      toast.error("Failed to complete session");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (sessions.length === 0) {
    return (
      <Card className="text-center py-12">
        <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">
          No Sessions Found
        </h3>
        <p className="text-gray-400">
          {role === "DOCTOR"
            ? "You don't have any consultations scheduled yet."
            : "You haven't booked any consultations yet."}
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {sessions.map((session) => (
        <motion.div
          key={session.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="hover:bg-gray-750 transition-colors">
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {role === "DOCTOR"
                      ? session.patient.name
                      : `Dr. ${session.doctor.name}`}
                  </h3>
                  {role === "PATIENT" && (
                    <p className="text-gray-400 text-sm mb-2">
                      {session.doctor.doctor_profiles[0]?.specialty}
                    </p>
                  )}
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {format(
                        new Date(session.scheduled_at),
                        "MMM d, yyyy h:mm a"
                      )}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {session.duration} minutes
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${getStatusColor(
                      session.status
                    )}`}
                  >
                    {session.status}
                  </span>
                  {session.status === "CONFIRMED" && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleStartChat(session.id)}
                      className="flex items-center"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Start Chat
                    </Button>
                  )}
                  {role === "DOCTOR" && session.status === "CONFIRMED" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCompleteSession(session.id)}
                      className="flex items-center"
                    >
                      Complete Session
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};
