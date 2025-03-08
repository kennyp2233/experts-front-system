import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/authProvider';
import { dispatchMenssage } from '@/utils/menssageDispatcher';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[]; // Roles permitidos (opcional)
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles = [] }) => {
  const { isLoggedIn, roles, checkToken, isChecking } = useAuth();
  const router = useRouter();
  const [hasChecked, setHasChecked] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  // Run only once on component mount to verify authentication
  useEffect(() => {
    const verify = async () => {
      try {
        await checkToken();
      } finally {
        setHasChecked(true);
      }
    };
    
    if (!hasChecked && !isChecking) {
      verify();
    }
  }, [checkToken, hasChecked, isChecking]);

  // Separate effect for navigation logic, runs only when auth state changes
  useEffect(() => {
    if (!hasChecked || redirecting) return;

    if (!isLoggedIn) {
      setRedirecting(true);
      router.push('/sistema');
      return;
    }

    if (allowedRoles.length > 0) {
      const userRoles = Array.isArray(roles) ? roles : [roles];
      const hasAllowedRole = allowedRoles.some(role => userRoles.includes(role));

      if (!hasAllowedRole) {
        setRedirecting(true);
        dispatchMenssage('error', 'No tienes permiso para acceder a esta página');
        router.push('/sistema');
      }
    }
  }, [hasChecked, isLoggedIn, roles, router, allowedRoles, redirecting]);

  // Show loading spinner while checking or redirecting
  if (isChecking || !hasChecked || redirecting) {
    return (
      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <span className="loading loading-ball loading-lg"></span>
          </div>
        </div>
      </div>
    );
  }

  // If all checks pass, render children
  return <>{children}</>;
};

export default ProtectedRoute;