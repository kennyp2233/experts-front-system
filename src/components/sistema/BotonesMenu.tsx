// src/components/sistema/BotonesMenu.tsx
import { IconType } from 'react-icons';
import React from 'react';

interface BotonesMenuProps {
    titulo: string;
    icon: IconType;  // Ahora usamos IconType en lugar de JSX.Element
    onClick?: () => void;
    className?: string;
    disabled?: boolean;
    description?: string;
    variant?: 'default' | 'outline' | 'ghost';
}

export default function BotonesMenu({
    titulo,
    icon: Icon, // Recibe el componente de icono, no la instancia
    onClick,
    className = "",
    disabled = false,
    description,
    variant = 'default'
}: BotonesMenuProps) {

    // Determinar las clases en base a la variante
    const variantClasses = {
        default: "card btn-outline bg-base-100 shadow-xl",
        outline: "card btn-outline bg-transparent shadow-md",
        ghost: "card btn-ghost bg-transparent"
    };

    return (
        <button
            className={`card btn ${variantClasses[variant]} h-full ${className}`}
            onClick={onClick}
            disabled={disabled}
        >
            <figure className="px-10 pt-10 text-8xl">
                <Icon />
            </figure>
            <div className="card-body items-center text-center h-fit">
                <h2 className="card-title">{titulo}</h2>
                {description && <p className="text-sm opacity-75">{description}</p>}
            </div>
        </button>
    );
}

