// src/app/sistema/dashboard/modulos/documentos/centro_guias/components/DocumentoCoordinacionDetailView.tsx
import React, { useEffect, useState } from 'react';
import { AppIcons } from '@/utils/icons';
import { consignatarioService } from '@/api/services/mantenimiento/consignatarioService';
import { productosService } from '@/api/services/mantenimiento/productosService';
import { agenciaIataService } from '@/api/services/mantenimiento/agenciasIataService';
import { destinosService } from '@/api/services/mantenimiento/destinosSevice';
import { origenesService } from '@/api/services/mantenimiento/origenesService';

interface DocumentoData {
    id: number;
    id_consignatario?: number;
    id_producto?: number;
    id_agencia_iata?: number;
    id_destino_awb?: number;
    id_destino_final_docs?: number;
    id_guia_madre?: number;
    pago?: string;
    fecha_vuelo?: Date | string;
    fecha_asignacion?: Date | string;
    from1?: number;
    to1?: number;
    by1?: number;
    to2?: number;
    by2?: number;
    to3?: number;
    by3?: number;
    costo_guia_valor?: number;
    combustible_valor?: number;
    seguridad_valor?: number;
    aux_calculo_valor?: number;
    otros_valor?: number;
    aux1_valor?: number;
    aux2_valor?: number;
    tarifa_rate?: number;
    char_weight?: number;
    form_a?: number;
    transport?: number;
    pca?: number;
    fitos?: number;
    termografo?: number;
    mca?: number;
    tax?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    // Campos adicionales para mostrar información legible
    consignatarioNombre?: string;
    productoNombre?: string;
    estadoLabel?: string;
    cooLabel?: string;
    [key: string]: any;
}

interface DocumentoCoordinacionDetailViewProps {
    documento: DocumentoData;
}

export default function DocumentoCoordinacionDetailView({ documento }: DocumentoCoordinacionDetailViewProps) {
    const [catalogs, setCatalogs] = useState<{
        consignatarios: any[];
        productos: any[];
        agenciasIata: any[];
        destinos: any[];
        origenes: any[];
    }>({
        consignatarios: [],
        productos: [],
        agenciasIata: [],
        destinos: [],
        origenes: []
    });

    const [loading, setLoading] = useState(true);

    // Cargar datos de catálogos para mostrar nombres en lugar de IDs
    useEffect(() => {
        const fetchCatalogs = async () => {
            setLoading(true);
            try {
                const [consignatarios, productos, agenciasIata, destinos, origenes] = await Promise.all([
                    consignatarioService.getConsignatarios(),
                    productosService.getProductos(),
                    agenciaIataService.getAgenciasIata(),
                    destinosService.getDestinos(),
                    origenesService.getOrigenes()
                ]);

                setCatalogs({
                    consignatarios,
                    productos,
                    agenciasIata,
                    destinos,
                    origenes
                });
            } catch (error) {
                console.error('Error al cargar catálogos:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCatalogs();
    }, []);

    // Función para obtener el nombre de un elemento de catálogo por ID
    const getCatalogItemName = (catalog: any[], id?: number, nameField: string = 'nombre') => {
        if (!id) return 'No especificado';
        const item = catalog.find(c => c.id === id || c[`id_${nameField.split('_')[0]}`] === id);
        return item ? item[nameField] : 'Desconocido';
    };

    // Renderizado condicional mientras se cargan los catálogos
    if (loading) {
        return (
            <div className="flex justify-center py-4">
                <span className="loading loading-spinner loading-md"></span>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Información general */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                <InfoItem
                    label="Consignatario"
                    value={documento.consignatarioNombre || getCatalogItemName(catalogs.consignatarios, documento.id_consignatario, 'nombre')}
                    icon={<AppIcons.Building className="w-4 h-4" />}
                />

                <InfoItem
                    label="Producto"
                    value={documento.productoNombre || getCatalogItemName(catalogs.productos, documento.id_producto, 'nombre')}
                    icon={<AppIcons.Package className="w-4 h-4" />}
                />

                <InfoItem
                    label="Agencia IATA"
                    value={getCatalogItemName(catalogs.agenciasIata, documento.id_agencia_iata, 'nombre')}
                    icon={<AppIcons.Network className="w-4 h-4" />}
                />

                <InfoItem
                    label="Guía Madre"
                    value={documento.id_guia_madre ? `#${documento.id_guia_madre}` : 'No disponible'}
                    icon={<AppIcons.Document className="w-4 h-4" />}
                />

                <InfoItem
                    label="Destino AWB"
                    value={getCatalogItemName(catalogs.destinos, documento.id_destino_awb, 'nombre')}
                    icon={<AppIcons.Map className="w-4 h-4" />}
                />

                <InfoItem
                    label="Destino Final Docs"
                    value={getCatalogItemName(catalogs.destinos, documento.id_destino_final_docs, 'nombre')}
                    icon={<AppIcons.Map className="w-4 h-4" />}
                />

                <InfoItem
                    label="Tipo de Pago"
                    value={documento.pago || 'No especificado'}
                    icon={<AppIcons.Document className="w-4 h-4" />}
                />

                <InfoItem
                    label="Fecha de Creación"
                    value={documento.createdAt ? new Date(documento.createdAt).toLocaleDateString() : 'No disponible'}
                    icon={<AppIcons.Calendar className="w-4 h-4" />}
                />

                <InfoItem
                    label="Fecha de Vuelo"
                    value={documento.fecha_vuelo ? new Date(documento.fecha_vuelo).toLocaleDateString() : 'No disponible'}
                    icon={<AppIcons.Plane className="w-4 h-4" />}
                />

                <InfoItem
                    label="Fecha de Asignación"
                    value={documento.fecha_asignacion ? new Date(documento.fecha_asignacion).toLocaleDateString() : 'No disponible'}
                    icon={<AppIcons.Calendar className="w-4 h-4" />}
                />
            </div>

            {/* Detalles de Rutas */}
            {(documento.from1 || documento.to1 || documento.by1) && (
                <>
                    <div className="divider">Rutas</div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Ruta 1 */}
                        {(documento.from1 || documento.to1 || documento.by1) && (
                            <div className="card bg-base-200 p-3">
                                <h4 className="font-medium mb-2">Ruta 1</h4>
                                <div className="text-sm">
                                    {documento.from1 && (
                                        <p><span className="font-medium">Origen:</span> {getCatalogItemName(catalogs.origenes, documento.from1, 'nombre')}</p>
                                    )}
                                    {documento.to1 && (
                                        <p><span className="font-medium">Destino:</span> {getCatalogItemName(catalogs.destinos, documento.to1, 'nombre')}</p>
                                    )}
                                    {documento.by1 && (
                                        <p><span className="font-medium">Aerolínea:</span> Aerolínea #{documento.by1}</p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Ruta 2 */}
                        {(documento.to2 || documento.by2) && (
                            <div className="card bg-base-200 p-3">
                                <h4 className="font-medium mb-2">Ruta 2</h4>
                                <div className="text-sm">
                                    {documento.to2 && (
                                        <p><span className="font-medium">Destino:</span> {getCatalogItemName(catalogs.destinos, documento.to2, 'nombre')}</p>
                                    )}
                                    {documento.by2 && (
                                        <p><span className="font-medium">Aerolínea:</span> Aerolínea #{documento.by2}</p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Ruta 3 */}
                        {(documento.to3 || documento.by3) && (
                            <div className="card bg-base-200 p-3">
                                <h4 className="font-medium mb-2">Ruta 3</h4>
                                <div className="text-sm">
                                    {documento.to3 && (
                                        <p><span className="font-medium">Destino:</span> {getCatalogItemName(catalogs.destinos, documento.to3, 'nombre')}</p>
                                    )}
                                    {documento.by3 && (
                                        <p><span className="font-medium">Aerolínea:</span> Aerolínea #{documento.by3}</p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </>
            )}

            {/* Valores y Comisiones */}
            <div className="divider">Valores y Comisiones</div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {documento.costo_guia_valor !== undefined && (
                    <InfoItem
                        label="Costo Guía"
                        value={formatCurrency(documento.costo_guia_valor)}
                        valueClassName="font-mono"
                    />
                )}

                {documento.combustible_valor !== undefined && (
                    <InfoItem
                        label="Combustible"
                        value={formatCurrency(documento.combustible_valor)}
                        valueClassName="font-mono"
                    />
                )}

                {documento.seguridad_valor !== undefined && (
                    <InfoItem
                        label="Seguridad"
                        value={formatCurrency(documento.seguridad_valor)}
                        valueClassName="font-mono"
                    />
                )}

                {documento.aux_calculo_valor !== undefined && (
                    <InfoItem
                        label="Aux Cálculo"
                        value={formatCurrency(documento.aux_calculo_valor)}
                        valueClassName="font-mono"
                    />
                )}

                {documento.otros_valor !== undefined && (
                    <InfoItem
                        label="Otros"
                        value={formatCurrency(documento.otros_valor)}
                        valueClassName="font-mono"
                    />
                )}

                {documento.tarifa_rate !== undefined && (
                    <InfoItem
                        label="Tarifa Rate"
                        value={formatCurrency(documento.tarifa_rate)}
                        valueClassName="font-mono"
                    />
                )}

                {documento.char_weight !== undefined && (
                    <InfoItem
                        label="Char Weight"
                        value={documento.char_weight.toString()}
                        valueClassName="font-mono"
                    />
                )}
            </div>

            {/* Valores adicionales */}
            {(documento.form_a || documento.transport || documento.pca || documento.fitos ||
                documento.termografo || documento.mca || documento.tax || documento.aux1_valor ||
                documento.aux2_valor) && (
                    <>
                        <div className="divider">Valores Adicionales</div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {documento.form_a !== undefined && documento.form_a > 0 && (
                                <InfoItem label="Form A" value={documento.form_a.toString()} valueClassName="font-mono" />
                            )}

                            {documento.transport !== undefined && documento.transport > 0 && (
                                <InfoItem label="Transport" value={documento.transport.toString()} valueClassName="font-mono" />
                            )}

                            {documento.pca !== undefined && documento.pca > 0 && (
                                <InfoItem label="PCA" value={documento.pca.toString()} valueClassName="font-mono" />
                            )}

                            {documento.fitos !== undefined && documento.fitos > 0 && (
                                <InfoItem label="Fitos" value={documento.fitos.toString()} valueClassName="font-mono" />
                            )}

                            {documento.termografo !== undefined && documento.termografo > 0 && (
                                <InfoItem label="Termógrafo" value={documento.termografo.toString()} valueClassName="font-mono" />
                            )}

                            {documento.mca !== undefined && documento.mca > 0 && (
                                <InfoItem label="MCA" value={documento.mca.toString()} valueClassName="font-mono" />
                            )}

                            {documento.tax !== undefined && documento.tax > 0 && (
                                <InfoItem label="Tax" value={documento.tax.toString()} valueClassName="font-mono" />
                            )}

                            {documento.aux1_valor !== undefined && documento.aux1_valor > 0 && (
                                <InfoItem label="Aux 1" value={formatCurrency(documento.aux1_valor)} valueClassName="font-mono" />
                            )}

                            {documento.aux2_valor !== undefined && documento.aux2_valor > 0 && (
                                <InfoItem label="Aux 2" value={formatCurrency(documento.aux2_valor)} valueClassName="font-mono" />
                            )}
                        </div>
                    </>
                )}
        </div>
    );
}

// Componente auxiliar para mostrar información de manera consistente
interface InfoItemProps {
    label: string;
    value: string;
    icon?: React.ReactNode;
    valueClassName?: string;
}

function InfoItem({ label, value, icon, valueClassName = '' }: InfoItemProps) {
    return (
        <div>
            <p className="text-sm opacity-70 flex items-center">
                {icon && <span className="mr-1">{icon}</span>}
                {label}
            </p>
            <p className={`font-medium ${valueClassName}`}>{value}</p>
        </div>
    );
}

// Función auxiliar para formatear valores de moneda
function formatCurrency(value?: number): string {
    if (value === undefined || value === null) return '-';
    return `$${value.toFixed(2)}`;
}