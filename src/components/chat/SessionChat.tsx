import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { supabase } from "../../lib/supabase";
import { useAuthStore } from "../../store/useAuthStore";
import { toast } from "react-hot-toast";

interface Message {
  id: string;
  sender_id: string;
  content: string;
  created_at: string;
}

interface SessionChatProps {
  sessionId: string;
  doctorId: string;
  patientId: string;
}

type ConnectionState = "connecting" | "connected" | "disconnected" | "error";

export const SessionChat: React.FC<SessionChatProps> = ({
  sessionId,
  doctorId,
  patientId,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [connectionState, setConnectionState] =
    useState<ConnectionState>("connecting");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const subscriptionRef = useRef<any>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
  const reconnectAttemptsRef = useRef(0);
  const { user } = useAuthStore();
  const [lastMessageTimestamp, setLastMessageTimestamp] = useState<string>("");
  const pollingIntervalRef = useRef<NodeJS.Timeout>();
  const [messageQueue, setMessageQueue] = useState<Message[]>([]);
  const [isProcessingQueue, setIsProcessingQueue] = useState(false);

  useEffect(() => {
    fetchMessages();
    setupSubscription();
    setupPolling();

    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [sessionId]);

  // Process message queue when connection state changes
  useEffect(() => {
    if (
      connectionState === "connected" &&
      messageQueue.length > 0 &&
      !isProcessingQueue
    ) {
      processMessageQueue();
    }
  }, [connectionState, messageQueue]);

  const setupPolling = () => {
    // Clear any existing polling interval
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
    }

    // Set up polling every 2 seconds
    pollingIntervalRef.current = setInterval(async () => {
      if (connectionState === "connected") {
        try {
          const { data, error } = await supabase
            .from("messages")
            .select("*")
            .eq("session_id", sessionId)
            .gt("created_at", lastMessageTimestamp)
            .order("created_at", { ascending: true });

          if (error) throw error;

          if (data && data.length > 0) {
            setMessages((current) => {
              const newMessages = data.filter(
                (msg) => !current.some((existing) => existing.id === msg.id)
              );
              if (newMessages.length === 0) return current;
              return [...current, ...newMessages];
            });
            setLastMessageTimestamp(data[data.length - 1].created_at);
            scrollToBottom();
          }
        } catch (error) {
          console.error("Error polling messages:", error);
        }
      }
    }, 2000);
  };

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("session_id", sessionId)
        .order("created_at", { ascending: true });

      if (error) throw error;

      setMessages(data || []);
      if (data && data.length > 0) {
        setLastMessageTimestamp(data[data.length - 1].created_at);
      }
      scrollToBottom();
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error("Failed to load messages");
    } finally {
      setIsLoading(false);
    }
  };

  const processMessageQueue = async () => {
    setIsProcessingQueue(true);
    try {
      // Fetch latest messages to ensure we have the most up-to-date state
      const { data: latestMessages, error } = await supabase
        .from("messages")
        .select("*")
        .eq("session_id", sessionId)
        .order("created_at", { ascending: true });

      if (error) throw error;

      // Update messages with latest data
      setMessages(latestMessages || []);

      // Clear the queue
      setMessageQueue([]);
    } catch (error) {
      console.error("Error processing message queue:", error);
    } finally {
      setIsProcessingQueue(false);
    }
  };

  const setupSubscription = async () => {
    try {
      if (subscriptionRef.current) {
        await subscriptionRef.current.unsubscribe();
      }

      setConnectionState("connecting");

      // Create a new channel for real-time messages
      const channel = supabase.channel(`chat:${sessionId}`, {
        config: {
          broadcast: { self: true },
        },
      });

      // Listen for new messages
      channel.on("broadcast", { event: "message" }, ({ payload }) => {
        console.log("New message received:", payload);
        const newMessage = payload as Message;

        setMessages((current) => {
          const exists = current.some((msg) => msg.id === newMessage.id);
          if (exists) return current;
          return [...current, newMessage];
        });
        scrollToBottom();
      });

      // Subscribe to the channel
      channel.subscribe((status) => {
        console.log("Channel status:", status);
        setConnectionState(
          status === "SUBSCRIBED" ? "connected" : "disconnected"
        );
      });

      subscriptionRef.current = channel;
    } catch (error) {
      console.error("Error setting up subscription:", error);
      setConnectionState("error");
    }
  };

  const attemptReconnect = () => {
    if (reconnectAttemptsRef.current >= 5) {
      setConnectionState("error");
      toast.error("Failed to connect to chat. Please refresh the page.");
      return;
    }

    reconnectAttemptsRef.current += 1;
    const delay = Math.min(
      1000 * Math.pow(2, reconnectAttemptsRef.current),
      30000
    );

    console.log(
      `Scheduling reconnection attempt ${reconnectAttemptsRef.current} in ${delay}ms`
    );

    reconnectTimeoutRef.current = setTimeout(() => {
      if (connectionState === "disconnected" || connectionState === "error") {
        console.log(
          `Executing reconnection attempt ${reconnectAttemptsRef.current}...`
        );
        setupSubscription();
      }
    }, delay);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      // First, insert the message into the database
      const { data, error } = await supabase
        .from("messages")
        .insert([
          {
            session_id: sessionId,
            sender_id: user?.id,
            content: newMessage.trim(),
            created_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (error) throw error;

      if (data) {
        // Add the message to local state
        setMessages((current) => [...current, data]);
        scrollToBottom();

        // Broadcast the message to all channel subscribers
        await subscriptionRef.current?.send({
          type: "broadcast",
          event: "message",
          payload: data,
        });
      }

      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">Loading...</div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {connectionState !== "connected" && (
        <div
          className={`border-b p-2 text-center text-sm ${
            connectionState === "connecting"
              ? "bg-blue-500/10 border-blue-500/20 text-blue-500"
              : connectionState === "error"
              ? "bg-red-500/10 border-red-500/20 text-red-500"
              : "bg-yellow-500/10 border-yellow-500/20 text-yellow-500"
          }`}
        >
          {connectionState === "connecting"
            ? "Connecting to chat..."
            : connectionState === "error"
            ? "Connection failed. Please refresh the page."
            : "Reconnecting to chat..."}
        </div>
      )}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 20 }}
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
              <p>{message.content}</p>
              <span className="text-xs opacity-70 mt-1 block">
                {formatTime(message.created_at)}
              </span>
            </div>
          </motion.div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={handleSendMessage}
        className="p-4 border-t border-gray-700"
      >
        <div className="flex space-x-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1"
          />
          <Button type="submit" disabled={!newMessage.trim()}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </form>
    </div>
  );
};
