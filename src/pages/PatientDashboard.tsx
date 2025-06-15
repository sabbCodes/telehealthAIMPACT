import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Calendar,
  Search,
  MessageCircle,
  Clock,
  User,
  LogOut,
} from "lucide-react";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { useAuthStore } from "../store/useAuthStore";
import { supabase, supabaseAdmin } from "../lib/supabase";
import { toast } from "react-hot-toast";
import { SessionsList } from "../components/sessions/SessionsList";

interface PatientData {
  id: string;
  name: string;
  email: string;
  patient_profiles: {
    date_of_birth: string;
    gender: string;
    blood_type: string;
    allergies: string;
    medications: string;
  }[];
}

export const PatientDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, setUser } = useAuthStore();
  const [patientData, setPatientData] = useState<PatientData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sessions, setSessions] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalSessions: 0,
    upcomingSessions: 0,
    completedSessions: 0,
  });

  useEffect(() => {
    if (user) {
      fetchPatientData();
      fetchSessions();
    }
  }, [user]);

  const fetchPatientData = async () => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select(
          `
          id,
          name,
          email,
          patient_profiles (
            date_of_birth,
            gender,
            blood_type,
            allergies,
            medications
          )
        `
        )
        .eq("id", user?.id)
        .single();

      if (error) throw error;

      setPatientData(data);
    } catch (error: any) {
      console.error("Error fetching patient data:", error);
      toast.error("Failed to load profile data");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSessions = async () => {
    try {
      const { data, error } = await supabaseAdmin
        .from("sessions")
        .select(
          `
          *,
          patient:patient_id (
            id,
            name
          )
        `
        )
        .eq("patient_id", user?.id)
        .order("scheduled_at", { ascending: false });

      if (error) throw error;

      console.log("Patient sessions data:", data); // Debug log

      setSessions(data || []);

      // Calculate stats
      const totalSessions = data.length;
      const upcomingSessions = data.filter(
        (s) => s.status === "CONFIRMED" && new Date(s.scheduled_at) > new Date()
      ).length;
      const completedSessions = data.filter(
        (s) => s.status === "COMPLETED"
      ).length;

      console.log("Patient stats:", { totalSessions, upcomingSessions, completedSessions }); // Debug log

      setStats({
        totalSessions,
        upcomingSessions,
        completedSessions,
      });
    } catch (error: any) {
      console.error("Error fetching sessions:", error);
      toast.error("Failed to load sessions");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "text-yellow-400";
      case "CONFIRMED":
        return "text-blue-400";
      case "COMPLETED":
        return "text-green-400";
      case "CANCELLED":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      navigate("/signin");
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Failed to sign out");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex justify-between items-center">
            <div>
          <h1 className="text-3xl font-bold text-white mb-2">
                Welcome back, {patientData?.name}
          </h1>
          <p className="text-gray-400">Manage your health consultations</p>
            </div>
            <Button
              variant="outline"
              onClick={handleSignOut}
              className="flex items-center space-x-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </Button>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card className="p-6">
            <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
            <div className="flex flex-wrap gap-4">
              <Button onClick={() => navigate("/doctors")}>
                <Search className="w-4 h-4 mr-2" />
                Find Doctors
              </Button>
              <Button variant="outline">
                <Calendar className="w-4 h-4 mr-2" />
                View Calendar
              </Button>
              <Button variant="outline">
                <User className="w-4 h-4 mr-2" />
                Update Profile
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          >
            <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Sessions</p>
                <h3 className="text-2xl font-bold text-white">
                  {stats.totalSessions}
                </h3>
              </div>
                <div className="bg-blue-600/20 p-3 rounded-lg">
                  <Calendar className="w-6 h-6 text-blue-400" />
                </div>
              </div>
            </Card>

            <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                  <p className="text-gray-400 text-sm">Upcoming</p>
                <h3 className="text-2xl font-bold text-white">
                  {stats.upcomingSessions}
                </h3>
              </div>
              <div className="bg-green-600/20 p-3 rounded-lg">
                <Clock className="w-6 h-6 text-green-400" />
                </div>
              </div>
            </Card>

            <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                  <p className="text-gray-400 text-sm">Completed</p>
                <h3 className="text-2xl font-bold text-white">
                  {stats.completedSessions}
                </h3>
              </div>
              <div className="bg-purple-600/20 p-3 rounded-lg">
                <MessageCircle className="w-6 h-6 text-purple-400" />
                </div>
              </div>
            </Card>
          </motion.div>

        {/* Sessions List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <SessionsList role="PATIENT" />
        </motion.div>
      </div>
    </div>
  );
};
