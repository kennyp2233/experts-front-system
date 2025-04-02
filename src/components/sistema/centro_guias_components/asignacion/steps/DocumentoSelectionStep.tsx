// src/components/sistema/centro_guias_components/steps/DocumentoSelectionStep.tsx
import React from 'react';
import { Controller, UseFormReturn } from 'react-hook-form';
import { AppIcons } from '@/utils/icons';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/sistema/common/ui/card';
import { FincasSelector } from '../common/FincasSelector';

interface DocumentoSelectionStepProps {
    coordinaciones?: any[];
    fields?: any[];
    error?: string | null;
    loading?: boolean;
    methods?: UseFormReturn<any>;
    fincas?: any[];
    fincaSearchTerm?: string;
    setFincaSearchTerm?: (term: string) => void;
    handleToggleFinca?: (fincaId: number) => void;
    handleToggleAllFincas?: () => void;
    onContinue?: () => void;
}

export const DocumentoSelectionStep: React.FC<DocumentoSelectionStepProps> = ({
    coordinaciones = [],
    fields = [],
    error,
    loading = false,
    methods,
    fincas = [],
    fincaSearchTerm = '',
    setFincaSearchTerm,
    handleToggleFinca,
    handleToggleAllFincas,
    onContinue
}) => {
    // Si no hay métodos del formulario, mostrar un componente básico
    if (!methods) return <div>No se pudo cargar el formulario</div>;

    const { control, watch } = methods;
    const watchDocumentoId = watch("documentoCoordinacionId");

    return (
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
                                        <option key={coo.id} value={coo.id}>
                                            {coo.label}
                                        </option>
                                    ))}
                                </select>
                            )}
                        />
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
                                        {/* Aquí iría la lista de productos */}
                                    </select>
                                )}
                            />
                        </div>
                    )}

                    {/* Componente reutilizable para selección de fincas */}
                    {watchDocumentoId && (
                        <FincasSelector
                            fincas={fincas}
                            selectedFincas={fields.map(f => f.fincaId)}
                            searchTerm={fincaSearchTerm}
                            onSearchChange={setFincaSearchTerm}
                            onToggleFinca={handleToggleFinca}
                            onToggleAll={handleToggleAllFincas}
                            loading={loading}
                        />
                    )}
                </div>
            </CardContent>

            <CardFooter className="justify-end">
                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={onContinue}
                    disabled={loading || !watchDocumentoId || fields.length === 0}
                >
                    Continuar <AppIcons.ChevronRight className="w-4 h-4 ml-1" />
                </button>
            </CardFooter>
        </Card>
    );
};