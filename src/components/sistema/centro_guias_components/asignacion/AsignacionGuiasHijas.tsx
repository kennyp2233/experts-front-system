// src/components/sistema/centro_guias_components/RefactoredAsignacionGuiasHijas.tsx
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, FormProvider, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/sistema/common/ui/card';
import { AppIcons } from '@/utils/icons';
import { coordinacionesService } from '@/api/services/documentos/coordinacionesService';
import { fincasService } from '@/api/services/mantenimiento/fincasService';
import { productosService } from '@/api/services/mantenimiento/productosService';
import { guiasHijasService } from '@/api/services/documentos/guiasHijasService';
import { dispatchMenssage } from '@/utils/menssageDispatcher';
import DocumentoCoordinacionDetailView from '../gestion_de_documentos/detail/DocumentoCoordinacionDetailView';
import { FincasSelector } from '../common/selectors/FincasSelector';
import { AsignacionesTable } from './tables/AsignacionesTable';

// Schema para la validación
const schema = yup.object({
    documentoId: yup.number().required('Debe seleccionar un documento de coordinación'),
    productoId: yup.mixed().nullable().transform(value => value === '' ? null : Number(value)),
    asignaciones: yup.array().of(
        yup.object({
            fincaId: yup.number().required('Finca requerida'),
            productoId: yup.mixed().nullable().transform(value => value === '' ? null : Number(value)),
            fulls: yup.number().nullable().transform(value => isNaN(value) || value === '' ? null : Number(value)),
            pcs: yup.number().nullable().transform(value => isNaN(value) || value === '' ? null : Number(value)),
            kgs: yup.number().nullable().transform(value => isNaN(value) || value === '' ? null : Number(value)),
            stems: yup.number().nullable().transform(value => isNaN(value) || value === '' ? null : Number(value)),
            selected: yup.boolean().default(true)
        })
    )
}).required();

type StepType = 'selection' | 'configuration' | 'preview' | 'success';

interface RefactoredAsignacionGuiasHijasProps {
    documentoId?: string | null;
    onComplete?: () => void;
}

export const AsignacionGuiasHijas: React.FC<RefactoredAsignacionGuiasHijasProps> = ({
    documentoId,
    onComplete
}) => {
    const router = useRouter();

    // Estados principales
    const [step, setStep] = useState<StepType>('selection');
    const [error, setError] = useState<string | null>(null);
    const [documento, setDocumento] = useState<any | null>(null);
    const [fincas, setFincas] = useState<any[]>([]);
    const [productos, setProductos] = useState<any[]>([]);
    const [previewResults, setPreviewResults] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // Estados para la selección de fincas
    const [fincaSearchTerm, setFincaSearchTerm] = useState("");
    const [filteredFincas, setFilteredFincas] = useState<any[]>([]);

    // Configuración de React Hook Form
    const methods = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            documentoId: documentoId ? Number(documentoId) : 0,
            productoId: '',
            asignaciones: []
        }
    });

    // Acceder a funciones y estados del formulario
    const { control, handleSubmit, watch, setValue, reset, getValues, formState: { errors } } = methods;
    const watchDocumentoId = watch("documentoId");
    const watchProductoId = watch("productoId");

    // Configurar field array para asignaciones dinámicas
    const { fields, append, remove } = useFieldArray({
        control,
        name: "asignaciones"
    });

    // Cargar datos iniciales
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Cargar fincas y productos
                const [fincasData, productosData] = await Promise.all([
                    fincasService.getFincas(),
                    productosService.getProductos()
                ]);

                setFincas(fincasData);
                setFilteredFincas(fincasData);
                setProductos(productosData);

                // Si hay un documento preseleccionado, cargarlo
                if (documentoId) {
                    setValue("documentoId", Number(documentoId));
                    await fetchDocumentoDetails(Number(documentoId));
                }
            } catch (error) {
                console.error("Error al cargar datos:", error);
                dispatchMenssage("error", "Error al cargar datos iniciales");
                setError("Error al cargar datos iniciales. Por favor, intente más tarde.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [documentoId, setValue]);

    // Filtrar fincas según término de búsqueda
    useEffect(() => {
        if (fincaSearchTerm.trim() === "") {
            setFilteredFincas(fincas);
        } else {
            const searchTermLower = fincaSearchTerm.toLowerCase();
            const filtered = fincas.filter(
                (finca) =>
                    finca.nombre?.toLowerCase().includes(searchTermLower) ||
                    finca.codigo?.toLowerCase().includes(searchTermLower)
            );
            setFilteredFincas(filtered);
        }
    }, [fincaSearchTerm, fincas]);

    // Cargar detalles del documento seleccionado
    const fetchDocumentoDetails = async (docId: number) => {
        setLoading(true);
        try {
            const doc = await coordinacionesService.getDocuments(1, 10, { id: docId });

            if (doc.data && doc.data.length > 0) {
                const documento = doc.data[0];
                setDocumento(documento);

                // Preseleccionar el producto del documento
                if (documento.id_producto) {
                    setValue("productoId", documento.id_producto);
                }

                setStep('selection');
                return documento;
            } else {
                setError("No se encontró el documento seleccionado");
                setDocumento(null);
                return null;
            }
        } catch (error) {
            console.error("Error al cargar detalles del documento:", error);
            dispatchMenssage("error", "Error al cargar detalles del documento");
            setError("Error al cargar detalles del documento. Por favor, intente más tarde.");
            setDocumento(null);
            return null;
        } finally {
            setLoading(false);
        }
    };

    // Función para seleccionar o deseleccionar una finca individual
    const handleToggleFinca = (fincaId: number) => {
        const existingIndex = fields.findIndex((field: { fincaId: number; }) => field.fincaId === fincaId);

        if (existingIndex >= 0) {
            // La finca ya está seleccionada, eliminarla
            remove(existingIndex);
        } else {
            // Agregar la finca
            const finca = fincas.find(f => f.id_finca === fincaId);
            if (finca) {
                append({
                    fincaId: finca.id_finca,
                    productoId: watchProductoId || null,
                    fulls: null,
                    pcs: null,
                    kgs: null,
                    stems: null,
                    selected: true
                });
            }
        }
    };

    // Manejar selección/deselección de todas las fincas
    const handleToggleAllFincas = () => {
        if (filteredFincas.length > 0) {
            const filteredIds = filteredFincas.map(finca => finca.id_finca);
            const allSelected = filteredIds.every(id =>
                fields.some((field: { fincaId: any; }) => field.fincaId === id)
            );

            if (allSelected) {
                // Deseleccionar todas las fincas filtradas
                const newAsignaciones = fields.filter((field: { fincaId: any; }) =>
                    !filteredIds.includes(field.fincaId)
                );
                setValue("asignaciones", newAsignaciones);
            } else {
                // Seleccionar todas las fincas filtradas que aún no están seleccionadas
                const existingFincaIds = fields.map((field: { fincaId: any; }) => field.fincaId);
                const fincasToAdd = filteredFincas
                    .filter(finca => !existingFincaIds.includes(finca.id_finca))
                    .map(finca => ({
                        fincaId: finca.id_finca,
                        productoId: watchProductoId || null,
                        fulls: null,
                        pcs: null,
                        kgs: null,
                        stems: null,
                        selected: true
                    }));

                setValue("asignaciones", [...fields, ...fincasToAdd]);
            }
        }
    };

    // Aplicar producto a todas las fincas seleccionadas
    const handleApplyProductToAll = () => {
        if (!watchProductoId) return;

        const updatedAsignaciones = fields.map((field: any) => ({
            ...field,
            productoId: watchProductoId
        }));

        setValue("asignaciones", updatedAsignaciones);
    };

    // Aplicar cantidades a todas las fincas
    const handleApplyCantidadesToAll = (values: { fulls?: number, pcs?: number, kgs?: number, stems?: number }) => {
        const updatedAsignaciones = fields.map((field: any) => ({
            ...field,
            ...Object.fromEntries(
                Object.entries(values).filter(([_, value]) => value !== undefined && value !== null)
            )
        }));

        setValue("asignaciones", updatedAsignaciones);
    };

    // Validar y previsualizar asignaciones
    const handlePreview = async () => {
        if (fields.length === 0) {
            setError("Debe seleccionar al menos una finca");
            return;
        }

        setSubmitting(true);
        setError(null);

        try {
            // Preparar datos para API
            const asignaciones = fields.map((asignacion) => ({
                id_documento_coordinacion: Number(watchDocumentoId),
                id_finca: asignacion.fincaId,
                id_producto: asignacion.productoId || watchProductoId || documento?.id_producto,
                fulls: asignacion.fulls,
                pcs: asignacion.pcs,
                kgs: asignacion.kgs,
                stems: asignacion.stems
            }));

            // Llamar a la API de pre-validación
            const resultados = await guiasHijasService.prevalidarAsignaciones(asignaciones as any);
            setPreviewResults(resultados);
            setStep('preview');
        } catch (error) {
            console.error('Error al pre-validar asignaciones:', error);
            setError('Error al validar las asignaciones. Por favor, verifique los datos e intente nuevamente.');
            dispatchMenssage('error', 'Error al pre-validar asignaciones');
        } finally {
            setSubmitting(false);
        }
    };

    // Confirmar asignaciones
    const handleConfirm = async () => {
        if (!previewResults) return;

        setSubmitting(true);

        try {
            // Confirmar todas las asignaciones
            await guiasHijasService.confirmarAsignaciones([
                ...(previewResults.asignacionesExistentes || []),
                ...(previewResults.nuevasAsignaciones || [])
            ]);

            const nuevas = previewResults.nuevasAsignaciones?.length || 0;
            const existentes = previewResults.asignacionesExistentes?.length || 0;

            dispatchMenssage(
                'success',
                `Asignación completada: ${nuevas} nuevas guías, ${existentes} actualizadas`
            );

            setStep('success');
        } catch (error) {
            console.error('Error al confirmar asignaciones:', error);
            setError('Error al confirmar las asignaciones. Por favor, intente nuevamente.');
            dispatchMenssage('error', 'Error al confirmar asignaciones');
        } finally {
            setSubmitting(false);
        }
    };

    // Reiniciar el proceso
    const handleReset = () => {
        reset({
            documentoId: documentoId ? Number(documentoId) : 0,
            productoId: '',
            asignaciones: []
        });
        setDocumento(null);
        setPreviewResults(null);
        setStep('selection');
        setError(null);
    };

    // Renderizar el paso correspondiente
    const renderStep = () => {
        switch (step) {
            case 'selection':
                return renderSelectionStep();
            case 'configuration':
                return renderConfigurationStep();
            case 'preview':
                return renderPreviewStep();
            case 'success':
                return renderSuccessStep();
            default:
                return renderSelectionStep();
        }
    };

    // Renderizar paso de selección de documento y fincas
    const renderSelectionStep = () => (
        <Card className="bg-base-100 shadow-lg">
            <CardHeader>
                <CardTitle>Selección de Documento y Fincas</CardTitle>
            </CardHeader>
            <CardContent>
                {error && (
                    <div className="alert alert-error mb-4">
                        <AppIcons.Error className="w-6 h-6" />
                        <span>{error}</span>
                    </div>
                )}

                <div className="space-y-6">
                    {/* Información del documento */}
                    {documento ? (
                        <div className="card bg-base-200 p-4">
                            <h3 className="font-bold mb-2">Documento de Coordinación Seleccionado</h3>
                            <DocumentoCoordinacionDetailView documento={documento} />
                        </div>
                    ) : (
                        <div className="alert alert-warning">
                            <AppIcons.Warning className="w-6 h-6" />
                            <span>Seleccione un documento de coordinación para continuar</span>
                        </div>
                    )}

                    {/* Selector de fincas */}
                    {documento && (
                        <div>
                            <h3 className="font-bold mb-2">Selección de Fincas</h3>
                            <FincasSelector
                                fincas={filteredFincas}
                                selectedFincas={fields.map((f: { fincaId: any; }) => f.fincaId)}
                                searchTerm={fincaSearchTerm}
                                onSearchChange={setFincaSearchTerm}
                                onToggleFinca={handleToggleFinca}
                                onToggleAll={handleToggleAllFincas}
                                loading={loading}
                            />
                        </div>
                    )}
                </div>
            </CardContent>
            <CardFooter className="justify-end">
                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                        if (!documento) {
                            setError("Debe seleccionar un documento de coordinación");
                            return;
                        }
                        if (fields.length === 0) {
                            setError("Debe seleccionar al menos una finca");
                            return;
                        }
                        setError(null);
                        setStep('configuration');
                    }}
                    disabled={loading || !documento || fields.length === 0}
                >
                    Continuar <AppIcons.ChevronRight className="w-4 h-4 ml-1" />
                </button>
            </CardFooter>
        </Card>
    );

    // Renderizar paso de configuración
    const renderConfigurationStep = () => (
        <Card className="bg-base-100 shadow-lg">
            <CardHeader>
                <CardTitle>Configuración de Asignaciones</CardTitle>
            </CardHeader>
            <CardContent>
                {error && (
                    <div className="alert alert-error mb-4">
                        <AppIcons.Error className="w-6 h-6" />
                        <span>{error}</span>
                    </div>
                )}

                <div className="mb-6">
                    <h3 className="font-bold mb-2">Configuración Global</h3>
                    <div className="flex flex-col md:flex-row gap-4 mb-4">
                        <div className="form-control flex-1">
                            <label className="label">
                                <span className="label-text">Producto por Defecto</span>
                            </label>
                            <div className="flex gap-2">
                                <select
                                    {...methods.register("productoId")}
                                    className="select select-bordered flex-1"
                                >
                                    <option value="">Usar producto del documento</option>
                                    {productos.map((producto) => (
                                        <option key={producto.id_producto} value={producto.id_producto}>
                                            {producto.nombre}
                                        </option>
                                    ))}
                                </select>
                                <button
                                    type="button"
                                    className="btn btn-outline btn-sm"
                                    onClick={handleApplyProductToAll}
                                    disabled={!watchProductoId}
                                >
                                    Aplicar a todos
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Fulls</span>
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="number"
                                    className="input input-bordered w-full"
                                    placeholder="0"
                                    min="0"
                                    id="globalFulls"
                                />
                                <button
                                    type="button"
                                    className="btn btn-outline btn-sm"
                                    onClick={() => {
                                        const value = (document.getElementById('globalFulls') as HTMLInputElement).value;
                                        handleApplyCantidadesToAll({ fulls: value ? Number(value) : undefined });
                                    }}
                                >
                                    Aplicar
                                </button>
                            </div>
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Piezas (PCS)</span>
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="number"
                                    className="input input-bordered w-full"
                                    placeholder="0"
                                    min="0"
                                    id="globalPcs"
                                />
                                <button
                                    type="button"
                                    className="btn btn-outline btn-sm"
                                    onClick={() => {
                                        const value = (document.getElementById('globalPcs') as HTMLInputElement).value;
                                        handleApplyCantidadesToAll({ pcs: value ? Number(value) : undefined });
                                    }}
                                >
                                    Aplicar
                                </button>
                            </div>
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Peso (KGS)</span>
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="number"
                                    className="input input-bordered w-full"
                                    placeholder="0"
                                    min="0"
                                    step="0.1"
                                    id="globalKgs"
                                />
                                <button
                                    type="button"
                                    className="btn btn-outline btn-sm"
                                    onClick={() => {
                                        const value = (document.getElementById('globalKgs') as HTMLInputElement).value;
                                        handleApplyCantidadesToAll({ kgs: value ? Number(value) : undefined });
                                    }}
                                >
                                    Aplicar
                                </button>
                            </div>
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Stems</span>
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="number"
                                    className="input input-bordered w-full"
                                    placeholder="0"
                                    min="0"
                                    id="globalStems"
                                />
                                <button
                                    type="button"
                                    className="btn btn-outline btn-sm"
                                    onClick={() => {
                                        const value = (document.getElementById('globalStems') as HTMLInputElement).value;
                                        handleApplyCantidadesToAll({ stems: value ? Number(value) : undefined });
                                    }}
                                >
                                    Aplicar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabla de asignaciones configuradas */}
                {fields.length > 0 && (
                    <div className="mt-6">
                        <h3 className="font-bold mb-2">Asignaciones Configuradas</h3>

                        <div className="overflow-x-auto">
                            <table className="table w-full">
                                <thead>
                                    <tr>
                                        <th>Finca</th>
                                        <th>Producto</th>
                                        <th>Fulls</th>
                                        <th>PCS</th>
                                        <th>KGS</th>
                                        <th>Stems</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {fields.map((field: { fincaId: any; id: any; }, index: any) => {
                                        const finca = fincas.find(f => f.id_finca === field.fincaId);

                                        return (
                                            <tr key={field.id || index}>
                                                <td>{finca?.nombre || `Finca ${field.fincaId}`}</td>
                                                <td>
                                                    <select
                                                        {...methods.register(`asignaciones.${index}.productoId`)}
                                                        className="select select-bordered select-sm w-full"
                                                    >
                                                        <option value="">Por defecto</option>
                                                        {productos.map((producto) => (
                                                            <option
                                                                key={producto.id_producto}
                                                                value={producto.id_producto}
                                                            >
                                                                {producto.nombre}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </td>
                                                <td>
                                                    <input
                                                        type="number"
                                                        className="input input-bordered input-sm w-20"
                                                        min="0"
                                                        placeholder="0"
                                                        {...methods.register(`asignaciones.${index}.fulls`)}
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        type="number"
                                                        className="input input-bordered input-sm w-20"
                                                        min="0"
                                                        placeholder="0"
                                                        {...methods.register(`asignaciones.${index}.pcs`)}
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        type="number"
                                                        className="input input-bordered input-sm w-20"
                                                        min="0"
                                                        step="0.1"
                                                        placeholder="0"
                                                        {...methods.register(`asignaciones.${index}.kgs`)}
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        type="number"
                                                        className="input input-bordered input-sm w-20"
                                                        min="0"
                                                        placeholder="0"
                                                        {...methods.register(`asignaciones.${index}.stems`)}
                                                    />
                                                </td>
                                                <td>
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-error btn-outline"
                                                        onClick={() => remove(index)}
                                                    >
                                                        <AppIcons.Delete className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </CardContent>
            <CardFooter className="justify-between">
                <button
                    type="button"
                    className="btn btn-outline"
                    onClick={() => setStep('selection')}
                    disabled={submitting}
                >
                    <AppIcons.ChevronLeft className="w-4 h-4 mr-1" />
                    Volver
                </button>
                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handlePreview}
                    disabled={submitting || fields.length === 0}
                >
                    {submitting ? (
                        <>
                            <span className="loading loading-spinner loading-sm"></span>
                            Procesando...
                        </>
                    ) : (
                        <>
                            <AppIcons.Search className="w-4 h-4 mr-1" />
                            Previsualizar
                        </>
                    )}
                </button>
            </CardFooter>
        </Card>
    );

    // Renderizar paso de previsualización
    const renderPreviewStep = () => (
        <Card className="bg-base-100 shadow-lg">
            <CardHeader>
                <CardTitle>Previsualización de Asignaciones</CardTitle>
            </CardHeader>
            <CardContent>
                {error && (
                    <div className="alert alert-error mb-4">
                        <AppIcons.Error className="w-6 h-6" />
                        <span>{error}</span>
                    </div>
                )}

                <div className="alert alert-info mb-4">
                    <AppIcons.Info className="w-6 h-6" />
                    <div>
                        <span className="font-bold">Documento de Coordinación:</span> {documento ? `COO-${documento.id.toString().padStart(7, '0')}` : ''}
                        <br />
                        <span className="font-bold">Fincas seleccionadas:</span> {previewResults?.asignacionesExistentes?.length + previewResults?.nuevasAsignaciones?.length || 0}
                        <br />
                        <span className="font-bold">Próximo secuencial:</span> {previewResults?.proximo || 'No disponible'}
                    </div>
                </div>

                {/* Asignaciones nuevas */}
                <div className="mb-6">
                    <h3 className="font-bold text-success flex items-center mb-2">
                        <AppIcons.Check className="w-5 h-5 mr-2" />
                        Nuevas asignaciones ({previewResults?.nuevasAsignaciones?.length || 0})
                    </h3>

                    <AsignacionesTable
                        nuevasAsignaciones={previewResults?.nuevasAsignaciones || []}
                        fincas={fincas}
                        productos={productos}
                        tipo="nuevas"
                    />
                </div>

                {/* Asignaciones existentes */}
                <div className="mb-6">
                    <h3 className="font-bold text-warning flex items-center mb-2">
                        <AppIcons.Info className="w-5 h-5 mr-2" />
                        Asignaciones existentes ({previewResults?.asignacionesExistentes?.length || 0})
                    </h3>

                    <AsignacionesTable
                        asignacionesExistentes={previewResults?.asignacionesExistentes || []}
                        fincas={fincas}
                        productos={productos}
                        tipo="existentes"
                    />
                </div>

                {previewResults?.nuevasAsignaciones?.length === 0 && previewResults?.asignacionesExistentes?.length === 0 && (
                    <div className="alert alert-warning">
                        <AppIcons.Warning className="w-6 h-6" />
                        <span>No hay asignaciones para procesar. Verifique la configuración.</span>
                    </div>
                )}
            </CardContent>
            <CardFooter className="justify-between">
                <button
                    type="button"
                    className="btn btn-outline"
                    onClick={() => setStep('configuration')}
                    disabled={submitting}
                >
                    <AppIcons.ChevronLeft className="w-4 h-4 mr-1" />
                    Volver
                </button>
                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleConfirm}
                    disabled={submitting ||
                        (!previewResults?.nuevasAsignaciones?.length && !previewResults?.asignacionesExistentes?.length)}
                >
                    {submitting ? (
                        <>
                            <span className="loading loading-spinner loading-sm"></span>
                            Procesando...
                        </>
                    ) : (
                        <>
                            <AppIcons.Check className="w-4 h-4 mr-1" />
                            Confirmar Asignaciones
                        </>
                    )}
                </button>
            </CardFooter>
        </Card>
    );

    // Renderizar paso de éxito
    const renderSuccessStep = () => (
        <Card className="bg-base-100 shadow-lg">
            <CardContent className="flex flex-col items-center py-8">
                <div className="text-success mb-4">
                    <AppIcons.CheckCircle className="w-16 h-16" />
                </div>
                <h2 className="text-2xl font-bold mb-2">¡Asignación Completada!</h2>
                <p className="text-center mb-6">
                    Las guías hijas han sido asignadas correctamente a las fincas seleccionadas.
                </p>
                <div className="flex flex-col sm:flex-row gap-2">
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={handleReset}
                    >
                        Nueva Asignación
                    </button>
                    <button
                        type="button"
                        className="btn btn-outline"
                        onClick={onComplete || (() => router.push('/sistema/dashboard/modulos/documentos/centro_guias?tab=gestor-documentos'))}
                    >
                        Volver al Gestor
                    </button>
                </div>
            </CardContent>
        </Card>
    );

    return (
        <FormProvider {...methods}>
            {renderStep()}
        </FormProvider>
    );
};