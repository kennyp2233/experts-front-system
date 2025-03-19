'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import BreadcrumbDocumentos from '@/components/sistema/documentos_components/BreadcrumbDocumentos';
import { FaNetworkWired } from "react-icons/fa";
import GestionCoordinaciones from "@/components/sistema/centro_guias_components/GestionCoordinaciones";
import CoordinacionesRapidas from "@/components/sistema/centro_guias_components/CoordinacionesRapidas";
import AsignacionGuiasHijas from "@/components/sistema/centro_guias_components/AsignacionGuiasHijas";
import GuiasHijasList from "@/components/sistema/centro_guias_components/GuiasHijasList";
import DashboardGuias from "@/components/sistema/centro_guias_components/DashboardGuias";
import Asignacion from '@/components/sistema/centro_guias_components/Asignacion';

const CentroGuiasPage: React.FC = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const tabParam = searchParams?.get('tab');
    const [activeTab, setActiveTab] = useState("dashboard");

    // Establecer la pestaña activa según los parámetros de URL
    useEffect(() => {
        if (tabParam && ['dashboard', 'asignacion', 'guias-hijas', 'gestion', 'rapidas'].includes(tabParam)) {
            setActiveTab(tabParam);
        }
    }, [tabParam]);

    // Actualizar la URL cuando cambia la pestaña
    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
        router.push(`/sistema/dashboard/modulos/documentos/centro_guias?tab=${tab}`, { scroll: false });
    };

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
                    className={`tab ${activeTab === 'dashboard' ? 'tab-active' : ''}`}
                    onClick={() => handleTabChange('dashboard')}
                >
                    Dashboard
                </a>
                <a
                    className={`tab ${activeTab === 'asignacion' ? 'tab-active' : ''}`}
                    onClick={() => handleTabChange('asignacion')}
                >
                    Asignación de Guías
                </a>
                <a
                    className={`tab ${activeTab === 'guias-hijas' ? 'tab-active' : ''}`}
                    onClick={() => handleTabChange('guias-hijas')}
                >
                    Guías Hijas
                </a>
                <a
                    className={`tab ${activeTab === 'gestion' ? 'tab-active' : ''}`}
                    onClick={() => handleTabChange('gestion')}
                >
                    Gestión de Coordinaciones
                </a>
                <a
                    className={`tab ${activeTab === 'rapidas' ? 'tab-active' : ''}`}
                    onClick={() => handleTabChange('rapidas')}
                >
                    Coordinaciones Rápidas
                </a>
            </div>

            <div className="space-y-6">
                {activeTab === 'dashboard' && <DashboardGuias />}

                {activeTab === 'asignacion' && (
                    <div className="grid grid-cols-1 gap-6">
                        <Asignacion />
                    </div>
                )}

                {activeTab === 'guias-hijas' && (
                    <div className="grid grid-cols-1 gap-6">
                        <GuiasHijasList showFilters={true} />
                    </div>
                )}

                {activeTab === 'gestion' && <GestionCoordinaciones />}

                {activeTab === 'rapidas' && <CoordinacionesRapidas />}
            </div>
        </div>
    );
};

export default CentroGuiasPage;