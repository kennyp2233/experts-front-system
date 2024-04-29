'use client';
import { useEffect, useState } from 'react';
import AllInitial from './components/initial/allInitial';
import Dashboard from './components/dashboard/dashboard';
import EventAlerts from './components/eventAlerts';
import Mantenimiento from './components/dashboard/modulos/mantenimiento';
import Modulos from './components/dashboard/modulos';
import { useAuth } from './authProvider';
import { useSistemState } from './sistemStateContext';



export default function Page() {
  const { sistemState, handleSistemState, } = useSistemState();
  const { isLoggedIn, setIsLoggedIn, isAdministrator } = useAuth();
  const [loading, setLoading] = useState(true);




  useEffect(() => {
    //use effect de cuando no esta logueado
    let timer: NodeJS.Timeout;

    if (!isLoggedIn) {
      handleSistemState(0);
    } else {
      if (isAdministrator) {
        handleSistemState(1);
      }
    }

    timer = setTimeout(() => {
      setLoading(false);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isLoggedIn) {
      handleSistemState(0);
    }
  }, [isLoggedIn]);

  if (loading) {
    return (
      <>
        <div className="hero min-h-screen bg-base-200">
          <div className="hero-content text-center">
            <div className="max-w-md">
              <span className="loading loading-ball loading-lg"></span>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <EventAlerts />
      {
        /*
          <div className='text-primary'>{"logged " + isLoggedIn}</div>
      <div className='text-primary'>{"admin " + isAdministrator}</div>
         */
      }


      {sistemState === 0 && <AllInitial />}
      {isLoggedIn && (
        <>
          {isAdministrator ? (
            <>
              {sistemState === 2 && <Modulos />}
            </>
          ) : (
            <>
              <div className='text-primary'>NO ES ADMIN</div>
            </>
          )}
          {sistemState === 1 && <Dashboard />}
          {sistemState === -1 && <div>Profile</div>}
          {sistemState === -1 && <div>Settings</div>}
          {sistemState !== 1 && sistemState !== 2 && sistemState !== 3 && <div>Error</div>}
        </>
      )}
      {!isLoggedIn && <div>Not Logged In</div>}
    </>
  );
}