// src/components/sistema/centro_guias_components/RefactoredGestorDocumentosCoordinacion.tsx
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/ui/card';
import { AppIcons } from '@/utils/icons';
import { useDocumentosCoordinacion } from './hooks/useDocumentosCoordinacion';
import { DocumentosFilter } from './filters/DocumentosFilter';
import { Pagination } from './common/Pagination';
import { ConfirmModal } from './modals/ConfirmModal';
import { DetalleDocumentoCoordinacion } from './DetalleDocumentoCoordinacion';

interface GestorDocumentosCoordinacionProps {
    onAssignGuides: (documentId: number) => void;
}

export const GestorDocumentosCoordinacion: React.FC<GestorDocumentosCoordinacionProps> = ({
    onAssignGuides
}) => {
    const router = useRouter();
    const [viewMode, setViewMode] = useState<'list' | 'detail'>('list');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [documentToDelete, setDocumentToDelete] = useState<number | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Utilizar el hook personalizado para la lógica
    const {
        documentos,
        selectedDocumento,
        loading,
        error,
        currentPage,
        totalPages,
        filtro,
        estadoFiltro,
        sorting,
        setCurrentPage,
        setFiltro,
        setEstadoFiltro,
        fetchDocumentos,
        fetchDocumentoById,
        deleteDocumento,
        handleSort,
        setSelectedDocumento
    } = useDocumentosCoordinacion();

    // Ver detalles de un documento
    const handleViewDetails = async (id: number) => {
        const documento = await fetchDocumentoById(id);
        if (documento) {
            setViewMode('detail');
        }
    };

    // Volver a la lista
    const handleBackToList = () => {
        setSelectedDocumento(null);
        setViewMode('list');
    };

    // Confirmar borrado de documento
    const handleConfirmDelete = async () => {
        if (!documentToDelete) return;

        setIsDeleting(true);
        try {
            const success = await deleteDocumento(documentToDelete);
            if (success && viewMode === 'detail' && selectedDocumento?.id === documentToDelete) {
                setViewMode('list');
            }
        } finally {
            setIsDeleting(false);
            setShowDeleteModal(false);
            setDocumentToDelete(null);
        }
    };

    // Borrar un documento (mostrar confirmación)
    const handleDeleteDocument = (id: number) => {
        setDocumentToDelete(id);
        setShowDeleteModal(true);
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
                    <DocumentosFilter
                        filtro={filtro}
                        setFiltro={setFiltro}
                        estadoFiltro={estadoFiltro}
                        setEstadoFiltro={setEstadoFiltro}
                        onSort={handleSort}
                        sorting={sorting}
                        loading={loading}
                    />

                    {loading ? (
                        <div className="flex justify-center py-8">
                            <span className="loading loading-spinner loading-lg"></span>
                        </div>
                    ) : error ? (
                        <div className="alert alert-error shadow-lg mt-4">
                            <AppIcons.Error className="w-6 h-6" />
                            <span>{error}</span>
                        </div>
                    ) : documentos.length === 0 ? (
                        <div className="alert alert-info mt-4">
                            <AppIcons.Info className="w-6 h-6" />
                            <span>No hay documentos de coordinación disponibles con los filtros seleccionados.</span>
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto mt-4">
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
                                                    Marcación
                                                    {sorting.field === 'id_consignatario' && (
                                                        <span className="ml-1">{sorting.direction === 'asc' ? '↑' : '↓'}</span>
                                                    )}
                                                </div>
                                            </th>
                                            <th className="cursor-pointer" onClick={() => handleSort('id_producto')}>
                                                <div className="flex items-center">
                                                    Cliente
                                                    {sorting.field === 'id_cliente' && (
                                                        <span className="ml-1">{sorting.direction === 'asc' ? '↑' : '↓'}</span>
                                                    )}
                                                </div>
                                            </th>

                                            <th className="cursor-pointer" onClick={() => handleSort('id_producto')}>
                                                <div className="flex items-center">
                                                    Aerolinea
                                                    {sorting.field === 'id_aerolinea' && (
                                                        <span className="ml-1">{sorting.direction === 'asc' ? '↑' : '↓'}</span>
                                                    )}
                                                </div>
                                            </th>
                                            <th className="cursor-pointer" onClick={() => handleSort('fecha_vuelo')}>
                                                <div className="flex items-center">
                                                    Guía Madre
                                                    {sorting.field === 'guia_madre' && (
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
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {documentos.map((doc) => (
                                            <tr key={doc.id} className="hover">
                                                <td>{doc.cooLabel}</td>
                                                <td>{doc.consignatario.nombre_consignatario}</td>
                                                <td>{doc.consignatario.cliente.nombre}</td>
                                                <td>{doc.guia_madre.documento_base.aerolinea.nombre}</td>
                                                <td>{`${doc.guia_madre.prefijo}-${String(doc.guia_madre.secuencial).padStart(8, '0')}`}</td>

                                                <td>
                                                    {doc.fecha_vuelo
                                                        ? new Date(doc.fecha_vuelo).toLocaleDateString()
                                                        : 'No definida'}
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
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={setCurrentPage}
                                disabled={loading}
                            />
                        </>
                    )}
                </CardContent>
            </Card>
        );
    }

    // Renderizar vista de detalle
    if (viewMode === 'detail' && selectedDocumento) {
        return (
            <DetalleDocumentoCoordinacion
                documentoId={selectedDocumento.id}
                documento={selectedDocumento}
                onBack={handleBackToList}
                onAssignGuides={onAssignGuides}
                onDocumentDeleted={() => {
                    setViewMode('list');
                    fetchDocumentos();
                }}
            />
        );
    }

    // Si no hay documento seleccionado pero estamos en modo detalle, mostrar error
    return (
        <div className="alert alert-error">
            <AppIcons.Error className="w-6 h-6" />
            <span>Error al cargar documento. Por favor, inténtelo de nuevo.</span>
        </div>
    );
};

