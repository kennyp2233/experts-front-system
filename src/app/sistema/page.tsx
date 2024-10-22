'use client';
import { useEffect, useState } from 'react';

import Hero from './initial/hero';

import { useAuth } from '../providers/authProvider';
import { useRouter } from 'next/navigation';
import React from 'react';


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
    return null;
  }


  return (
    <>
      <Hero />
    </>
  );
}