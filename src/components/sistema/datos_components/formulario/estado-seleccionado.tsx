import React from 'react';
import { MdCancel } from 'react-icons/md';

interface EstadoSeleccionadoProps {
    mensaje: string;
    onCancelar: () => void;
}

export const EstadoSeleccionado: React.FC<EstadoSeleccionadoProps> = ({ mensaje, onCancelar }) => (
    <>
        <h2 className="text-2xl self-center pt-8 max-sm:text-xl">{mensaje}</h2>
        <button className="btn btn-error w-fit self-center" onClick={onCancelar}>
            <MdCancel className="text-xl" />
            Cancelar
        </button>
    </>
);