import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { baseUrl } from '@/api/mantenimiento/config.api';
import { dispatchMenssage } from '@/utils/menssageDispatcher';

interface AsignacionGuiaHijaProps {
    documentoCoordinacionId?: number;
    guiaMadreId?: number;
    onSuccess?: () => void;
    onCancel?: () => void;
}

const AsignacionGuiaHija: React.FC<AsignacionGuiaHijaProps> = ({
    documentoCoordinacionId,
    guiaMadreId,
    onSuccess,
    onCancel
}) => {
    const [loading, setLoading] = useState(false);
    const [fincas, setFincas] = useState<any[]>([]);
    const [asignaciones, setAsignaciones] = useState<any[]>([]);
    const [verificando, setVerificando] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors }
    } = useForm({
        defaultValues: {
            id_documento_coordinacion: documentoCoordinacionId || '',
            id_guia_madre: guiaMadreId || '',
            id_finca: ''
        }
    });

    const selectedFinca = watch('id_finca');

    // Cargar fincas disponibles
    useEffect(() => {
        const fetchFincas = async () => {
            try {
                const response = await axios.get(`${baseUrl}/fincas`);
                setFincas(response.data);
            } catch (error) {
                console.error('Error al cargar fincas:', error);
                dispatchMenssage('error', 'Error al cargar las fincas');
            }
        };

        fetchFincas();
    }, []);

    // Cargar asignaciones existentes
    useEffect(() => {
        const fetchAsignaciones = async () => {
            if (!guiaMadreId) return;

            try {
                const response = await axios.get(`${baseUrl}/guia_hija/guia-madre/${guiaMadreId}`);
                setAsignaciones(response.data);
            } catch (error) {
                console.error('Error al cargar asignaciones:', error);
                dispatchMenssage('error', 'Error al cargar las asignaciones existentes');
            }
        };

        fetchAsignaciones();
    }, [guiaMadreId]);

    // Verificar si ya existe una asignación para la finca seleccionada
    useEffect(() => {
        const verificarAsignacion = async () => {
            if (!selectedFinca || !guiaMadreId) return;

            setVerificando(true);
            try {
                const response = await axios.get(
                    `${baseUrl}/guia_hija/verificar/${selectedFinca}/${guiaMadreId}`
                );

                if (response.data.exists) {
                    dispatchMenssage('info', 'Ya existe una asignación para esta finca');
                }
            } catch (error) {
                console.error('Error al verificar asignación:', error);
            } finally {
                setVerificando(false);
            }
        };

        verificarAsignacion();
    }, [selectedFinca, guiaMadreId]);

    const onSubmit = async (data: any) => {
        setLoading(true);
        try {
            const response = await axios.post(`${baseUrl}/guia_hija/asignar`, data);
            dispatchMenssage('success', 'Asignación creada correctamente');

            if (onSuccess) onSuccess();
        } catch (error: any) {
            const errorMsg = error.response?.data?.msg || 'Error al crear la asignación';
            dispatchMenssage('error', errorMsg);
        } finally {
            setLoading(false);
        }
    };

    // Filtrar fincas que ya tienen asignación
    const fincasDisponibles = fincas.filter(finca =>
        !asignaciones.some(asignacion => asignacion.id_finca === finca.id_finca)
    );

    return (
        <div className="card bg-base-100 shadow-xl p-6">
            <h2 className="text-xl font-semibold mb-4">Asignación de Guía Hija</h2>

            {asignaciones.length > 0 && (
                <div className="mb-4">
                    <h3 className="font-semibold text-lg mb-2">Asignaciones Existentes</h3>
                    <div className="overflow-x-auto">
                        <table className="table w-full">
                            <thead>
                                <tr>
                                    <th>Número de Guía</th>
                                    <th>Finca</th>
                                    <th>Código Finca</th>
                                </tr>
                            </thead>
                            <tbody>
                                {asignaciones.map(asignacion => (
                                    <tr key={asignacion.id}>
                                        <td>{asignacion.numero_guia_hija}</td>
                                        <td>{asignacion.finca?.nombre_finca || 'N/A'}</td>
                                        <td>{asignacion.finca?.codigo_finca || 'N/A'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <input
                    type="hidden"
                    {...register('id_documento_coordinacion', { required: true })}
                />
                <input
                    type="hidden"
                    {...register('id_guia_madre', { required: true })}
                />

                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Finca</span>
                    </label>
                    <select
                        className={`select select-bordered w-full ${errors.id_finca ? 'select-error' : ''}`}
                        {...register('id_finca', { required: "La finca es requerida" })}
                        disabled={verificando || loading}
                    >
                        <option value="">Seleccionar finca</option>
                        {fincasDisponibles.map(finca => (
                            <option key={finca.id_finca} value={finca.id_finca}>
                                {finca.nombre_finca} ({finca.codigo_finca})
                            </option>
                        ))}
                    </select>
                    {errors.id_finca && (
                        <span className="text-error text-sm">{errors.id_finca.message}</span>
                    )}
                    {verificando && <span className="text-info text-sm">Verificando disponibilidad...</span>}

                    {fincasDisponibles.length === 0 && (
                        <div className="alert alert-warning mt-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                            <span>No hay fincas disponibles para asignar</span>
                        </div>
                    )}
                </div>

                <div className="flex justify-end gap-2 mt-4">
                    <button
                        type="button"
                        className="btn btn-outline"
                        onClick={onCancel}
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading || verificando || fincasDisponibles.length === 0}
                    >
                        {loading ? (
                            <>
                                <span className="loading loading-spinner loading-xs"></span>
                                Asignando...
                            </>
                        ) : 'Asignar Guía'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AsignacionGuiaHija;