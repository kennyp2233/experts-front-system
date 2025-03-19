import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { CoordinationDocument } from '@/api/services/documentos/coordinacionesService';
import { useCatalogosCoordinaciones } from '@/hooks/useCatalogosCoordinaciones';
import { SelectField } from '@/components/sistema/common/SelectField';
import { guiasMadreService } from '@/api/services/documentos/guiasMadreService';
import { AppIcons } from '@/utils/icons';

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
  const [activeTab, setActiveTab] = useState<'details' | 'rates'>('details');

  const selectedGuiaMadre = watch('id_guia_madre');
  const selectedAerolinea = watch('busqueda_guias_madres');

  // Verificar si hay guías madres disponibles
  const verificarGuiasMadres = async (aerolineaId: number) => {
    setCheckingGuides(true);
    try {
      const response = await guiasMadreService.getGuiasMadrePorAerolinea(aerolineaId);
      setGuiasMadres(response);
      setGuiasMadresDisponibles(response.length > 0);
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
        <a
          role="tab"
          className={`tab ${activeTab === 'details' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('details')}
        >
          Detalles Principales
        </a>
        <a
          role="tab"
          className={`tab ${!selectedGuiaMadre ? 'tab-disabled' : ''} ${activeTab === 'rates' ? 'tab-active' : ''}`}
          onClick={() => selectedGuiaMadre && setActiveTab('rates')}
        >
          Comisiones y Tarifas
        </a>
      </div>

      {/* CARD: Información Principal */}
      {activeTab === 'details' && (
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
                  nameKey="secuencial"
                  onChange={(e) => setValue('id_guia_madre', Number(e.target.value))}
                />
              </div>
            )}

            {/* Si se seleccionó aerolínea pero no hay guías disponibles */}
            {!guiasMadresDisponibles && selectedAerolinea && !checkingGuides && (
              <div className="alert alert-warning">
                <AppIcons.Warning className="w-6 h-6" />
                <span>No hay guías madre disponibles para esta aerolínea.</span>
              </div>
            )}

            {selectedGuiaMadre && (
              <>
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
                      label="Tipo de Producto"
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
                      label="Destino AWB"
                      name="id_destino_awb"
                      register={register}
                      options={destinos}
                      required
                      error={errors.id_destino_awb?.message}
                    />
                  </div>

                  <div className="form-control">
                    <SelectField
                      label="Destino Final Docs"
                      name="id_destino_final_docs"
                      register={register}
                      options={destinos}
                      required
                      error={errors.id_destino_final_docs?.message}
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Tipo de Pago</span>
                    </label>
                    <select
                      className={`select select-bordered w-full ${errors.pago ? 'select-error' : ''}`}
                      {...register('pago', { required: 'Este campo es requerido' })}
                    >
                      <option value="">Seleccionar...</option>
                      <option value="PREPAID">PREPAID</option>
                      <option value="COLLECT">COLLECT</option>
                    </select>
                    {errors.pago && <span className="text-error text-sm mt-1">{errors.pago.message}</span>}
                  </div>

                  {/* Campo: Fecha de Vuelo */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text text-sm font-medium">Fecha de Vuelo</span>
                    </label>
                    <input
                      type="date"
                      className={`input input-bordered ${errors.fecha_vuelo ? 'input-error' : ''}`}
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
                      className={`input input-bordered ${errors.fecha_asignacion ? 'input-error' : ''}`}
                      {...register('fecha_asignacion', { required: 'Este campo es requerido' })}
                    />
                    {errors.fecha_asignacion && (
                      <span className="text-error text-sm mt-1">
                        {errors.fecha_asignacion.message}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => setActiveTab('rates')}
                  >
                    Continuar <AppIcons.ChevronRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* CARD: Tarifas y Comisiones (solo visible si hay guía madre) */}
      {activeTab === 'rates' && selectedGuiaMadre && (
        <div className="card bg-base-200 shadow-lg">
          <div className="card-body">
            <h2 className="card-title text-lg mb-4">Tarifas y Comisiones</h2>
            <p className="text-sm opacity-70 mb-4">
              Ingrese los valores para las diferentes tarifas y comisiones (opcional).
            </p>

            <div className="grid md:grid-cols-3 gap-4">
              {/* Costo de Guía */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Costo de Guía</span>
                </label>
                <label className="input-group">
                  <span>$</span>
                  <input
                    type="number"
                    step="0.01"
                    className="input input-bordered w-full"
                    placeholder="0.00"
                    {...register('costo_guia_valor', { valueAsNumber: true })}
                  />
                </label>
              </div>

              {/* Combustible */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Combustible</span>
                </label>
                <label className="input-group">
                  <span>$</span>
                  <input
                    type="number"
                    step="0.01"
                    className="input input-bordered w-full"
                    placeholder="0.00"
                    {...register('combustible_valor', { valueAsNumber: true })}
                  />
                </label>
              </div>

              {/* Seguridad */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Seguridad</span>
                </label>
                <label className="input-group">
                  <span>$</span>
                  <input
                    type="number"
                    step="0.01"
                    className="input input-bordered w-full"
                    placeholder="0.00"
                    {...register('seguridad_valor', { valueAsNumber: true })}
                  />
                </label>
              </div>

              {/* Tarifa Rate */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Tarifa Rate</span>
                </label>
                <label className="input-group">
                  <span>$</span>
                  <input
                    type="number"
                    step="0.01"
                    className="input input-bordered w-full"
                    placeholder="0.00"
                    {...register('tarifa_rate', { valueAsNumber: true })}
                  />
                </label>
              </div>

              {/* Char Weight */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Char Weight</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  className="input input-bordered w-full"
                  placeholder="0.00"
                  {...register('char_weight', { valueAsNumber: true })}
                />
              </div>

              {/* Otros Valor */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Otros</span>
                </label>
                <label className="input-group">
                  <span>$</span>
                  <input
                    type="number"
                    step="0.01"
                    className="input input-bordered w-full"
                    placeholder="0.00"
                    {...register('otros_valor', { valueAsNumber: true })}
                  />
                </label>
              </div>
            </div>

            <div className="divider text-sm opacity-70">Valores Adicionales</div>

            <div className="grid md:grid-cols-3 gap-4">
              {/* Form A */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Form A</span>
                </label>
                <label className="input-group">
                  <span>$</span>
                  <input
                    type="number"
                    step="0.01"
                    className="input input-bordered w-full"
                    placeholder="0.00"
                    {...register('form_a', { valueAsNumber: true })}
                  />
                </label>
              </div>

              {/* Transport */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Transport</span>
                </label>
                <label className="input-group">
                  <span>$</span>
                  <input
                    type="number"
                    step="0.01"
                    className="input input-bordered w-full"
                    placeholder="0.00"
                    {...register('transport', { valueAsNumber: true })}
                  />
                </label>
              </div>

              {/* PCA */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">PCA</span>
                </label>
                <label className="input-group">
                  <span>$</span>
                  <input
                    type="number"
                    step="0.01"
                    className="input input-bordered w-full"
                    placeholder="0.00"
                    {...register('pca', { valueAsNumber: true })}
                  />
                </label>
              </div>

              {/* Fitos */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Fitos</span>
                </label>
                <label className="input-group">
                  <span>$</span>
                  <input
                    type="number"
                    step="0.01"
                    className="input input-bordered w-full"
                    placeholder="0.00"
                    {...register('fitos', { valueAsNumber: true })}
                  />
                </label>
              </div>

              {/* Termografo */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Termógrafo</span>
                </label>
                <label className="input-group">
                  <span>$</span>
                  <input
                    type="number"
                    step="0.01"
                    className="input input-bordered w-full"
                    placeholder="0.00"
                    {...register('termografo', { valueAsNumber: true })}
                  />
                </label>
              </div>

              {/* MCA */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">MCA</span>
                </label>
                <label className="input-group">
                  <span>$</span>
                  <input
                    type="number"
                    step="0.01"
                    className="input input-bordered w-full"
                    placeholder="0.00"
                    {...register('mca', { valueAsNumber: true })}
                  />
                </label>
              </div>
            </div>

            <div className="flex justify-between mt-6">
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setActiveTab('details')}
              >
                <AppIcons.ChevronLeft className="w-4 h-4 mr-1" />
                Volver a Detalles
              </button>

              <button
                type="submit"
                className={`btn btn-primary w-32 ${isLoading ? 'loading' : ''}`}
                disabled={isLoading || catalogsLoading}
              >
                {isLoading ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mensaje si no hay aerolíneas en absoluto */}
      {aerolineas.length === 0 && (
        <div className="alert alert-warning shadow-lg">
          <AppIcons.Warning className="w-6 h-6" />
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
    </form>
  );
};

export default DocumentForm;