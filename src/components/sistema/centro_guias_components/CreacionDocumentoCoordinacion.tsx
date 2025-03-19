// src/components/sistema/centro_guias_components/CreacionDocumentoCoordinacion.tsx
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { coordinacionesService, CoordinationDocument } from '@/api/services/documentos/coordinacionesService';
import { guiasMadreService } from '@/api/services/documentos/guiasMadreService';
import { consignatarioService } from '@/api/services/mantenimiento/consignatarioService';
import { productosService } from '@/api/services/mantenimiento/productosService';
import { agenciaIataService } from '@/api/services/mantenimiento/agenciasIataService';
import { destinosService } from '@/api/services/mantenimiento/destinosSevice';
import { origenesService } from '@/api/services/mantenimiento/origenesService';
import { aerolineasService } from '@/api/services/mantenimiento/aerolineasService';
import { dispatchMenssage } from '@/utils/menssageDispatcher';
import { AppIcons } from '@/utils/icons';

export default function CreacionDocumentoCoordinacion() {
    const router = useRouter();

    // Estados para datos y UI
    const [guiaMadreId, setGuiaMadreId] = useState<number | null>(null);
    const [guiaMadreSearchTerm, setGuiaMadreSearchTerm] = useState('');
    const [guiaMadreSearchResults, setGuiaMadreSearchResults] = useState<any[]>([]);
    const [selectedGuiaMadre, setSelectedGuiaMadre] = useState<any>(null);
    const [searchingGuiaMadre, setSearchingGuiaMadre] = useState(false);

    // Datos del formulario
    const [formData, setFormData] = useState({
        id_guia_madre: 0,
        id_consignatario: '',
        id_producto: '',
        id_agencia_iata: '',
        id_destino_awb: '',
        id_destino_final_docs: '',
        pago: 'PREPAID',
        fecha_vuelo: new Date().toISOString().split('T')[0],
        fecha_asignacion: new Date().toISOString().split('T')[0],

        // Rutas
        from1: '',
        to1: '',
        by1: '',
        to2: '',
        by2: '',
        to3: '',
        by3: '',

        // Valores
        costo_guia_valor: 0,
        combustible_valor: 0,
        seguridad_valor: 0,
        aux_calculo_valor: 0,
        otros_valor: 0,
        tarifa_rate: 0,
        char_weight: 0,
        form_a: 0,
        transport: 0,
        pca: 0,
        fitos: 0,
        termografo: 0,
        mca: 0
    });

    // Catálogos
    const [consignatarios, setConsignatarios] = useState<any[]>([]);
    const [productos, setProductos] = useState<any[]>([]);
    const [agenciasIata, setAgenciasIata] = useState<any[]>([]);
    const [destinos, setDestinos] = useState<any[]>([]);
    const [origenes, setOrigenes] = useState<any[]>([]);
    const [aerolineas, setAerolineas] = useState<any[]>([]);

    // Estado de carga y errores
    const [loadingCatalogs, setLoadingCatalogs] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Cargar catálogos necesarios
    useEffect(() => {
        const fetchCatalogs = async () => {
            try {
                const [
                    consigData,
                    prodData,
                    agenciaData,
                    destinosData,
                    origenesData,
                    aerolineasData
                ] = await Promise.all([
                    consignatarioService.getConsignatarios(),
                    productosService.getProductos(),
                    agenciaIataService.getAgenciasIata(),
                    destinosService.getDestinos(),
                    origenesService.getOrigenes(),
                    aerolineasService.getAerolineas()
                ]);

                setConsignatarios(consigData);
                setProductos(prodData);
                setAgenciasIata(agenciaData);
                setDestinos(destinosData);
                setOrigenes(origenesData);
                setAerolineas(aerolineasData);
            } catch (error) {
                console.error('Error al cargar catálogos:', error);
                dispatchMenssage('error', 'Error al cargar datos de referencia');
            } finally {
                setLoadingCatalogs(false);
            }
        };

        fetchCatalogs();
    }, []);

    // Buscar guía madre cuando cambia el término de búsqueda
    const handleSearchGuiaMadre = async () => {
        if (!guiaMadreSearchTerm) {
            dispatchMenssage('error', 'Ingrese un número de guía madre para buscar');
            return;
        }

        setSearchingGuiaMadre(true);
        try {
            // Implementación de búsqueda - ajustar según la API
            let guiasEncontradas: any[] = [];

            // Si es un número, buscar por ID
            if (!isNaN(Number(guiaMadreSearchTerm))) {
                const id = Number(guiaMadreSearchTerm);
                try {
                    const guia = await guiasMadreService.getGuiaMadreById(id);
                    if (guia) {
                        guiasEncontradas = [guia];
                    }
                } catch (e) {
                    // Sólo capturar error y continuar
                    console.warn('Guía madre no encontrada por ID:', e);
                }
            }

            // Si no se encontró por ID o el término no es numérico, intentar buscar por prefijo-secuencial
            if (guiasEncontradas.length === 0 && guiaMadreSearchTerm.includes('-')) {
                const [prefijo, secuencial] = guiaMadreSearchTerm.split('-');

                // Aquí se podría implementar una búsqueda más específica
                // Este es un enfoque simplificado - ajustar según la API
                const todasLasGuias = await guiasMadreService.getGuiasMadre();
                guiasEncontradas = todasLasGuias.filter(g =>
                    g.prefijo === Number(prefijo) && g.secuencial === Number(secuencial)
                );
            }

            // Filtrar solo guías disponibles (no prestadas ni asignadas)
            const guiasDisponibles = guiasEncontradas.filter(g => !g.prestado);
            setGuiaMadreSearchResults(guiasDisponibles);

            if (guiasDisponibles.length === 0) {
                dispatchMenssage('info', 'No se encontraron guías madre disponibles con ese criterio');
            }
        } catch (error) {
            console.error('Error al buscar guía madre:', error);
            dispatchMenssage('error', 'Error al buscar guía madre');
        } finally {
            setSearchingGuiaMadre(false);
        }
    };

    // Seleccionar una guía madre de los resultados
    const handleSelectGuiaMadre = (guia: any) => {
        setSelectedGuiaMadre(guia);
        setGuiaMadreId(guia.id);

        // Actualizar formData
        setFormData(prev => ({
            ...prev,
            id_guia_madre: guia.id
        }));

        // Buscar detalles de la aerolínea para pre-llenar valores
        const buscarDetallesAerolinea = async () => {
            try {
                // Esto dependerá de cómo esté estructurada la API
                // Aquí asumimos que hay un campo id_aerolinea en la guía madre o su documento base
                if (guia.id_documento_base) {
                    // Obtener documento base para encontrar la aerolínea
                    // Implementar lógica según corresponda
                }

                // Alternativa: buscar la aerolínea directamente por ID
                if (guia.aerolinea?.id_aerolinea) {
                    const aerolineaId = guia.aerolinea.id_aerolinea;
                    const aerolinea = aerolineas.find(a => a.id_aerolinea === aerolineaId);

                    if (aerolinea?.aerolineas_plantilla) {
                        const plantilla = aerolinea.aerolineas_plantilla;

                        // Actualizar valores de la plantilla en el formulario
                        setFormData(prev => ({
                            ...prev,
                            costo_guia_valor: plantilla.costo_guia_valor || 0,
                            combustible_valor: plantilla.combustible_valor || 0,
                            seguridad_valor: plantilla.seguridad_valor || 0,
                            aux_calculo_valor: plantilla.aux_calculo_valor || 0,
                            tarifa_rate: plantilla.tarifa_rate || 0,
                            pca: plantilla.pca || 0
                        }));
                    }
                }
            } catch (e) {
                console.error('Error al cargar detalles de aerolínea:', e);
            }
        };

        buscarDetallesAerolinea();
    };

    // Manejar cambios en el formulario
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        // Para inputs numéricos, convertir a número
        const newValue = type === 'number' ? Number(value) : value;

        setFormData(prev => ({
            ...prev,
            [name]: newValue
        }));

        // Si había un error para este campo, limpiarlo
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    // Validar formulario antes de enviar
    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        // Validaciones requeridas
        if (!formData.id_guia_madre) {
            newErrors.id_guia_madre = 'Debe seleccionar una guía madre';
        }

        if (!formData.id_consignatario) {
            newErrors.id_consignatario = 'Debe seleccionar un consignatario';
        }

        if (!formData.id_producto) {
            newErrors.id_producto = 'Debe seleccionar un producto';
        }

        if (!formData.id_agencia_iata) {
            newErrors.id_agencia_iata = 'Debe seleccionar una agencia IATA';
        }

        if (!formData.id_destino_awb) {
            newErrors.id_destino_awb = 'Debe seleccionar un destino AWB';
        }

        if (!formData.id_destino_final_docs) {
            newErrors.id_destino_final_docs = 'Debe seleccionar un destino final para documentos';
        }

        if (!formData.fecha_vuelo) {
            newErrors.fecha_vuelo = 'Debe ingresar una fecha de vuelo';
        }

        if (!formData.fecha_asignacion) {
            newErrors.fecha_asignacion = 'Debe ingresar una fecha de asignación';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Enviar formulario
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            dispatchMenssage('error', 'Por favor, corrija los errores en el formulario');
            return;
        }

        setSubmitting(true);

        try {
            // Preparar datos para API
            const documentoData: Partial<CoordinationDocument> = {
                ...formData,
                id_guia_madre: Number(formData.id_guia_madre),
                id_consignatario: Number(formData.id_consignatario),
                id_producto: Number(formData.id_producto),
                id_agencia_iata: Number(formData.id_agencia_iata),
                id_destino_awb: Number(formData.id_destino_awb),
                id_destino_final_docs: Number(formData.id_destino_final_docs),
                from1: formData.from1 ? Number(formData.from1) : undefined,
                to1: formData.to1 ? Number(formData.to1) : undefined,
                by1: formData.by1 ? Number(formData.by1) : undefined,
                to2: formData.to2 ? Number(formData.to2) : undefined,
                by2: formData.by2 ? Number(formData.by2) : undefined,
                to3: formData.to3 ? Number(formData.to3) : undefined,
                by3: formData.by3 ? Number(formData.by3) : undefined,

                // Convertir fechas al formato esperado por la API
                fecha_vuelo: new Date(formData.fecha_vuelo),
                fecha_asignacion: new Date(formData.fecha_asignacion)
            };

            // Llamar a la API para crear el documento
            const response = await coordinacionesService.createDocument(documentoData as any);

            dispatchMenssage('success', 'Documento de Coordinación creado correctamente');

            // Redireccionar a la página de gestión
            router.push('/sistema/dashboard/modulos/documentos/centro_guias?tab=gestion-documentos');
        } catch (error) {
            console.error('Error al crear documento de coordinación:', error);
            dispatchMenssage('error', 'Error al crear el documento de coordinación');
        } finally {
            setSubmitting(false);
        }
    };

    // Renderizado del componente
    return (
        <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
                <h2 className="card-title">Crear Documento de Coordinación</h2>
                <p className="text-sm opacity-70 mb-4">
                    Los documentos de coordinación asocian una guía madre con un consignatario, producto, destinos y fechas.
                </p>

                {loadingCatalogs ? (
                    <div className="flex justify-center py-8">
                        <span className="loading loading-spinner loading-lg"></span>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* SECCIÓN 1: BÚSQUEDA Y SELECCIÓN DE GUÍA MADRE */}
                        <div className="card bg-base-200 p-4">
                            <h3 className="font-bold mb-4">Selección de Guía Madre</h3>

                            {!selectedGuiaMadre ? (
                                <div className="space-y-4">
                                    <div className="flex gap-2">
                                        <div className="form-control flex-1">
                                            <input
                                                type="text"
                                                placeholder="Buscar guía madre por ID o prefijo-secuencial"
                                                className="input input-bordered w-full"
                                                value={guiaMadreSearchTerm}
                                                onChange={(e) => setGuiaMadreSearchTerm(e.target.value)}
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            className="btn btn-primary"
                                            onClick={handleSearchGuiaMadre}
                                            disabled={searchingGuiaMadre}
                                        >
                                            {searchingGuiaMadre ? (
                                                <span className="loading loading-spinner loading-sm"></span>
                                            ) : (
                                                <AppIcons.Search className="w-5 h-5" />
                                            )}
                                            Buscar
                                        </button>
                                    </div>

                                    {guiaMadreSearchResults.length > 0 && (
                                        <div className="overflow-x-auto">
                                            <table className="table table-zebra">
                                                <thead>
                                                    <tr>
                                                        <th>ID</th>
                                                        <th>Prefijo</th>
                                                        <th>Secuencial</th>
                                                        <th>Acciones</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {guiaMadreSearchResults.map((guia) => (
                                                        <tr key={guia.id}>
                                                            <td>{guia.id}</td>
                                                            <td>{guia.prefijo}</td>
                                                            <td>{guia.secuencial}</td>
                                                            <td>
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-sm btn-primary"
                                                                    onClick={() => handleSelectGuiaMadre(guia)}
                                                                >
                                                                    Seleccionar
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="alert alert-success bg-success/20 border-success">
                                        <AppIcons.Check className="w-6 h-6" />
                                        <div>
                                            <span className="font-semibold">Guía Madre Seleccionada:</span>
                                            <br />
                                            ID: {selectedGuiaMadre.id}, Prefijo: {selectedGuiaMadre.prefijo}, Secuencial: {selectedGuiaMadre.secuencial}
                                        </div>
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-ghost"
                                            onClick={() => {
                                                setSelectedGuiaMadre(null);
                                                setGuiaMadreId(null);
                                                setFormData(prev => ({ ...prev, id_guia_madre: 0 }));
                                            }}
                                        >
                                            Cambiar
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* SECCIÓN 2: DATOS PRINCIPALES DEL DOCUMENTO */}
                        {selectedGuiaMadre && (
                            <div className="card bg-base-200 p-4">
                                <h3 className="font-bold mb-4">Información Principal del Documento</h3>

                                <div className="grid md:grid-cols-2 gap-4">
                                    {/* Consignatario */}
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text font-medium">Consignatario <span className="text-error">*</span></span>
                                        </label>
                                        <select
                                            className={`select select-bordered w-full ${errors.id_consignatario ? 'select-error' : ''}`}
                                            name="id_consignatario"
                                            value={formData.id_consignatario}
                                            onChange={handleInputChange}
                                        >
                                            <option value="">Seleccionar consignatario</option>
                                            {consignatarios.map(c => (
                                                <option key={c.id_consignatario} value={c.id_consignatario}>
                                                    {c.nombre}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.id_consignatario && (
                                            <label className="label">
                                                <span className="label-text-alt text-error">{errors.id_consignatario}</span>
                                            </label>
                                        )}
                                    </div>

                                    {/* Producto */}
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text font-medium">Producto <span className="text-error">*</span></span>
                                        </label>
                                        <select
                                            className={`select select-bordered w-full ${errors.id_producto ? 'select-error' : ''}`}
                                            name="id_producto"
                                            value={formData.id_producto}
                                            onChange={handleInputChange}
                                        >
                                            <option value="">Seleccionar producto</option>
                                            {productos.map(p => (
                                                <option key={p.id_producto} value={p.id_producto}>
                                                    {p.nombre}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.id_producto && (
                                            <label className="label">
                                                <span className="label-text-alt text-error">{errors.id_producto}</span>
                                            </label>
                                        )}
                                    </div>

                                    {/* Agencia IATA */}
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text font-medium">Agencia IATA <span className="text-error">*</span></span>
                                        </label>
                                        <select
                                            className={`select select-bordered w-full ${errors.id_agencia_iata ? 'select-error' : ''}`}
                                            name="id_agencia_iata"
                                            value={formData.id_agencia_iata}
                                            onChange={handleInputChange}
                                        >
                                            <option value="">Seleccionar agencia IATA</option>
                                            {agenciasIata.map(a => (
                                                <option key={a.id_agencia_iata} value={a.id_agencia_iata}>
                                                    {a.alias_shipper || a.nombre} {a.iata_code_carrier ? `(${a.iata_code_carrier})` : ''}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.id_agencia_iata && (
                                            <label className="label">
                                                <span className="label-text-alt text-error">{errors.id_agencia_iata}</span>
                                            </label>
                                        )}
                                    </div>

                                    {/* Destino AWB */}
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text font-medium">Destino AWB <span className="text-error">*</span></span>
                                        </label>
                                        <select
                                            className={`select select-bordered w-full ${errors.id_destino_awb ? 'select-error' : ''}`}
                                            name="id_destino_awb"
                                            value={formData.id_destino_awb}
                                            onChange={handleInputChange}
                                        >
                                            <option value="">Seleccionar destino AWB</option>
                                            {destinos.map(d => (
                                                <option key={d.id_destino} value={d.id_destino}>
                                                    {d.nombre} {d.codigo ? `(${d.codigo})` : ''}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.id_destino_awb && (
                                            <label className="label">
                                                <span className="label-text-alt text-error">{errors.id_destino_awb}</span>
                                            </label>
                                        )}
                                    </div>

                                    {/* Destino Final Docs */}
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text font-medium">Destino Final Docs <span className="text-error">*</span></span>
                                        </label>
                                        <select
                                            className={`select select-bordered w-full ${errors.id_destino_final_docs ? 'select-error' : ''}`}
                                            name="id_destino_final_docs"
                                            value={formData.id_destino_final_docs}
                                            onChange={handleInputChange}
                                        >
                                            <option value="">Seleccionar destino final</option>
                                            {destinos.map(d => (
                                                <option key={d.id_destino} value={d.id_destino}>
                                                    {d.nombre} {d.codigo ? `(${d.codigo})` : ''}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.id_destino_final_docs && (
                                            <label className="label">
                                                <span className="label-text-alt text-error">{errors.id_destino_final_docs}</span>
                                            </label>
                                        )}
                                    </div>

                                    {/* Tipo de Pago */}
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text font-medium">Tipo de Pago <span className="text-error">*</span></span>
                                        </label>
                                        <div className="flex gap-2">
                                            <label className="label cursor-pointer border rounded-lg px-4 flex-1 justify-center">
                                                <input
                                                    type="radio"
                                                    className="radio radio-primary mr-2"
                                                    name="pago"
                                                    value="PREPAID"
                                                    checked={formData.pago === 'PREPAID'}
                                                    onChange={handleInputChange}
                                                />
                                                <span className="label-text">PREPAID</span>
                                            </label>
                                            <label className="label cursor-pointer border rounded-lg px-4 flex-1 justify-center">
                                                <input
                                                    type="radio"
                                                    className="radio radio-primary mr-2"
                                                    name="pago"
                                                    value="COLLECT"
                                                    checked={formData.pago === 'COLLECT'}
                                                    onChange={handleInputChange}
                                                />
                                                <span className="label-text">COLLECT</span>
                                            </label>
                                        </div>
                                    </div>

                                    {/* Fecha de Vuelo */}
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text font-medium">Fecha de Vuelo <span className="text-error">*</span></span>
                                        </label>
                                        <input
                                            type="date"
                                            className={`input input-bordered w-full ${errors.fecha_vuelo ? 'input-error' : ''}`}
                                            name="fecha_vuelo"
                                            value={formData.fecha_vuelo}
                                            onChange={handleInputChange}
                                        />
                                        {errors.fecha_vuelo && (
                                            <label className="label">
                                                <span className="label-text-alt text-error">{errors.fecha_vuelo}</span>
                                            </label>
                                        )}
                                    </div>

                                    {/* Fecha de Asignación */}
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text font-medium">Fecha de Asignación <span className="text-error">*</span></span>
                                        </label>
                                        <input
                                            type="date"
                                            className={`input input-bordered w-full ${errors.fecha_asignacion ? 'input-error' : ''}`}
                                            name="fecha_asignacion"
                                            value={formData.fecha_asignacion}
                                            onChange={handleInputChange}
                                        />
                                        {errors.fecha_asignacion && (
                                            <label className="label">
                                                <span className="label-text-alt text-error">{errors.fecha_asignacion}</span>
                                            </label>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* SECCIÓN 3: RUTAS */}
                        {selectedGuiaMadre && (
                            <div className="card bg-base-200 p-4">
                                <h3 className="font-bold mb-4">Rutas</h3>

                                {/* Ruta 1 */}
                                <div className="mb-4">
                                    <h4 className="font-medium mb-2">Ruta 1</h4>
                                    <div className="grid md:grid-cols-3 gap-4">
                                        {/* Origen */}
                                        <div className="form-control">
                                            <label className="label">
                                                <span className="label-text">Origen</span>
                                            </label>
                                            <select
                                                className="select select-bordered w-full"
                                                name="by1"
                                                value={formData.by1}
                                                onChange={handleInputChange}
                                            >
                                                <option value="">Seleccionar aerolínea</option>
                                                {aerolineas.map(a => (
                                                    <option key={a.id_aerolinea} value={a.id_aerolinea}>
                                                        {a.nombre} {a.codigo ? `(${a.codigo})` : ''}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* Ruta 2 */}
                                <div className="mb-4">
                                    <h4 className="font-medium mb-2">Ruta 2 (opcional)</h4>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        {/* Destino */}
                                        <div className="form-control">
                                            <label className="label">
                                                <span className="label-text">Destino</span>
                                            </label>
                                            <select
                                                className="select select-bordered w-full"
                                                name="to2"
                                                value={formData.to2}
                                                onChange={handleInputChange}
                                            >
                                                <option value="">Seleccionar destino</option>
                                                {destinos.map(d => (
                                                    <option key={d.id_destino} value={d.id_destino}>
                                                        {d.nombre} {d.codigo ? `(${d.codigo})` : ''}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Aerolínea */}
                                        <div className="form-control">
                                            <label className="label">
                                                <span className="label-text">Aerolínea</span>
                                            </label>
                                            <select
                                                className="select select-bordered w-full"
                                                name="by2"
                                                value={formData.by2}
                                                onChange={handleInputChange}
                                            >
                                                <option value="">Seleccionar aerolínea</option>
                                                {aerolineas.map(a => (
                                                    <option key={a.id_aerolinea} value={a.id_aerolinea}>
                                                        {a.nombre} {a.codigo ? `(${a.codigo})` : ''}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* Ruta 3 */}
                                <div>
                                    <h4 className="font-medium mb-2">Ruta 3 (opcional)</h4>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        {/* Destino */}
                                        <div className="form-control">
                                            <label className="label">
                                                <span className="label-text">Destino</span>
                                            </label>
                                            <select
                                                className="select select-bordered w-full"
                                                name="to3"
                                                value={formData.to3}
                                                onChange={handleInputChange}
                                            >
                                                <option value="">Seleccionar destino</option>
                                                {destinos.map(d => (
                                                    <option key={d.id_destino} value={d.id_destino}>
                                                        {d.nombre} {d.codigo ? `(${d.codigo})` : ''}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Aerolínea */}
                                        <div className="form-control">
                                            <label className="label">
                                                <span className="label-text">Aerolínea</span>
                                            </label>
                                            <select
                                                className="select select-bordered w-full"
                                                name="by3"
                                                value={formData.by3}
                                                onChange={handleInputChange}
                                            >
                                                <option value="">Seleccionar aerolínea</option>
                                                {aerolineas.map(a => (
                                                    <option key={a.id_aerolinea} value={a.id_aerolinea}>
                                                        {a.nombre} {a.codigo ? `(${a.codigo})` : ''}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* SECCIÓN 4: VALORES Y COMISIONES */}
                        {selectedGuiaMadre && (
                            <div className="card bg-base-200 p-4">
                                <h3 className="font-bold mb-4">Valores y Comisiones</h3>
                                <p className="text-sm opacity-70 mb-4">
                                    Los valores se pre-llenan de la plantilla de la aerolínea. Puede ajustarlos si es necesario.
                                </p>

                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {/* Costo Guía */}
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text">Costo Guía</span>
                                        </label>
                                        <label className="input-group">
                                            <span className="font-mono">$</span>
                                            <input
                                                type="number"
                                                step="0.01"
                                                className="input input-bordered w-full"
                                                name="costo_guia_valor"
                                                value={formData.costo_guia_valor}
                                                onChange={handleInputChange}
                                            />
                                        </label>
                                    </div>

                                    {/* Combustible */}
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text">Combustible</span>
                                        </label>
                                        <label className="input-group">
                                            <span className="font-mono">$</span>
                                            <input
                                                type="number"
                                                step="0.01"
                                                className="input input-bordered w-full"
                                                name="combustible_valor"
                                                value={formData.combustible_valor}
                                                onChange={handleInputChange}
                                            />
                                        </label>
                                    </div>

                                    {/* Seguridad */}
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text">Seguridad</span>
                                        </label>
                                        <label className="input-group">
                                            <span className="font-mono">$</span>
                                            <input
                                                type="number"
                                                step="0.01"
                                                className="input input-bordered w-full"
                                                name="seguridad_valor"
                                                value={formData.seguridad_valor}
                                                onChange={handleInputChange}
                                            />
                                        </label>
                                    </div>

                                    {/* Tarifa Rate */}
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text">Tarifa Rate</span>
                                        </label>
                                        <label className="input-group">
                                            <span className="font-mono">$</span>
                                            <input
                                                type="number"
                                                step="0.01"
                                                className="input input-bordered w-full"
                                                name="tarifa_rate"
                                                value={formData.tarifa_rate}
                                                onChange={handleInputChange}
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
                                            name="char_weight"
                                            value={formData.char_weight}
                                            onChange={handleInputChange}
                                        />
                                    </div>

                                    {/* Otros */}
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text">Otros Valores</span>
                                        </label>
                                        <label className="input-group">
                                            <span className="font-mono">$</span>
                                            <input
                                                type="number"
                                                step="0.01"
                                                className="input input-bordered w-full"
                                                name="otros_valor"
                                                value={formData.otros_valor}
                                                onChange={handleInputChange}
                                            />
                                        </label>
                                    </div>
                                </div>

                                <div className="divider text-sm opacity-70">Valores Adicionales</div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {/* Form A */}
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text">Form A</span>
                                        </label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            className="input input-bordered w-full"
                                            name="form_a"
                                            value={formData.form_a}
                                            onChange={handleInputChange}
                                        />
                                    </div>

                                    {/* Transport */}
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text">Transport</span>
                                        </label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            className="input input-bordered w-full"
                                            name="transport"
                                            value={formData.transport}
                                            onChange={handleInputChange}
                                        />
                                    </div>

                                    {/* PCA */}
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text">PCA</span>
                                        </label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            className="input input-bordered w-full"
                                            name="pca"
                                            value={formData.pca}
                                            onChange={handleInputChange}
                                        />
                                    </div>

                                    {/* Fitos */}
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text">Fitos</span>
                                        </label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            className="input input-bordered w-full"
                                            name="fitos"
                                            value={formData.fitos}
                                            onChange={handleInputChange}
                                        />
                                    </div>

                                    {/* Termografo */}
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text">Termógrafo</span>
                                        </label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            className="input input-bordered w-full"
                                            name="termografo"
                                            value={formData.termografo}
                                            onChange={handleInputChange}
                                        />
                                    </div>

                                    {/* MCA */}
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text">MCA</span>
                                        </label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            className="input input-bordered w-full"
                                            name="mca"
                                            value={formData.mca}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* BOTONES DE ACCIÓN */}
                        <div className="flex justify-end gap-2 mt-6">
                            <button
                                type="button"
                                className="btn btn-outline"
                                onClick={() => router.push('/sistema/dashboard/modulos/documentos/centro_guias')}
                            >
                                Cancelar
                            </button>

                            {selectedGuiaMadre && (
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={submitting}
                                >
                                    {submitting ? (
                                        <>
                                            <span className="loading loading-spinner loading-sm"></span>
                                            Guardando...
                                        </>
                                    ) : (
                                        <>
                                            <AppIcons.Check className="w-4 h-4 mr-1" />
                                            Guardar Documento
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}