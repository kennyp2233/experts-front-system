// src/components/sistema/centro_guias_components/CreacionDocumentoCoordinacionRefactorizado.tsx
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { coordinacionesService } from '@/api/services/documentos/coordinacionesService';
import { dispatchMenssage } from '@/utils/menssageDispatcher';
import { AppIcons } from '@/utils/icons';
import { useCatalogosCoordinaciones } from '@/hooks/useCatalogosCoordinaciones';

// Importamos los componentes de formulario refactorizados
import { Form } from '@/components/sistema/common/form';
import { AerolineaGuiaSelector } from './forms/AerolineaGuiaSelector';
import { DocumentoCoordinacionForm } from './forms/DocumentoCoordinacionForm';
import { RutasForm } from './forms/RutasForm';
import { ValoresComisionesForm } from './forms/ValoresComisionesForm';

// Esquema de validación con Yup
const schema = yup.object({
  id_guia_madre: yup.number().required('Debe seleccionar una guía madre'),
  id_consignatario: yup.number().required('Debe seleccionar un consignatario'),
  id_producto: yup.number().required('Debe seleccionar un producto'),
  id_agencia_iata: yup.number().required('Debe seleccionar una agencia IATA'),
  id_destino_awb: yup.number().required('Debe seleccionar un destino AWB'),
  id_destino_final_docs: yup.number().required('Debe seleccionar un destino final para documentos'),
  pago: yup.string().required('Debe seleccionar un tipo de pago'),
  fecha_vuelo: yup.string().required('Debe ingresar una fecha de vuelo'),
  fecha_asignacion: yup.string().required('Debe ingresar una fecha de asignación'),
  // Campos opcionales con transformación de tipos
  from1: yup.mixed().transform((value: string) => value === '' ? undefined : Number(value)),
  to1: yup.mixed().transform((value: string) => value === '' ? undefined : Number(value)),
  by1: yup.mixed().transform((value: string) => value === '' ? undefined : Number(value)),
  to2: yup.mixed().transform((value: string) => value === '' ? undefined : Number(value)),
  by2: yup.mixed().transform((value: string) => value === '' ? undefined : Number(value)),
  to3: yup.mixed().transform((value: string) => value === '' ? undefined : Number(value)),
  by3: yup.mixed().transform((value: string) => value === '' ? undefined : Number(value)),
  // Valores numéricos con transformación
  costo_guia_valor: yup.number().default(0),
  combustible_valor: yup.number().default(0),
  seguridad_valor: yup.number().default(0),
  aux_calculo_valor: yup.number().default(0),
  otros_valor: yup.number().default(0),
  aux1_valor: yup.number().default(0),
  aux2_valor: yup.number().default(0),
  tarifa_rate: yup.number().default(0),
  char_weight: yup.number().default(0),
  form_a: yup.number().default(0),
  transport: yup.number().default(0),
  pca: yup.number().default(0),
  fitos: yup.number().default(0),
  termografo: yup.number().default(0),
  mca: yup.number().default(0),
  tax: yup.number().default(0),
}).required();

// Tipo para los valores del formulario
type FormValues = yup.InferType<typeof schema>;

export default function CreacionDocumentoCoordinacionRefactorizado() {
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

  // Estado para el manejo de errores y carga
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Configurar React Hook Form con validación Yup
  const methods = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      pago: 'PREPAID',
      fecha_vuelo: new Date().toISOString().split('T')[0],
      fecha_asignacion: new Date().toISOString().split('T')[0],
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
    }
  });

  // Manejar la selección de una guía madre
  const handleGuiaSelected = (guia: any) => {
    if (!guia) return;

    // Actualizar el ID de la guía madre en el formulario
    methods.setValue('id_guia_madre', guia.id);
  };

  // Manejar el envío del formulario
  const handleSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Preparar datos para la API
      const documentoData = {
        ...data,
        // Convertir fechas al formato esperado por la API
        fecha_vuelo: new Date(data.fecha_vuelo),
        fecha_asignacion: new Date(data.fecha_asignacion)
      };

      // Llamar a la API para crear el documento
      const response = await coordinacionesService.createDocument(documentoData as any);

      dispatchMenssage('success', 'Documento de Coordinación creado correctamente');

      // Redireccionar a la página de gestión
      router.push('/sistema/dashboard/modulos/documentos/centro_guias?tab=gestion-documentos');
    } catch (error) {
      console.error('Error al crear documento de coordinación:', error);
      setError('Error al crear el documento de coordinación. Verifique los datos e intente nuevamente.');
      dispatchMenssage('error', 'Error al crear el documento de coordinación');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Manejar el cancel del formulario
  const handleCancel = () => {
    router.push('/sistema/dashboard/modulos/documentos/centro_guias');
  };

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
            <span>Error al cargar datos de referencia</span>
          </div>
        ) : (
          <FormProvider {...methods}>
            <Form
              methods={methods}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              isSubmitting={isSubmitting}
              error={error || undefined}
              submitText="Guardar Documento"
              submitIcon={<AppIcons.Check className="w-4 h-4 mr-1" />}
            >
              {/* SECCIÓN 1: BÚSQUEDA Y SELECCIÓN DE GUÍA MADRE */}
              <div className="card bg-base-200 p-4 mb-6">
                <h3 className="font-bold mb-4">Selección de Guía Madre</h3>
                <AerolineaGuiaSelector onGuiaSelected={handleGuiaSelected} />
              </div>

              {/* SECCIÓN 2: DATOS PRINCIPALES DEL DOCUMENTO */}
              {methods.watch('id_guia_madre') && (
                <div className="card bg-base-200 p-4 mb-6">
                  <h3 className="font-bold mb-4">Información Principal del Documento</h3>
                  <DocumentoCoordinacionForm
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
              {methods.watch('id_guia_madre') && (
                <div className="card bg-base-200 p-4 mb-6">
                  <h3 className="font-bold mb-4">Rutas</h3>
                  <RutasForm
                    destinos={destinos}
                    aerolineas={aerolineas}
                    origenes={origenes}
                  />
                </div>
              )}

              {/* SECCIÓN 4: VALORES Y COMISIONES */}
              {methods.watch('id_guia_madre') && (
                <div className="card bg-base-200 p-4 mb-6">
                  <h3 className="font-bold mb-4">Valores y Comisiones</h3>
                  <p className="text-sm opacity-70 mb-4">
                    Los valores se pre-llenan de la plantilla de la aerolínea. Puede ajustarlos si es necesario.
                  </p>
                  <ValoresComisionesForm />
                </div>
              )}

              {/* Los botones de acción se manejan automáticamente por el componente Form */}
            </Form>
          </FormProvider>
        )}
      </div>
    </div>
  );
}