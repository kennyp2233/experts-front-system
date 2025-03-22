// src/app/sistema/dashboard/modulos/documentos/centro_guias/components/GestorDocumentosCoordinacion.tsx
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { coordinacionesService } from '@/api/services/documentos/coordinacionesService';
import { consignatarioService } from '@/api/services/mantenimiento/consignatarioService';
import { productosService } from '@/api/services/mantenimiento/productosService';
import { dispatchMenssage } from '@/utils/menssageDispatcher';
import { AppIcons } from '@/utils/icons';

// Componentes
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/ui/card';
import DocumentoCoordinacionDetailView from './DocumentoCoordinacionDetailView';
import GuiasHijasList from './GuiasHijasList';

// Tipo para documentos de coordinación con información adicional
interface EnhancedCoordinationDocument {
    id: number;
    id_consignatario: number;
    id_producto: number;
    id_guia_madre: number;
    fecha_vuelo: Date;
    createdAt: Date;
    consignatarioNombre?: string;
    productoNombre?: string;
    estadoLabel?: string;
    cooLabel?: string;
    [key: string]: any;
}

interface GestorDocumentosCoordinacionProps {
    onAssignGuides: (documentId: number) => void;
}

export default function GestorDocumentosCoordinacion({ onAssignGuides }: GestorDocumentosCoordinacionProps) {
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
                const formattedData = response.data.map(doc => {
                    const consignatario = consignatarios.find(c => c.id_consignatario === doc.id_consignatario);
                    const producto = productos.find(p => p.id_producto === doc.id_producto);

                    return {
                        ...doc,
                        consignatarioNombre: consignatario ? consignatario.nombre : 'No asignado',
                        productoNombre: producto ? producto.nombre : 'No asignado',
                        estadoLabel: doc.createdAt ? "Activo" : "Pendiente",
                        cooLabel: `COO-${doc.id.toString().padStart(7, '0')}`
                    };
                });

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
    }, [currentPage, filtro, estadoFiltro, sorting, consignatarios, productos]);

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
            <Card className="bg-base-100 shadow-lg">
                <CardHeader className="pb-2">
                    <div className="flex flex-wrap justify-between items-center">
                        <CardTitle className="text-xl font-semibold">Gestor de Documentos de Coordinación</CardTitle>
                        <button
                            className="btn btn-primary"
                            onClick={() => router.push('/sistema/dashboard/modulos/documentos/centro_guias?tab=crear-documento')}
                        >
                            <AppIcons.Add className="w-4 h-4 mr-1" /> Nuevo Documento
                        </button>
                    </div>
                </CardHeader>

                <CardContent>
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
                                            <th className="cursor-pointer" onClick={() => handleSort('id')}>
                                                <div className="flex items-center">
                                                    COO
                                                    {sorting.field === 'id' && (
                                                        <span className="ml-1">{sorting.direction === 'asc' ? '↑' : '↓'}</span>
                                                    )}
                                                </div>
                                            </th>
                                            <th className="cursor-pointer" onClick={() => handleSort('id_consignatario')}>
                                                <div className="flex items-center">
                                                    Consignatario
                                                    {sorting.field === 'id_consignatario' && (
                                                        <span className="ml-1">{sorting.direction === 'asc' ? '↑' : '↓'}</span>
                                                    )}
                                                </div>
                                            </th>
                                            <th className="cursor-pointer" onClick={() => handleSort('id_producto')}>
                                                <div className="flex items-center">
                                                    Producto
                                                    {sorting.field === 'id_producto' && (
                                                        <span className="ml-1">{sorting.direction === 'asc' ? '↑' : '↓'}</span>
                                                    )}
                                                </div>
                                            </th>
                                            <th className="cursor-pointer" onClick={() => handleSort('fecha_vuelo')}>
                                                <div className="flex items-center">
                                                    Fecha Vuelo
                                                    {sorting.field === 'fecha_vuelo' && (
                                                        <span className="ml-1">{sorting.direction === 'asc' ? '↑' : '↓'}</span>
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
                </CardContent>
            </Card>
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
                    <Card className="bg-base-100 shadow-lg">
                        <CardHeader>
                            <CardTitle className="text-lg">Detalles del Documento</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <DocumentoCoordinacionDetailView documento={selectedDocumento} />
                        </CardContent>
                        <CardFooter className="justify-end space-x-2">
                            <button
                                className="btn btn-outline btn-sm"
                                onClick={() => router.push(`/sistema/dashboard/modulos/documentos/centro_guias?tab=crear-documento&edit=${selectedDocumento.id}`)}
                            >
                                <AppIcons.Edit className="w-4 h-4 mr-1" />
                                Editar
                            </button>
                            <button
                                className="btn btn-error btn-sm"
                                onClick={() => handleDeleteDocument(selectedDocumento.id)}
                            >
                                <AppIcons.Delete className="w-4 h-4 mr-1" />
                                Eliminar
                            </button>
                        </CardFooter>
                    </Card>

                    {/* Guías hijas asociadas */}
                    <Card className="bg-base-100 shadow-lg">
                        <CardHeader>
                            <CardTitle className="text-lg">Guías Hijas Asignadas</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <GuiasHijasList filtroGuiaMadre={selectedDocumento.id_guia_madre} showFilters={false} />
                        </CardContent>
                        <CardFooter className="justify-end">
                            <button
                                className="btn btn-primary"
                                onClick={() => onAssignGuides(selectedDocumento.id)}
                            >
                                <AppIcons.Add className="w-4 h-4 mr-1" />
                                Asignar Guías Hijas
                            </button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        );
    }

    return null;
}