// src/components/sistema/centro_guias_components/AsignacionGuiasHijas.tsx
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { coordinacionesService, CoordinationDocument } from '@/api/services/documentos/coordinacionesService';
import { fincasService } from '@/api/services/mantenimiento/fincasService';
import { guiasHijasService } from '@/api/services/documentos/guiasHijasService';
import { dispatchMenssage } from '@/utils/menssageDispatcher';
import { AppIcons } from '@/utils/icons';

interface AsignacionData {
    id_documento_coordinacion: number;
    id_finca: number;
    id_guia_madre?: number;
}

interface DocumentoCoordinacion extends Partial<CoordinationDocument> {
    cooLabel?: string;
    consignatarioNombre?: string;
}

export default function AsignacionGuiasHijas() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const preselectedDocumentoId = searchParams?.get('documento');

    // Estados
    const [documentos, setDocumentos] = useState<DocumentoCoordinacion[]>([]);
    const [fincas, setFincas] = useState<any[]>([]);
    const [selectedDocumento, setSelectedDocumento] = useState<DocumentoCoordinacion | null>(null);
    const [selectedFincas, setSelectedFincas] = useState<number[]>([]);
    const [fincaSearchTerm, setFincaSearchTerm] = useState<string>('');
    const [filteredFincas, setFilteredFincas] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [validating, setValidating] = useState<boolean>(false);
    const [previewResults, setPreviewResults] = useState<any | null>(null);
    const [step, setStep] = useState<'selection' | 'preview' | 'success'>('selection');
    const [loadingCatalogs, setLoadingCatalogs] = useState<boolean>(true);

    // Cargar catálogos
    useEffect(() => {
        const fetchCatalogs = async () => {
            setLoadingCatalogs(true);
            try {
                const [documentosRes, fincasRes] = await Promise.all([
                    coordinacionesService.getDocuments(1, 100),
                    fincasService.getFincas()
                ]);

                // Formatear documentos con etiquetas legibles
                const formattedDocumentos = documentosRes.data.map(doc => ({
                    ...doc,
                    cooLabel: `COO-${doc.id.toString().padStart(7, '0')}`,
                    consignatarioNombre: 'Pendiente' // Se actualizará después
                }));

                setDocumentos(formattedDocumentos);
                setFincas(fincasRes);
                setFilteredFincas(fincasRes);

                // Si hay un documento preseleccionado en la URL, seleccionarlo
                if (preselectedDocumentoId) {
                    const selectedDoc = formattedDocumentos.find(
                        doc => doc.id === parseInt(preselectedDocumentoId)
                    );
                    if (selectedDoc) {
                        setSelectedDocumento(selectedDoc);
                    }
                }
            } catch (error) {
                console.error('Error al cargar catálogos:', error);
                dispatchMenssage('error', 'Error al cargar datos necesarios');
            } finally {
                setLoadingCatalogs(false);
            }
        };

        fetchCatalogs();
    }, [preselectedDocumentoId]);

    // Filtrar fincas cuando cambia el término de búsqueda
    useEffect(() => {
        if (fincaSearchTerm.trim() === '') {
            setFilteredFincas(fincas);
        } else {
            const searchTermLower = fincaSearchTerm.toLowerCase();
            const filtered = fincas.filter(
                finca =>
                    finca.nombre?.toLowerCase().includes(searchTermLower) ||
                    finca.codigo?.toLowerCase().includes(searchTermLower)
            );
            setFilteredFincas(filtered);
        }
    }, [fincaSearchTerm, fincas]);

    // Manejar selección de documento
    const handleDocumentoSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const docId = parseInt(e.target.value);
        const selected = documentos.find(doc => doc.id === docId) || null;
        setSelectedDocumento(selected);

        // Reset de fincas seleccionadas al cambiar de documento
        setSelectedFincas([]);
    };

    // Manejar selección de finca
    const handleFincaSelect = (fincaId: number) => {
        setSelectedFincas(prev => {
            if (prev.includes(fincaId)) {
                return prev.filter(id => id !== fincaId);
            } else {
                return [...prev, fincaId];
            }
        });
    };

    // Seleccionar todas las fincas filtradas
    const handleSelectAllFincas = () => {
        if (filteredFincas.length === selectedFincas.length) {
            // Si todas están seleccionadas, deseleccionar todas
            setSelectedFincas([]);
        } else {
            // Seleccionar todas las que están filtradas
            setSelectedFincas(filteredFincas.map(finca => finca.id_finca));
        }
    };

    // Previsualizar asignaciones
    const handlePreviewAsignaciones = async () => {
        if (!selectedDocumento || selectedFincas.length === 0) {
            dispatchMenssage('error', 'Seleccione un documento de coordinación y al menos una finca');
            return;
        }

        setValidating(true);

        try {
            // Preparar datos para pre-validación
            const asignaciones: AsignacionData[] = selectedFincas.map(fincaId => ({
                id_documento_coordinacion: selectedDocumento.id!,
                id_finca: fincaId,
                id_guia_madre: selectedDocumento.id_guia_madre
            }));

            // Llamar a la API de pre-validación
            const resultados = await guiasHijasService.prevalidarAsignaciones(asignaciones);

            setPreviewResults(resultados);
            setStep('preview');
        } catch (error) {
            console.error('Error al pre-validar asignaciones:', error);
            dispatchMenssage('error', 'Error al pre-validar asignaciones');
        } finally {
            setValidating(false);
        }
    };

    // Confirmar asignaciones
    const handleConfirmAsignaciones = async () => {
        if (!previewResults) return;

        setLoading(true);

        try {
            // Confirmar todas las asignaciones (nuevas y existentes)
            const resultado = await guiasHijasService.confirmarAsignaciones([
                ...(previewResults.asignacionesExistentes || []),
                ...(previewResults.nuevasAsignaciones || [])
            ]);

            dispatchMenssage(
                'success',
                `Se han asignado ${resultado.asignadas || 0} guías hijas correctamente`
            );
            setStep('success');

            // Limpiar selecciones
            setSelectedDocumento(null);
            setSelectedFincas([]);
            setPreviewResults(null);
        } catch (error) {
            console.error('Error al confirmar asignaciones:', error);
            dispatchMenssage('error', 'Error al confirmar asignaciones');
        } finally {
            setLoading(false);
        }
    };

    // Reiniciar el proceso
    const handleReset = () => {
        setSelectedDocumento(null);
        setSelectedFincas([]);
        setPreviewResults(null);
        setStep('selection');
    };

    // Renderizar pantalla de selección
    if (step === 'selection') {
        return (
            <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                    <h2 className="card-title">Asignación de Guías Hijas</h2>
                    <p className="text-sm opacity-70 mb-4">
                        Este proceso asigna guías hijas vinculando fincas a un documento de coordinación (COO).
                    </p>

                    {loadingCatalogs ? (
                        <div className="flex justify-center py-4">
                            <span className="loading loading-spinner loading-lg"></span>
                        </div>
                    ) : (
                        <>
                            {/* Selección de documento */}
                            <div className="form-control mb-4">
                                <label className="label">
                                    <span className="label-text font-medium">Documento de Coordinación (COO)</span>
                                </label>

                                <select
                                    className="select select-bordered w-full"
                                    value={selectedDocumento?.id || ''}
                                    onChange={handleDocumentoSelect}
                                >
                                    <option value="">Seleccionar documento...</option>
                                    {documentos.map(doc => (
                                        <option key={doc.id} value={doc.id}>
                                            {doc.cooLabel} - {doc.consignatarioNombre}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {selectedDocumento && (
                                <>
                                    <div className="divider">Selección de Fincas</div>

                                    {/* Búsqueda y selección de fincas */}
                                    <div className="form-control">
                                        <div className="flex justify-between items-center">
                                            <label className="label-text font-medium">Fincas Disponibles</label>
                                            <div className="flex items-center space-x-2">
                                                <span className="text-sm opacity-70">
                                                    {selectedFincas.length} / {filteredFincas.length} seleccionadas
                                                </span>
                                                <button
                                                    className="btn btn-xs"
                                                    onClick={handleSelectAllFincas}
                                                >
                                                    {selectedFincas.length === filteredFincas.length
                                                        ? 'Deseleccionar todas'
                                                        : 'Seleccionar todas'}
                                                </button>
                                            </div>
                                        </div>

                                        <div className="input-group mb-2">
                                            <input
                                                type="text"
                                                placeholder="Buscar finca por nombre o código..."
                                                className="input input-bordered w-full"
                                                value={fincaSearchTerm}
                                                onChange={(e) => setFincaSearchTerm(e.target.value)}
                                            />
                                            <button className="btn btn-square">
                                                <AppIcons.Search className="w-5 h-5" />
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mt-2 max-h-80 overflow-y-auto p-2">
                                            {filteredFincas.length === 0 ? (
                                                <div className="col-span-full text-center py-4 text-sm opacity-70">
                                                    No se encontraron fincas con ese término de búsqueda
                                                </div>
                                            ) : (
                                                filteredFincas.map(finca => (
                                                    <div
                                                        key={finca.id_finca}
                                                        className={`border rounded-lg p-2 cursor-pointer hover:bg-base-200 transition-colors ${selectedFincas.includes(finca.id_finca)
                                                            ? 'bg-primary/10 border-primary'
                                                            : ''
                                                            }`}
                                                        onClick={() => handleFincaSelect(finca.id_finca)}
                                                    >
                                                        <div className="flex items-center">
                                                            <input
                                                                type="checkbox"
                                                                className="checkbox checkbox-primary mr-2"
                                                                checked={selectedFincas.includes(finca.id_finca)}
                                                                onChange={() => { }} // Manejado por el onClick del div padre
                                                                onClick={(e) => e.stopPropagation()}
                                                            />
                                                            <div>
                                                                <p className="font-medium">{finca.nombre_finca}</p>
                                                                <p className="text-xs opacity-70">{finca.codigo_finca || 'Sin código'}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>

                                    <div className="card-actions justify-end mt-4">
                                        <button
                                            className="btn btn-primary"
                                            onClick={handlePreviewAsignaciones}
                                            disabled={selectedFincas.length === 0 || validating}
                                        >
                                            {validating ? (
                                                <>
                                                    <span className="loading loading-spinner loading-sm"></span>
                                                    Verificando...
                                                </>
                                            ) : (
                                                <>
                                                    <AppIcons.Search className="w-4 h-4 mr-1" />
                                                    Pre-validar Asignaciones
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </>
                            )}
                        </>
                    )}
                </div>
            </div>
        );
    }

    // Renderizar pantalla de previsualización
    if (step === 'preview' && previewResults) {
        return (
            <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                    <h2 className="card-title">Pre-validación de Asignaciones</h2>

                    <p className="text-sm opacity-70 mb-4">
                        Revise las asignaciones antes de confirmar la creación de guías hijas.
                    </p>

                    <div className="alert alert-info mb-4">
                        <AppIcons.Info className="w-6 h-6" />
                        <div>
                            <span className="font-semibold">Documento de Coordinación:</span> {selectedDocumento?.cooLabel}
                            <br />
                            <span className="font-semibold">Fincas seleccionadas:</span> {selectedFincas.length}
                        </div>
                    </div>

                    {/* Asignaciones existentes */}
                    {previewResults.asignacionesExistentes && previewResults.asignacionesExistentes.length > 0 && (
                        <div className="mt-4">
                            <h3 className="font-bold text-warning flex items-center">
                                <AppIcons.Info className="w-5 h-5 mr-2" />
                                Asignaciones existentes ({previewResults.asignacionesExistentes.length})
                            </h3>
                            <div className="overflow-x-auto">
                                <table className="table table-zebra w-full mt-2">
                                    <thead>
                                        <tr>
                                            <th>Finca</th>
                                            <th>Guía Hija</th>
                                            <th>Estado</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {previewResults.asignacionesExistentes.map((asignacion: any, index: number) => (
                                            <tr key={index}>
                                                <td>{fincas.find(f => f.id_finca === asignacion.id_finca)?.nombre || 'Desconocida'}</td>
                                                <td>{asignacion.numero_guia_hija || `${asignacion.anio}-${asignacion.secuencial}`}</td>
                                                <td><span className="badge badge-warning">Ya asignada</span></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Nuevas asignaciones */}
                    {previewResults.nuevasAsignaciones && previewResults.nuevasAsignaciones.length > 0 && (
                        <div className="mt-4">
                            <h3 className="font-bold text-success flex items-center">
                                <AppIcons.Check className="w-5 h-5 mr-2" />
                                Nuevas asignaciones ({previewResults.nuevasAsignaciones.length})
                            </h3>
                            <div className="overflow-x-auto">
                                <table className="table table-zebra w-full mt-2">
                                    <thead>
                                        <tr>
                                            <th>Finca</th>
                                            <th>Guía Hija (Propuesta)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {previewResults.nuevasAsignaciones.map((asignacion: any, index: number) => (
                                            <tr key={index}>
                                                <td>{fincas.find(f => f.id_finca === asignacion.id_finca)?.nombre || 'Desconocida'}</td>
                                                <td>{`${asignacion.anio}-${asignacion.secuencial}`}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {previewResults.nuevasAsignaciones?.length === 0 && previewResults.asignacionesExistentes?.length === 0 && (
                        <div className="alert alert-warning">
                            <AppIcons.Warning className="w-6 h-6" />
                            <span>No hay asignaciones para procesar. Todas las fincas seleccionadas ya tienen guías asignadas o hay un problema con la configuración.</span>
                        </div>
                    )}

                    <div className="card-actions justify-end mt-6">
                        <button
                            className="btn btn-outline"
                            onClick={handleReset}
                            disabled={loading}
                        >
                            Cancelar
                        </button>
                        <button
                            className="btn btn-primary"
                            onClick={handleConfirmAsignaciones}
                            disabled={!previewResults.nuevasAsignaciones?.length || loading}
                        >
                            {loading ? (
                                <>
                                    <span className="loading loading-spinner loading-sm"></span>
                                    Confirmando...
                                </>
                            ) : (
                                <>
                                    <AppIcons.Check className="w-4 h-4 mr-1" />
                                    Confirmar Asignaciones
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Renderizar pantalla de éxito
    if (step === 'success') {
        return (
            <div className="card bg-base-100 shadow-xl">
                <div className="card-body items-center text-center">
                    <div className="mb-4 text-success">
                        <AppIcons.CheckCircle className="w-16 h-16 mx-auto" />
                    </div>
                    <h2 className="card-title">¡Asignación Completada!</h2>
                    <p>Las guías hijas han sido asignadas correctamente.</p>
                    <div className="card-actions justify-center mt-6 gap-2">
                        <button
                            className="btn btn-primary"
                            onClick={handleReset}
                        >
                            Realizar Nueva Asignación
                        </button>
                        <button
                            className="btn btn-outline"
                            onClick={() => router.push('/sistema/dashboard/modulos/documentos/centro_guias?tab=guias-hijas')}
                        >
                            Ver Guías Hijas
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return null;
}