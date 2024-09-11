'use client';
import PaginaDatos from "../utils/paginaDatos";
import { useEffect, useState } from "react";

import {
    getClientes,
    postCliente,
    putCliente,
    deleteClientes
} from "@/api/mantenimiento/clientes.api";
import { steps } from "framer-motion";

export default function Page() {
    const [loading, setLoading] = useState(true);
    const nombrePagina = "Clientes";
    const iconoPagina = <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 32 32"><path fill="currentColor" d="M21.053 20.8c-1.132-.453-1.584-1.698-1.584-1.698s-.51.282-.51-.51s.51.51 1.02-2.548c0 0 1.413-.397 1.13-3.68h-.34s.85-3.51 0-4.7c-.85-1.188-1.188-1.98-3.057-2.547s-1.188-.454-2.547-.396c-1.36.058-2.492.793-2.492 1.19c0 0-.85.056-1.188.396c-.34.34-.906 1.924-.906 2.32s.283 3.06.566 3.625l-.337.114c-.284 3.283 1.13 3.68 1.13 3.68c.51 3.058 1.02 1.756 1.02 2.548s-.51.51-.51.51s-.452 1.245-1.584 1.698c-1.132.452-7.416 2.886-7.927 3.396c-.512.51-.454 2.888-.454 2.888H29.43s.06-2.377-.452-2.888c-.51-.51-6.795-2.944-7.927-3.396zm-12.47-.172c-.1-.18-.148-.31-.148-.31s-.432.24-.432-.432s.432.432.864-2.16c0 0 1.2-.335.96-3.118h-.29s.144-.59.238-1.334a10.01 10.01 0 0 1 .037-.996l.038-.426c-.02-.492-.107-.94-.312-1.226c-.72-1.007-1.008-1.68-2.59-2.16c-1.584-.48-1.01-.384-2.16-.335c-1.152.05-2.112.672-2.112 1.01c0 0-.72.047-1.008.335c-.27.27-.705 1.462-.757 1.885v.28c.048.654.26 2.45.47 2.873l-.286.096c-.24 2.782.96 3.118.96 3.118c.43 2.59.863 1.488.863 2.16s-.432.43-.432.43s-.383 1.058-1.343 1.44l-.232.092v5.234h.575c-.03-1.278.077-2.927.746-3.594c.357-.355 1.524-.94 6.353-2.862zm22.33-9.056c-.04-.378-.127-.715-.292-.946c-.718-1.008-1.007-1.68-2.59-2.16c-1.583-.48-1.007-.384-2.16-.335c-1.15.05-2.11.672-2.11 1.01c0 0-.72.047-1.008.335c-.27.272-.71 1.472-.758 1.89h.033l.08.914c.02.23.022.435.027.644c.09.666.21 1.35.33 1.59l-.286.095c-.24 2.782.96 3.118.96 3.118c.432 2.59.863 1.488.863 2.16s-.43.43-.43.43s-.054.143-.164.34c4.77 1.9 5.927 2.48 6.28 2.833c.67.668.774 2.316.745 3.595h.48V21.78l-.05-.022c-.96-.383-1.344-1.44-1.344-1.44s-.433.24-.433-.43s.433.43.864-2.16c0 0 .804-.23.963-1.84V14.66c0-.018 0-.033-.003-.05h-.29s.216-.89.293-1.862z" /></svg>
    const modificationLabelId = { label: "ID Cliente", key: "id_clientes" };

    const [formFields, setFormFields] = useState([] as any[]);

    const visibleColumns = {
        nombre: "Nombre",
        ruc: "CI/RUC",
        direccion: "Direccion",
        telefono: "Telefono",
        email: "Email",
        ciudad: "Ciudad",
        pais: "Pais",
        codigo_pais: "Codigo Pais",
        fitos_valor: "Fito Sanitario",
        form_a: "Formulario A",
        transport: "Transport",
        termo: "Termos",
        mica: "Mca",
        handling: "Handling",
        cuenta_contable: "Cuenta Contable",
        nombre_factura: "Nombre Factura",
        ruc_factura: "RUC Factura",
        direccion_factura: "Direccion Factura",
        telefono_factura: "Telefono Factura",
    } as any;

    const keys = Object.keys(visibleColumns).filter(key => visibleColumns[key]);

    useEffect(() => {


    }, []);

    useEffect(() => {
        if (

            true
        ) {
            setFormFields([
                { division: true, label: 'Datos Cliente' },
                { label: "Nombre", key: "nombre", example: 'Nombre del cliente', type: 'text' },
                { label: "CI/RUC", key: "ruc", example: 'CI o RUC del cliente', type: 'text' },
                { label: "Direccion", key: "direccion", example: 'Direccion del cliente', type: 'text' },
                { label: "Telefono", key: "telefono", example: 'Telefono del cliente', type: 'text' },
                { label: "Email", key: "email", example: 'Email del cliente', type: 'text' },
                { label: "Ciudad", key: "ciudad", example: 'Ciudad del cliente', type: 'text' },
                { label: "Pais", key: "pais", example: 'Pais del cliente', type: 'text' },
                { label: "Codigo Pais", key: "codigo_pais", example: 'Codigo Pais del cliente', type: 'text' },

                { division: true, label: 'Manejo Fitos' },
                { label: "Fito Sanitario Valor", key: "fitos_valor", example: '0.00', type: 'number', step: '0.01' },

                { division: true, label: 'Valores Por Defecto ' },
                { label: "Formulario A", key: "form_a", example: '0.00', type: 'number', step: '0.01' },
                { label: "Transport", key: "transport", example: '0.00', type: 'number', step: '0.01' },
                { label: "Termos", key: "termo", example: '0.00', type: 'number', step: '0.01' },
                { label: "Mica", key: "mica", example: '0.00', type: 'number', step: '0.01' },

                { division: true, label: 'General' },
                { label: "Handling", key: "handling", example: '0.00', type: 'number', step: '0.01' },
                { label: "Cuenta Contable", key: "cuenta_contable", example: '0.00', type: 'number', step: '0.01' },

                { division: true, label: 'Facturacion' },
                { label: "Nombre Factura", key: "nombre_factura", example: 'Nombre Factura del cliente', type: 'text' },
                { label: "RUC Factura", key: "ruc_factura", example: 'RUC Factura del cliente', type: 'text' },
                { label: "Direccion Factura", key: "direccion_factura", example: 'Direccion Factura del cliente', type: 'text' },
                { label: "Telefono Factura", key: "telefono_factura", example: 'Telefono Factura del cliente', type: 'text' },
            ])
            setLoading(false);
        }
    }, []);

    if (loading) {
        return (
            <>
                <div className="hero min-h-screen bg-base-200">
                    <div className="hero-content text-center">
                        <div className="max-w-md">
                            <span className="loading loading-ball loading-lg"></span>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            {formFields.length > 0 &&
                <PaginaDatos
                    nombre={nombrePagina}
                    icono={iconoPagina}
                    fetchData={getClientes}
                    createData={postCliente}
                    updateData={putCliente}
                    deleteData={deleteClientes}
                    formFields={formFields}
                    modificationLabelId={modificationLabelId}
                    visibleColumns={visibleColumns}
                    formularioSegments={true}
                    formClassName="grid-cols-3 max-lg:grid-cols-2"
                />
            }
        </>
    );
}