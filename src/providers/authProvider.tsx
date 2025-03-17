'use client';
import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '@/api/services/authService';
import { dispatchMenssage } from '@/utils/menssageDispatcher';

interface User {
  id: string;
  roles: string[]; // Ahora roles es un array
  // Otros campos según la respuesta del backend
}

interface AuthContextProps {
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
  roles: string[]; // Ahora es un array de roles
  setRoles: (roles: string[]) => void;
  user: User | null;
  setUser: (user: User | null) => void;
  checkToken: () => Promise<boolean>;
  handleLogin: (username: string, password: string, recordar: boolean) => Promise<boolean>;
  handleLogout: () => Promise<void>;
  isChecking: boolean;
  hasRole: (requiredRoles: string | string[]) => boolean; // Nueva función para verificar roles
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [roles, setRoles] = useState<string[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [isChecking, setIsChecking] = useState<boolean>(false);

  const checkToken = async () => {
    if (isChecking) return false;
    setIsChecking(true);
    try {
      const response = await authService.getMe();
      if (response.ok && response.user) {
        const userData = response.user;

        // Asegurarse de que roles sea siempre un array
        const userRoles = userData.roles; // Soporte para compatibilidad con versiones anteriores

        setUser({
          ...userData,
          roles: userRoles
        });
        setIsLoggedIn(true);
        setRoles(userRoles);
        return true;
      } else {
        setUser(null);
        setIsLoggedIn(false);
        setRoles([]);
        return false;
      }
    } catch (error: any) {
      console.error('Error al verificar el token:', error);
      setUser(null);
      setIsLoggedIn(false);
      setRoles([]);
      return false;
    } finally {
      setIsChecking(false);
    }
  };

  const handleLogin = async (username: string, password: string, recordar: boolean): Promise<boolean> => {
    try {
      const response = await authService.login(username, password, recordar);
      if (response.ok) {
        const isValid = await checkToken(); // Verifica el token después del login
        if (isValid && user) {
          const rolesStr = roles.join(', ');
          dispatchMenssage('info', `Has ingresado con roles: ${rolesStr}`);
        }
        return true;
      } else {
        dispatchMenssage('error', 'Credenciales inválidas');
        return false;
      }
    } catch (error: any) {
      console.error('Error al iniciar sesión:', error);
      dispatchMenssage('error', 'Error al iniciar sesión');
      return false;
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      setUser(null);
      setIsLoggedIn(false);
      setRoles([]);
      dispatchMenssage('info', 'Se ha cerrado la sesión');
    }
  };

  // Nueva función para verificar si el usuario tiene los roles requeridos
  const hasRole = (requiredRoles: string | string[]): boolean => {
    if (!isLoggedIn || !roles.length) return false;

    const requiredRolesArray = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];

    // Verificar si el usuario tiene al menos uno de los roles requeridos
    return requiredRolesArray.some(role => roles.includes(role));
  };

  useEffect(() => {
    checkToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        roles,
        setRoles,
        user,
        setUser,
        checkToken,
        handleLogin,
        handleLogout,
        isChecking,
        hasRole
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};