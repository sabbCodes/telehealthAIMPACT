import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Send } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { toast } from "react-hot-toast";
import { Button } from "../components/ui/Button";
import { supabase, supabaseAdmin } from "../lib/supabase";

interface Message {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
}

interface Session {
  id: string;
  doctor_id: string;
  patient_id: string;
  status: string;
  doctor: {
    id: string;
    name: string;
  };
  patient: {
    id: string;
    name: string;
  };
}

export const ChatPage: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [isEndingSession, setIsEndingSession] = useState(false);
  const channelRef = useRef<any>(null);

  useEffect(() => {
    if (sessionId) {
      fetchSession();
      setupSubscription();
    }

    return () => {
      if (channelRef.current) {
        channelRef.current.unsubscribe();
        channelRef.current = null;
      }
    };
  }, [sessionId]);

  const fetchSession = async () => {
    try {
      const { data, error } = await supabaseAdmin
        .from("sessions")
        .select(
          `
          id,
          doctor_id,
          patient_id,
          status,
          doctor:users!doctor_id (
            id,
            name
          ),
          patient:users!patient_id (
            id,
            name
          )
        `
        )
        .eq("id", sessionId)
        .single();

      if (error) throw error;

      console.log("Raw session data:", data);

      // Fix the data structure
      const sessionData: Session = {
        id: data.id,
        doctor_id: data.doctor_id,
        patient_id: data.patient_id,
        status: data.status,
        doctor: {
          id: data.doctor.id,
          name: data.doctor.name,
        },
        patient: {
          id: data.patient.id,
          name: data.patient.name,
        },
      };

      console.log("Processed session data:", sessionData);
      setSession(sessionData);

      // Fetch existing messages
      const { data: messagesData, error: messagesError } = await supabaseAdmin
        .from("messages")
        .select("*")
        .eq("session_id", sessionId)
        .order("created_at", { ascending: true });

      if (messagesError) throw messagesError;
      console.log("Messages data:", messagesData);
      setMessages(messagesData || []);
    } catch (error: any) {
      console.error("Error fetching session:", error);
      toast.error("Failed to load session");
      navigate(getDashboardPath());
    }
  };

  const setupSubscription = () => {
    if (channelRef.current) {
      channelRef.current.unsubscribe();
      channelRef.current = null;
    }

    const channel = supabase
      .channel(`chat:${sessionId}`)
      .on("broadcast", { event: "message" }, ({ payload }) => {
        console.log("New message received:", payload);
        setMessages((current) => {
          const exists = current.some((msg) => msg.id === payload.id);
          if (exists) return current;
          return [...current, payload as Message];
        });
      })
      .subscribe((status) => {
        console.log("Subscription status:", status);
      });

    channelRef.current = channel;
  };

  const getDashboardPath = () => {
    if (!user) return "/signin";
    return user.role === "DOCTOR" ? "/dashboard/doctor" : "/dashboard/patient";
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    try {
      setIsLoading(true);
      const { data, error } = await supabaseAdmin
        .from("messages")
        .insert({
          session_id: sessionId,
          content: newMessage,
          sender_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      // Add message to state immediately for sender
      setMessages((current) => [...current, data]);
      setNewMessage("");

      // Broadcast the message to all subscribers
      await channelRef.current?.send({
        type: "broadcast",
        event: "message",
        payload: data,
      });
    } catch (error: any) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEndSession = async () => {
    if (!sessionId) return;

    try {
      setIsEndingSession(true);
      const { error } = await supabaseAdmin
        .from("sessions")
        .update({ status: "COMPLETED" })
        .eq("id", sessionId);

      if (error) throw error;

      toast.success("Session ended successfully");
      navigate(getDashboardPath());
    } catch (error: any) {
      console.error("Error ending session:", error);
      toast.error("Failed to end session");
    } finally {
      setIsEndingSession(false);
    }
  };

  const otherUser =
    user?.id === session?.doctor_id ? session?.patient : session?.doctor;
  const displayName =
    user?.id === session?.doctor_id
      ? otherUser?.name
      : `Dr. ${otherUser?.name}`;

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(getDashboardPath())}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-white">{displayName}</h1>
              </div>
            </div>
            {user?.role === "PATIENT" && (
              <Button
                variant="primary"
                onClick={handleEndSession}
                disabled={isEndingSession}
                className="flex items-center space-x-2 bg-red-600 hover:bg-red-700"
              >
                <span>{isEndingSession ? "Ending..." : "End Session"}</span>
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto h-[calc(100vh-5rem)] flex flex-col">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${
                message.sender_id === user?.id ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[70%] rounded-lg p-3 ${
                  message.sender_id === user?.id
                    ? "bg-blue-600 text-white"
                    : "bg-gray-700 text-white"
                }`}
              >
                {message.content}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Message Input */}
        <form
          onSubmit={handleSendMessage}
          className="p-4 border-t border-gray-700"
        >
          <div className="flex space-x-4">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Button
              type="submit"
              disabled={isLoading || !newMessage.trim()}
              className="flex items-center space-x-2"
            >
              <Send className="w-4 h-4" />
              <span>Send</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
