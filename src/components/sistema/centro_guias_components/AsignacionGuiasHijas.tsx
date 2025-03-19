// src/components/sistema/centro_guias_components/AsignacionGuiasHijasRefactorizado.tsx
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { coordinacionesService } from '@/api/services/documentos/coordinacionesService';
import { fincasService } from '@/api/services/mantenimiento/fincasService';
import { productosService } from '@/api/services/mantenimiento/productosService';
import { guiasHijasService } from '@/api/services/documentos/guiasHijasService';
import { dispatchMenssage } from '@/utils/menssageDispatcher';
import { AppIcons } from '@/utils/icons';

// Importamos los componentes de formulario refactorizados
import { Form, FormField, NumberField } from '@/components/sistema/common/form';
import { FincasSelector } from './forms/FincasSelector';

// Esquema de validación con Yup
const schema = yup.object({
    id_documento_coordinacion: yup.number().required('Debe seleccionar un documento de coordinación'),
    selectedFincas: yup
        .array()
        .of(yup.number().required())
        .min(1, 'Debe seleccionar al menos una finca'),
    id_producto: yup.number().transform(value => value === '' ? undefined : Number(value)),
    fulls: yup.number().default(0),
    pcs: yup.number().default(0),
    kgs: yup.number().default(0),
    stems: yup.number().default(0),
}).required();

// Tipo para los valores del formulario
type FormValues = yup.InferType<typeof schema>;

// Componente para cada paso del formulario
interface StepContainerProps {
    title: string;
    children: React.ReactNode;
}

const StepContainer: React.FC<StepContainerProps> = ({ title, children }) => (
    <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
            <h2 className="card-title">{title}</h2>
            {children}
        </div>
    </div>
);

export default function AsignacionGuiasHijasRefactorizado() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const preselectedDocumentoId = searchParams?.get('documento');

    // Estados
    const [documentos, setDocumentos] = useState<any[]>([]);
    const [fincas, setFincas] = useState<any[]>([]);
    const [productos, setProductos] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [loadingCatalogs, setLoadingCatalogs] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [step, setStep] = useState<'selection' | 'preview' | 'success'>('selection');
    const [previewResults, setPreviewResults] = useState<any | null>(null);

    // Configurar React Hook Form con validación Yup
    const methods = useForm<FormValues>({
        resolver: yupResolver(schema),
        defaultValues: {
            selectedFincas: [],
            fulls: 0,
            pcs: 0,
            kgs: 0,
            stems: 0,
        }
    });

    const { setValue, watch } = methods;
    const selectedDocumentoId = watch('id_documento_coordinacion');

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

                // Si hay un documento preseleccionado en la URL, seleccionarlo
                if (preselectedDocumentoId) {
                    const selectedDoc = formattedDocumentos.find(
                        doc => doc.id === parseInt(preselectedDocumentoId)
                    );
                    if (selectedDoc) {
                        setValue('id_documento_coordinacion', selectedDoc.id);
                        // Pre-seleccionar el producto del documento de coordinación si existe
                        if (selectedDoc.id_producto) {
                            setValue('id_producto', selectedDoc.id_producto);
                        }
                    }
                }
            } catch (error) {
                console.error('Error al cargar catálogos:', error);
                dispatchMenssage('error', 'Error al cargar datos necesarios');
                setError('Error al cargar datos necesarios. Por favor, intente más tarde.');
            } finally {
                setLoadingCatalogs(false);
            }
        };

        fetchCatalogs();
    }, [preselectedDocumentoId, setValue]);

    // Cuando cambia el documento seleccionado
    useEffect(() => {
        if (!selectedDocumentoId) return;

        const fetchDocumentoDetalles = async () => {
            try {
                // Aquí podrías cargar detalles adicionales del documento si es necesario
                const documento = documentos.find(doc => doc.id === selectedDocumentoId);
                if (documento && documento.id_producto) {
                    setValue('id_producto', documento.id_producto);
                }
            } catch (error) {
                console.error('Error al cargar detalles del documento:', error);
            }
        };

        fetchDocumentoDetalles();
    }, [selectedDocumentoId, documentos, setValue]);

    // Función para previsualizar asignaciones
    const handlePreviewAsignaciones = async (data: FormValues) => {
        setLoading(true);
        setError(null);

        try {
            // Preparar datos para pre-validación
            const asignaciones = (data.selectedFincas || []).map(fincaId => ({
                id_documento_coordinacion: data.id_documento_coordinacion,
                id_finca: fincaId,
                id_producto: data.id_producto,
                fulls: data.fulls || undefined,
                pcs: data.pcs || undefined,
                kgs: data.kgs || undefined,
                stems: data.stems || undefined
            }));

            // Llamar a la API de pre-validación
            const resultados = await guiasHijasService.prevalidarAsignaciones(asignaciones);

            setPreviewResults(resultados);
            setStep('preview');
        } catch (error) {
            console.error('Error al pre-validar asignaciones:', error);
            setError('Error al validar las asignaciones. Por favor, verifique los datos e intente nuevamente.');
            dispatchMenssage('error', 'Error al pre-validar asignaciones');
        } finally {
            setLoading(false);
        }
    };

    // Función para confirmar asignaciones
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
        } catch (error) {
            console.error('Error al confirmar asignaciones:', error);
            setError('Error al confirmar las asignaciones. Por favor, intente nuevamente.');
            dispatchMenssage('error', 'Error al confirmar asignaciones');
        } finally {
            setLoading(false);
        }
    };

    // Reiniciar el formulario
    const handleReset = () => {
        methods.reset();
        setStep('selection');
        setPreviewResults(null);
        setError(null);
    };

    // Renderizar pantalla de selección
    if (step === 'selection') {
        return (
            <FormProvider {...methods}>
                <Form
                    methods={methods}
                    onSubmit={handlePreviewAsignaciones}
                    onCancel={() => router.push('/sistema/dashboard/modulos/documentos/centro_guias')}
                    isSubmitting={loading}
                    error={error || undefined}
                    submitText="Pre-validar Asignaciones"
                    submitIcon={<AppIcons.Search className="w-4 h-4 mr-1" />}
                >
                    <div className="space-y-6">
                        <div className="card bg-base-200 p-6">
                            <h3 className="font-bold mb-4">Selección de Documento</h3>

                            <FormField
                                name="id_documento_coordinacion"
                                label="Documento de Coordinación (COO)"
                                type="select"
                                options={documentos.map(doc => ({
                                    value: doc.id,
                                    label: `${doc.cooLabel} - ${doc.consignatarioNombre || 'Sin consignatario'}`
                                }))}
                                required
                                disabled={loadingCatalogs}
                            />
                        </div>

                        {selectedDocumentoId && (
                            <>
                                <div className="card bg-base-200 p-6">
                                    <h3 className="font-bold mb-4">Información del Producto</h3>

                                    <FormField
                                        name="id_producto"
                                        label="Producto"
                                        type="select"
                                        options={productos.map(producto => ({
                                            value: producto.id_producto,
                                            label: producto.nombre
                                        }))}
                                        helpText="Si no selecciona un producto, se usará el del documento de coordinación."
                                        disabled={loadingCatalogs}
                                    />

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                                        <NumberField
                                            name="fulls"
                                            label="Fulls"
                                            min={0}
                                            step={1}
                                            disabled={loadingCatalogs}
                                        />

                                        <NumberField
                                            name="pcs"
                                            label="Piezas (Pcs)"
                                            min={0}
                                            step={1}
                                            disabled={loadingCatalogs}
                                        />

                                        <NumberField
                                            name="kgs"
                                            label="Peso (Kgs)"
                                            min={0}
                                            step={0.1}
                                            disabled={loadingCatalogs}
                                        />

                                        <NumberField
                                            name="stems"
                                            label="Stems"
                                            min={0}
                                            step={1}
                                            disabled={loadingCatalogs}
                                        />
                                    </div>
                                </div>

                                <div className="card bg-base-200 p-6">
                                    <h3 className="font-bold mb-4">Selección de Fincas</h3>
                                    <FincasSelector
                                        fincas={fincas}
                                        disabled={loadingCatalogs}
                                    />
                                </div>
                            </>
                        )}
                    </div>
                </Form>
            </FormProvider>
        );
    }

    // Renderizar pantalla de previsualización
    if (step === 'preview' && previewResults) {
        return (
            <StepContainer title="Pre-validación de Asignaciones">
                <p className="text-sm opacity-70 mb-4">
                    Revise las asignaciones antes de confirmar la creación de guías hijas.
                </p>

                <div className="alert alert-info mb-4">
                    <AppIcons.Info className="w-6 h-6" />
                    <div>
                        <span className="font-semibold">Documento de Coordinación:</span> {
                            documentos.find(d => d.id === selectedDocumentoId)?.cooLabel
                        }
                        <br />
                        <span className="font-semibold">Fincas seleccionadas:</span> {
                            watch('selectedFincas')?.length || 0
                        }
                        <br />
                        <span className="font-semibold">Producto:</span> {
                            watch('id_producto')
                                ? productos.find(p => p.id_producto === watch('id_producto'))?.nombre
                                : 'Se usará el del documento de coordinación'
                        }
                    </div>
                </div>

                {/* Detalles de cantidades */}
                {(watch('fulls') > 0 || watch('pcs') > 0 || watch('kgs') > 0 || watch('stems') > 0) && (
                    <div className="alert alert-info mb-4">
                        <AppIcons.Package className="w-6 h-6" />
                        <div>
                            <span className="font-semibold">Cantidades:</span>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-1">
                                {watch('fulls') > 0 && <div>Fulls: {watch('fulls')}</div>}
                                {watch('pcs') > 0 && <div>Pcs: {watch('pcs')}</div>}
                                {watch('kgs') > 0 && <div>Kgs: {watch('kgs')}</div>}
                                {watch('stems') > 0 && <div>Stems: {watch('stems')}</div>}
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

                <div className="flex justify-end gap-2 mt-6">
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
            </StepContainer>
        );
    }

    // Renderizar pantalla de éxito
    if (step === 'success') {
        return (
            <StepContainer title="¡Asignación Completada!">
                <div className="items-center text-center">
                    <div className="mb-4 text-success">
                        <AppIcons.CheckCircle className="w-16 h-16 mx-auto" />
                    </div>
                    <p>Las guías hijas han sido asignadas correctamente.</p>
                    <div className="flex justify-center mt-6 gap-2">
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
            </StepContainer>
        );
    }

    return (
        <div className="flex justify-center py-8">
            <span className="loading loading-spinner loading-lg"></span>
        </div>
    );
}