import React from "react";

export const LoadingScreen: React.FC = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-base-200 p-4">
            <div className="flex flex-col items-center">
                <span className="loading loading-spinner loading-lg mb-4" aria-label="Cargando"></span>
                <p className="text-xl text-base-content">Cargando datos, por favor espera...</p>
            </div>
        </div>
    );
};