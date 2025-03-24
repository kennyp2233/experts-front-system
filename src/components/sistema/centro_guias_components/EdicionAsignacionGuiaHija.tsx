// src/components/sistema/centro_guias_components/EdicionAsignacionGuiaHija.tsx
import React, { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/ui/card';
import { AppIcons } from '@/utils/icons';
import { CantidadesConfiguration } from './common/CantidadesConfiguration';
import { guiasHijasService, GuiaHija } from '@/api/services/documentos/guiasHijasService';
import { productosService } from '@/api/services/mantenimiento/productosService';
import { dispatchMenssage } from '@/utils/menssageDispatcher';
import { Form, FormField } from '@/components/sistema/centro_guias_components/common/form';

// Schema para validación
const schema = yup.object({
    id_producto: yup.number().nullable(),
    fulls: yup.number().nullable().transform(value =>
        value === undefined || isNaN(value) ? null : Number(value)
    ),
    pcs: yup.number().nullable().transform(value =>
        value === undefined || isNaN(value) ? null : Number(value)
    ),
    kgs: yup.number().nullable().transform(value =>
        value === undefined || isNaN(value) ? null : Number(value)
    ),
    stems: yup.number().nullable().transform(value =>
        value === undefined || isNaN(value) ? null : Number(value)
    )
}).test(
    'al-menos-una-cantidad',
    'Debe especificar al menos una cantidad (Fulls, Pcs, Kgs o Stems)',
    (values) => {
        return !!(values.fulls || values.pcs || values.kgs || values.stems);
    }
);

interface EdicionAsignacionGuiaHijaProps {
    guiaHijaId: number;
    onSuccess?: () => void;
    onCancel?: () => void;
}

export const EdicionAsignacionGuiaHija: React.FC<EdicionAsignacionGuiaHijaProps> = ({
    guiaHijaId,
    onSuccess,
    onCancel
}) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [guiaHija, setGuiaHija] = useState<GuiaHija | null>(null);
    const [productos, setProductos] = useState<any[]>([]);

    // Configurar el formulario con React Hook Form
    const methods = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            id_producto: null,
            fulls: null,
            pcs: null,
            kgs: null,
            stems: null
        }
    });

    // Cargar datos iniciales
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Cargar datos de la guía hija
                const guiaHijaData = await guiasHijasService.getGuiaHijaById(guiaHijaId);
                setGuiaHija(guiaHijaData);

                // Cargar productos para el selector
                const productosData = await productosService.getProductos();
                setProductos(productosData);

                // Establecer valores por defecto del formulario
                methods.reset({
                    id_producto: guiaHijaData.id_producto || null,
                    fulls: guiaHijaData.fulls || null,
                    pcs: guiaHijaData.pcs || null,
                    kgs: guiaHijaData.kgs || null,
                    stems: guiaHijaData.stems || null
                });
            } catch (error) {
                console.error('Error al cargar datos:', error);
                setError('Error al cargar datos de la guía hija');
                dispatchMenssage('error', 'Error al cargar datos de la guía hija');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [guiaHijaId, methods]);

    // Manejar el envío del formulario
    const handleSubmit = async (data: any) => {
        setSubmitting(true);
        setError(null);

        try {
            // Actualizar guía hija
            await guiasHijasService.actualizarGuiaHija(guiaHijaId, data);

            dispatchMenssage('success', 'Guía hija actualizada correctamente');

            if (onSuccess) {
                onSuccess();
            }
        } catch (error) {
            console.error('Error al actualizar guía hija:', error);
            setError('Error al actualizar la guía hija');
            dispatchMenssage('error', 'Error al actualizar la guía hija');
        } finally {
            setSubmitting(false);
        }
    };

    // Aplicar valores de cantidades
    const applyCantidades = (values: any) => {
        Object.entries(values).forEach(([key, value]) => {
            if (value !== undefined) {
                methods.setValue(key as any, value);
            }
        });
    };

    if (loading) {
        return (
            <Card className="bg-base-100 shadow-lg">
                <CardContent className="flex justify-center py-8">
                    <span className="loading loading-spinner loading-lg"></span>
                </CardContent>
            </Card>
        );
    }

    if (!guiaHija) {
        return (
            <Card className="bg-base-100 shadow-lg">
                <CardContent>
                    <div className="alert alert-error">
                        <AppIcons.Error className="w-6 h-6" />
                        <span>No se pudo cargar la guía hija</span>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <FormProvider {...methods}>
            <Form
                methods={methods}
                onSubmit={handleSubmit}
                onCancel={onCancel}
                error={error || undefined}
                isSubmitting={submitting}
                submitText="Guardar Cambios"
                submitIcon={<AppIcons.Check className="w-4 h-4 mr-1" />}
            >
                <Card className="bg-base-100 shadow-lg mb-4">
                    <CardHeader>
                        <CardTitle>Editar Asignación de Guía Hija</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                            {/* Información de la guía (no editable) */}
                            <div>
                                <h3 className="font-bold mb-2">Información de la Guía</h3>
                                <div className="bg-base-200 p-3 rounded-lg">
                                    <p><strong>Número:</strong> {guiaHija.anio}-{guiaHija.secuencial}</p>
                                    <p><strong>Finca:</strong> {guiaHija.finca?.nombre || 'No especificada'}</p>
                                    <p><strong>Documento:</strong> {`COO-${guiaHija.id_documento_coordinacion.toString().padStart(7, '0')}`}</p>
                                </div>
                            </div>

                            {/* Selector de producto */}
                            <div>
                                <h3 className="font-bold mb-2">Producto</h3>
                                <FormField
                                    name="id_producto"
                                    label="Producto"
                                    type="select"
                                    options={productos.map(p => ({
                                        value: p.id_producto,
                                        label: p.nombre
                                    }))}
                                    required
                                />
                            </div>
                        </div>

                        {/* Configuración de cantidades */}
                        <div className="mb-4">
                            <h3 className="font-bold mb-2">Cantidades</h3>
                            <p className="text-sm opacity-70 mb-3">
                                Especifique al menos una cantidad para la guía hija.
                            </p>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <FormField
                                    name="fulls"
                                    label="Fulls"
                                    type="number"
                                    min={0}
                                />

                                <FormField
                                    name="pcs"
                                    label="Piezas (PCS)"
                                    type="number"
                                    min={0}
                                />

                                <FormField
                                    name="kgs"
                                    label="Peso (KGS)"
                                    type="number"
                                    min={0}
                                    step={0.1}
                                />

                                <FormField
                                    name="stems"
                                    label="Stems"
                                    type="number"
                                    min={0}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </Form>
        </FormProvider>
    );
};
