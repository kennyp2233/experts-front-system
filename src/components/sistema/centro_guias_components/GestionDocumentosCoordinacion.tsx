// src/components/sistema/centro_guias_components/GestionDocumentosCoordinacion.tsx
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { coordinacionesService, CoordinationDocument } from '@/api/services/documentos/coordinacionesService';
import { consignatarioService } from '@/api/services/mantenimiento/consignatarioService';
import { productosService } from '@/api/services/mantenimiento/productosService';
import { dispatchMenssage } from '@/utils/menssageDispatcher';
import { AppIcons } from '@/utils/icons';
import GuiasHijasList from './GuiasHijasList';

interface EnhancedCoordinationDocument extends CoordinationDocument {
    consignatarioNombre?: string;
    productoNombre?: string;
    estadoLabel?: string;
    cooLabel?: string;
}

export default function GestionDocumentosCoordinacion() {
    const router = useRouter();

    // Estados
    const [documentos, setDocumentos] = useState<EnhancedCoordinationDocument[]>([]);
    const [consignatarios, setConsignatarios] = useState<any[]>([]);
    const [productos, setProductos] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [selectedDocumentoId, setSelectedDocumentoId] = useState<number | null>(null);
    const [viewMode, setViewMode] = useState<'list' | 'detail'>('list');
    const [filtro, setFiltro] = useState<string>('');
    const [estadoFiltro, setEstadoFiltro] = useState<string>('todos');
    const [sorting, setSorting] = useState<{ field: string, direction: 'asc' | 'desc' }>({
        field: 'createdAt',
        direction: 'desc'
    });

    // Cargar catálogos necesarios para mostrar nombres en lugar de IDs
    useEffect(() => {
        const fetchCatalogs = async () => {
            try {
                const [consignatariosData, productosData] = await Promise.all([
                    consignatarioService.getConsignatarios(),
                    productosService.getProductos()
                ]);

                setConsignatarios(consignatariosData);
                setProductos(productosData);
            } catch (err) {
                console.error('Error al cargar catálogos:', err);
            }
        };

        fetchCatalogs();
    }, []);

    // Cargar documentos de coordinación con paginación
    useEffect(() => {
        const fetchDocumentos = async () => {
            setLoading(true);
            try {
                // Construir filtros
                const filters: any = {};

                // Filtro de búsqueda (ID o consignatario)
                if (filtro) {
                    if (!isNaN(Number(filtro))) {
                        filters.id = Number(filtro);
                    } else {
                        // Implementar filtro por nombre de consignatario o producto si se necesita
                        // (Requeriría modificación en el backend)
                    }
                }

                // Filtro por estado (todos, activos, pendientes)
                if (estadoFiltro !== 'todos') {
                    filters.estado = estadoFiltro;
                }

                // Ordenamiento
                filters.sortField = sorting.field;
                filters.sortDirection = sorting.direction;

                const response = await coordinacionesService.getDocuments(currentPage, 10, filters);

                // Transformar datos para mostrar información legible
                const formattedData = response.data.map(doc => ({
                    ...doc,
                    consignatarioNombre: 'Pendiente', // Se actualizará después
                    productoNombre: 'Pendiente', // Se actualizará después
                    estadoLabel: doc.createdAt ? "Activo" : "Pendiente",
                    cooLabel: `COO-${doc.id.toString().padStart(7, '0')}`
                }));

                setDocumentos(formattedData);
                setTotalPages(response.totalPages);
                setError(null);
            } catch (err) {
                console.error('Error al cargar documentos de coordinación:', err);
                setError('No se pudieron cargar los documentos de coordinación');
                dispatchMenssage('error', 'Error al cargar los documentos de coordinación');
            } finally {
                setLoading(false);
            }
        };

        fetchDocumentos();
    }, [currentPage, filtro, estadoFiltro, sorting]);

    // Enriquecer datos con información de catálogos
    useEffect(() => {
        if (documentos.length > 0 && consignatarios.length > 0 && productos.length > 0) {
            const enrichedData = documentos.map(doc => {
                const consignatario = consignatarios.find(c => c.id_consignatario === doc.id_consignatario);
                const producto = productos.find(p => p.id_producto === doc.id_producto);

                return {
                    ...doc,
                    consignatarioNombre: consignatario?.nombre || 'No asignado',
                    productoNombre: producto?.nombre || 'No asignado'
                };
            });

            setDocumentos(enrichedData);
        }
    }, [consignatarios, productos, documentos]);

    // Ver detalles de un documento
    const handleViewDetails = (id: number) => {
        setSelectedDocumentoId(id);
        setViewMode('detail');
    };

    // Volver a la lista
    const handleBackToList = () => {
        setSelectedDocumentoId(null);
        setViewMode('list');
    };

    // Borrar un documento
    const handleDeleteDocument = async (id: number) => {
        if (confirm("¿Está seguro de que desea eliminar este documento? Esta acción no se puede deshacer.")) {
            try {
                await coordinacionesService.deleteDocument(id);
                dispatchMenssage('success', 'Documento eliminado correctamente');

                // Actualizar la lista
                setDocumentos(prev => prev.filter(doc => doc.id !== id));

                // Si estamos en la vista de detalle, volver a la lista
                if (viewMode === 'detail' && selectedDocumentoId === id) {
                    setViewMode('list');
                    setSelectedDocumentoId(null);
                }
            } catch (error) {
                console.error('Error al eliminar el documento:', error);
                dispatchMenssage('error', 'Error al eliminar el documento');
            }
        }
    };

    // Cambiar ordenamiento
    const handleSort = (field: string) => {
        setSorting(prev => ({
            field,
            direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    // Renderizar vista de lista
    if (viewMode === 'list') {
        return (
            <div className="card bg-base-100 shadow-lg">
                <div className="card-body">
                    <div className="flex flex-wrap justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold">Gestión de Documentos de Coordinación</h2>

                        <button
                            className="btn btn-primary"
                            onClick={() => router.push('/sistema/dashboard/modulos/documentos/centro_guias?tab=crear-documento')}
                        >
                            <AppIcons.Add className="w-4 h-4 mr-1" /> Nuevo Documento
                        </button>
                    </div>

                    {/* Filtros */}
                    <div className="flex flex-wrap gap-3 mb-6">
                        <div className="form-control flex-1 max-w-xs">
                            <div className="input-group">
                                <input
                                    type="text"
                                    placeholder="Buscar por ID..."
                                    className="input input-bordered w-full"
                                    value={filtro}
                                    onChange={(e) => setFiltro(e.target.value)}
                                />
                                <button className="btn btn-square btn-primary">
                                    <AppIcons.Search className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        <select
                            className="select select-bordered"
                            value={estadoFiltro}
                            onChange={(e) => setEstadoFiltro(e.target.value)}
                        >
                            <option value="todos">Todos los estados</option>
                            <option value="activo">Activos</option>
                            <option value="pendiente">Pendientes</option>
                        </select>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-8">
                            <span className="loading loading-spinner loading-lg"></span>
                        </div>
                    ) : error ? (
                        <div className="alert alert-error shadow-lg">
                            <AppIcons.Error className="w-6 h-6" />
                            <span>{error}</span>
                        </div>
                    ) : documentos.length === 0 ? (
                        <div className="alert alert-info">
                            <AppIcons.Info className="w-6 h-6" />
                            <span>No hay documentos de coordinación disponibles con los filtros seleccionados.</span>
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="table w-full">
                                    <thead>
                                        <tr>
                                            <th
                                                className="cursor-pointer"
                                                onClick={() => handleSort('id')}
                                            >
                                                <div className="flex items-center">
                                                    COO
                                                    {sorting.field === 'id' && (
                                                        <span className="ml-1">
                                                            {sorting.direction === 'asc' ? '↑' : '↓'}
                                                        </span>
                                                    )}
                                                </div>
                                            </th>
                                            <th
                                                className="cursor-pointer"
                                                onClick={() => handleSort('id_consignatario')}
                                            >
                                                <div className="flex items-center">
                                                    Consignatario
                                                    {sorting.field === 'id_consignatario' && (
                                                        <span className="ml-1">
                                                            {sorting.direction === 'asc' ? '↑' : '↓'}
                                                        </span>
                                                    )}
                                                </div>
                                            </th>
                                            <th
                                                className="cursor-pointer"
                                                onClick={() => handleSort('id_producto')}
                                            >
                                                <div className="flex items-center">
                                                    Producto
                                                    {sorting.field === 'id_producto' && (
                                                        <span className="ml-1">
                                                            {sorting.direction === 'asc' ? '↑' : '↓'}
                                                        </span>
                                                    )}
                                                </div>
                                            </th>
                                            <th
                                                className="cursor-pointer"
                                                onClick={() => handleSort('fecha_vuelo')}
                                            >
                                                <div className="flex items-center">
                                                    Fecha Vuelo
                                                    {sorting.field === 'fecha_vuelo' && (
                                                        <span className="ml-1">
                                                            {sorting.direction === 'asc' ? '↑' : '↓'}
                                                        </span>
                                                    )}
                                                </div>
                                            </th>
                                            <th>Estado</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {documentos.map((doc) => (
                                            <tr key={doc.id} className="hover">
                                                <td>{doc.cooLabel}</td>
                                                <td>{doc.consignatarioNombre}</td>
                                                <td>{doc.productoNombre}</td>
                                                <td>
                                                    {doc.fecha_vuelo
                                                        ? new Date(doc.fecha_vuelo).toLocaleDateString()
                                                        : 'No definida'}
                                                </td>
                                                <td>
                                                    <span className={`badge ${doc.estadoLabel === 'Activo' ? 'badge-success' : 'badge-warning'}`}>
                                                        {doc.estadoLabel}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className="flex space-x-2">
                                                        <button
                                                            className="btn btn-sm btn-primary"
                                                            onClick={() => handleViewDetails(doc.id)}
                                                        >
                                                            <AppIcons.Search className="w-4 h-4" />
                                                            Ver
                                                        </button>
                                                        <button
                                                            className="btn btn-sm btn-error"
                                                            onClick={() => handleDeleteDocument(doc.id)}
                                                        >
                                                            <AppIcons.Delete className="w-4 h-4" />
                                                            Eliminar
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Paginación */}
                            {totalPages > 1 && (
                                <div className="flex justify-center mt-4">
                                    <div className="join">
                                        <button
                                            className="join-item btn"
                                            onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                                            disabled={currentPage === 1}
                                        >
                                            «
                                        </button>
                                        <button className="join-item btn">
                                            Página {currentPage} de {totalPages}
                                        </button>
                                        <button
                                            className="join-item btn"
                                            onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                                            disabled={currentPage === totalPages}
                                        >
                                            »
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        );
    }

    // Renderizar vista de detalle
    if (viewMode === 'detail' && selectedDocumentoId) {
        const selectedDocumento = documentos.find(doc => doc.id === selectedDocumentoId);

        if (!selectedDocumento) {
            return (
                <div className="alert alert-error">
                    <AppIcons.Error className="w-6 h-6" />
                    <span>Documento no encontrado</span>
                </div>
            );
        }

        return (
            <div className="space-y-6">
                <div className="flex items-center">
                    <button
                        className="btn btn-sm btn-outline mr-4"
                        onClick={handleBackToList}
                    >
                        <AppIcons.ChevronLeft className="w-4 h-4 mr-1" />
                        Volver a la lista
                    </button>
                    <h3 className="text-xl font-bold">{selectedDocumento.cooLabel}</h3>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Detalles del documento */}
                    <div className="card bg-base-100 shadow-lg">
                        <div className="card-body">
                            <h3 className="card-title text-lg">Detalles del Documento de Coordinación</h3>

                            <div className="grid grid-cols-2 gap-4 mt-4">
                                <div>
                                    <p className="text-sm opacity-70">Consignatario</p>
                                    <p className="font-medium">{selectedDocumento.consignatarioNombre}</p>
                                </div>
                                <div>
                                    <p className="text-sm opacity-70">Producto</p>
                                    <p className="font-medium">{selectedDocumento.productoNombre}</p>
                                </div>
                                <div>
                                    <p className="text-sm opacity-70">Fecha de Vuelo</p>
                                    <p className="font-medium">
                                        {selectedDocumento.fecha_vuelo
                                            ? new Date(selectedDocumento.fecha_vuelo).toLocaleDateString()
                                            : 'No definida'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm opacity-70">Fecha de Asignación</p>
                                    <p className="font-medium">
                                        {selectedDocumento.fecha_asignacion
                                            ? new Date(selectedDocumento.fecha_asignacion).toLocaleDateString()
                                            : 'No definida'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm opacity-70">Tipo de Pago</p>
                                    <p className="font-medium">
                                        {selectedDocumento.pago || 'No definido'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm opacity-70">Estado</p>
                                    <p className="font-medium">
                                        <span className={`badge ${selectedDocumento.estadoLabel === 'Activo' ? 'badge-success' : 'badge-warning'}`}>
                                            {selectedDocumento.estadoLabel}
                                        </span>
                                    </p>
                                </div>
                            </div>

                            {/* Sección de tarifas y valores */}
                            <div className="divider">Tarifas y Valores</div>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                <div>
                                    <p className="text-sm opacity-70">Costo Guía</p>
                                    <p className="font-medium">
                                        {selectedDocumento.costo_guia_valor
                                            ? `$${selectedDocumento.costo_guia_valor.toFixed(2)}`
                                            : '-'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm opacity-70">Combustible</p>
                                    <p className="font-medium">
                                        {selectedDocumento.combustible_valor
                                            ? `${selectedDocumento.combustible_valor.toFixed(2)}`
                                            : '-'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm opacity-70">Seguridad</p>
                                    <p className="font-medium">
                                        {selectedDocumento.seguridad_valor
                                            ? `${selectedDocumento.seguridad_valor.toFixed(2)}`
                                            : '-'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm opacity-70">Tarifa Rate</p>
                                    <p className="font-medium">
                                        {selectedDocumento.tarifa_rate
                                            ? `${selectedDocumento.tarifa_rate.toFixed(2)}`
                                            : '-'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm opacity-70">Char Weight</p>
                                    <p className="font-medium">
                                        {selectedDocumento.char_weight
                                            ? selectedDocumento.char_weight.toFixed(2)
                                            : '-'}
                                    </p>
                                </div>
                            </div>

                            {/* Acciones */}
                            <div className="card-actions justify-end mt-6">
                                <button
                                    className="btn btn-error"
                                    onClick={() => handleDeleteDocument(selectedDocumento.id)}
                                >
                                    <AppIcons.Delete className="w-4 h-4 mr-1" />
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Guías hijas asociadas */}
                    <div className="card bg-base-100 shadow-lg">
                        <div className="card-body">
                            <h3 className="card-title text-lg">Guías Hijas Asignadas</h3>
                            <GuiasHijasList filtroGuiaMadre={selectedDocumento.id_guia_madre} showFilters={false} />

                            <div className="card-actions justify-end mt-4">
                                <button
                                    className="btn btn-primary"
                                    onClick={() => router.push(`/sistema/dashboard/modulos/documentos/centro_guias?tab=asignacion-guias&documento=${selectedDocumento.id}`)}
                                >
                                    <AppIcons.Add className="w-4 h-4 mr-1" />
                                    Asignar Guías Hijas
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return null;
}