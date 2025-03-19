// src/app/sistema/dashboard/modulos/documentos/centro_guias/page.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import BreadcrumbDocumentos from '@/components/sistema/documentos_components/BreadcrumbDocumentos';
import { FaNetworkWired } from "react-icons/fa";
import { AppIcons } from '@/utils/icons';

// Componentes que se mantendrán o adaptarán 
import GuiasHijasList from "@/components/sistema/centro_guias_components/GuiasHijasList";
import DashboardGuias from "@/components/sistema/centro_guias_components/DashboardGuias";
import CoordinacionesRapidas from "@/components/sistema/centro_guias_components/CoordinacionesRapidas";

// Importación de los nuevos componentes mejorados
import CreacionDocumentoCoordinacion from '@/components/sistema/centro_guias_components/CreacionDocumentoCoordinacion';
import GestionDocumentosCoordinacion from '@/components/sistema/centro_guias_components/GestionDocumentosCoordinacion';
import AsignacionGuiasHijas from "@/components/sistema/centro_guias_components/AsignacionGuiasHijas";

const CentroGuiasPage: React.FC = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const tabParam = searchParams?.get('tab');

    // Tabs disponibles
    const tabs = {
        DASHBOARD: 'dashboard',
        CREAR_DOCUMENTO: 'crear-documento',
        ASIGNACION_GUIAS: 'asignacion-guias',
        GUIAS_HIJAS: 'guias-hijas',
        GESTION_DOCUMENTOS: 'gestion-documentos',
        COORDINACION_RAPIDA: 'coordinacion-rapida',
    };

    const [activeTab, setActiveTab] = useState(tabs.DASHBOARD);

    // Establecer la pestaña activa según los parámetros de URL
    useEffect(() => {
        if (tabParam && Object.values(tabs).includes(tabParam)) {
            setActiveTab(tabParam);
        }
    }, [tabParam, tabs]);

    // Actualizar la URL cuando cambia la pestaña
    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
        router.push(`/sistema/dashboard/modulos/documentos/centro_guias?tab=${tab}`, { scroll: false });
    };

    // Estructura de pestañas con sus nombres y opciones
    const tabOptions = [
        { id: tabs.DASHBOARD, label: 'Dashboard', icon: <AppIcons.Dashboard className="w-4 h-4 mr-1" /> },
        { id: tabs.CREAR_DOCUMENTO, label: 'Crear Documento COO', icon: <AppIcons.DocumentDuplicate className="w-4 h-4 mr-1" /> },
        { id: tabs.ASIGNACION_GUIAS, label: 'Asignación de Guías', icon: <AppIcons.Link className="w-4 h-4 mr-1" /> },
        { id: tabs.GUIAS_HIJAS, label: 'Guías Hijas', icon: <AppIcons.Document className="w-4 h-4 mr-1" /> },
        { id: tabs.GESTION_DOCUMENTOS, label: 'Gestión de Documentos', icon: <AppIcons.ClipboardList className="w-4 h-4 mr-1" /> },
        { id: tabs.COORDINACION_RAPIDA, label: 'Coordinación Rápida', icon: <AppIcons.Bolt className="w-4 h-4 mr-1" /> },
    ];

    return (
        <div className="w-full p-6">
            <BreadcrumbDocumentos
                icon={<FaNetworkWired />}
                titulo="Centro de Guías"
            />

            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Centro de Guías</h1>
                <div className="flex gap-2">
                    {/* Botones de acción rápida podrían ir aquí si se necesitan */}
                </div>
            </div>

            {/* Tabs con íconos para mejor UX */}
            <div className="tabs tabs-boxed mb-6">
                {tabOptions.map((tab) => (
                    <a
                        key={tab.id}
                        className={`tab gap-1 ${activeTab === tab.id ? 'tab-active' : ''}`}
                        onClick={() => handleTabChange(tab.id)}
                    >
                        {tab.icon}
                        {tab.label}
                    </a>
                ))}
            </div>

            <div className="space-y-6">
                {/* Dashboard */}
                {activeTab === tabs.DASHBOARD && <DashboardGuias />}

                {/* Crear Documento de Coordinación */}
                {activeTab === tabs.CREAR_DOCUMENTO && <CreacionDocumentoCoordinacion />}

                {/* Asignación de Guías Hijas */}
                {activeTab === tabs.ASIGNACION_GUIAS && <AsignacionGuiasHijas />}

                {/* Lista de Guías Hijas */}
                {activeTab === tabs.GUIAS_HIJAS && (
                    <div className="grid grid-cols-1 gap-6">
                        <GuiasHijasList showFilters={true} />
                    </div>
                )}

                {/* Gestión de Documentos de Coordinación */}
                {activeTab === tabs.GESTION_DOCUMENTOS && <GestionDocumentosCoordinacion />}

                {/* Coordinación Rápida */}
                {activeTab === tabs.COORDINACION_RAPIDA && <CoordinacionesRapidas />}
            </div>
        </div>
    );
};

export default CentroGuiasPage;