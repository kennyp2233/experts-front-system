'use client';
import { useEffect, useState } from 'react';
import EventAlerts from '../utils/eventAlerts';
import Hero from './initial/hero';

import { useAuth } from './providers/authProvider';
import { useRouter } from 'next/navigation';


export default function Page() {
  const { isLoggedIn, setIsLoggedIn, isAdministrator } = useAuth();
  const [loading, setLoading] = useState(true);
  const router = useRouter();



  useEffect(() => {
    let timer: NodeJS.Timeout;

    timer = setTimeout(() => {
      setLoading(false);
    }, 100);
    return () => clearTimeout(timer);
  }, []);


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
     
      {
        /*
          <div className='text-primary'>{"logged " + isLoggedIn}</div>
      <div className='text-primary'>{"admin " + isAdministrator}</div>
         */
      }
      <Hero />
    </>
  );
}