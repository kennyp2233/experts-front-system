import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { SelectField } from '@/components/common/SelectField';
import { baseUrl } from '@/api/mantenimiento/config.api';
import { dispatchMenssage } from '@/utils/menssageDispatcher';
import axios from 'axios';

interface FormularioCoordinacionProps {
    onSuccess?: () => void;
    initialData?: any;
    isEditing?: boolean;
}

export const FormularioCoordinacion: React.FC<FormularioCoordinacionProps> = ({
    onSuccess,
    initialData,
    isEditing = false
}) => {
    const [aerolineas, setAerolineas] = useState<any[]>([]);
    const [guiasMadre, setGuiasMadre] = useState<any[]>([]);
    const [consignatarios, setConsignatarios] = useState<any[]>([]);
    const [productos, setProductos] = useState<any[]>([]);
    const [agenciasIata, setAgenciasIata] = useState<any[]>([]);
    const [destinos, setDestinos] = useState<any[]>([]);
    const [origenes, setOrigenes] = useState<any[]>([]);
    const [clientes, setClientes] = useState<any[]>([]);
    const [selectedClientes, setSelectedClientes] = useState<number[]>([]);
    const [loading, setLoading] = useState(true);
    const [fetchingGuias, setFetchingGuias] = useState(false);

    const {
        register,
        handleSubmit,
        control,
        setValue,
        watch,
        reset,
        formState: { errors }
    } = useForm({
        defaultValues: initialData || {
            id_guia_madre: '',
            id_consignatario: '',
            id_producto: '',
            id_agencia_iata: '',
            id_destino_awb: '',
            id_destino_final_docs: '',
            pago: 'PREPAID',
            fecha_vuelo: new Date().toISOString().split('T')[0],
            fecha_asignacion: new Date().toISOString().split('T')[0],
            busqueda_guias_madres: ''
        }
    });

    const selectedAerolinea = watch('busqueda_guias_madres');
    const selectedConsignatario = watch('id_consignatario');

    // Cargar catálogos al iniciar
    useEffect(() => {
        const fetchCatalogos = async () => {
            setLoading(true);
            try {
                const [
                    aerolineasRes,
                    consignatariosRes,
                    productosRes,
                    agenciasRes,
                    destinosRes,
                    origenesRes,
                    clientesRes
                ] = await Promise.all([
                    axios.get(`${baseUrl}/asignacion/aerolineas`),
                    axios.get(`${baseUrl}/consignatariosJoinAll`),
                    axios.get(`${baseUrl}/productos`),
                    axios.get(`${baseUrl}/agencias_iata`),
                    axios.get(`${baseUrl}/destinos`),
                    axios.get(`${baseUrl}/origenes`),
                    axios.get(`${baseUrl}/clientes`)
                ]);

                setAerolineas(aerolineasRes.data);
                setConsignatarios(consignatariosRes.data);
                setProductos(productosRes.data);
                setAgenciasIata(agenciasRes.data);
                setDestinos(destinosRes.data);
                setOrigenes(origenesRes.data);
                setClientes(clientesRes.data);

                // Si estamos editando, cargamos los clientes seleccionados
                if (isEditing && initialData && initialData.coordinacion_clientes) {
                    const clientesIds = initialData.coordinacion_clientes.map(
                        (cliente: any) => cliente.id_cliente
                    );
                    setSelectedClientes(clientesIds);
                }
            } catch (error) {
                console.error('Error al cargar catálogos:', error);
                dispatchMenssage('error', 'Error al cargar los catálogos');
            } finally {
                setLoading(false);
            }
        };

        fetchCatalogos();
    }, [isEditing, initialData]);

    // Cargar guías madre cuando se seleccione una aerolínea
    useEffect(() => {
        const fetchGuiasMadre = async () => {
            if (!selectedAerolinea) return;

            setFetchingGuias(true);
            try {
                const response = await axios.get(`${baseUrl}/guia_madre/aerolinea`, {
                    params: { id: selectedAerolinea }
                });

                setGuiasMadre(response.data);
            } catch (error) {
                console.error('Error al cargar guías madre:', error);
                dispatchMenssage('error', 'Error al cargar las guías madre');
            } finally {
                setFetchingGuias(false);
            }
        };

        fetchGuiasMadre();
    }, [selectedAerolinea]);

    // Añadir automáticamente el consignatario seleccionado a la lista de clientes
    useEffect(() => {
        if (selectedConsignatario) {
            const consignatarioId = parseInt(selectedConsignatario);
            if (!selectedClientes.includes(consignatarioId)) {
                setSelectedClientes(prev => [...prev, consignatarioId]);
            }
        }
    }, [selectedConsignatario]);

    const onSubmit = async (data: any) => {
        // Añadir la lista de clientes seleccionados
        const formData = {
            ...data,
            id_clientes: selectedClientes
        };

        try {
            if (isEditing) {
                await axios.put(`${baseUrl}/asignacion/${initialData.id}`, formData);
                dispatchMenssage('success', 'Documento de coordinación actualizado correctamente');
            } else {
                await axios.post(`${baseUrl}/asignacion`, formData);
                dispatchMenssage('success', 'Documento de coordinación creado correctamente');
                reset();
                setSelectedClientes([]);
            }

            if (onSuccess) onSuccess();
        } catch (error: any) {
            const errorMsg = error.response?.data?.msg || 'Error en la operación';
            dispatchMenssage('error', errorMsg);
        }
    };

    const handleClienteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const clienteId = parseInt(e.target.value);

        if (e.target.checked) {
            setSelectedClientes(prev => [...prev, clienteId]);
        } else {
            // No permitir desmarcar el consignatario seleccionado
            if (clienteId.toString() === selectedConsignatario) {
                e.preventDefault();
                return;
            }
            setSelectedClientes(prev => prev.filter(id => id !== clienteId));
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center p-8">
                <div className="loading loading-spinner loading-lg"></div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="card bg-base-200 shadow-xl p-4">
                <h2 className="text-xl font-semibold mb-4">Información del Documento</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Selección de Aerolínea */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Aerolínea</span>
                        </label>
                        <select
                            className={`select select-bordered w-full ${errors.busqueda_guias_madres ? 'select-error' : ''}`}
                            {...register('busqueda_guias_madres', { required: "La aerolínea es requerida" })}
                            disabled={isEditing}
                        >
                            <option value="">Seleccionar aerolínea</option>
                            {aerolineas.map(aerolinea => (
                                <option key={aerolinea.id_aerolinea} value={aerolinea.id_aerolinea}>
                                    {aerolinea.nombre}
                                </option>
                            ))}
                        </select>
                        {errors.busqueda_guias_madres && (
                            <span className="text-error text-sm">{errors.busqueda_guias_madres.message as string}</span>
                        )}
                    </div>

                    {/* Selección de Guía Madre */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Guía Madre</span>
                        </label>
                        <select
                            className={`select select-bordered w-full ${errors.id_guia_madre ? 'select-error' : ''}`}
                            {...register('id_guia_madre', { required: "La guía madre es requerida" })}
                            disabled={fetchingGuias || !selectedAerolinea || guiasMadre.length === 0 || isEditing}
                        >
                            <option value="">Seleccionar guía madre</option>
                            {guiasMadre.map(guia => (
                                <option key={guia.id} value={guia.id}>
                                    {`${guia.prefijo}-${guia.secuencial}`}
                                </option>
                            ))}
                        </select>
                        {errors.id_guia_madre && (
                            <span className="text-error text-sm">{errors.id_guia_madre.message as string}</span>
                        )}
                        {fetchingGuias && <span className="text-info text-sm">Cargando guías...</span>}
                        {selectedAerolinea && guiasMadre.length === 0 && !fetchingGuias && (
                            <span className="text-warning text-sm">No hay guías madre disponibles</span>
                        )}
                    </div>

                    {/* Selección de Consignatario */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Consignatario</span>
                        </label>
                        <select
                            className={`select select-bordered w-full ${errors.id_consignatario ? 'select-error' : ''}`}
                            {...register('id_consignatario', { required: "El consignatario es requerido" })}
                        >
                            <option value="">Seleccionar consignatario</option>
                            {consignatarios.map(consignatario => (
                                <option key={consignatario.id_consignatario} value={consignatario.id_consignatario}>
                                    {consignatario.nombre_consignatario}
                                </option>
                            ))}
                        </select>
                        {errors.id_consignatario && (
                            <span className="text-error text-sm">{errors.id_consignatario.message as string}</span>
                        )}
                    </div>

                    {/* Selección de Producto */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Tipo de Embarque</span>
                        </label>
                        <select
                            className={`select select-bordered w-full ${errors.id_producto ? 'select-error' : ''}`}
                            {...register('id_producto', { required: "El producto es requerido" })}
                        >
                            <option value="">Seleccionar producto</option>
                            {productos.map(producto => (
                                <option key={producto.id_producto} value={producto.id_producto}>
                                    {producto.nombre}
                                </option>
                            ))}
                        </select>
                        {errors.id_producto && (
                            <span className="text-error text-sm">{errors.id_producto.message as string}</span>
                        )}
                    </div>

                    {/* Selección de Agencia IATA */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Agencia IATA</span>
                        </label>
                        <select
                            className={`select select-bordered w-full ${errors.id_agencia_iata ? 'select-error' : ''}`}
                            {...register('id_agencia_iata', { required: "La agencia IATA es requerida" })}
                        >
                            <option value="">Seleccionar agencia</option>
                            {agenciasIata.map(agencia => (
                                <option key={agencia.id_agencia_iata} value={agencia.id_agencia_iata}>
                                    {agencia.alias_shipper}
                                </option>
                            ))}
                        </select>
                        {errors.id_agencia_iata && (
                            <span className="text-error text-sm">{errors.id_agencia_iata.message as string}</span>
                        )}
                    </div>

                    {/* Selección de Origen */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Origen</span>
                        </label>
                        <select
                            className={`select select-bordered w-full ${errors.id_origen ? 'select-error' : ''}`}
                            {...register('id_origen', { required: "El origen es requerido" })}
                        >
                            <option value="">Seleccionar origen</option>
                            {origenes.map(origen => (
                                <option key={origen.id_origen} value={origen.id_origen}>
                                    {origen.nombre}
                                </option>
                            ))}
                        </select>
                        {errors.id_origen && (
                            <span className="text-error text-sm">{errors.id_origen.message as string}</span>
                        )}
                    </div>

                    {/* Selección de Destino AWB */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Destino AWB</span>
                        </label>
                        <select
                            className={`select select-bordered w-full ${errors.id_destino_awb ? 'select-error' : ''}`}
                            {...register('id_destino_awb', { required: "El destino AWB es requerido" })}
                        >
                            <option value="">Seleccionar destino AWB</option>
                            {destinos.map(destino => (
                                <option key={destino.id_destino} value={destino.id_destino}>
                                    {destino.nombre}
                                </option>
                            ))}
                        </select>
                        {errors.id_destino_awb && (
                            <span className="text-error text-sm">{errors.id_destino_awb.message as string}</span>
                        )}
                    </div>

                    {/* Selección de Destino Final */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Destino Final</span>
                        </label>
                        <select
                            className={`select select-bordered w-full ${errors.id_destino_final_docs ? 'select-error' : ''}`}
                            {...register('id_destino_final_docs', { required: "El destino final es requerido" })}
                        >
                            <option value="">Seleccionar destino final</option>
                            {destinos.map(destino => (
                                <option key={destino.id_destino} value={destino.id_destino}>
                                    {destino.nombre}
                                </option>
                            ))}
                        </select>
                        {errors.id_destino_final_docs && (
                            <span className="text-error text-sm">{errors.id_destino_final_docs.message as string}</span>
                        )}
                    </div>

                    {/* Selección de Tipo de Pago */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Tipo de Pago</span>
                        </label>
                        <select
                            className="select select-bordered w-full"
                            {...register('pago')}
                        >
                            <option value="PREPAID">PREPAID</option>
                            <option value="COLLECT">COLLECT</option>
                        </select>
                    </div>

                    {/* Fecha de Vuelo */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Fecha de Vuelo</span>
                        </label>
                        <input
                            type="date"
                            className={`input input-bordered w-full ${errors.fecha_vuelo ? 'input-error' : ''}`}
                            {...register('fecha_vuelo', { required: "La fecha de vuelo es requerida" })}
                        />
                        {errors.fecha_vuelo && (
                            <span className="text-error text-sm">{errors.fecha_vuelo.message as string}</span>
                        )}
                    </div>

                    {/* Fecha de Asignación */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Fecha de Asignación</span>
                        </label>
                        <input
                            type="date"
                            className={`input input-bordered w-full ${errors.fecha_asignacion ? 'input-error' : ''}`}
                            {...register('fecha_asignacion', { required: "La fecha de asignación es requerida" })}
                        />
                        {errors.fecha_asignacion && (
                            <span className="text-error text-sm">{errors.fecha_asignacion.message as string}</span>
                        )}
                    </div>
                </div>
            </div>

            {/* Sección de Clientes */}
            <div className="card bg-base-200 shadow-xl p-4">
                <h2 className="text-xl font-semibold mb-4">Clientes</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    {clientes.map(cliente => (
                        <div key={cliente.id_clientes} className="form-control">
                            <label className="cursor-pointer label justify-start gap-2">
                                <input
                                    type="checkbox"
                                    className="checkbox checkbox-primary"
                                    value={cliente.id_clientes}
                                    checked={selectedClientes.includes(cliente.id_clientes)}
                                    onChange={handleClienteChange}
                                    disabled={cliente.id_clientes.toString() === selectedConsignatario} // Deshabilitar si es el consignatario
                                />
                                <span className="label-text">{cliente.nombre}</span>
                                {cliente.id_clientes.toString() === selectedConsignatario && (
                                    <span className="badge badge-primary">Consignatario</span>
                                )}
                            </label>
                        </div>
                    ))}
                </div>
                {selectedClientes.length === 0 && (
                    <div className="alert alert-warning mt-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                        <span>Debe seleccionar al menos un cliente</span>
                    </div>
                )}
            </div>

            <div className="flex justify-end gap-2">
                <button
                    type="button"
                    className="btn btn-outline"
                    onClick={() => {
                        if (onSuccess) onSuccess();
                    }}
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={selectedClientes.length === 0}
                >
                    {isEditing ? 'Actualizar' : 'Crear'} Documento
                </button>
            </div>
        </form>
    );
};

export default FormularioCoordinacion;