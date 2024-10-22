'use client';

import React, { ChangeEvent, useState, useEffect } from 'react';
import InputField from './InputField';
import { DocumentoBase, Guia } from '@/hooks/useDocumentosBase';
interface DocumentoBaseDetailProps {
    documento: DocumentoBase;
    onUpdate: (updatedFields: Partial<DocumentoBase>) => void;
}

const aerolineas: string[] = ['Aerolínea 1', 'Aerolínea 2', 'Aerolínea 3'];
const stockTypes: string[] = ['Virtual', 'Físico'];

const DocumentoBaseDetail: React.FC<DocumentoBaseDetailProps> = ({ documento, onUpdate }) => {
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [formData, setFormData] = useState<Partial<DocumentoBase>>({});

    useEffect(() => {
        // Reset formData cuando cambia el documento
        setFormData({});
        setIsEditing(false);
    }, [documento]);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCancel = () => {
        setFormData({});
        setIsEditing(false);
    };

    const handleSave = () => {
        onUpdate(formData);
        setIsEditing(false);
    };

    return (
        <div className="card card-body bg-base-100 w-1/2 overflow-y-auto">
            <div className="mb-4">
                {!isEditing ? (
                    <button
                        className="btn btn-secondary"
                        onClick={handleEdit}
                    >
                        Editar
                    </button>
                ) : (
                    <div className="flex gap-2">
                        <button
                            className="btn btn-primary"
                            onClick={handleSave}
                        >
                            Guardar
                        </button>
                        <button
                            className="btn btn-neutral"
                            onClick={handleCancel}
                        >
                            Cancelar
                        </button>
                    </div>
                )}
            </div>
            <h2 className="text-lg font-bold mb-4">Detalle de Documento Base</h2>
            <InputField
                label="Fecha"
                id="fecha"
                type="date"
                value={formData.fecha !== undefined ? formData.fecha : documento.fecha}
                onChange={handleChange}
                editable={isEditing}
            />
            <InputField
                label="Aerolínea"
                id="aerolinea"
                type="select"
                value={documento.aerolinea.nombre}
                onChange={handleChange}
                options={aerolineas}
                editable={false} // Siempre no editable
            />
            <InputField
                label="Referencia"
                id="referencia"
                type="text"
                value={formData.referencia !== undefined ? formData.referencia : documento.referencia}
                onChange={handleChange}
                editable={isEditing}
            />
            <InputField
                label="Tipo de Stock"
                id="stock"
                type="select"
                value={formData.stock !== undefined ? formData.stock : documento.stock}
                onChange={handleChange}
                options={stockTypes}
                editable={isEditing}
            />
            <h3 className="font-bold mt-6 mb-2">Guías Generadas:</h3>
            <ul className="list-disc pl-4">
                {documento.guias.map((guia, index) => (
                    <li key={index}>
                        {`Guía: ${guia.id_documento_base}, Fecha: ${guia.id_documento_base}, Aerolínea: ${guia.id_documento_base}, Referencia: ${guia.id_documento_base}, Stock: ${guia.id_documento_base}`}
                    </li>
                ))}
            </ul>

        </div>
    );
};

export default DocumentoBaseDetail;
