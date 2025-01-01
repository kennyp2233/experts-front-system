import React, { useState } from 'react'; // Add this line

import { useRouter } from 'next/navigation';
import { useAuth } from '../../providers/authProvider';
import { useEffect } from 'react';

const ProtectedRoute = ({ children, adminOnly }: { children: React.ReactNode, adminOnly: boolean }) => {
  const { isLoggedIn, isAdministrator, checkToken, isChecking } = useAuth();
  const router = useRouter();
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    const verify = async () => {
      await checkToken();
      setHasChecked(true);
    };
    verify();
  }, []);

  useEffect(() => {
    if (hasChecked) { // Solo ejecutar después de la verificación inicial
      if (!isLoggedIn) {
        router.push('/sistema');
      } else if (adminOnly && !isAdministrator) {
        router.push('/sistema');
      }
    }
  }, [hasChecked, isLoggedIn, isAdministrator, router, adminOnly]);

  // Mientras está verificando o aún no ha terminado la verificación inicial
  if (isChecking || !hasChecked) {
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

  // Si ya verificó y no está autenticado, mostrar loading mientras redirige
  if (!isLoggedIn || (adminOnly && !isAdministrator)) {
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
