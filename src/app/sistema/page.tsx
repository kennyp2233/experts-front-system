'use client';
import { useState } from 'react';
import Hero from './components/hero';
import Login from './components/login';
import Register from './components/register';
export default function Page() {
  const [sistemState, setSistemState] = useState(0);
  const [initialState, setInitialState] = useState(0);

  const handleSistemState = (n: number) => {
    setSistemState(n);
  };

  const handleInitialState = (n: number) => {
    setInitialState(n);
  }
  return (
    <>
      {
        sistemState === 0 ?
          (initialState === 0 ? <Hero handleClick={handleInitialState} /> :
            initialState === 1 ? <Login handleClick={handleInitialState} /> :
              initialState === 2 ? <Register handleClick={handleInitialState} /> :
                initialState === 3 ? <div>Forgot Password</div> :
                  <div>Error</div>) :
          sistemState === 1 ? <div>Dashboard</div> :
            sistemState === 2 ? <div>Profile</div> :
              sistemState === 3 ? <div>Settings</div> :
                <div>Error</div>
      }
    </>
  );
}
