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

  useEffect(() => {
    const verify = async () => {
      await checkToken();
      setHasChecked(true);
    };
    verify();
  }, [checkToken]);

  useEffect(() => {
    if (hasChecked) { // Solo ejecutar después de la verificación inicial
      if (!isLoggedIn) {
        router.push('/sistema'); // Redirige si no está autenticado
      } else if (allowedRoles.length > 0) {
        // Asumiendo que 'rol' ahora es un array de roles
        const userRoles = Array.isArray(roles) ? roles : [roles];

        // Verificar si el usuario tiene al menos uno de los roles permitidos
        const hasAllowedRole = allowedRoles.some(role => userRoles.includes(role));

        if (!hasAllowedRole) {
          router.push('/sistema'); // Redirige si no tiene ningún rol permitido
          dispatchMenssage('error', 'No tienes permiso para acceder a esta página');
        }
      }
    }
  }, [hasChecked, isLoggedIn, roles, router, allowedRoles]);

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
  if (!isLoggedIn) {
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

  // Si ya verificó y tiene un rol permitido, o no hay roles permitidos especificados
  if (allowedRoles.length === 0 ||
    (Array.isArray(roles) ? allowedRoles.some(role => roles.includes(role)) : allowedRoles.includes(roles as string))) {
    return <>{children}</>;
  }

  // Si ya verificó pero no tiene un rol permitido, mostrar loading mientras redirige
  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <span className="loading loading-ball loading-lg"></span>
        </div>
      </div>
    </div>
  );
};

export default ProtectedRoute;