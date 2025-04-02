// src/components/sistema/centro_guias_components/DetalleDocumentoCoordinacion.tsx
import React, { useState, useEffect } from 'react';
import { AppIcons } from '@/utils/icons';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/sistema/common/ui/card';
import DocumentoCoordinacionDetailView from './DocumentoCoordinacionDetailView';
import { GuiasHijasList } from '../../common/lists/GuiasHijasList';
import { ConfirmModal } from '../../common/modals/ConfirmModal';
import { coordinacionesService } from '@/api/services/documentos/coordinacionesService';
import { useRouter } from 'next/navigation';
import { dispatchMenssage } from '@/utils/menssageDispatcher';

interface DetalleDocumentoCoordinacionProps {
    documentoId: number;
    documento?: any;
    onBack?: () => void;
    onAssignGuides?: (documentId: number) => void;
    onDocumentDeleted?: () => void;
}

export const DetalleDocumentoCoordinacion: React.FC<DetalleDocumentoCoordinacionProps> = ({
    documentoId,
    documento: initialDocumento,
    onBack,
    onAssignGuides,
    onDocumentDeleted
}) => {
    const router = useRouter();
    const [documento, setDocumento] = useState<any | null>(initialDocumento || null);
    const [loading, setLoading] = useState(!initialDocumento);
    const [error, setError] = useState<string | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleting, setDeleting] = useState(false);

    // Cargar documento si no se proporciona uno inicial
    useEffect(() => {
        const fetchDocumento = async () => {
            setLoading(true);
            try {
                const response = await coordinacionesService.findOne(documentoId);
                if (response) {
                    setDocumento({
                        ...response,
                        cooLabel: `COO-${response.id.toString().padStart(8, '0')}`,
                    });

                } else {
                    setError("No se encontró el documento solicitado");
                }
            } catch (error) {
                console.error("Error al cargar documento:", error);
                setError("Error al cargar el documento");
                dispatchMenssage('error', 'Error al cargar el documento');
            } finally {
                setLoading(false);
            }
        };

        fetchDocumento();
    }, [documentoId, initialDocumento]);

    // Eliminar documento
    const handleDelete = async () => {
        setDeleting(true);
        try {
            await coordinacionesService.deleteDocument(documentoId);
            dispatchMenssage('success', 'Documento eliminado correctamente');

            if (onDocumentDeleted) {
                onDocumentDeleted();
            } else if (onBack) {
                onBack();
            } else {
                router.push('/sistema/dashboard/modulos/documentos/centro_guias?tab=gestor-documentos');
            }
        } catch (error) {
            console.error('Error al eliminar documento:', error);
            dispatchMenssage('error', 'Error al eliminar el documento');
        } finally {
            setDeleting(false);
            setShowDeleteModal(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center py-8">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    if (error || !documento) {
        return (
            <div className="alert alert-error">
                <AppIcons.Error className="w-6 h-6" />
                <span>{error || "No se pudo cargar el documento"}</span>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center">
                <button
                    className="btn btn-sm btn-outline mr-4"
                    onClick={onBack}
                >
                    <AppIcons.ChevronLeft className="w-4 h-4 mr-1" />
                    Volver
                </button>
                <h3 className="text-xl font-bold">{documento.cooLabel}</h3>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Detalles del documento */}
                <Card className="bg-base-100 shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-lg">Detalles del Documento</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <DocumentoCoordinacionDetailView documento={documento} />
                    </CardContent>
                    <CardFooter className="justify-end space-x-2">
                        <button
                            className="btn btn-outline btn-sm"
                            onClick={() => router.push(`/sistema/dashboard/modulos/documentos/centro_guias?tab=crear-documento&edit=${documento.id}`)}
                        >
                            <AppIcons.Edit className="w-4 h-4 mr-1" />
                            Editar
                        </button>
                        <button
                            className="btn btn-error btn-sm"
                            onClick={() => setShowDeleteModal(true)}
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
                        <GuiasHijasList filtroGuiaMadre={documento.id_guia_madre} showFilters={false} />
                    </CardContent>
                    <CardFooter className="justify-end">
                        <button
                            className="btn btn-primary"
                            onClick={() => {
                                if (onAssignGuides) {
                                    onAssignGuides(documento.id);
                                } else {
                                    router.push(`/sistema/dashboard/modulos/documentos/centro_guias?tab=asignacion-guias&documento=${documento.id}`);
                                }
                            }}
                        >
                            <AppIcons.Add className="w-4 h-4 mr-1" />
                            Asignar Guías Hijas
                        </button>
                    </CardFooter>
                </Card>
            </div>

            {/* Modal de confirmación para eliminar */}
            <ConfirmModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDelete}
                title="Eliminar Documento"
                message="¿Está seguro de que desea eliminar este documento de coordinación? Esta acción no se puede deshacer."
                confirmText="Eliminar"
                type="danger"
                isProcessing={deleting}
            />
        </div>
    );
};
