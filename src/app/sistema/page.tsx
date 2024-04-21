'use client';
import { useState } from 'react';
import AllInitial from './components/initial/allInitial';
import { SistemStateContext } from './sistemStateContext';


export default function Page() {
  const [sistemState, setSistemState] = useState(0);


  const handleSistemState = (n: number) => {
    setSistemState(n);
  };


  return (
    <SistemStateContext.Provider value={{ sistemState, handleSistemState }}>
      {
        sistemState === 0 ? <AllInitial /> :
          sistemState === 1 ? <div>Dashboard</div> :
            sistemState === 2 ? <div>Profile</div> :
              sistemState === 3 ? <div>Settings</div> :
                <div>Error</div>
      }
    </SistemStateContext.Provider>
  );
}