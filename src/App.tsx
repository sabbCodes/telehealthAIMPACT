import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';
import { useMemo } from 'react';
import { Toaster } from 'react-hot-toast';

import { LandingPage } from './pages/LandingPage';
import { SignUpPage } from './pages/SignUpPage';
import { SignInPage } from './pages/SignInPage';
import { DoctorDashboard } from './pages/DoctorDashboard';
import { PatientDashboard } from './pages/PatientDashboard';
import { DoctorsPage } from './pages/DoctorsPage';
import { OnboardingFlow } from './components/onboarding/OnboardingFlow';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { useAuthStore } from './store/useAuthStore';
import { ChatPage } from "./pages/ChatPage";

import '@solana/wallet-adapter-react-ui/styles.css';
import './index.css';

function App() {
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
    ],
    []
  );

  const { user, isOnboarded } = useAuthStore();

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <Router>
            <Toaster 
              position="top-center"
              toastOptions={{
                duration: 3000,
                style: {
                  background: '#1F2937',
                  color: '#fff',
                  border: '1px solid #374151',
                },
                success: {
                  iconTheme: {
                    primary: '#10B981',
                    secondary: '#fff',
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#EF4444',
                    secondary: '#fff',
                  },
                },
              }}
            />
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/signup" element={<SignUpPage />} />
              <Route path="/signin" element={<SignInPage />} />
              <Route 
                path="/onboarding" 
                element={
                  user && !isOnboarded ? <OnboardingFlow /> : <Navigate to="/" />
                } 
              />
              <Route 
                path="/doctors" 
                element={
                  <ProtectedRoute>
                    <DoctorsPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/dashboard/doctor" 
                element={
                  <ProtectedRoute requiredRole="DOCTOR">
                    <DoctorDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/dashboard/patient" 
                element={
                  <ProtectedRoute requiredRole="PATIENT">
                    <PatientDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/dashboard/patient/chat/:sessionId" 
                element={
                  <ProtectedRoute requiredRole="PATIENT">
                    <ChatPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/dashboard/doctor/chat/:sessionId" 
                element={
                  <ProtectedRoute requiredRole="DOCTOR">
                    <ChatPage />
                  </ProtectedRoute>
                } 
              />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </Router>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default App;
