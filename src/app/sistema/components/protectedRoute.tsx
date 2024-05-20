
import { useRouter } from 'next/navigation';
import { useAuth } from '../providers/authProvider';
import { useEffect } from 'react';

const ProtectedRoute = ({ children, adminOnly }: { children: React.ReactNode, adminOnly: boolean }) => {
  const { isLoggedIn, isAdministrator, checkToken } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/sistema');
    } else if (adminOnly && !isAdministrator) {
      router.push('/');
    }

    return () => {
    };
  }, [isLoggedIn, isAdministrator, router, adminOnly]);

  if (!isLoggedIn || (adminOnly && !isAdministrator)) {
    return null; // O un componente de carga
  }

  return children;
};

export default ProtectedRoute;
