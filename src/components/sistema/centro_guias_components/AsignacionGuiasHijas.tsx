// src/components/sistema/centro_guias_components/AsignacionGuiasHijas.tsx
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { coordinacionesService, CoordinationDocument } from '@/api/services/documentos/coordinacionesService';
import { fincasService } from '@/api/services/mantenimiento/fincasService';
import { productosService } from '@/api/services/mantenimiento/productosService';
import { guiasHijasService } from '@/api/services/documentos/guiasHijasService';
import { dispatchMenssage } from '@/utils/menssageDispatcher';
import { AppIcons } from '@/utils/icons';

interface AsignacionData {
    id_documento_coordinacion: number;
    id_finca: number;
    id_guia_madre?: number;
    id_producto?: number;
    fulls?: number;
    pcs?: number;
    kgs?: number;
    stems?: number;
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
    const [productos, setProductos] = useState<any[]>([]);
    const [selectedDocumento, setSelectedDocumento] = useState<DocumentoCoordinacion | null>(null);
    const [selectedFincas, setSelectedFincas] = useState<number[]>([]);
    const [selectedProducto, setSelectedProducto] = useState<number | undefined>(undefined);
    const [cantidades, setCantidades] = useState({
        fulls: 0,
        pcs: 0,
        kgs: 0,
        stems: 0
    });
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
                const [documentosRes, fincasRes, productosRes] = await Promise.all([
                    coordinacionesService.getDocuments(1, 100),
                    fincasService.getFincas(),
                    productosService.getProductos()
                ]);

                // Formatear documentos con etiquetas legibles
                const formattedDocumentos = documentosRes.data.map(doc => ({
                    ...doc,
                    cooLabel: `COO-${doc.id.toString().padStart(7, '0')}`,
                    consignatarioNombre: 'Pendiente' // Se actualizará después
                }));

                setDocumentos(formattedDocumentos);
                setFincas(fincasRes);
                setProductos(productosRes);
                setFilteredFincas(fincasRes);

                // Si hay un documento preseleccionado en la URL, seleccionarlo
                if (preselectedDocumentoId) {
                    const selectedDoc = formattedDocumentos.find(
                        doc => doc.id === parseInt(preselectedDocumentoId)
                    );
                    if (selectedDoc) {
                        setSelectedDocumento(selectedDoc);
                        // Pre-seleccionar el producto del documento de coordinación si existe
                        if (selectedDoc.id_producto) {
                            setSelectedProducto(selectedDoc.id_producto);
                        }
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

    // Manejar cambio en campos numéricos de cantidades
    const handleCantidadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCantidades(prev => ({
            ...prev,
            [name]: value === '' ? 0 : parseFloat(value)
        }));
    };

    // Manejar selección de documento
    const handleDocumentoSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const docId = parseInt(e.target.value);
        const selected = documentos.find(doc => doc.id === docId) || null;
        setSelectedDocumento(selected);

        // Pre-seleccionar el producto del documento de coordinación si existe
        if (selected && selected.id_producto) {
            setSelectedProducto(selected.id_producto);
        } else {
            setSelectedProducto(undefined);
        }

        // Reset de fincas seleccionadas al cambiar de documento
        setSelectedFincas([]);
    };

    // Manejar selección de producto
    const handleProductoSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        setSelectedProducto(value ? parseInt(value) : undefined);
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
                id_guia_madre: selectedDocumento.id_guia_madre,
                id_producto: selectedProducto,
                fulls: cantidades.fulls || undefined,
                pcs: cantidades.pcs || undefined,
                kgs: cantidades.kgs || undefined,
                stems: cantidades.stems || undefined
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
            setSelectedProducto(undefined);
            setCantidades({ fulls: 0, pcs: 0, kgs: 0, stems: 0 });
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
        setSelectedProducto(undefined);
        setCantidades({ fulls: 0, pcs: 0, kgs: 0, stems: 0 });
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
                                    {/* Selección de producto y cantidades */}
                                    <div className="card bg-base-200 p-4 mb-4">
                                        <h3 className="font-bold mb-4">Información del Producto</h3>

                                        <div className="form-control mb-4">
                                            <label className="label">
                                                <span className="label-text font-medium">Producto</span>
                                            </label>
                                            <select
                                                className="select select-bordered w-full"
                                                value={selectedProducto || ''}
                                                onChange={handleProductoSelect}
                                            >
                                                <option value="">Seleccionar producto...</option>
                                                {productos.map(producto => (
                                                    <option key={producto.id_producto} value={producto.id_producto}>
                                                        {producto.nombre}
                                                    </option>
                                                ))}
                                            </select>
                                            <label className="label">
                                                <span className="label-text-alt text-info">
                                                    Si no selecciona un producto, se usará el del documento de coordinación.
                                                </span>
                                            </label>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                            <div className="form-control">
                                                <label className="label">
                                                    <span className="label-text">Fulls</span>
                                                </label>
                                                <input
                                                    type="number"
                                                    name="fulls"
                                                    className="input input-bordered"
                                                    value={cantidades.fulls === 0 ? '' : cantidades.fulls}
                                                    onChange={handleCantidadChange}
                                                    min="0"
                                                    step="1"
                                                />
                                            </div>

                                            <div className="form-control">
                                                <label className="label">
                                                    <span className="label-text">Piezas (Pcs)</span>
                                                </label>
                                                <input
                                                    type="number"
                                                    name="pcs"
                                                    className="input input-bordered"
                                                    value={cantidades.pcs === 0 ? '' : cantidades.pcs}
                                                    onChange={handleCantidadChange}
                                                    min="0"
                                                    step="1"
                                                />
                                            </div>

                                            <div className="form-control">
                                                <label className="label">
                                                    <span className="label-text">Peso (Kgs)</span>
                                                </label>
                                                <input
                                                    type="number"
                                                    name="kgs"
                                                    className="input input-bordered"
                                                    value={cantidades.kgs === 0 ? '' : cantidades.kgs}
                                                    onChange={handleCantidadChange}
                                                    min="0"
                                                    step="0.1"
                                                />
                                            </div>

                                            <div className="form-control">
                                                <label className="label">
                                                    <span className="label-text">Stems</span>
                                                </label>
                                                <input
                                                    type="number"
                                                    name="stems"
                                                    className="input input-bordered"
                                                    value={cantidades.stems === 0 ? '' : cantidades.stems}
                                                    onChange={handleCantidadChange}
                                                    min="0"
                                                    step="1"
                                                />
                                            </div>
                                        </div>
                                    </div>

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
                            <br />
                            <span className="font-semibold">Producto:</span> {
                                selectedProducto
                                    ? productos.find(p => p.id_producto === selectedProducto)?.nombre
                                    : 'Se usará el del documento de coordinación'
                            }
                        </div>
                    </div>

                    {/* Detalles de cantidades */}
                    {(cantidades.fulls > 0 || cantidades.pcs > 0 || cantidades.kgs > 0 || cantidades.stems > 0) && (
                        <div className="alert alert-info mb-4">
                            <AppIcons.Package className="w-6 h-6" />
                            <div>
                                <span className="font-semibold">Cantidades:</span>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-1">
                                    {cantidades.fulls > 0 && <div>Fulls: {cantidades.fulls}</div>}
                                    {cantidades.pcs > 0 && <div>Pcs: {cantidades.pcs}</div>}
                                    {cantidades.kgs > 0 && <div>Kgs: {cantidades.kgs}</div>}
                                    {cantidades.stems > 0 && <div>Stems: {cantidades.stems}</div>}
                                </div>
                            </div>
                        </div>
                    )}

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
                                            <th>Producto</th>
                                            <th>Cantidades</th>
                                            <th>Estado</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {previewResults.asignacionesExistentes.map((asignacion: any, index: number) => (
                                            <tr key={index}>
                                                <td>{fincas.find(f => f.id_finca === asignacion.id_finca)?.nombre || 'Desconocida'}</td>
                                                <td>{asignacion.numero_guia_hija || `${asignacion.anio}-${asignacion.secuencial}`}</td>
                                                <td>
                                                    {productos.find(p => p.id_producto === asignacion.id_producto)?.nombre || 'No especificado'}
                                                </td>
                                                <td className="text-xs">
                                                    {asignacion.fulls > 0 && <div>Fulls: {asignacion.fulls}</div>}
                                                    {asignacion.pcs > 0 && <div>Pcs: {asignacion.pcs}</div>}
                                                    {asignacion.kgs > 0 && <div>Kgs: {asignacion.kgs}</div>}
                                                    {asignacion.stems > 0 && <div>Stems: {asignacion.stems}</div>}
                                                </td>
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
                                            <th>Producto</th>
                                            <th>Cantidades</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {previewResults.nuevasAsignaciones.map((asignacion: any, index: number) => (
                                            <tr key={index}>
                                                <td>{fincas.find(f => f.id_finca === asignacion.id_finca)?.nombre || 'Desconocida'}</td>
                                                <td>{`${asignacion.anio}-${asignacion.secuencial}`}</td>
                                                <td>
                                                    {productos.find(p => p.id_producto === asignacion.id_producto)?.nombre || 'No especificado'}
                                                </td>
                                                <td className="text-xs">
                                                    {asignacion.fulls > 0 && <div>Fulls: {asignacion.fulls}</div>}
                                                    {asignacion.pcs > 0 && <div>Pcs: {asignacion.pcs}</div>}
                                                    {asignacion.kgs > 0 && <div>Kgs: {asignacion.kgs}</div>}
                                                    {asignacion.stems > 0 && <div>Stems: {asignacion.stems}</div>}
                                                </td>
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
                            disabled={loading || (!previewResults.nuevasAsignaciones?.length && !previewResults.asignacionesExistentes?.length)}
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