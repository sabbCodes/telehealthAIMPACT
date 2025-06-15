import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'DOCTOR' | 'PATIENT';
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole 
}) => {
  const { user, isOnboarded } = useAuthStore();

  if (!user) {
    return <Navigate to="/signin" />;
  }

  if (!isOnboarded) {
    return <Navigate to="/onboarding" />;
  }

  if (requiredRole && user.role !== requiredRole) {
    const redirectPath = user.role === 'DOCTOR' ? '/dashboard/doctor' : '/dashboard/patient';
    return <Navigate to={redirectPath} />;
  }

  return <>{children}</>;
};
