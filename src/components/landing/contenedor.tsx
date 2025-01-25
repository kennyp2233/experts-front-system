import React, { ReactNode } from 'react';

type ContenedorProps = {
    titulo: ReactNode;
    descripcion: ReactNode;
    className?: string;
};

export default function Contenedor({ titulo, descripcion, className }: ContenedorProps) {
    return (
        <div className={"block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 " + className}>
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{titulo}</h5>
            <p className="font-normal text-gray-700 dark:text-gray-400">{descripcion}</p>
        </div>
    );
}