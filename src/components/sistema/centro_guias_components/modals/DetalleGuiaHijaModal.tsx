// src/components/sistema/centro_guias_components/modals/DetalleGuiaHijaModal.tsx
import React from 'react';
import { AppIcons } from '@/utils/icons';

interface DetalleGuiaHijaModalProps {
    guiaHija: any;
    isOpen: boolean;
    onClose: () => void;
    onPrint?: () => void;
    onEdit?: () => void;
    showEditButton?: boolean;
    showPrintButton?: boolean;
}

export const DetalleGuiaHijaModal: React.FC<DetalleGuiaHijaModalProps> = ({
    guiaHija,
    isOpen,
    onClose,
    onPrint,
    onEdit,
    showEditButton = false,
    showPrintButton = true
}) => {
    if (!isOpen || !guiaHija) return null;

    const hasCantidades = (
        (guiaHija.fulls !== undefined && guiaHija.fulls > 0) ||
        (guiaHija.pcs !== undefined && guiaHija.pcs > 0) ||
        (guiaHija.kgs !== undefined && guiaHija.kgs > 0) ||
        (guiaHija.stems !== undefined && guiaHija.stems > 0)
    );

    return (
        <dialog className="modal modal-open">
            <div className="modal-box">
                <h3 className="font-bold text-lg">Detalles de la Guía Hija</h3>

                <div className="py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <span className="font-semibold block">Número:</span>
                            <span>{guiaHija.anio}-{guiaHija.secuencial}</span>
                        </div>
                        <div>
                            <span className="font-semibold block">Finca:</span>
                            <span>{guiaHija.fincaNombre || guiaHija.finca?.nombre || 'No especificada'}</span>
                        </div>
                        <div>
                            <span className="font-semibold block">Producto:</span>
                            <span>{guiaHija.productoNombre || guiaHija.producto?.nombre || 'No especificado'}</span>
                        </div>
                        <div>
                            <span className="font-semibold block">Documento COO:</span>
                            <span>{guiaHija.cooLabel || `COO-${guiaHija.id_documento_coordinacion.toString().padStart(7, '0')}`}</span>
                        </div>
                    </div>

                    <div className="divider">Cantidades</div>

                    <div className="grid grid-cols-2 gap-4">
                        {guiaHija.fulls !== undefined && guiaHija.fulls > 0 && (
                            <div>
                                <span className="font-semibold block">Fulls:</span>
                                <span>{guiaHija.fulls}</span>
                            </div>
                        )}
                        {guiaHija.pcs !== undefined && guiaHija.pcs > 0 && (
                            <div>
                                <span className="font-semibold block">Piezas (Pcs):</span>
                                <span>{guiaHija.pcs}</span>
                            </div>
                        )}
                        {guiaHija.kgs !== undefined && guiaHija.kgs > 0 && (
                            <div>
                                <span className="font-semibold block">Peso (Kgs):</span>
                                <span>{guiaHija.kgs}</span>
                            </div>
                        )}
                        {guiaHija.stems !== undefined && guiaHija.stems > 0 && (
                            <div>
                                <span className="font-semibold block">Stems:</span>
                                <span>{guiaHija.stems}</span>
                            </div>
                        )}
                        {!hasCantidades && (
                            <div className="col-span-2 text-center py-2">
                                <span className="text-sm opacity-70">No hay información de cantidades registrada</span>
                            </div>
                        )}
                    </div>

                    <div className="divider">Información adicional</div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <span className="font-semibold block">Fecha de creación:</span>
                            <span>{new Date(guiaHija.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div>
                            <span className="font-semibold block">Última actualización:</span>
                            <span>{new Date(guiaHija.updatedAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>

                <div className="modal-action">
                    {showEditButton && onEdit && (
                        <button className="btn btn-secondary" onClick={onEdit}>
                            <AppIcons.Edit className="w-4 h-4 mr-2" />
                            Editar
                        </button>
                    )}
                    {showPrintButton && onPrint && (
                        <button className="btn btn-primary" onClick={onPrint}>
                            <AppIcons.Print className="w-4 h-4 mr-2" />
                            Imprimir
                        </button>
                    )}
                    <button className="btn" onClick={onClose}>
                        Cerrar
                    </button>
                </div>
            </div>
            <div className="modal-backdrop" onClick={onClose}></div>
        </dialog>
    );
};