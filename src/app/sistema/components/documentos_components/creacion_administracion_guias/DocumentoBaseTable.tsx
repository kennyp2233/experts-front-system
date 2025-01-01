'use client';

import React from 'react';

import { DocumentoBase, Guia } from '@/hooks/useDocumentosBase';
interface DocumentoBaseTableProps {
    documentosBase: DocumentoBase[];
    onSelect: (documento: DocumentoBase) => void;
}

const DocumentoBaseTable: React.FC<DocumentoBaseTableProps> = ({ documentosBase, onSelect }) => (
    <div className="card card-body bg-base-100 w-1/2 overflow-x-auto">
        <table className="table w-full">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Fecha</th>
                    <th>Aerolínea</th>
                    <th>Total Guías</th>
                </tr>
            </thead>
            <tbody>
                {documentosBase?.map((documento) => (
                    <tr
                        key={documento.id}
                        onClick={() => onSelect(documento)}
                        className="cursor-pointer hover:bg-gray-100"
                    >
                        <th>{documento.id}</th>
                        <td>{new Date(documento.fecha).toISOString().split('T')[0]}</td>
                        <td>{documento.aerolinea?.nombre ?? "SIN AEROLINEA"}</td>

                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

export default DocumentoBaseTable;
