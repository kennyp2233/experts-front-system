import React, { useContext } from 'react';

type SistemStateContextType = {
    sistemState: number;
    handleSistemState: (n: number) => void;
};

export const useSistemState = () => {
    const context = useContext(SistemStateContext);
    if (context === null) {
        throw new Error('useSistemState must be used within a SistemStateProvider');
    }
    return context;
}

export const SistemStateContext = React.createContext<SistemStateContextType | null>(null);