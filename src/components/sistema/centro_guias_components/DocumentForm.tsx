import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { CoordinationDocument } from '@/api/documentos/coordinacion/coordinacion.api';
import { useCatalogosCoordinaciones } from '@/hooks/useCatalogosCoordinaciones';
import { SelectField } from '@/components/common/SelectField';
import { baseUrl } from '@/api/mantenimiento/config.api';

interface DocumentFormProps {
  initialData?: Partial<CoordinationDocument>;
  onSubmit: (data: Partial<CoordinationDocument>) => Promise<void>;
  isLoading?: boolean;
}

export const DocumentForm: React.FC<DocumentFormProps> = ({
  initialData,
  onSubmit,
  isLoading
}) => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<CoordinationDocument>({
    defaultValues: initialData
  });

  const {
    consignatarios,
    aerolineas,
    productos,
    agenciasIata,
    destinos,
    origenes,
    loading: catalogsLoading,
    error: catalogsError
  } = useCatalogosCoordinaciones();

  const [checkingGuides, setCheckingGuides] = useState(false);
  const [guiasMadres, setGuiasMadres] = useState<any[]>([]);
  const [guiasMadresDisponibles, setGuiasMadresDisponibles] = useState(false);

  const selectedGuiaMadre = watch('id_guia_madre');
  const selectedAerolinea = watch('busqueda_guias_madres');

  // Verificar si hay guías madres disponibles
  const verificarGuiasMadres = async (aerolineaId: number) => {
    setCheckingGuides(true);
    try {
      const response = await axios.get(`${baseUrl}/guia_madre/aerolinea`, {
        params: { id: aerolineaId }
      });
      setGuiasMadres(response.data);
      setGuiasMadresDisponibles(response.data.length > 0);
    } catch (error) {
      console.error('Error al consultar guías madres:', error);
      setGuiasMadres([]);
      setGuiasMadresDisponibles(false);
    }
    setCheckingGuides(false);
  };

  // Si viene aerolínea preseleccionada en initialData, consultamos guías
  useEffect(() => {
    if (initialData?.busqueda_guias_madres) {
      verificarGuiasMadres(Number(initialData.busqueda_guias_madres));
    }
  }, [initialData]);

  if (catalogsLoading) {
    return (
      <div className="flex items-center justify-center p-10">
        <span className="loading loading-lg"></span>
        <span className="ml-2 text-xl">Cargando datos...</span>
      </div>
    );
  }

  if (catalogsError) {
    return (
      <div className="alert alert-error shadow-lg my-4">
        <span>Error cargando catálogos</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Tabs (para separar secciones) */}
      <div role="tablist" className="tabs tabs-boxed">
        <a role="tab" className="tab tab-active">
          Detalles Principales
        </a>
        <a
          role="tab"
          className={`tab ${!selectedGuiaMadre ? 'tab-disabled' : ''}`}
        >
          Comisiones y Tarifas
        </a>
      </div>

      {/* CARD: Información Principal */}
      <div className="card bg-base-200 shadow-lg">
        <div className="card-body space-y-4">
          <h2 className="card-title text-lg">Información Principal</h2>

          <div className="form-control">
            <SelectField
              label="Aerolínea"
              name="busqueda_guias_madres"
              register={register}
              options={aerolineas}
              required
              error={errors.busqueda_guias_madres?.message}
              onChange={(e) => {
                // Asignamos la aerolínea y consultamos guías
                setValue('busqueda_guias_madres', Number(e.target.value));
                verificarGuiasMadres(Number(e.target.value));
              }}
            />
          </div>

          {checkingGuides && (
            <div className="flex items-center text-sm text-info">
              <span className="loading loading-sm mr-2"></span>
              Verificando guías...
            </div>
          )}

          {guiasMadresDisponibles && (
            <div className="form-control">
              <SelectField
                label="Guía Madre"
                name="id_guia_madre"
                register={register}
                options={guiasMadres}
                required
                error={errors.id_guia_madre?.message}
                guiaLabel
                onChange={(e) => setValue('id_guia_madre', Number(e.target.value))}
              />
            </div>
          )}

          {/* Si se seleccionó aerolínea pero no hay guías disponibles */}
          {!guiasMadresDisponibles && selectedAerolinea && !checkingGuides && (
            <div className="alert alert-warning">
              <span>No hay guías madre disponibles para esta aerolínea.</span>
            </div>
          )}
        </div>
      </div>

      {/* CARD: Detalles del Documento (solo visible si hay guía madre) */}
      {selectedGuiaMadre && (
        <div className="card bg-base-200 shadow-lg">
          <div className="card-body">
            <h2 className="card-title text-lg mb-4">Detalles del Documento</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="form-control">
                <SelectField
                  label="Consignatario"
                  name="id_consignatario"
                  register={register}
                  options={consignatarios}
                  required
                  error={errors.id_consignatario?.message}
                />
              </div>

              <div className="form-control">
                <SelectField
                  label="Tipo de Embarque"
                  name="id_producto"
                  register={register}
                  options={productos}
                  required
                  error={errors.id_producto?.message}
                />
              </div>

              <div className="form-control">
                <SelectField
                  label="Agencia IATA"
                  name="id_agencia_iata"
                  register={register}
                  options={agenciasIata}
                  required
                  error={errors.id_agencia_iata?.message}
                />
              </div>

              <div className="form-control">
                <SelectField
                  label="Origen"
                  name="id_destino_awb"
                  register={register}
                  options={destinos}
                  required
                  error={errors.id_destino_awb?.message}
                />
              </div>

              <div className="form-control">
                <SelectField
                  label="Destino"
                  name="id_destino_final_docs"
                  register={register}
                  options={destinos}
                  required
                  error={errors.id_destino_final_docs?.message}
                />
              </div>

              {/* Campo: Fecha de Vuelo */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-sm font-medium">Fecha de Vuelo</span>
                </label>
                <input
                  type="date"
                  className="input input-bordered"
                  {...register('fecha_vuelo', { required: 'Este campo es requerido' })}
                />
                {errors.fecha_vuelo && (
                  <span className="text-error text-sm mt-1">
                    {errors.fecha_vuelo.message}
                  </span>
                )}
              </div>

              {/* Campo: Fecha de Asignación */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-sm font-medium">Fecha de Asignación</span>
                </label>
                <input
                  type="date"
                  className="input input-bordered"
                  {...register('fecha_asignacion', { required: 'Este campo es requerido' })}
                />
                {errors.fecha_asignacion && (
                  <span className="text-error text-sm mt-1">
                    {errors.fecha_asignacion.message}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mensaje si no hay aerolíneas en absoluto */}
      {aerolineas.length === 0 && (
        <div className="alert alert-warning shadow-lg">
          <span>No hay aerolíneas con guías madres disponibles.</span>
          <button
            className="btn btn-primary mt-2"
            onClick={() =>
              router.push('/sistema/dashboard/modulos/documentos/creacion_administracion_guias')
            }
          >
            Crear Documentos Base
          </button>
        </div>
      )}

      {/* Botón de Guardar */}
      <div className="flex justify-end">
        <button
          type="submit"
          className={`btn btn-primary w-32 ${isLoading ? 'loading' : ''}`}
          disabled={isLoading || catalogsLoading}
        >
          {isLoading ? 'Guardando...' : 'Guardar'}
        </button>
      </div>
    </form>
  );
};

export default DocumentForm;
