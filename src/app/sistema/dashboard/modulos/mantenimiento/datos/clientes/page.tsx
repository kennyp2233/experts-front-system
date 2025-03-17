'use client';

import PaginaGenerica from "@/components/sistema/datos_components/PaginaGenerica";

import { clientesService } from "@/api/services/mantenimiento/clientesService";
import { FiUsers } from "react-icons/fi";

export default function ClientesPage() {
    return (
        <PaginaGenerica
            nombrePagina="Clientes"
            iconoPagina={
                <FiUsers />
            }
            fetchData={clientesService.getClientes.bind(clientesService)}
            createData={clientesService.postCliente.bind(clientesService)}
            updateData={clientesService.putCliente.bind(clientesService)}
            deleteData={clientesService.deleteClientes.bind(clientesService)}
            formFieldsConfig={() => [
                { division: true, label: 'Datos Cliente' },
                { label: "Nombre", key: "nombre", example: 'Nombre del cliente', type: 'text' },
                { label: "CI/RUC", key: "ruc", example: 'CI o RUC del cliente', type: 'text' },
                { label: "Direccion", key: "direccion", example: 'Direccion del cliente', type: 'text' },
                { label: "Telefono", key: "telefono", example: 'Telefono del cliente', type: 'text' },
                { label: "Email", key: "email", example: 'Email del cliente', type: 'text' },
                { label: "Ciudad", key: "ciudad", example: 'Ciudad del cliente', type: 'text' },
                { label: "Pais", key: "pais", example: 'Pais del cliente', type: 'text' },
                { label: "Codigo Pais", key: "cliente_codigo_pais", example: 'Codigo Pais del cliente', type: 'text' },

                { division: true, label: 'Manejo Fitos' },
                { label: "Fito Sanitario Valor", key: "fitos_valor", example: '0.00', type: 'number', step: '0.01' },

                { division: true, label: 'Valores Por Defecto' },
                { label: "Formulario A", key: "form_a", example: '0.00', type: 'number', step: '0.01' },
                { label: "Transport", key: "transport", example: '0.00', type: 'number', step: '0.01' },
                { label: "Termos", key: "termo", example: '0.00', type: 'number', step: '0.01' },
                { label: "Mica", key: "mica", example: '0.00', type: 'number', step: '0.01' },

                { division: true, label: 'General' },
                { label: "Handling", key: "handling", example: '0.00', type: 'number', step: '0.01' },
                { label: "Cuenta Contable", key: "cuenta_contable", example: '0.00', type: 'number', step: '0.01' },

                { division: true, label: 'Facturación' },
                { label: "Nombre Factura", key: "nombre_factura", example: 'Nombre Factura del cliente', type: 'text' },
                { label: "RUC Factura", key: "ruc_factura", example: 'RUC Factura del cliente', type: 'text' },
                { label: "Direccion Factura", key: "direccion_factura", example: 'Direccion Factura del cliente', type: 'text' },
                { label: "Telefono Factura", key: "telefono_factura", example: 'Telefono Factura del cliente', type: 'text' },
            ]}
            visibleColumns={{
                nombre: "Nombre",
                ruc: "CI/RUC",
                direccion: "Direccion",
                telefono: "Telefono",
                email: "Email",
                ciudad: "Ciudad",
                pais: "Pais",
                cliente_codigo_pais: "Codigo Pais",
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
            }}
            modificationLabelId={{ label: "ID Cliente", key: "id_clientes" }}
            formClassName="grid-cols-3 max-lg:grid-cols-2" // Clases para el diseño de las columnas
        />
    );
}
