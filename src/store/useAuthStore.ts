import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  walletAddress: string;
  name: string;
  email?: string;
  role: 'DOCTOR' | 'PATIENT';
  isVerified?: boolean;
}

interface AuthState {
  user: User | null;
  isConnected: boolean;
  isOnboarded: boolean;
  setUser: (user: User | null) => void;
  setConnected: (connected: boolean) => void;
  setOnboarded: (onboarded: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isConnected: false,
      isOnboarded: false,
      setUser: (user) => set({ user }),
      setConnected: (connected) => set({ isConnected: connected }),
      setOnboarded: (onboarded) => set({ isOnboarded: onboarded }),
      logout: () => set({ user: null, isConnected: false, isOnboarded: false }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
