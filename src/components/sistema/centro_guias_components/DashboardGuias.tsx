import React, { useState, useEffect } from 'react';
import { coordinacionesService } from '@/api/services/documentos/coordinacionesService';
import { guiasHijasService, GuiaHija } from '@/api/services/documentos/guiasHijasService';
import { guiasMadreService } from '@/api/services/documentos/guiasMadreService';
import { dispatchMenssage } from '@/utils/menssageDispatcher';
import { AppIcons } from '@/utils/icons';
import { useRouter } from 'next/navigation';

interface StatCardProps {
    title: string;
    value: number | string;
    icon: React.ReactNode;
    description?: string;
    color?: string;
    loading?: boolean;
    onClick?: () => void;
}

const StatCard: React.FC<StatCardProps> = ({
    title,
    value,
    icon,
    description,
    color = "primary",
    loading = false,
    onClick
}) => {
    return (
        <div
            className={`card bg-base-100 shadow-md hover:shadow-lg transition-shadow ${onClick ? 'cursor-pointer' : ''}`}
            onClick={onClick}
        >
            <div className="card-body p-6">
                <div className="flex justify-between items-center">
                    <h3 className="card-title text-lg">{title}</h3>
                    <div className={`text-${color}`}>
                        {icon}
                    </div>
                </div>

                {loading ? (
                    <span className="loading loading-spinner loading-md"></span>
                ) : (
                    <p className="text-3xl font-bold mt-2">{value}</p>
                )}

                {description && (
                    <p className="text-sm opacity-70 mt-2">{description}</p>
                )}
            </div>
        </div>
    );
};

export default function DashboardGuias() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalGuiasMadre: 0,
        guiasMadreDisponibles: 0,
        totalCoordinaciones: 0,
        totalGuiasHijas: 0,
        pendientesAsignacion: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            try {
                // En un entorno real, idealmente tendríamos endpoints específicos para estadísticas
                // Aquí estamos simulando esas consultas usando los endpoints existentes

                const [guiasMadreResponse, coordinacionesResponse, guiasHijasResponse] = await Promise.all([
                    guiasMadreService.getGuiasMadre(),
                    coordinacionesService.getDocuments(1, 1), // Solo para obtener el total
                    guiasHijasService.getGuiasHijas(1, 1) // Solo para obtener el total
                ]);

                const guiasMadreDisponibles = guiasMadreResponse.filter(gm => !gm.prestado).length;

                setStats({
                    totalGuiasMadre: guiasMadreResponse.length,
                    guiasMadreDisponibles,
                    totalCoordinaciones: coordinacionesResponse.total,
                    totalGuiasHijas: guiasHijasResponse.total,
                    // Esto es un cálculo aproximado simulando "pendientes"
                    pendientesAsignacion: Math.max(0, coordinacionesResponse.total - guiasHijasResponse.total)
                });
            } catch (error) {
                console.error('Error al cargar estadísticas:', error);
                dispatchMenssage('error', 'Error al cargar estadísticas del sistema');
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const navigateToSection = (section: string) => {
        router.push(`/sistema/dashboard/modulos/documentos/centro_guias?tab=${section}`);
    };

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">Panel de Control</h2>
            <p className="mb-6">Resumen del estado actual de guías y coordinaciones en el sistema.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                <StatCard
                    title="Guías Madre Disponibles"
                    value={loading ? "..." : stats.guiasMadreDisponibles}
                    icon={<AppIcons.Document className="w-8 h-8" />}
                    description={`De un total de ${stats.totalGuiasMadre} guías madre`}
                    color="primary"
                    loading={loading}
                    onClick={() => navigateToSection('asignacion')}
                />

                <StatCard
                    title="Documentos de Coordinación"
                    value={loading ? "..." : stats.totalCoordinaciones}
                    icon={<AppIcons.Network className="w-8 h-8" />}
                    description="Documentos COO creados en el sistema"
                    color="secondary"
                    loading={loading}
                    onClick={() => navigateToSection('gestion')}
                />

                <StatCard
                    title="Guías Hijas Asignadas"
                    value={loading ? "..." : stats.totalGuiasHijas}
                    icon={<AppIcons.Package className="w-8 h-8" />}
                    description="Asignaciones realizadas a fincas"
                    color="success"
                    loading={loading}
                    onClick={() => navigateToSection('guias-hijas')}
                />

                <StatCard
                    title="Pendientes de Asignación"
                    value={loading ? "..." : stats.pendientesAsignacion}
                    icon={<AppIcons.Clock className="w-8 h-8" />}
                    description="Documentos COO sin guías hijas asignadas"
                    color="warning"
                    loading={loading}
                    onClick={() => navigateToSection('rapidas')}
                />
            </div>

            <div className="mt-8 flex justify-end">
                <button
                    className="btn btn-primary"
                    onClick={() => router.push('/sistema/dashboard/modulos/documentos/centro_guias')}
                >
                    <AppIcons.ChevronRight className="w-4 h-4 mr-1" />
                    Ir al Centro de Guías
                </button>
            </div>
        </div>
    );
}