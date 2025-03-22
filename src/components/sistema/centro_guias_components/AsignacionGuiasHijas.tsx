// src/app/sistema/dashboard/modulos/documentos/centro_guias/components/AsignacionGuiasHijas.tsx
import React, { useState, useEffect } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { coordinacionesService } from '@/api/services/documentos/coordinacionesService';
import { fincasService } from '@/api/services/mantenimiento/fincasService';
import { productosService } from '@/api/services/mantenimiento/productosService';
import { guiasHijasService } from '@/api/services/documentos/guiasHijasService';
import { dispatchMenssage } from '@/utils/menssageDispatcher';
import { AppIcons } from '@/utils/icons';

// Componentes UI
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/ui/card';
import DocumentoCoordinacionDetailView from './DocumentoCoordinacionDetailView';

// Schema de validación
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

interface AsignacionGuiasHijasProps {
    documentoId?: string | null;
    onComplete?: () => void;
}

export default function AsignacionGuiasHijas({ documentoId, onComplete }: AsignacionGuiasHijasProps) {
    // Estados
    const [documento, setDocumento] = useState<any | null>(null);
    const [fincas, setFincas] = useState<any[]>([]);
    const [productos, setProductos] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [step, setStep] = useState<'selection' | 'detail' | 'success'>('selection');
    const [fincaSearchTerm, setFincaSearchTerm] = useState("");
    const [filteredFincas, setFilteredFincas] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [previewResults, setPreviewResults] = useState<any | null>(null);

    // Configurar React Hook Form
    const { control, handleSubmit, watch, setValue, register, formState: { errors }, reset } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            documentoId: documentoId ? Number(documentoId) : 0,
            productoId: '',
            asignaciones: []
        }
    });

    // Ver valores actuales
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
                // Cargar productos
                const productosData = await productosService.getProductos();
                setProductos(productosData);

                // Cargar fincas
                const fincasData = await fincasService.getFincas();
                setFincas(fincasData);
                setFilteredFincas(fincasData);

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

    // Cuando cambia el término de búsqueda de fincas
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

    // Cargar detalles del documento cuando cambia el documento seleccionado
    useEffect(() => {
        if (watchDocumentoId && !documento) {
            fetchDocumentoDetails(Number(watchDocumentoId));
        }
    }, [watchDocumentoId, documento]);

    // Función para cargar detalles del documento
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

                setStep('detail');
            } else {
                setError("No se encontró el documento seleccionado");
                setDocumento(null);
            }
        } catch (error) {
            console.error("Error al cargar detalles del documento:", error);
            dispatchMenssage("error", "Error al cargar detalles del documento");
            setError("Error al cargar detalles del documento. Por favor, intente más tarde.");
            setDocumento(null);
        } finally {
            setLoading(false);
        }
    };

    // Función para seleccionar o deseleccionar una finca individual
    const handleToggleFinca = (fincaId: number) => {
        const existingIndex = fields.findIndex(field => field.fincaId === fincaId);

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
        // Si hay fincas filtradas y son diferentes de las seleccionadas
        if (filteredFincas.length > 0) {
            // Obtener IDs de fincas filtradas
            const filteredIds = filteredFincas.map(finca => finca.id_finca);

            // Verificar si todas las fincas filtradas ya están seleccionadas
            const allSelected = filteredIds.every(id =>
                fields.some(field => field.fincaId === id)
            );

            if (allSelected) {
                // Deseleccionar todas las fincas filtradas
                const newAsignaciones = fields.filter(field =>
                    !filteredIds.includes(field.fincaId)
                );
                setValue("asignaciones", newAsignaciones);
            } else {
                // Seleccionar todas las fincas filtradas que aún no están seleccionadas
                const existingFincaIds = fields.map(field => field.fincaId);
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

        const updatedAsignaciones = fields.map(field => ({
            ...field,
            productoId: watchProductoId
        }));

        setValue("asignaciones", updatedAsignaciones);
    };

    // Aplicar cantidades a todas las fincas
    const handleApplyCantidadesToAll = (values: { fulls?: number, pcs?: number, kgs?: number, stems?: number }) => {
        const updatedAsignaciones = fields.map(field => ({
            ...field,
            ...Object.fromEntries(
                Object.entries(values).filter(([_, value]) => value !== undefined && value !== null)
            )
        }));

        setValue("asignaciones", updatedAsignaciones);
    };

    // Enviar formulario para asignar guías
    const onSubmit = async (data: any) => {
        if (data.asignaciones.length === 0) {
            setError("Debe seleccionar al menos una finca");
            return;
        }

        setSubmitting(true);
        setError(null);

        try {
            // Preparar datos para API
            const asignaciones = data.asignaciones.map((asignacion: any) => ({
                id_documento_coordinacion: data.documentoId,
                id_finca: asignacion.fincaId,
                id_producto: asignacion.productoId || data.productoId || documento.id_producto,
                fulls: asignacion.fulls,
                pcs: asignacion.pcs,
                kgs: asignacion.kgs,
                stems: asignacion.stems
            }));

            // Llamar a la API de pre-validación
            const resultados = await guiasHijasService.prevalidarAsignaciones(asignaciones);

            // Confirmar todas las asignaciones
            const resultado = await guiasHijasService.confirmarAsignaciones([
                ...(resultados.asignacionesExistentes || []),
                ...(resultados.nuevasAsignaciones || [])
            ]);

            const nuevas = resultados.nuevasAsignaciones?.length || 0;
            const existentes = resultados.asignacionesExistentes?.length || 0;

            dispatchMenssage(
                'success',
                `Asignación completada: ${nuevas} nuevas guías, ${existentes} actualizadas`
            );

            setStep('success');
        } catch (error) {
            console.error('Error al asignar guías:', error);
            setError('Error al asignar guías. Por favor, intente nuevamente.');
            dispatchMenssage('error', 'Error al asignar guías');
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
        setStep('selection');
        setError(null);
    };

    // Renderizar paso de selección de documento
    const renderSelectionStep = () => (
        <Card className="bg-base-100 shadow-lg">
            <CardHeader>
                <CardTitle>Selección de Documento</CardTitle>
            </CardHeader>
            <CardContent>
                {error && (
                    <div className="alert alert-error mb-4">
                        <AppIcons.Error className="w-6 h-6" />
                        <span>{error}</span>
                    </div>
                )}

                <div className="form-control">
                    <label className="label">
                        <span className="label-text font-medium">Documento de Coordinación</span>
                    </label>
                    <Controller
                        name="documentoId"
                        control={control}
                        render={({ field }) => (
                            <select
                                {...field}
                                className="select select-bordered w-full"
                                disabled={loading}
                                onChange={(e) => {
                                    field.onChange(e.target.value ? Number(e.target.value) : '');
                                }}
                            >
                                <option value="">Seleccionar documento...</option>
                                {documento ? (
                                    <option key={documento.id} value={documento.id}>
                                        {`COO-${documento.id.toString().padStart(7, '0')}`}
                                    </option>
                                ) : null}
                            </select>
                        )}
                    />
                    <div className="mt-4">
                        <button
                            type="button"
                            className="btn btn-primary w-full"
                            onClick={() => {
                                if (!watchDocumentoId) {
                                    setError("Debe seleccionar un documento");
                                    return;
                                }
                                fetchDocumentoDetails(Number(watchDocumentoId));
                            }}
                            disabled={loading || !watchDocumentoId}
                        >
                            {loading ? (
                                <span className="loading loading-spinner loading-sm"></span>
                            ) : (
                                <AppIcons.Search className="w-4 h-4 mr-1" />
                            )}
                            Continuar
                        </button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );

    // Renderizar paso de detalle y configuración
    const renderDetailStep = () => (
        <div className="space-y-6">
            <Card className="bg-base-100 shadow-lg">
                <CardHeader>
                    <CardTitle>Asignación de Guías Hijas</CardTitle>
                </CardHeader>
                <CardContent>
                    {error && (
                        <div className="alert alert-error mb-4">
                            <AppIcons.Error className="w-6 h-6" />
                            <span>{error}</span>
                        </div>
                    )}

                    <h3 className="text-lg font-bold mb-4">Detalles del Documento</h3>
                    {documento && <DocumentoCoordinacionDetailView documento={documento} />}

                    <div className="divider mt-8">Configuración de Asignaciones</div>

                    <div className="mb-6">
                        <h3 className="font-bold mb-2">Configuración Global</h3>
                        <div className="flex flex-col md:flex-row gap-4 mb-4">
                            <div className="form-control flex-1">
                                <label className="label">
                                    <span className="label-text">Producto</span>
                                </label>
                                <div className="flex gap-2">
                                    <Controller
                                        name="productoId"
                                        control={control}
                                        render={({ field }) => (
                                            <select
                                                {...field}
                                                className="select select-bordered flex-1"
                                                onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : '')}
                                            >
                                                <option value="">Usar producto del documento</option>
                                                {productos.map((producto) => (
                                                    <option key={producto.id_producto} value={producto.id_producto}>
                                                        {producto.nombre}
                                                    </option>
                                                ))}
                                            </select>
                                        )}
                                    />
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

                    <div className="mt-8">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="font-bold">Selección de Fincas</h3>
                            <div className="flex items-center">
                                <span className="mr-2 text-sm opacity-70">
                                    {fields.length} seleccionadas
                                </span>
                                <button
                                    type="button"
                                    className="btn btn-sm btn-outline"
                                    onClick={handleToggleAllFincas}
                                    disabled={loading || filteredFincas.length === 0}
                                >
                                    {filteredFincas.length > 0 &&
                                        filteredFincas.every(finca =>
                                            fields.some(field => field.fincaId === finca.id_finca)
                                        )
                                        ? 'Deseleccionar todas'
                                        : 'Seleccionar todas'}
                                </button>
                            </div>
                        </div>

                        <div className="input-group mb-4">
                            <input
                                type="text"
                                placeholder="Buscar finca por nombre o código..."
                                className="input input-bordered w-full"
                                value={fincaSearchTerm}
                                onChange={(e) => setFincaSearchTerm(e.target.value)}
                                disabled={loading}
                            />
                            <button
                                className="btn btn-square"
                                type="button"
                                disabled={loading}
                            >
                                <AppIcons.Search className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 max-h-80 overflow-y-auto p-2 border rounded-lg">
                            {filteredFincas.length === 0 ? (
                                <div className="col-span-full text-center py-4 text-sm opacity-70">
                                    No se encontraron fincas con ese término de búsqueda
                                </div>
                            ) : (
                                filteredFincas.map((finca) => {
                                    const isSelected = fields.some(
                                        (field) => field.fincaId === finca.id_finca
                                    );

                                    return (
                                        <div
                                            key={finca.id_finca}
                                            className={`border rounded-lg p-3 cursor-pointer hover:bg-base-200 transition-colors ${isSelected ? "bg-primary/10 border-primary" : ""
                                                }`}
                                            onClick={() => handleToggleFinca(finca.id_finca)}
                                        >
                                            <div className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    className="checkbox checkbox-primary mr-2"
                                                    checked={isSelected}
                                                    onChange={() => { }} // Controlado por el onClick del div padre
                                                    onClick={(e) => e.stopPropagation()}
                                                />
                                                <div>
                                                    <p className="font-medium">{finca.nombre}</p>
                                                    <p className="text-xs opacity-70">
                                                        {finca.codigo || "Sin código"}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>

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
                                        {fields.map((field, index) => {
                                            const finca = fincas.find(f => f.id_finca === field.fincaId);

                                            return (
                                                <tr key={field.id || index}>
                                                    <td>{finca?.nombre || `Finca ${field.fincaId}`}</td>
                                                    <td>
                                                        <Controller
                                                            name={`asignaciones.${index}.productoId`}
                                                            control={control}
                                                            render={({ field: productField }) => (
                                                                <select
                                                                    {...productField}
                                                                    className="select select-bordered select-sm w-full"
                                                                    onChange={(e) => productField.onChange(e.target.value ? Number(e.target.value) : '')}
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
                                                            )}
                                                        />
                                                    </td>
                                                    <td>
                                                        <Controller
                                                            name={`asignaciones.${index}.fulls`}
                                                            control={control}
                                                            render={({ field: fullsField }) => (
                                                                <input
                                                                    {...fullsField}
                                                                    type="number"
                                                                    className="input input-bordered input-sm w-20"
                                                                    min="0"
                                                                    placeholder="0"
                                                                    value={fullsField.value || ''}
                                                                    onChange={(e) => fullsField.onChange(e.target.value === '' ? null : Number(e.target.value))}
                                                                />
                                                            )}
                                                        />
                                                    </td>
                                                    <td>
                                                        <Controller
                                                            name={`asignaciones.${index}.pcs`}
                                                            control={control}
                                                            render={({ field: pcsField }) => (
                                                                <input
                                                                    {...pcsField}
                                                                    type="number"
                                                                    className="input input-bordered input-sm w-20"
                                                                    min="0"
                                                                    placeholder="0"
                                                                    value={pcsField.value || ''}
                                                                    onChange={(e) => pcsField.onChange(e.target.value === '' ? null : Number(e.target.value))}
                                                                />
                                                            )}
                                                        />
                                                    </td>
                                                    <td>
                                                        <Controller
                                                            name={`asignaciones.${index}.kgs`}
                                                            control={control}
                                                            render={({ field: kgsField }) => (
                                                                <input
                                                                    {...kgsField}
                                                                    type="number"
                                                                    className="input input-bordered input-sm w-20"
                                                                    min="0"
                                                                    step="0.1"
                                                                    placeholder="0"
                                                                    value={kgsField.value || ''}
                                                                    onChange={(e) => kgsField.onChange(e.target.value === '' ? null : Number(e.target.value))}
                                                                />
                                                            )}
                                                        />
                                                    </td>
                                                    <td>
                                                        <Controller
                                                            name={`asignaciones.${index}.stems`}
                                                            control={control}
                                                            render={({ field: stemsField }) => (
                                                                <input
                                                                    {...stemsField}
                                                                    type="number"
                                                                    className="input input-bordered input-sm w-20"
                                                                    min="0"
                                                                    placeholder="0"
                                                                    value={stemsField.value || ''}
                                                                    onChange={(e) => stemsField.onChange(e.target.value === '' ? null : Number(e.target.value))}
                                                                />
                                                            )}
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
                        onClick={handleReset}
                        disabled={submitting}
                    >
                        <AppIcons.ChevronLeft className="w-4 h-4 mr-1" />
                        Volver
                    </button>
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={handleSubmit(onSubmit)}
                        disabled={submitting || fields.length === 0}
                    >
                        {submitting ? (
                            <>
                                <span className="loading loading-spinner loading-sm"></span>
                                Procesando...
                            </>
                        ) : (
                            <>
                                <AppIcons.Check className="w-4 h-4 mr-1" />
                                Asignar Guías
                            </>
                        )}
                    </button>
                </CardFooter>
            </Card>
        </div>
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
                        className="btn btn-primary"
                        onClick={handleReset}
                    >
                        Nueva Asignación
                    </button>
                    <button
                        type="button"
                        className="btn btn-outline"
                        onClick={onComplete}
                    >
                        Volver al Gestor
                    </button>
                </div>
            </CardContent>
        </Card>
    );

    // Renderizar el paso correspondiente
    const renderStep = () => {
        switch (step) {
            case 'selection':
                return renderSelectionStep();
            case 'detail':
                return renderDetailStep();
            case 'success':
                return renderSuccessStep();
            default:
                return renderSelectionStep();
        }
    };

    // Mostrar carga mientras se obtienen los datos iniciales
    if (loading && !documento && documentoId) {
        return (
            <div className="flex justify-center py-8">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    return renderStep();
}