import React, { createContext, useState, useContext, useEffect } from 'react';
import { checkJwt, isAdmin } from "@/api/usuarios/auth.api";
import { dispatchMenssage } from '@/app/utils/menssageDispatcher';

interface AuthContextProps {
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
  isAdministrator: boolean;
  setIsAdministrator: (value: boolean) => void;
  checkToken: () => Promise<boolean>;
  handleLogout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdministrator, setIsAdministrator] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  const checkToken = async () => {
    if (isChecking) return false;
    setIsChecking(true);

    const token = localStorage.getItem('jwt');
    if (!token) {
      handleLogout();
      return false;
    }

    try {
      const response = await checkJwt(token);
      if (response.ok) {
        setIsLoggedIn(true);
        await verifyAdmin(token);
        setIsChecking(false);
        return true;
      } else {
        handleLogout();
        return false;
      }
    } catch (error: any) {
      handleLogout();
      return false;
    }
  };

  const verifyAdmin = async (token: string) => {
    try {
      const response = await isAdmin(token);
      if (response.isAdmin) {
        setIsAdministrator(true);
        dispatchMenssage('info', 'Haz ingresado como admin');
      } else {
        setIsAdministrator(false);
      }
    } catch (error) {
      console.log(error);
      setIsAdministrator(false);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsAdministrator(false);
    dispatchMenssage('fail', 'Se ha cerrado la sesión');
    localStorage.removeItem('jwt');
  };

  useEffect(() => {
    const token = localStorage.getItem('jwt');
    if (token) {
      checkToken();
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, isAdministrator, setIsAdministrator, checkToken, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
