import React from 'react'; // Add this line

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

  }, [isLoggedIn, isAdministrator, router, adminOnly]);

  if (!isLoggedIn || (adminOnly && !isAdministrator)) { // (!true || (false && !true)) = (false || (false && false)) = (false || false) = false
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

  return children;
};

export default ProtectedRoute;
