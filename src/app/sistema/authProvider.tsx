import React, { createContext, useState, useContext, useEffect } from 'react';
import { checkJwt, isAdmin } from "@/api/usuarios/auth.api";
interface AuthContextProps {
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
  //verifyAdmin?: () => Promise<boolean>;
  isAdministrator: boolean;
  setIsAdministrator: (value: boolean) => void;
  checkToken: () => Promise<boolean>;
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
    if (token) {
      try {
        const response = await checkJwt(token);

        if (response.ok) {
          setIsLoggedIn(true);
          await verifyAdmin();
          setIsChecking(false);
          return true;
        } else {
          setIsLoggedIn(false);
          setIsAdministrator(false);

          const event = new CustomEvent('error', { detail: 'Se ha cerrado la sesión' });
          window.dispatchEvent(event);

          setIsChecking(false);
          return false;
        }
      } catch (error: any) {
        setIsAdministrator(false);
        setIsLoggedIn(false);
        setIsChecking(false);
      }
    }
    const event = new CustomEvent('info', { detail: 'Se ha cerrado la sesión' });
    window.dispatchEvent(event);
    setIsChecking(false);
    setIsLoggedIn(false);
    return false;

  }

  const verifyAdmin = async () => {


    const token = localStorage.getItem('jwt');
    if (token) {
      try {
        const response = await isAdmin(token);
        if (response.isAdmin) {
          if (!isAdministrator) {
            const event = new CustomEvent('info', { detail: 'Haz ingresado como admin' });
            window.dispatchEvent(event);
          }

          setIsAdministrator(true);
          return true;
        }
      } catch (error) {
        console.log(error);
      }
    }

    setIsAdministrator(false);
    return false;

  }

  useEffect(() => {

    const token = localStorage.getItem('jwt');
    if (token) {
      const verifyToken = async () => {
        try {
          const response = await checkJwt(token);
          if (response.ok) {
            await checkToken();
          }
        } catch (error) {
          console.log(error);
        }
      }
      verifyToken();
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, isAdministrator, setIsAdministrator, checkToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};