// src/app/sistema/dashboard/modulos/documentos/centro_guias/components/CoordinacionMasiva.tsx
import React, { useState, useEffect } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { coordinacionesService } from "@/api/services/documentos/coordinacionesService";
import { fincasService } from "@/api/services/mantenimiento/fincasService";
import { productosService } from "@/api/services/mantenimiento/productosService";
import { guiasHijasService } from "@/api/services/documentos/guiasHijasService";
import { dispatchMenssage } from "@/utils/menssageDispatcher";
import { AppIcons } from "@/utils/icons";

// Componente de UI
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/ui/card';
import { useRouter } from "next/navigation";

// Schema de validación
const schema = yup.object({
  documentoCoordinacionId: yup.number().required("Seleccione un documento de coordinación"),
  defaultProductoId: yup.string().nullable(),
  asignaciones: yup.array().of(
    yup.object({
      fincaId: yup.number().required("Finca requerida"),
      productoId: yup.mixed().nullable().transform(value => value === '' ? null : Number(value)),
      fulls: yup.number().nullable().transform(value => isNaN(value) || value === '' ? null : Number(value)),
      pcs: yup.number().nullable().transform(value => isNaN(value) || value === '' ? null : Number(value)),
      kgs: yup.number().nullable().transform(value => isNaN(value) || value === '' ? null : Number(value)),
      stems: yup.number().nullable().transform(value => isNaN(value) || value === '' ? null : Number(value)),
      selected: yup.boolean().default(true)
    })
  )
}).required();

export default function CoordinacionMasiva() {
  // Estados
  const [coordinaciones, setCoordinaciones] = useState<any[]>([]);
  const [fincas, setFincas] = useState<any[]>([]);
  const [productos, setProductos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState<'selection' | 'configuration' | 'preview' | 'success'>('selection');
  const [fincaSearchTerm, setFincaSearchTerm] = useState("");
  const [filteredFincas, setFilteredFincas] = useState<any[]>([]);
  const [previewResults, setPreviewResults] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Configurar React Hook Form
  const { control, handleSubmit, watch, setValue, register, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      documentoCoordinacionId: 0,
      defaultProductoId: '',
      asignaciones: []
    }
  });

  const router = useRouter();
  // Ver valores actuales
  const watchDocumentoId = watch("documentoCoordinacionId");
  const watchDefaultProductoId = watch("defaultProductoId");
  const watchAsignaciones = watch("asignaciones");

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
        // Cargar coordinaciones disponibles
        const coordsResponse = await coordinacionesService.getDocuments(1, 50);
        const coordsData = coordsResponse.data.map((coo) => ({
          id: coo.id,
          label: `COO-${coo.id.toString().padStart(7, '0')}`,
          producto: coo.id_producto
        }));
        setCoordinaciones(coordsData);

        // Cargar fincas
        const fincasData = await fincasService.getFincas();
        setFincas(fincasData);
        setFilteredFincas(fincasData);

        // Cargar productos
        const productosData = await productosService.getProductos();
        setProductos(productosData);
      } catch (error) {
        console.error("Error al cargar datos:", error);
        dispatchMenssage("error", "Error al cargar datos iniciales");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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

  // Cuando cambia el documento de coordinación seleccionado
  useEffect(() => {
    if (watchDocumentoId) {
      // Buscar el producto por defecto del documento seleccionado
      const selectedDoc = coordinaciones.find(coo => coo.id === Number(watchDocumentoId));
      if (selectedDoc && selectedDoc.producto) {
        setValue("defaultProductoId", selectedDoc.producto.toString());
      } else {
        setValue("defaultProductoId", '');
      }
    }
  }, [watchDocumentoId, coordinaciones, setValue]);

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
          productoId: watchDefaultProductoId || null,
          fulls: null,
          pcs: null,
          kgs: null,
          stems: null,
          selected: true
        });
      }
    }
  };

  // Pasar al paso de configuración
  const handleContinueToConfiguration = () => {
    if (!watchDocumentoId) {
      setError("Debe seleccionar un documento de coordinación");
      return;
    }

    if (fields.length === 0) {
      setError("Debe seleccionar al menos una finca");
      return;
    }

    setError(null);
    setStep('configuration');
  };

  // Aplicar producto a todas las fincas seleccionadas
  const handleApplyProductToAll = () => {
    if (!watchDefaultProductoId) return;

    const updatedAsignaciones = fields.map(field => ({
      ...field,
      productoId: watchDefaultProductoId
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

  // Validar y previsualizar asignaciones
  const handlePreview = async () => {
    if (fields.length === 0) {
      setError("Debe seleccionar al menos una finca");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      // Preparar datos para pre-validación
      const asignaciones: any = fields.map(field => ({
        id_documento_coordinacion: Number(watchDocumentoId),
        id_finca: field.fincaId,
        id_producto: field.productoId,
        fulls: field.fulls,
        pcs: field.pcs,
        kgs: field.kgs,
        stems: field.stems
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
      setSubmitting(false);
    }
  };

  // Confirmar asignaciones
  const handleConfirm = async () => {
    if (!previewResults) return;

    setSubmitting(true);

    try {
      // Confirmar todas las asignaciones (nuevas y existentes)
      const resultado = await guiasHijasService.confirmarAsignaciones([
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

  // Reiniciar el formulario
  const handleReset = () => {
    setValue("documentoCoordinacionId", 0);
    setValue("defaultProductoId", "");
    setValue("asignaciones", []);
    setPreviewResults(null);
    setError(null);
    setStep('selection');
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
            productoId: watchDefaultProductoId || null,
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

  //... [El código anterior permanece igual, continuamos donde se quedó]

  // Renderizar el paso de selección
  const renderSelectionStep = () => (
    <Card className="bg-base-100 shadow-lg">
      <CardHeader>
        <CardTitle>Asignación Masiva de Guías Hijas</CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="alert alert-error mb-4">
            <AppIcons.Error className="w-6 h-6" />
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-6">
          {/* Selección de documento */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Documento de Coordinación</span>
            </label>
            <Controller
              name="documentoCoordinacionId"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  className="select select-bordered w-full"
                  disabled={loading}
                >
                  <option value="">Seleccionar...</option>
                  {coordinaciones.map((coo) => (
                    <option key={coo.id} value={coo.id.toString()}>
                      {coo.label}
                    </option>
                  ))}
                </select>
              )}
            />
            {errors.documentoCoordinacionId && (
              <span className="text-error text-sm mt-1">
                {errors.documentoCoordinacionId.message?.toString()}
              </span>
            )}
          </div>

          {/* Selección de producto por defecto (opcional) */}
          {watchDocumentoId && (
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Producto por Defecto (opcional)</span>
              </label>
              <Controller
                name="defaultProductoId"
                control={control}
                render={({ field }) => (
                  <select
                    {...field}
                    className="select select-bordered w-full"
                    disabled={loading}
                  >
                    <option value="">Seleccionar producto...</option>
                    {productos.map((producto) => (
                      <option key={producto.id_producto} value={producto.id_producto.toString()}>
                        {producto.nombre}
                      </option>
                    ))}
                  </select>
                )}
              />
            </div>
          )}

          {/* Selección de fincas */}
          {watchDocumentoId && (
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="label-text font-medium">Selección de Fincas</label>
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
          )}
        </div>
      </CardContent>

      <CardFooter className="justify-end">
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleContinueToConfiguration}
          disabled={loading || !watchDocumentoId || fields.length === 0}
        >
          Continuar <AppIcons.ChevronRight className="w-4 h-4 ml-1" />
        </button>
      </CardFooter>
    </Card>
  );

  // Renderizar el paso de configuración
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
                <span className="label-text">Producto</span>
              </label>
              <div className="flex gap-2">
                <Controller
                  name="defaultProductoId"
                  control={control}
                  render={({ field }) => (
                    <select
                      {...field}
                      className="select select-bordered flex-1"
                    >
                      <option value="">Seleccionar producto...</option>
                      {productos.map((producto) => (
                        <option key={producto.id_producto} value={producto.id_producto.toString()}>
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
                  disabled={!watchDefaultProductoId}
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

        <div className="divider">Fincas Seleccionadas ({fields.length})</div>

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
                          >
                            <option value="">Sin producto</option>
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
      </CardContent>
      <CardFooter className="justify-between">
        <button
          type="button"
          className="btn btn-outline"
          onClick={() => setStep('selection')}
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

  // Renderizar el paso de previsualización
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
            <span className="font-bold">Documento de Coordinación:</span> {
              coordinaciones.find(c => c.id === Number(watchDocumentoId))?.label
            }
            <br />
            <span className="font-bold">Fincas seleccionadas:</span> {fields.length}
            <br />
            {watchDefaultProductoId && (
              <>
                <span className="font-bold">Producto por defecto:</span> {
                  productos.find(p => p.id_producto === Number(watchDefaultProductoId))?.nombre
                }
                <br />
              </>
            )}
          </div>
        </div>

        {!previewResults && (
          <div className="flex justify-center py-8">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        )}

        {previewResults && (
          <>
            {/* Nuevas asignaciones */}
            <div className="mb-6">
              <h3 className="font-bold text-success flex items-center mb-2">
                <AppIcons.Check className="w-5 h-5 mr-2" />
                Nuevas asignaciones ({previewResults.nuevasAsignaciones?.length || 0})
              </h3>

              {previewResults.nuevasAsignaciones?.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="table table-zebra w-full">
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
                          <td className="font-mono">{`${asignacion.anio}-${asignacion.secuencial}`}</td>
                          <td>
                            {productos.find(p => p.id_producto === asignacion.id_producto)?.nombre || 'No especificado'}
                          </td>
                          <td className="text-xs">
                            <div className="flex flex-wrap gap-2">
                              {asignacion.fulls > 0 && (
                                <span className="badge badge-info">Fulls: {asignacion.fulls}</span>
                              )}
                              {asignacion.pcs > 0 && (
                                <span className="badge badge-info">Pcs: {asignacion.pcs}</span>
                              )}
                              {asignacion.kgs > 0 && (
                                <span className="badge badge-info">Kgs: {asignacion.kgs}</span>
                              )}
                              {asignacion.stems > 0 && (
                                <span className="badge badge-info">Stems: {asignacion.stems}</span>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="alert alert-info">
                  <span>No hay nuevas asignaciones para crear.</span>
                </div>
              )}
            </div>

            {/* Asignaciones existentes */}
            <div className="mb-6">
              <h3 className="font-bold text-warning flex items-center mb-2">
                <AppIcons.Info className="w-5 h-5 mr-2" />
                Asignaciones existentes ({previewResults.asignacionesExistentes?.length || 0})
              </h3>

              {previewResults.asignacionesExistentes?.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="table table-zebra w-full">
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
                          <td className="font-mono">{asignacion.numero_guia_hija || `${asignacion.anio}-${asignacion.secuencial}`}</td>
                          <td>
                            {productos.find(p => p.id_producto === asignacion.id_producto)?.nombre || 'No especificado'}
                          </td>
                          <td className="text-xs">
                            <div className="flex flex-wrap gap-2">
                              {asignacion.fulls > 0 && (
                                <span className="badge badge-info">Fulls: {asignacion.fulls}</span>
                              )}
                              {asignacion.pcs > 0 && (
                                <span className="badge badge-info">Pcs: {asignacion.pcs}</span>
                              )}
                              {asignacion.kgs > 0 && (
                                <span className="badge badge-info">Kgs: {asignacion.kgs}</span>
                              )}
                              {asignacion.stems > 0 && (
                                <span className="badge badge-info">Stems: {asignacion.stems}</span>
                              )}
                            </div>
                          </td>
                          <td><span className="badge badge-warning">Ya asignada</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="alert alert-info">
                  <span>No hay asignaciones existentes que actualizar.</span>
                </div>
              )}
            </div>

            {previewResults.nuevasAsignaciones?.length === 0 && previewResults.asignacionesExistentes?.length === 0 && (
              <div className="alert alert-warning">
                <AppIcons.Warning className="w-6 h-6" />
                <span>No hay asignaciones para procesar. Verifique la configuración.</span>
              </div>
            )}
          </>
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

  // Renderizar el paso de éxito
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
            onClick={() => router.push('/sistema/dashboard/modulos/documentos/centro_guias?tab=gestor-documentos')}
          >
            Ver Documentos
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

  return renderStep();
}