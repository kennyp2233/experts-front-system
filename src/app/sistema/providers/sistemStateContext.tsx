import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './authProvider';
interface SistemStateContextProps {
    sistemState: number;
    handleSistemState: (value: number) => void;
}

const SistemStateContext = createContext<SistemStateContextProps | undefined>(undefined);

export const SistemStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [sistemState, setSistemState] = useState(0);
    const { checkToken } = useAuth();
    useEffect(() => {
        const state = localStorage.getItem('sistemState');
        if (state) {
            setSistemState(Number(state));
        }
    }, []);



    return (
        <SistemStateContext.Provider value={{ sistemState, handleSistemState: setSistemState }}>
            {children}
        </SistemStateContext.Provider>
    );
};

export const useSistemState = () => {
    const context = useContext(SistemStateContext);
    if (context === undefined) {
        throw new Error('useSistemState must be used within a SistemStateProvider');
    }
    return context;
};