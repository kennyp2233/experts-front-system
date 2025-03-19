import React, { useState, useEffect } from 'react';
import { fincasService } from '@/api/services/mantenimiento/fincasService';
import { coordinacionesService } from '@/api/services/documentos/coordinacionesService';
import { guiasHijasService } from '@/api/services/documentos/guiasHijasService';
import { dispatchMenssage } from '@/utils/menssageDispatcher';
import { AppIcons } from '@/utils/icons';

interface AsignacionData {
    id_documento_coordinacion: number;
    id_finca: number;
}

export default function AsignacionGuiasHijas() {
    // Estados
    const [fincas, setFincas] = useState<any[]>([]);
    const [coordinaciones, setCoordinaciones] = useState<any[]>([]);
    const [selectedCoordinacion, setSelectedCoordinacion] = useState<number | null>(null);
    const [selectedFincas, setSelectedFincas] = useState<number[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [validating, setValidating] = useState<boolean>(false);
    const [previewResults, setPreviewResults] = useState<any | null>(null);
    const [step, setStep] = useState<'selection' | 'preview' | 'success'>('selection');

    // Cargar catálogos
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [fincasData, coordsData] = await Promise.all([
                    fincasService.getFincas(),
                    coordinacionesService.getDocuments(1, 100)
                ]);

                setFincas(fincasData);
                setCoordinaciones(coordsData.data);
            } catch (error) {
                console.error('Error al cargar datos:', error);
                dispatchMenssage('error', 'Error al cargar datos');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Manejar selección de fincas
    const handleFincaSelect = (fincaId: number) => {
        setSelectedFincas(prev => {
            if (prev.includes(fincaId)) {
                return prev.filter(id => id !== fincaId);
            } else {
                return [...prev, fincaId];
            }
        });
    };

    // Manejar selección de coordinación
    const handleCoordinacionSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const value = parseInt(event.target.value);
        setSelectedCoordinacion(isNaN(value) ? null : value);
    };

    // Función para previsualizar asignaciones
    const handlePreviewAsignaciones = async () => {
        if (!selectedCoordinacion || selectedFincas.length === 0) {
            dispatchMenssage('error', 'Seleccione una coordinación y al menos una finca');
            return;
        }

        setValidating(true);

        try {
            // Preparar datos para prevalidación
            const asignaciones: AsignacionData[] = selectedFincas.map(fincaId => ({
                id_documento_coordinacion: selectedCoordinacion,
                id_finca: fincaId
            }));

            // Llamar a la API de prevalidación
            const resultados = await guiasHijasService.prevalidarAsignaciones(asignaciones);

            setPreviewResults(resultados);
            setStep('preview');
        } catch (error) {
            console.error('Error al prevalidar asignaciones:', error);
            dispatchMenssage('error', 'Error al prevalidar asignaciones');
        } finally {
            setValidating(false);
        }
    };

    // Función para confirmar asignaciones
    const handleConfirmAsignaciones = async () => {
        if (!previewResults) return;

        setLoading(true);

        try {
            // Confirmar todas las asignaciones (nuevas y existentes)
            const resultado = await guiasHijasService.confirmarAsignaciones([
                ...(previewResults.asignacionesExistentes || []),
                ...(previewResults.nuevasAsignaciones || [])
            ]);

            dispatchMenssage('success', `Se han asignado ${resultado.asignadas || 0} guías hijas correctamente`);
            setStep('success');

            // Limpiar selecciones
            setSelectedCoordinacion(null);
            setSelectedFincas([]);
            setPreviewResults(null);
        } catch (error) {
            console.error('Error al confirmar asignaciones:', error);
            dispatchMenssage('error', 'Error al confirmar asignaciones');
        } finally {
            setLoading(false);
        }
    };

    // Función para reiniciar el proceso
    const handleReset = () => {
        setSelectedCoordinacion(null);
        setSelectedFincas([]);
        setPreviewResults(null);
        setStep('selection');
    };

    // Renderizar pantalla de selección
    if (step === 'selection') {
        return (
            <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                    <h2 className="card-title">Asignación de Guías Hijas</h2>
                    <p className="text-sm opacity-70 mb-4">
                        Seleccione un documento de coordinación (COO) y las fincas a las que desea asignar guías hijas.
                    </p>

                    {loading ? (
                        <div className="flex justify-center py-4">
                            <span className="loading loading-spinner loading-lg"></span>
                        </div>
                    ) : (
                        <>
                            <div className="form-control mb-4">
                                <label className="label">
                                    <span className="label-text font-medium">Documento de Coordinación (COO)</span>
                                </label>
                                <select
                                    className="select select-bordered w-full"
                                    value={selectedCoordinacion || ''}
                                    onChange={handleCoordinacionSelect}
                                >
                                    <option value="">Seleccionar documento...</option>
                                    {coordinaciones.map(coo => (
                                        <option key={coo.id} value={coo.id}>
                                            COO-{coo.id.toString().padStart(7, '0')}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {selectedCoordinacion && (
                                <>
                                    <div className="divider">Selección de Fincas</div>

                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text font-medium">Fincas Disponibles</span>
                                            <span className="label-text-alt">
                                                {selectedFincas.length} seleccionadas
                                            </span>
                                        </label>

                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mt-2 max-h-80 overflow-y-auto p-2">
                                            {fincas.map(finca => (
                                                <div
                                                    key={finca.id_finca}
                                                    className={`border rounded-lg p-2 cursor-pointer hover:bg-base-200 transition-colors ${selectedFincas.includes(finca.id_finca) ? 'bg-primary/10 border-primary' : ''
                                                        }`}
                                                    onClick={() => handleFincaSelect(finca.id_finca)}
                                                >
                                                    <div className="flex items-center">
                                                        <input
                                                            type="checkbox"
                                                            className="checkbox checkbox-primary mr-2"
                                                            checked={selectedFincas.includes(finca.id_finca)}
                                                            onChange={() => { }} // Manejado por el onClick del div padre
                                                        />
                                                        <div>
                                                            <p className="font-medium">{finca.nombre}</p>
                                                            <p className="text-xs opacity-70">{finca.codigo || 'Sin código'}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="card-actions justify-end mt-4">
                                        <button
                                            className="btn btn-primary"
                                            onClick={handlePreviewAsignaciones}
                                            disabled={selectedFincas.length === 0 || validating}
                                        >
                                            {validating ? (
                                                <>
                                                    <span className="loading loading-spinner loading-sm"></span>
                                                    Verificando...
                                                </>
                                            ) : (
                                                <>Previsualizar Asignaciones</>
                                            )}
                                        </button>
                                    </div>
                                </>
                            )}
                        </>
                    )}
                </div>
            </div>
        );
    }

    // Renderizar pantalla de previsualización
    if (step === 'preview' && previewResults) {
        return (
            <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                    <h2 className="card-title">Previsualización de Asignaciones</h2>

                    <p className="text-sm opacity-70 mb-4">
                        Revise las asignaciones antes de confirmar.
                    </p>

                    {/* Asignaciones existentes */}
                    {previewResults.asignacionesExistentes && previewResults.asignacionesExistentes.length > 0 && (
                        <div className="mt-4">
                            <h3 className="font-bold text-warning flex items-center">
                                <AppIcons.Info className="w-5 h-5 mr-2" />
                                Asignaciones existentes ({previewResults.asignacionesExistentes.length})
                            </h3>
                            <div className="overflow-x-auto">
                                <table className="table table-zebra w-full mt-2">
                                    <thead>
                                        <tr>
                                            <th>Finca</th>
                                            <th>Guía Hija</th>
                                            <th>Estado</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {previewResults.asignacionesExistentes.map((asignacion: any, index: number) => (
                                            <tr key={index}>
                                                <td>{fincas.find(f => f.id_finca === asignacion.id_finca)?.nombre || 'Desconocida'}</td>
                                                <td>{asignacion.numero_guia_hija || `${asignacion.anio}-${asignacion.secuencial}`}</td>
                                                <td><span className="badge badge-warning">Ya asignada</span></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Nuevas asignaciones */}
                    {previewResults.nuevasAsignaciones && previewResults.nuevasAsignaciones.length > 0 && (
                        <div className="mt-4">
                            <h3 className="font-bold text-success flex items-center">
                                <AppIcons.Check className="w-5 h-5 mr-2" />
                                Nuevas asignaciones ({previewResults.nuevasAsignaciones.length})
                            </h3>
                            <div className="overflow-x-auto">
                                <table className="table table-zebra w-full mt-2">
                                    <thead>
                                        <tr>
                                            <th>Finca</th>
                                            <th>Guía Hija (Propuesta)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {previewResults.nuevasAsignaciones.map((asignacion: any, index: number) => (
                                            <tr key={index}>
                                                <td>{fincas.find(f => f.id_finca === asignacion.id_finca)?.nombre || 'Desconocida'}</td>
                                                <td>{`${asignacion.anio}-${asignacion.secuencial}`}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    <div className="card-actions justify-end mt-6">
                        <button
                            className="btn btn-outline"
                            onClick={handleReset}
                            disabled={loading}
                        >
                            Cancelar
                        </button>
                        <button
                            className="btn btn-primary"
                            onClick={handleConfirmAsignaciones}
                            disabled={!previewResults.nuevasAsignaciones?.length || loading}
                        >
                            {loading ? (
                                <>
                                    <span className="loading loading-spinner loading-sm"></span>
                                    Confirmando...
                                </>
                            ) : (
                                <>Confirmar Asignaciones</>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Renderizar pantalla de éxito
    if (step === 'success') {
        return (
            <div className="card bg-base-100 shadow-xl">
                <div className="card-body items-center text-center">
                    <div className="mb-4 text-success">
                        <AppIcons.CheckCircle className="w-16 h-16 mx-auto" />
                    </div>
                    <h2 className="card-title">¡Asignación Completada!</h2>
                    <p>Las guías hijas han sido asignadas correctamente.</p>
                    <div className="card-actions justify-center mt-6">
                        <button
                            className="btn btn-primary"
                            onClick={handleReset}
                        >
                            Realizar Nueva Asignación
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return null;
}