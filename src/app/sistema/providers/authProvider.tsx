'use client';
// src/context/AuthContext.tsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { getMe, login, logout } from '@/api/usuarios/auth.api';
import { dispatchMenssage } from '@/app/utils/menssageDispatcher';

interface User {
  id: string;
  isAdmin: boolean;
  // Agrega otros campos según tu respuesta del backend
}

interface AuthContextProps {
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
  isAdministrator: boolean;
  setIsAdministrator: (value: boolean) => void;
  user: User | null;
  setUser: (user: User | null) => void;
  checkToken: () => Promise<boolean>;
  handleLogin: (username: string, password: string, recordar: boolean) => Promise<boolean>;
  handleLogout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isAdministrator, setIsAdministrator] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [isChecking, setIsChecking] = useState<boolean>(false);

  const checkToken = async () => {
    if (isChecking) return false;
    setIsChecking(true);
    try {
      const response = await getMe();
      if (response.ok && response.user) {
        setUser(response.user);
        setIsLoggedIn(true);
        setIsAdministrator(response.user.isAdmin);
        return true;
      } else {
        setUser(null);
        setIsLoggedIn(false);
        setIsAdministrator(false);
        return false;
      }
    } catch (error: any) {
      console.error('Error al verificar el token:', error);
      setUser(null);
      setIsLoggedIn(false);
      setIsAdministrator(false);
      return false;
    } finally {
      setIsChecking(false);
    }
  };

  const handleLogin = async (username: string, password: string, recordar: boolean): Promise<boolean> => {
    try {
      const response = await login(username, password, recordar);
      if (response.ok) {
        // Después de iniciar sesión, verifica el token para obtener la información del usuario
        const isValid = await checkToken();
        if (isValid && user) {
          if (user.isAdmin) {
            dispatchMenssage('info', 'Has ingresado como admin');
          }
        }
        return true;
      } else {
        dispatchMenssage('fail', 'Credenciales inválidas');
        return false;
      }
    } catch (error: any) {
      console.error('Error al iniciar sesión:', error);
      dispatchMenssage('fail', 'Error al iniciar sesión');
      return false;
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      // Incluso si hay un error al cerrar sesión en el backend, continúa en el frontend
    } finally {
      setUser(null);
      setIsLoggedIn(false);
      setIsAdministrator(false);
      dispatchMenssage('fail', 'Se ha cerrado la sesión');
    }
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
        isAdministrator,
        setIsAdministrator,
        user,
        setUser,
        checkToken,
        handleLogin,
        handleLogout,
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
