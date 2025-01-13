import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../providers/authProvider';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[]; // Roles permitidos (opcional)
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles = [] }) => {
  const { isLoggedIn, rol, checkToken, isChecking } = useAuth();
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
        router.push('/sistema'); // Redirige si no está autenticado
      } else if (allowedRoles.length > 0 && !allowedRoles.includes(rol || '')) {
        router.push('/sistema'); // Redirige si no tiene un rol permitido
      }
    }
  }, [hasChecked, isLoggedIn, rol, router, allowedRoles]);

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
  if (!isLoggedIn || (allowedRoles.length > 0 && !allowedRoles.includes(rol || ''))) {
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

  return <>{children}</>;
};

export default ProtectedRoute;
