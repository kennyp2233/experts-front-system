// src/app/sistema/dashboard/modulos/documentos/centro_guias/page.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CentroGuiasProvider } from '@/contexts/CentroGuiasContext';
import { AppIcons } from '@/utils/icons';

// Componentes principales
import CreacionDocumentoCoordinacion from '@/components/sistema/centro_guias_components/CreacionDocumentoCoordinacion';
import { GestorDocumentosCoordinacion } from '@/components/sistema/centro_guias_components/GestorDocumentosCoordinacion';
import { AsignacionGuiasHijas } from '@/components/sistema/centro_guias_components/AsignacionGuiasHijas';
import CoordinacionMasiva from '@/components/sistema/centro_guias_components/CoordinacionMasiva';

// Disponible en repositorio existente
import BreadcrumbDocumentos from '@/components/sistema/documentos_components/BreadcrumbDocumentos';
import { FaNetworkWired } from "react-icons/fa";

export default function CentroGuiasPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const tabParam = searchParams?.get('tab');
    const documentoId = searchParams?.get('documento');

    // Tabs disponibles
    const TABS = {
        CREAR_DOCUMENTO: 'crear-documento',
        GESTOR_DOCUMENTOS: 'gestor-documentos',
        ASIGNACION_GUIAS: 'asignacion-guias',
        COORDINACION_MASIVA: 'coordinacion-masiva',
    };

    const [activeTab, setActiveTab] = useState(TABS.ASIGNACION_GUIAS);

    // Establecer la pestaña activa según los parámetros de URL
    useEffect(() => {
        if (tabParam && Object.values(TABS).includes(tabParam)) {
            setActiveTab(tabParam);
        }
    }, [tabParam, TABS]);

    // Actualizar la URL cuando cambia la pestaña
    const handleTabChange = (tab: React.SetStateAction<string>, docId?: string) => {
        setActiveTab(tab);

        // Usar docId si se proporciona, o documentoId del estado actual
        const documentIdToUse = docId || documentoId;

        // Mantener el parámetro documento si está presente y se va a asignación de guías
        if (tab === TABS.ASIGNACION_GUIAS && documentIdToUse) {
            router.push(`/sistema/dashboard/modulos/documentos/centro_guias?tab=${tab}&documento=${documentIdToUse}`, { scroll: false });
        } else {
            router.push(`/sistema/dashboard/modulos/documentos/centro_guias?tab=${tab}`, { scroll: false });
        }
    };

    // Estructura de pestañas con sus nombres y opciones
    const tabOptions = [
        { id: TABS.CREAR_DOCUMENTO, label: 'Crear Documento', icon: <AppIcons.DocumentDuplicate className="w-4 h-4 mr-1" /> },
        { id: TABS.GESTOR_DOCUMENTOS, label: 'Gestor de Documentos', icon: <AppIcons.ClipboardList className="w-4 h-4 mr-1" /> },
        { id: TABS.ASIGNACION_GUIAS, label: 'Asignación de Guías', icon: <AppIcons.Link className="w-4 h-4 mr-1" /> },
        { id: TABS.COORDINACION_MASIVA, label: 'Coordinación Masiva', icon: <AppIcons.Bolt className="w-4 h-4 mr-1" /> },
    ];

    return (
        <CentroGuiasProvider>
            <div className="w-full p-6">
                <BreadcrumbDocumentos
                    icon={<FaNetworkWired />}
                    titulo="Centro de Guías"
                />

                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">Centro de Guías</h1>
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

                    {activeTab === TABS.CREAR_DOCUMENTO && <CreacionDocumentoCoordinacion />}

                    {activeTab === TABS.GESTOR_DOCUMENTOS &&
                        <GestorDocumentosCoordinacion
                            onAssignGuides={(docId: any) => handleTabChange(TABS.ASIGNACION_GUIAS, docId)}
                        />
                    }

                    {activeTab === TABS.ASIGNACION_GUIAS &&
                        <AsignacionGuiasHijas
                            documentoId={documentoId}
                            onComplete={() => handleTabChange(TABS.GESTOR_DOCUMENTOS)}
                        />
                    }

                    {activeTab === TABS.COORDINACION_MASIVA && <CoordinacionMasiva />}
                </div>
            </div>
        </CentroGuiasProvider>
    );
}