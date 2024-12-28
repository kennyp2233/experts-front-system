'use client';

import React, { useState, ChangeEvent, useEffect } from 'react';
import InputField from './InputField';
import { Aerolinea, DocumentoBase, Guia, Stock } from '@/hooks/useDocumentosBase';

interface CrearDocumentoModalProps {
    aerolineas: Aerolinea[];
    stockTypes: Stock[];
    agenciasIata: any[];
    onPreview: (data: {
        documento_base: Partial<DocumentoBase>;
        n_guias: number;
        secuencial_inicial: number;
        prefijo: number;
    }) => Promise<DocumentoBase | null>;
    onConfirm: (data: {
        documento_base: Partial<DocumentoBase>;
        n_guias: number;
        secuencial_inicial: number;
        prefijo: number;
    }) => Promise<void>;
    onClose: () => void;
}

const CrearDocumentoModal: React.FC<CrearDocumentoModalProps> = ({
    aerolineas,
    stockTypes,
    agenciasIata,
    onPreview,
    onConfirm,
    onClose,
}) => {
    const [step, setStep] = useState<number>(1);
    const [formData, setFormData] = useState({
        prefijo: 0,
        numero: '',
        cantidad: 0,
        aerolinea: aerolineas[0] || { id_aerolinea: 0, nombre: '' }, // Asegúrate de que el campo es id_aerolinea
        fecha: '',
        referencia: agenciasIata[0] || { id_agencia_iata: 0, alias_shipper: '', iata_code_carrier: '' },
        stock: stockTypes[0] || { id: 0, nombre: '' }
    });
    const [guiasPreview, setGuiasPreview] = useState<Guia[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: id === 'aerolinea'
                ? aerolineas.find(a => a.id_aerolinea === parseInt(value)) || prev.aerolinea
                : id === 'stock'
                    ? stockTypes.find(s => s.id === parseInt(value)) || prev.stock
                    : id === 'referencia'
                        ? agenciasIata.find(a => a.id_agencia_iata === parseInt(value)) || prev.referencia
                        : (id === 'cantidad' || id === 'prefijo') ? parseInt(value) || 0 : value
        }));
    };


    useEffect(() => {
        console.log("DATOS DEL FORM", formData);
    }, [formData]);

    const isFormValid = () => {
        const { aerolinea, fecha, referencia, stock, prefijo, numero, cantidad } = formData;
        return (
            aerolinea && aerolinea.id_aerolinea > 0 &&
            fecha.trim() !== '' &&
            referencia && referencia.id_agencia_iata > 0 &&
            stock && stock.id > 0 &&
            prefijo > 0 &&
            numero.trim() !== '' &&
            cantidad > 0
        );
    };

    const handleGeneratePreview = async () => {
        setLoading(true);
        setError(null);
        try {
            const { prefijo, numero, cantidad, aerolinea, fecha, referencia, stock } = formData;
            const secuencial_inicial = parseInt(numero);
            if (isNaN(secuencial_inicial) || isNaN(prefijo)) {
                throw new Error('El número y el prefijo deben ser valores numéricos válidos.');
            }

            // Validar que todos los campos requeridos estén establecidos
            if (!isFormValid()) {
                throw new Error('Por favor, completa todos los campos requeridos.');
            }

            const response = await onPreview({
                documento_base: { id_aerolinea: aerolinea.id_aerolinea, fecha, id_referencia: referencia.id_stock, id_stock: stock.id },
                n_guias: cantidad,
                secuencial_inicial,
                prefijo
            });

            if (response) {
                setGuiasPreview(response.guias_madre || []); // Asegúrate de que response tiene el campo 'guias'
                setStep(2);
            } else {
                setError('No se pudo generar la vista previa.');
            }
        } catch (err: any) {
            setError(err.message || 'Error al generar la vista previa.');
        } finally {
            setLoading(false);
        }
    };

    const handleConfirm = async () => {
        setLoading(true);
        setError(null);
        try {
            const { prefijo, numero, cantidad, aerolinea, fecha, referencia, stock } = formData;
            const secuencial_inicial = parseInt(numero);
            if (isNaN(secuencial_inicial) || isNaN(prefijo)) {
                throw new Error('El número y el prefijo deben ser valores numéricos válidos.');
            }

            await onConfirm({
                documento_base: { id_aerolinea: aerolinea.id_aerolinea, fecha, id_referencia: referencia.id_stock, id_stock: stock.id },
                n_guias: cantidad,
                secuencial_inicial,
                prefijo
            });

            // Reiniciar el formulario y cerrar el modal
            setFormData({
                prefijo: 0,
                numero: '',
                cantidad: 0,
                aerolinea: aerolineas[0] || { id_aerolinea: 0, nombre: '' },
                fecha: '',
                referencia: agenciasIata[0] || '',
                stock: stockTypes[0] || { id: 0, nombre: '' }
            });
            setGuiasPreview([]);
            setStep(1);
            onClose();
        } catch (err: any) {
            setError(err.message || 'Error al confirmar la creación del documento base.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <dialog id="crear_documento_modal" className="modal">
            <div className="modal-box flex flex-col">
                <ul className="steps w-full">
                    <li className={`step ${step >= 1 ? 'step-primary font-bold' : ''}`}>Datos Iniciales</li>
                    <li className={`step ${step === 2 ? 'step-primary font-bold' : ''}`}>Vista Previa de Guías</li>
                </ul>

                {step === 1 ? (
                    <form method='dialog' className='overflow-y-auto' onSubmit={e => e.preventDefault()}>
                        <InputField
                            label="Prefijo"
                            id="prefijo"
                            type="number"
                            value={formData.prefijo}
                            onChange={handleInputChange}
                        />
                        <InputField
                            label="Número"
                            id="numero"
                            type="text"
                            value={formData.numero}
                            onChange={handleInputChange}
                        />
                        <InputField
                            label="Cantidad de Guías"
                            id="cantidad"
                            type="number"
                            value={formData.cantidad}
                            onChange={handleInputChange}
                        />
                        <InputField
                            label="Fecha"
                            id="fecha"
                            type="date"
                            value={formData.fecha}
                            onChange={handleInputChange}
                        />
                        <InputField
                            label="Aerolínea"
                            id="aerolinea"
                            type="select"
                            value={formData.aerolinea.id_aerolinea}
                            onChange={handleInputChange}
                            options={aerolineas.map(a => ({ label: a.nombre, value: a.id_aerolinea }))}
                        />
                        <InputField
                            label="Referencia"
                            id="referencia"
                            type="select"
                            value={formData.referencia.id_agencia_iata}
                            onChange={handleInputChange}
                            options={agenciasIata.map(a => ({ label: `${a.alias_shipper} (${a.iata_code_carrier})`, value: a.id_agencia_iata }))}
                        />
                        <InputField
                            label="Tipo de Stock"
                            id="stock"
                            type="select"
                            value={formData.stock.id}
                            onChange={handleInputChange}
                            options={stockTypes.map(s => ({ label: s.nombre, value: s.id }))}
                        />

                        {error && <p className="text-red-500">{error}</p>}

                        <div className="modal-action flex justify-between">
                            <button className="btn" onClick={onClose}>Cancelar</button>

                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={handleGeneratePreview}
                                disabled={!isFormValid() || loading} // Deshabilitar si el formulario no es válido
                            >
                                {loading ? 'Generando...' : 'Generar Vista Previa'}
                            </button>
                        </div>
                    </form>
                ) : (
                    <>
                        <h3 className="font-bold mb-4">Vista Previa de Guías</h3>

                        {/* Información adicional */}
                        <div className="mb-4">
                            <p><strong>Aerolínea:</strong> {formData.aerolinea.nombre}</p>
                            <p><strong>Fecha:</strong> {formData.fecha}</p>
                            <p><strong>Referencia:</strong> {formData.referencia.alias_shipper} ({formData.referencia.iata_code_carrier})</p>
                            <p><strong>Tipo de Stock:</strong> {formData.stock.nombre}</p>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="table w-full">
                                <thead>
                                    <tr>
                                        <th>Prefijo</th>
                                        <th>Secuencial</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {guiasPreview.map((guia, index) => (
                                        <tr key={index}>
                                            <td>{guia.prefijo}</td>
                                            <td>{guia.secuencial}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {error && <p className="text-red-500">{error}</p>}
                        <div className="modal-action flex justify-between">
                            <button type="button" className="btn" onClick={() => setStep(1)}>Volver</button>
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={handleConfirm}
                                disabled={loading}
                            >
                                {loading ? 'Confirmando...' : 'Confirmar y Crear Documento Base'}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </dialog>
    );
};

export default CrearDocumentoModal;
