import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './authProvider';
interface AdminModulesProviderProps {
    adminState: number;
    setAdminState: (value: number) => void;
}

const AdminModulesContext = createContext<AdminModulesProviderProps | undefined>(undefined);

export const AdminModulesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [adminState, setAdminState] = useState(0);

    const { checkToken } = useAuth();


    return (
        <AdminModulesContext.Provider value={{ adminState, setAdminState }}>
            {children}
        </AdminModulesContext.Provider>
    );
};

export const useAdminModules = () => {
    const context = useContext(AdminModulesContext);
    if (!context) {
        throw new Error('useAdminModules must be used within a AdminModulesProvider');
    }
    return context;
};