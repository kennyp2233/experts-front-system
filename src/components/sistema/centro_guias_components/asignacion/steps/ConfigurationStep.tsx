// src/components/sistema/centro_guias_components/steps/ConfigurationStep.tsx
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { AppIcons } from '@/utils/icons';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/sistema/common/ui/card';
import { CantidadesConfiguration } from '../common/CantidadesConfiguration';

interface ConfigurationStepProps {
    fields?: any[];
    error?: string | null;
    productos?: any[];
    methods?: UseFormReturn<any>;
    handleApplyProductToAll?: () => void;
    handleApplyCantidadesToAll?: (values: any) => void;
    onBack?: () => void;
    onPreview?: () => void;
    submitting?: boolean;
}

export const ConfigurationStep: React.FC<ConfigurationStepProps> = ({
    fields = [],
    error,
    productos = [],
    methods,
    handleApplyProductToAll,
    handleApplyCantidadesToAll,
    onBack,
    onPreview,
    submitting = false
}) => {
    // Si no hay métodos del formulario, mostrar un componente básico
    if (!methods) return <div>No se pudo cargar el formulario</div>;

    const { control, watch, register, formState: { errors } } = methods;
    const watchDefaultProductoId = watch("defaultProductoId");

    return (
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

                <div className="space-y-6">
                    <div className="mb-6">
                        <h3 className="font-bold mb-2">Configuración Global</h3>
                        <div className="flex flex-col md:flex-row gap-4 mb-4">
                            <div className="form-control flex-1">
                                <label className="label">
                                    <span className="label-text">Producto</span>
                                </label>
                                <div className="flex gap-2">
                                    <select
                                        {...register("defaultProductoId")}
                                        className="select select-bordered flex-1"
                                    >
                                        <option value="">Seleccionar producto...</option>
                                        {productos.map((producto) => (
                                            <option key={producto.id_producto} value={producto.id_producto.toString()}>
                                                {producto.nombre}
                                            </option>
                                        ))}
                                    </select>
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

                        {/* Componente reutilizable para configurar cantidades */}
                        <CantidadesConfiguration
                            onApply={handleApplyCantidadesToAll || (() => { })}
                        />
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
                                        {fields.map((field, index) => (
                                            <tr key={field.id || index}>
                                                <td>{field.fincaNombre || `Finca ${field.fincaId}`}</td>
                                                <td>
                                                    <select
                                                        {...register(`asignaciones.${index}.productoId`)}
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
                                                        {...register(`asignaciones.${index}.fulls`)}
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        type="number"
                                                        className="input input-bordered input-sm w-20"
                                                        min="0"
                                                        placeholder="0"
                                                        {...register(`asignaciones.${index}.pcs`)}
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        type="number"
                                                        className="input input-bordered input-sm w-20"
                                                        min="0"
                                                        step="0.1"
                                                        placeholder="0"
                                                        {...register(`asignaciones.${index}.kgs`)}
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        type="number"
                                                        className="input input-bordered input-sm w-20"
                                                        min="0"
                                                        placeholder="0"
                                                        {...register(`asignaciones.${index}.stems`)}
                                                    />
                                                </td>
                                                <td>
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-error btn-outline"
                                                        onClick={() => {
                                                            if (methods.getValues) {
                                                                const currentValues = methods.getValues();
                                                                const newAsignaciones = [...currentValues.asignaciones];
                                                                newAsignaciones.splice(index, 1);
                                                                methods.setValue("asignaciones", newAsignaciones);
                                                            }
                                                        }}
                                                    >
                                                        <AppIcons.Delete className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </CardContent>
            <CardFooter className="justify-between">
                <button
                    type="button"
                    className="btn btn-outline"
                    onClick={onBack}
                    disabled={submitting}
                >
                    <AppIcons.ChevronLeft className="w-4 h-4 mr-1" />
                    Volver
                </button>
                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={onPreview}
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
};