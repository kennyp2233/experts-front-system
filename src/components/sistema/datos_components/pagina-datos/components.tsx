import React from "react";
import { MdCancel } from "react-icons/md";

// Componente para mostrar un mensaje de selección con botón de cancelar
export const EstadoSeleccionado: React.FC<{
    mensaje: string;
    onCancelar: () => void;
}> = ({ mensaje, onCancelar }) => (
    <>
        <h2 className="text-2xl self-center pt-8 max-sm:text-xl">{mensaje}</h2>
        <button className="btn btn-error w-fit self-center" onClick={onCancelar}>
            <MdCancel className="text-xl" />
            Cancelar
        </button>
    </>
);

// Componente de esqueleto para mostrar durante la carga
export const TablaSkeleton: React.FC = () => (
    <div className="flex flex-col p-4 gap-4 w-full h-full">
        <div className="skeleton w-full h-1/3"></div>
        <div className="skeleton w-full h-full"></div>
    </div>
);