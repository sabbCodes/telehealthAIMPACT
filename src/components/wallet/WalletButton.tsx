import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useEffect } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { User } from '../../types';

export const WalletButton: React.FC = () => {
  const { publicKey, connected } = useWallet();
  const { setUser, setConnected, user } = useAuthStore();

  useEffect(() => {
    if (connected && publicKey) {
      setConnected(true);
      
      // Create or update user
      if (!user || user.walletAddress !== publicKey.toString()) {
        const newUser: User = {
          walletAddress: publicKey.toString(),
          isDoctor: false,
          createdAt: new Date(),
        };
        setUser(newUser);
      }
    } else {
      setConnected(false);
      setUser(null);
    }
  }, [connected, publicKey, setUser, setConnected, user]);

  return (
    <div className="wallet-adapter-button-trigger">
      <WalletMultiButton className="!bg-gradient-to-r !from-blue-600 !to-purple-600 hover:!from-blue-700 hover:!to-purple-700 !rounded-lg !transition-all !duration-200" />
    </div>
  );
};
