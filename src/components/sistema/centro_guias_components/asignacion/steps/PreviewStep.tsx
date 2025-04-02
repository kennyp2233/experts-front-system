// src/components/sistema/centro_guias_components/steps/PreviewStep.tsx
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { AppIcons } from '@/utils/icons';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/sistema/common/ui/card';
import { AsignacionesTable } from '../tables/AsignacionesTable';

interface PreviewStepProps {
    previewResults: any | null;
    error?: string | null;
    fincas?: any[];
    productos?: any[];
    coordinaciones?: any[];
    methods?: UseFormReturn<any>;
    onBack?: () => void;
    onConfirm?: () => void;
    submitting?: boolean;
}

export const PreviewStep: React.FC<PreviewStepProps> = ({
    previewResults,
    error,
    fincas = [],
    productos = [],
    coordinaciones = [],
    methods,
    onBack,
    onConfirm,
    submitting = false
}) => {
    // Si no hay resultados de previsualización, mostrar un mensaje o cargar
    if (!previewResults) {
        return (
            <Card className="bg-base-100 shadow-lg">
                <CardContent className="flex justify-center py-8">
                    <span className="loading loading-spinner loading-lg"></span>
                </CardContent>
            </Card>
        );
    }

    const coordinacionId = methods?.getValues("documentoCoordinacionId");
    const coordinacionLabel = coordinaciones.find(c => c.id === Number(coordinacionId))?.label || `Documento #${coordinacionId}`;

    return (
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
                        <span className="font-bold">Documento de Coordinación:</span> {coordinacionLabel}
                        <br />
                        <span className="font-bold">Fincas seleccionadas:</span> {previewResults.asignacionesExistentes?.length + previewResults.nuevasAsignaciones?.length || 0}
                        <br />
                        <span className="font-bold">Próximo secuencial:</span> {previewResults.proximo || 'No disponible'}
                    </div>
                </div>

                {/* Asignaciones nuevas */}
                <div className="mb-6">
                    <h3 className="font-bold text-success flex items-center mb-2">
                        <AppIcons.Check className="w-5 h-5 mr-2" />
                        Nuevas asignaciones ({previewResults.nuevasAsignaciones?.length || 0})
                    </h3>

                    <AsignacionesTable
                        nuevasAsignaciones={previewResults.nuevasAsignaciones || []}
                        fincas={fincas}
                        productos={productos}
                        tipo="nuevas"
                    />
                </div>

                {/* Asignaciones existentes */}
                <div className="mb-6">
                    <h3 className="font-bold text-warning flex items-center mb-2">
                        <AppIcons.Info className="w-5 h-5 mr-2" />
                        Asignaciones existentes ({previewResults.asignacionesExistentes?.length || 0})
                    </h3>

                    <AsignacionesTable
                        asignacionesExistentes={previewResults.asignacionesExistentes || []}
                        fincas={fincas}
                        productos={productos}
                        tipo="existentes"
                    />
                </div>

                {previewResults.nuevasAsignaciones?.length === 0 && previewResults.asignacionesExistentes?.length === 0 && (
                    <div className="alert alert-warning">
                        <AppIcons.Warning className="w-6 h-6" />
                        <span>No hay asignaciones para procesar. Verifique la configuración.</span>
                    </div>
                )}
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
                    onClick={onConfirm}
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
};