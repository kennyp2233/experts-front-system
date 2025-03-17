'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import BreadcrumbDocumentos from '@/components/sistema/documentos_components/BreadcrumbDocumentos';
import { FaNetworkWired } from "react-icons/fa";
import GestionCoordinaciones from "@/components/sistema/centro_guias_components/GestionCoordinaciones";
import CoordinacionesRapidas from "@/components/sistema/centro_guias_components/CoordinacionesRapidas";
import Asignacion from "@/components/sistema/centro_guias_components/Asignacion";

const CentroGuiasPage: React.FC = () => {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("asignacion");

    return (
        <div className="w-full p-6">
            <BreadcrumbDocumentos
                icon={<FaNetworkWired />}
                titulo="Centro de Guías"
            />

            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Centro de Guías</h1>
            </div>

            <div className="tabs tabs-boxed mb-6">
                <a
                    className={`tab ${activeTab === 'asignacion' ? 'tab-active' : ''}`}
                    onClick={() => setActiveTab('asignacion')}
                >
                    Asignación de Guías
                </a>
                <a
                    className={`tab ${activeTab === 'gestion' ? 'tab-active' : ''}`}
                    onClick={() => setActiveTab('gestion')}
                >
                    Gestión de Coordinaciones
                </a>
                <a
                    className={`tab ${activeTab === 'rapidas' ? 'tab-active' : ''}`}
                    onClick={() => setActiveTab('rapidas')}
                >
                    Coordinaciones Rápidas
                </a>
            </div>

            {activeTab === 'asignacion' && <Asignacion />}
            {activeTab === 'gestion' && <GestionCoordinaciones />}
            {activeTab === 'rapidas' && <CoordinacionesRapidas />}
        </div>
    );
};

export default CentroGuiasPage;