'use client';
import React, { createContext, useState, useContext, useEffect } from 'react';
import { getMe, login, logout } from '@/api/usuarios/auth.api';
import { dispatchMenssage } from '@/app/utils/menssageDispatcher';

interface User {
  id: string;
  rol: string; // El rol dinámico del usuario
  // Otros campos según la respuesta del backend
}

interface AuthContextProps {
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
  rol: string | null; // Almacena el rol actual
  setRol: (rol: string | null) => void;
  user: User | null;
  setUser: (user: User | null) => void;
  checkToken: () => Promise<boolean>;
  handleLogin: (username: string, password: string, recordar: boolean) => Promise<boolean>;
  handleLogout: () => Promise<void>;
  isChecking: boolean;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [rol, setRol] = useState<string | null>(null);
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
        setRol(response.user.rol); // Actualiza el rol dinámico
        return true;
      } else {
        setUser(null);
        setIsLoggedIn(false);
        setRol(null);
        return false;
      }
    } catch (error: any) {
      console.error('Error al verificar el token:', error);
      setUser(null);
      setIsLoggedIn(false);
      setRol(null);
      return false;
    } finally {
      setIsChecking(false);
    }
  };

  const handleLogin = async (username: string, password: string, recordar: boolean): Promise<boolean> => {
    try {
      const response = await login(username, password, recordar);
      if (response.ok) {
        const isValid = await checkToken(); // Verifica el token después del login
        if (isValid && user) {
          dispatchMenssage('info', `Has ingresado con rol: ${user.rol}`);
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
    } finally {
      setUser(null);
      setIsLoggedIn(false);
      setRol(null);
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
        rol,
        setRol,
        user,
        setUser,
        checkToken,
        handleLogin,
        handleLogout,
        isChecking,
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
