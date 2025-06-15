import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { motion } from "framer-motion";
import { Heart, ArrowLeft, LogIn } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { useAuthStore } from "../store/useAuthStore";
import { supabaseAdmin } from "../lib/supabase";

export const SignInPage: React.FC = () => {
  const { connected, publicKey } = useWallet();
  const { user, setUser, setConnected, setOnboarded } = useAuthStore();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    setConnected(connected);
  }, [connected, setConnected]);

  useEffect(() => {
    if (user) {
      const dashboardPath =
        user.role === "DOCTOR" ? "/dashboard/doctor" : "/dashboard/patient";
      navigate(dashboardPath);
    }
  }, [user, navigate]);

  const handleWalletSignIn = async () => {
    if (!connected || !publicKey) {
      setError("Please connect your wallet first");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const { data: userData, error: userError } = await supabaseAdmin
        .from("users")
        .select("*")
        .eq("wallet_address", publicKey.toString())
        .single();

      if (userError || !userData) {
        setError("Account not found. Please sign up first.");
        setIsLoading(false);
        return;
      }

      setUser({
        id: userData.id,
        walletAddress: userData.wallet_address,
        name: userData.name,
        email: userData.email,
        role: userData.role,
      });
      setOnboarded(true);

      const dashboardPath =
        userData.role === "DOCTOR" ? "/dashboard/doctor" : "/dashboard/patient";
      navigate(dashboardPath);
    } catch (err) {
      setError("Failed to sign in. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const { data: userData, error: userError } = await supabaseAdmin
        .from("users")
        .select("*")
        .eq("email", email)
        .single();

      if (userError || !userData) {
        setError("Invalid email or password");
        setIsLoading(false);
        return;
      }

      setUser({
        id: userData.id,
        walletAddress: userData.wallet_address,
        name: userData.name,
        email: userData.email,
        role: userData.role,
      });
      setOnboarded(true);

      const dashboardPath =
        userData.role === "DOCTOR" ? "/dashboard/doctor" : "/dashboard/patient";
      navigate(dashboardPath);
    } catch (err) {
      setError("Failed to sign in. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center mb-6">
            <Heart className="w-12 h-12 text-blue-500" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-gray-400">Sign in to your TeleHealthSol account</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-800 rounded-lg p-6 border border-gray-700"
        >
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-white mb-4">
                Connect Your Wallet
              </h2>
              <WalletMultiButton className="!w-full !bg-blue-600 !rounded-lg !text-white hover:!bg-blue-700 !h-12" />
            </div>

            {connected && publicKey && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-4"
              >
                <div className="p-4 bg-green-900/20 border border-green-700 rounded-lg">
                  <p className="text-green-400 text-sm">
                    Wallet connected successfully!
                  </p>
                  <p className="text-gray-400 text-xs mt-1 break-all">
                    {publicKey.toString()}
                  </p>
                </div>
              </motion.div>
            )}

            <form onSubmit={handleEmailSignIn} className="space-y-4">
              <Input
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Signing In...
                  </div>
                ) : (
                  <>
                    <LogIn className="w-4 h-4 mr-2" />
                    Sign In
                  </>
                )}
              </Button>
            </form>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-4 bg-red-900/20 border border-red-700 rounded-lg mt-4"
            >
              <p className="text-red-400 text-sm">{error}</p>
            </motion.div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mt-6 space-y-4"
        >
          <p className="text-gray-400">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-400 hover:text-blue-300">
              Sign up here
            </Link>
          </p>

          <Button
            variant="outline"
            onClick={() => navigate("/")}
            className="inline-flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </motion.div>
      </div>
    </div>
  );
};
