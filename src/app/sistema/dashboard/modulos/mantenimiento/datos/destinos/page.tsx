'use client';
import { getPaises } from "@/api/mantenimiento/paises.api";
import { deleteDestinos, getDestinosJoinPaisesAduanas, postDestino, putDestino } from "@/api/mantenimiento/destinos.api";
import PaginaDatos from "../utils/paginaDatos";
import { useEffect, useState } from "react";

interface Pais {
    id_pais: number;
    nombre: string;
}

interface Destino {
    id_destino: number;
    codigo_destino: string;
    nombre: string;
    aeropuerto?: string;
    id_pais: number;
    sesa_id?: string;
    leyenda_fito?: string;
    cobro_fitos?: boolean;
    paise: Pais;
}

export default function Page() {
    const [loading, setLoading] = useState(true);
    const nombrePagina = "Destinos";
    const iconoPagina = <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" fillRule="evenodd" d="M8.445 3.168a1 1 0 0 1 1.002-.062L15 5.882l5.553-2.776A1 1 0 0 1 22 4v12a1 1 0 0 1-.445.832l-6 4a1 1 0 0 1-1.002.062L9 18.118l-5.553 2.776A1 1 0 0 1 2 20V8a1 1 0 0 1 .445-.832zM5 12a1 1 0 1 0 2 0a1 1 0 1 0-2 0m5 1a1 1 0 0 1-1-1a1 1 0 1 1 2 0v.001a1 1 0 0 1-1 1zm4.707-3.708a1 1 0 1 0-1.414 1.414L14.586 12l-1.293 1.293a1 1 0 0 0 1.414 1.414L16 13.414l1.293 1.293a1 1 0 0 0 1.414-1.414L17.414 12l1.293-1.293a1 1 0 0 0-1.414-1.414L16 10.586l-1.293-1.293z" clipRule="evenodd" /></svg>
    const modificationLabelId = { label: "ID Destino", key: "id_destino" };
    const [paises, setPaises] = useState([]);
    const [formFields, setFormFields] = useState([] as any[]);

    const visibleColumns = {
        codigo_destino: "Codigo Destino",
        nombre: "Nombre",
        aeropuerto: "Aeropuerto",
        paise: "Pais",
        sesa_id: "Sesa ID",
        leyenda_fito: "Leyenda Fito",
        cobro_fitos: "Cobro Fitos",
    } as any;

    const keys = Object.keys(visibleColumns).filter(key => visibleColumns[key]);

    useEffect(() => {
        getPaises().then(data => {
            setPaises(data);
        });
    }, []);

    useEffect(() => {
        if (paises.length > 0) {
            setFormFields([
                { label: visibleColumns[keys[0]], key: keys[0], example: 'EC', type: 'text' },
                { label: visibleColumns[keys[1]], key: keys[1], example: 'Ecuador', type: 'text' },
                { label: visibleColumns[keys[2]], key: keys[2], example: 'Aeropuerto', type: 'text' },
                { label: visibleColumns[keys[3]], key: keys[3], options: paises, type: 'select' },
                { label: visibleColumns[keys[4]], key: keys[4], example: 'Sesa ID', type: 'number' },
                { label: visibleColumns[keys[5]], key: keys[5], example: 'Leyenda Fito', type: 'textarea' },
                { label: visibleColumns[keys[6]], key: keys[6], example: 'Cobro Fitos', type: 'checkbox' },
            ])
            setLoading(false);
        }
    }, [paises]);

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
                    fetchData={getDestinosJoinPaisesAduanas}
                    createData={postDestino}
                    updateData={putDestino}
                    deleteData={deleteDestinos}
                    formFields={formFields}
                    modificationLabelId={modificationLabelId}
                    visibleColumns={visibleColumns}
                />
            }
        </>
    );
}