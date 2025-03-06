'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/authProvider';
import GestionCoordinaciones from '@/components/sistema/coordinaciones/GestionCoordinaciones';
import VistaFincas from '@/components/sistema/coordinaciones/VistaFincas';
import DocumentosRoute from '@/components/sistema/documentos_components/DocumentosRoute';
import { FaChartLine, FaExchangeAlt, FaTruck } from 'react-icons/fa';

export default function CoordinacionesPage() {
    const { hasRole } = useAuth();
    const router = useRouter();
    const [view, setView] = useState<'admin' | 'finca'>('admin');

    // Determinar qué vista mostrar según los roles del usuario
    useEffect(() => {
        if (hasRole(['admin', 'coordinator'])) {
            setView('admin');
        } else if (hasRole(['finca'])) {
            setView('finca');
        } else {
            // Si no tiene ningún rol permitido, redirigir al dashboard
            router.push('/sistema/dashboard');
        }
    }, [hasRole, router]);

    return (
        <div className="container mx-auto">
            <DocumentosRoute
                icon={<FaExchangeAlt />}
                titulo="Coordinaciones"
                desde="sistema"
            />

            <div className="mb-6">
                <h1 className="text-3xl font-bold mb-2">Sistema de Coordinaciones</h1>
                <p className="text-gray-600">
                    Gestión y seguimiento de guías de exportación y coordinación con fincas.
                </p>
            </div>

            {/* Selector de vista para usuarios con múltiples roles */}
            {hasRole(['admin', 'coordinator']) && hasRole(['finca']) && (
                <div className="tabs tabs-boxed mb-6">
                    <button
                        className={`tab ${view === 'admin' ? 'tab-active' : ''}`}
                        onClick={() => setView('admin')}
                    >
                        <FaChartLine className="mr-2" />
                        Vista de Administración
                    </button>
                    <button
                        className={`tab ${view === 'finca' ? 'tab-active' : ''}`}
                        onClick={() => setView('finca')}
                    >
                        <FaTruck className="mr-2" />
                        Vista de Finca
                    </button>
                </div>
            )}

            {/* Mostrar la vista correspondiente */}
            {view === 'admin' && <GestionCoordinaciones />}
            {view === 'finca' && <VistaFincas />}
        </div>
    );
}