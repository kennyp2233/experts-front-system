'use client';

import React, { ChangeEvent, useState, useEffect } from 'react';
import InputField from './InputField';
import { DocumentoBase, Guia } from '@/hooks/useDocumentosBase';
interface DocumentoBaseDetailProps {
    documento: DocumentoBase;
    aerolineas: any[];
    stockTypes: any[];
    agenciasIata: any[];
    onUpdate: (updatedFields: Partial<DocumentoBase>) => void;

}



const DocumentoBaseDetail: React.FC<DocumentoBaseDetailProps> = ({ documento, onUpdate, aerolineas, agenciasIata, stockTypes }) => {
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [formData, setFormData] = useState<Partial<DocumentoBase>>({});

    useEffect(() => {
        console.log('DocumentoBaseDetail: documento', documento);
        const formattedDate = documento.fecha ?
            new Date(documento.fecha).toISOString().split('T')[0] : '';
        // Reset formData cuando cambia el documento
        setFormData({
            id: documento.id,
            fecha: formattedDate,
            id_aerolinea: documento.id_aerolinea,
            id_referencia: documento.id_referencia,
            id_stock: documento.id_stock,
        });
        setIsEditing(false);
    }, [documento]);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        
        // Mapeo de IDs del input a las propiedades del formData
        const fieldMapping: { [key: string]: string } = {
            'aerolinea': 'id_aerolinea',
            'referencia': 'id_referencia',
            'stock': 'id_stock',
            'fecha': 'fecha'
        };
    
        setFormData(prev => ({
            ...prev,
            [fieldMapping[id]]: value
        }));
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

    const formatDateForInput = (dateString: string) => {
        if (!dateString) return '';
        return new Date(dateString).toISOString().split('T')[0];
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
                value={formatDateForInput(formData.fecha !== undefined ? formData.fecha : documento.fecha)}
                onChange={handleChange}
                editable={isEditing}
            />
            <InputField
                label="Aerolínea"
                id="aerolinea"
                type="select"
                value={formData.id_aerolinea || documento.id_aerolinea || ""}
                onChange={handleChange}
                options={aerolineas.map(a => ({ label: a.nombre, value: a.id_aerolinea }))}
                editable={false} // Siempre no editable
            />
            <InputField
                label="Referencia"
                id="referencia"
                type="select"
                value={formData.id_referencia || documento.id_referencia || ""}
                onChange={handleChange}
                options={agenciasIata.map(a => ({ label: `${a.alias_shipper} (${a.iata_code_carrier})`, value: a.id_agencia_iata }))}
                editable={isEditing}
            />
            <InputField
                label="Tipo de Stock"
                id="stock"
                type="select"
                value={formData.id_stock || documento.id_stock || ""}
                onChange={handleChange}
                options={stockTypes.map(s => ({ label: s.nombre, value: s.id }))}
                editable={isEditing}
            />
            <h3 className="font-bold mt-6 mb-2">Guías Generadas:</h3>
            <ul className="list-disc pl-4">
                {documento.guias_madre.map((guia, index) => (
                    <li key={index}>
                        {`Guía: ${guia.id}, Fecha: ${guia.id_documento_base}, Aerolínea: ${guia.id_documento_base}, Referencia: ${guia.id_documento_base}, Stock: ${guia.id_documento_base}`}
                    </li>
                ))}
            </ul>

        </div>
    );
};

export default DocumentoBaseDetail;
