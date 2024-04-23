import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './authProvider';

interface MantenimientoProviderProps {
    mantenimientoState: number;
    setMantenimientoState: (value: number) => void;
}

const MantenimientoContext = createContext<MantenimientoProviderProps | undefined>(undefined);

export const MantenimientoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [mantenimientoState, setMantenimientoState] = useState(0);

  
    return (
        <MantenimientoContext.Provider value={{ mantenimientoState, setMantenimientoState }}>
            {children}
        </MantenimientoContext.Provider>
    );
};

export const useMantenimiento = () => {
    const context = useContext(MantenimientoContext);
    if (!context) {
        throw new Error('useMantenimiento must be used within a MantenimientoProvider');
    }
    return context;
};

