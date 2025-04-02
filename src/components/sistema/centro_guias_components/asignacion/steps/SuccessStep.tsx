// src/components/sistema/centro_guias_components/steps/SuccessStep.tsx
import React from 'react';
import { AppIcons } from '@/utils/icons';
import { Card, CardContent } from '@/components/sistema/common/ui/card';

interface SuccessStepProps {
    title?: string;
    message?: string;
    onReset?: () => void;
    onViewDocuments?: () => void;
    onPrint?: () => void;
    showPrintOption?: boolean;
}

export const SuccessStep: React.FC<SuccessStepProps> = ({
    title = '¡Asignación Completada!',
    message = 'Las guías hijas han sido asignadas correctamente a las fincas seleccionadas.',
    onReset,
    onViewDocuments,
    onPrint,
    showPrintOption = false
}) => {
    return (
        <Card className="bg-base-100 shadow-lg">
            <CardContent className="flex flex-col items-center py-8">
                <div className="text-success mb-4">
                    <AppIcons.CheckCircle className="w-16 h-16" />
                </div>
                <h2 className="text-2xl font-bold mb-2">{title}</h2>
                <p className="text-center mb-6">
                    {message}
                </p>
                <div className="flex flex-col sm:flex-row gap-2">
                    {onReset && (
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={onReset}
                        >
                            <AppIcons.Add className="w-4 h-4 mr-1" />
                            Nueva Asignación
                        </button>
                    )}

                    {onViewDocuments && (
                        <button
                            type="button"
                            className="btn btn-outline"
                            onClick={onViewDocuments}
                        >
                            <AppIcons.Document className="w-4 h-4 mr-1" />
                            Ver Documentos
                        </button>
                    )}

                    {showPrintOption && onPrint && (
                        <button
                            type="button"
                            className="btn btn-outline"
                            onClick={onPrint}
                        >
                            <AppIcons.Print className="w-4 h-4 mr-1" />
                            Imprimir Guías
                        </button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};