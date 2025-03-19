// src/components/sistema/centro_guias_components/CreacionDocumentoCoordinacion.tsx
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { coordinacionesService, CoordinationDocument } from '@/api/services/documentos/coordinacionesService';
import { guiasMadreService } from '@/api/services/documentos/guiasMadreService';
import { aerolineasService } from '@/api/services/mantenimiento/aerolineasService';

import { dispatchMenssage } from '@/utils/menssageDispatcher';
import { AppIcons } from '@/utils/icons';
import { AerolineaGuiaSelector } from './forms/AerolineaGuiaSelector';
import { DocumentoCoordinacionForm } from './forms/DocumentoCoordinacionForm';
import { RutasForm } from './forms/RutasForm';
import { ValoresComisionesForm } from './forms/ValoresComisionesForm';
import { useCatalogosCoordinaciones } from '@/hooks/useCatalogosCoordinaciones';

export default function CreacionDocumentoCoordinacion() {
    const router = useRouter();
    const {
        consignatarios,
        aerolineas,
        productos,
        agenciasIata,
        destinos,
        origenes,
        loading: loadingCatalogs,
        error: catalogsError
    } = useCatalogosCoordinaciones();

    // Guía madre seleccionada
    const [selectedGuiaMadre, setSelectedGuiaMadre] = useState<any>(null);
    const [loadingGuiaDetails, setLoadingGuiaDetails] = useState<boolean>(false);

    // Datos del formulario con valores iniciales
    const [formData, setFormData] = useState({
        id_guia_madre: 0,
        id_consignatario: '',
        id_producto: '',
        id_agencia_iata: '',
        id_destino_awb: '',
        id_destino_final_docs: '',
        pago: 'PREPAID',
        fecha_vuelo: new Date().toISOString().split('T')[0],
        fecha_asignacion: new Date().toISOString().split('T')[0],

        // Rutas
        from1: '',
        to1: '',
        by1: '',
        to2: '',
        by2: '',
        to3: '',
        by3: '',

        // Valores
        costo_guia_valor: 0,
        combustible_valor: 0,
        seguridad_valor: 0,
        aux_calculo_valor: 0,
        otros_valor: 0,
        aux1_valor: 0,
        aux2_valor: 0,
        tarifa_rate: 0,
        char_weight: 0,
        form_a: 0,
        transport: 0,
        pca: 0,
        fitos: 0,
        termografo: 0,
        mca: 0,
        tax: 0,
    });

    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Manejar selección de guía madre
    const handleGuiaSelected = async (guia: any) => {
        setSelectedGuiaMadre(guia);

        if (guia) {
            setFormData(prev => ({
                ...prev,
                id_guia_madre: guia.id
            }));

            setLoadingGuiaDetails(true);
            try {
                // Obtener detalles completos de la guía madre, incluyendo el documento base y la aerolínea
                const guiaDetallada = await guiasMadreService.getGuiaMadreById(guia.id);

                // Verificar si la guía tiene documento_base y aerolinea
                if (guiaDetallada.documento_base?.id_aerolinea) {
                    const aerolineaId = guiaDetallada.documento_base.id_aerolinea;
                    // Buscar la aerolínea completa con su plantilla
                    const aerolineaCompleta = await aerolineasService.findOneComplete(aerolineaId);

                    if (aerolineaCompleta) {
                        // Preparar valores por defecto para rutas basados en la plantilla de la aerolínea
                        console.log('Aerolínea completa:', aerolineaCompleta);
                        const rutasDefecto = {
                            from1: aerolineaCompleta.from1?.toString() || '',
                            to1: aerolineaCompleta.to1?.toString() || '',
                            by1: aerolineaCompleta.by1?.toString() || '',
                            to2: aerolineaCompleta.to2?.toString() || '',
                            by2: aerolineaCompleta.by2?.toString() || '',
                            to3: aerolineaCompleta.to3?.toString() || '',
                            by3: aerolineaCompleta.by3?.toString() || '',
                        };

                        // Si la aerolínea tiene plantilla, usamos sus valores
                        if (aerolineaCompleta.aerolineas_plantilla) {
                            const plantilla = aerolineaCompleta.aerolineas_plantilla;

                            // Actualizar datos del formulario con valores de la plantilla
                            setFormData(prev => ({
                                ...prev,
                                ...rutasDefecto,
                                costo_guia_valor: plantilla.costo_guia_valor || 0,
                                combustible_valor: plantilla.combustible_valor || 0,
                                seguridad_valor: plantilla.seguridad_valor || 0,
                                aux_calculo_valor: plantilla.aux_calculo_valor || 0,
                                otros_valor: plantilla.otros_valor || 0,
                                aux1_valor: plantilla.aux1_valor || 0,
                                aux2_valor: plantilla.aux2_valor || 0,
                                tarifa_rate: plantilla.tarifa_rate || 0,
                                pca: plantilla.pca || 0,
                            }));

                            dispatchMenssage('info', 'Se cargaron los valores de la plantilla de la aerolínea');
                        } else {
                            // Si no tiene plantilla, solo actualizamos las rutas
                            setFormData(prev => ({
                                ...prev,
                                ...rutasDefecto
                            }));
                        }
                    }
                }
            } catch (error) {
                console.error('Error al cargar detalles de la guía madre:', error);
                dispatchMenssage('error', 'No se pudieron cargar los detalles completos de la guía madre');
            } finally {
                setLoadingGuiaDetails(false);
            }
        } else {
            // Reiniciar formulario si no hay guía seleccionada
            setFormData(prev => ({
                ...prev,
                id_guia_madre: 0
            }));
        }
    };

    // Manejar cambios en el formulario
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        // Para inputs numéricos, convertir a número
        const newValue = (type === 'number') ? Number(value) : value;

        setFormData(prev => ({
            ...prev,
            [name]: newValue
        }));

        // Si había un error para este campo, limpiarlo
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    // Validar formulario antes de enviar
    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        // Validaciones requeridas
        if (!formData.id_guia_madre) {
            newErrors.id_guia_madre = 'Debe seleccionar una guía madre';
        }

        if (!formData.id_consignatario) {
            newErrors.id_consignatario = 'Debe seleccionar un consignatario';
        }

        if (!formData.id_producto) {
            newErrors.id_producto = 'Debe seleccionar un producto';
        }

        if (!formData.id_agencia_iata) {
            newErrors.id_agencia_iata = 'Debe seleccionar una agencia IATA';
        }

        if (!formData.id_destino_awb) {
            newErrors.id_destino_awb = 'Debe seleccionar un destino AWB';
        }

        if (!formData.id_destino_final_docs) {
            newErrors.id_destino_final_docs = 'Debe seleccionar un destino final para documentos';
        }

        if (!formData.fecha_vuelo) {
            newErrors.fecha_vuelo = 'Debe ingresar una fecha de vuelo';
        }

        if (!formData.fecha_asignacion) {
            newErrors.fecha_asignacion = 'Debe ingresar una fecha de asignación';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Enviar formulario
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            dispatchMenssage('error', 'Por favor, corrija los errores en el formulario');
            return;
        }

        setSubmitting(true);

        try {
            // Preparar datos para API, convirtiendo strings a números donde corresponda
            const documentoData: Partial<CoordinationDocument> = {
                ...formData,
                id_guia_madre: Number(formData.id_guia_madre),
                id_consignatario: Number(formData.id_consignatario),
                id_producto: Number(formData.id_producto),
                id_agencia_iata: Number(formData.id_agencia_iata),
                id_destino_awb: Number(formData.id_destino_awb),
                id_destino_final_docs: Number(formData.id_destino_final_docs),

                // Convertir rutas de string a número o undefined
                from1: formData.from1 ? Number(formData.from1) : undefined,
                to1: formData.to1 ? Number(formData.to1) : undefined,
                by1: formData.by1 ? Number(formData.by1) : undefined,
                to2: formData.to2 ? Number(formData.to2) : undefined,
                by2: formData.by2 ? Number(formData.by2) : undefined,
                to3: formData.to3 ? Number(formData.to3) : undefined,
                by3: formData.by3 ? Number(formData.by3) : undefined,

                // Convertir fechas al formato esperado por la API
                fecha_vuelo: new Date(formData.fecha_vuelo),
                fecha_asignacion: new Date(formData.fecha_asignacion)
            };

            // Llamar a la API para crear el documento
            const response = await coordinacionesService.createDocument(documentoData as any);

            dispatchMenssage('success', 'Documento de Coordinación creado correctamente');

            // Redireccionar a la página de gestión
            router.push('/sistema/dashboard/modulos/documentos/centro_guias?tab=gestion-documentos');
        } catch (error) {
            console.error('Error al crear documento de coordinación:', error);
            dispatchMenssage('error', 'Error al crear el documento de coordinación');
        } finally {
            setSubmitting(false);
        }
    };

    // Renderizado del componente utilizando los componentes reutilizables
    return (
        <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
                <h2 className="card-title">Crear Documento de Coordinación</h2>
                <p className="text-sm opacity-70 mb-4">
                    Los documentos de coordinación asocian una guía madre con un consignatario, producto, destinos y fechas.
                </p>

                {loadingCatalogs ? (
                    <div className="flex justify-center py-8">
                        <span className="loading loading-spinner loading-lg"></span>
                    </div>
                ) : catalogsError ? (
                    <div className="alert alert-error">
                        <AppIcons.Error className="w-6 h-6" />
                        <span>Error al cargar datos de referencia: {catalogsError.message}</span>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* SECCIÓN 1: BÚSQUEDA Y SELECCIÓN DE GUÍA MADRE */}
                        <div className="card bg-base-200 p-4">
                            <h3 className="font-bold mb-4">Selección de Guía Madre</h3>
                            <AerolineaGuiaSelector onGuiaSelected={handleGuiaSelected} />
                            {errors.id_guia_madre && (
                                <p className="text-error text-sm mt-2">{errors.id_guia_madre}</p>
                            )}

                            {loadingGuiaDetails && (
                                <div className="flex items-center mt-2">
                                    <span className="loading loading-spinner loading-sm mr-2"></span>
                                    <span className="text-sm">Cargando información de la aerolínea...</span>
                                </div>
                            )}
                        </div>

                        {/* SECCIÓN 2: DATOS PRINCIPALES DEL DOCUMENTO */}
                        {selectedGuiaMadre && (
                            <div className="card bg-base-200 p-4">
                                <h3 className="font-bold mb-4">Información Principal del Documento</h3>
                                <DocumentoCoordinacionForm
                                    formData={formData}
                                    onChange={handleInputChange}
                                    errors={errors}
                                    catalogs={{
                                        consignatarios,
                                        productos,
                                        agenciasIata,
                                        destinos,
                                        origenes,
                                        aerolineas
                                    }}
                                />
                            </div>
                        )}

                        {/* SECCIÓN 3: RUTAS */}
                        {selectedGuiaMadre && (
                            <div className="card bg-base-200 p-4">
                                <h3 className="font-bold mb-4">Rutas</h3>
                                <RutasForm
                                    formData={formData}
                                    onChange={handleInputChange}
                                    destinos={destinos}
                                    aerolineas={aerolineas}
                                    origenes={origenes}
                                />
                            </div>
                        )}

                        {/* SECCIÓN 4: VALORES Y COMISIONES */}
                        {selectedGuiaMadre && (
                            <div className="card bg-base-200 p-4">
                                <h3 className="font-bold mb-4">Valores y Comisiones</h3>
                                <p className="text-sm opacity-70 mb-4">
                                    Los valores se pre-llenan de la plantilla de la aerolínea. Puede ajustarlos si es necesario.
                                </p>
                                <ValoresComisionesForm
                                    formData={formData}
                                    onChange={handleInputChange}
                                />
                            </div>
                        )}

                        {/* BOTONES DE ACCIÓN */}
                        <div className="flex justify-end gap-2 mt-6">
                            <button
                                type="button"
                                className="btn btn-outline"
                                onClick={() => router.push('/sistema/dashboard/modulos/documentos/centro_guias')}
                            >
                                Cancelar
                            </button>

                            {selectedGuiaMadre && (
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={submitting}
                                >
                                    {submitting ? (
                                        <>
                                            <span className="loading loading-spinner loading-sm"></span>
                                            Guardando...
                                        </>
                                    ) : (
                                        <>
                                            <AppIcons.Check className="w-4 h-4 mr-1" />
                                            Guardar Documento
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}