'use client';

import React, { useState, ChangeEvent } from 'react';
import InputField from './InputField';
import { DocumentoBase, Guia } from '@/hooks/useDocumentosBase';



interface CrearDocumentoModalProps {
    aerolineas: string[];
    stockTypes: string[];
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
    onPreview,
    onConfirm,
    onClose,
}) => {
    const [step, setStep] = useState<number>(1);
    const [formData, setFormData] = useState({
        prefijo: 0,
        numero: '',
        cantidad: 0,
        aerolinea: '',
        fecha: '',
        referencia: '',
        stock: ''
    });
    const [guiasPreview, setGuiasPreview] = useState<Guia[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: (id === 'cantidad' || id === 'prefijo') ? parseInt(value) || 0 : value
        }));
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

            const response = await onPreview({
                documento_base: { aerolinea, fecha, referencia, stock },
                n_guias: cantidad,
                secuencial_inicial,
                prefijo
            });

            if (response) {
                setGuiasPreview(response.guias);
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
                documento_base: { aerolinea, fecha, referencia, stock },
                n_guias: cantidad,
                secuencial_inicial,
                prefijo
            });

            // Reiniciar el formulario y cerrar el modal
            setFormData({
                prefijo: 0,
                numero: '',
                cantidad: 0,
                aerolinea: '',
                fecha: '',
                referencia: '',
                stock: ''
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
            <div className="modal-box">
                <ul className="steps w-full mb-4">
                    <li className={`step ${step >= 1 ? 'step-primary font-bold' : ''}`}>Datos Iniciales</li>
                    <li className={`step ${step === 2 ? 'step-primary font-bold' : ''}`}>Vista Previa de Guías</li>
                </ul>

                {step === 1 ? (
                    <form method='dialog' onSubmit={e => e.preventDefault()}>
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
                            value={formData.aerolinea}
                            onChange={handleInputChange}
                            options={aerolineas}
                        />
                        <InputField
                            label="Referencia"
                            id="referencia"
                            type="text"
                            value={formData.referencia}
                            onChange={handleInputChange}
                        />
                        <InputField
                            label="Tipo de Stock"
                            id="stock"
                            type="select"
                            value={formData.stock}
                            onChange={handleInputChange}
                            options={stockTypes}
                        />

                        {error && <p className="text-red-500">{error}</p>}

                        <div className="modal-action flex justify-between">
                            <button className="btn" onClick={onClose}>Cancelar</button>

                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={handleGeneratePreview}
                                disabled={formData.cantidad <= 0 || loading}
                            >
                                {loading ? 'Generando...' : 'Generar Vista Previa'}
                            </button>
                        </div>
                    </form>
                ) : (
                    <>
                        <h3 className="font-bold mb-4">Vista Previa de Guías</h3>
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
