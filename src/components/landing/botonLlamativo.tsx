'use client';

import React from 'react';
import { motion } from 'framer-motion';
import tinycolor from 'tinycolor2';
import { COLORS } from '@/utils/theme';

interface BotonLlamativoProps {
    children: React.ReactNode;
    onClick?: () => void;
    colorBase?: string;
    className?: string;
    style?: React.CSSProperties;
    size?: 'sm' | 'md' | 'lg';
    variant?: 'filled' | 'outlined' | 'gradient';
    icon?: React.ReactNode;
}

export default function BotonLlamativo({
    children,
    onClick,
    colorBase = COLORS.PRIMARY.MAIN,
    className = '',
    style = {},
    size = 'md',
    variant = 'gradient',
    icon
}: BotonLlamativoProps) {
    // Crear colores derivados del color base
    const color1 = tinycolor(colorBase).lighten(15).toString();
    const color2 = tinycolor(colorBase).toString();
    const colorHover = tinycolor(colorBase).lighten(10).toString();
    const colorShadow = tinycolor(colorBase).setAlpha(0.3).toString();
    const colorText = tinycolor(colorBase).isDark() ? '#FFFFFF' : '#1A1A1A';

    // Determinar tamaño del botón
    const sizeClasses = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-5 py-2.5 text-base',
        lg: 'px-7 py-3 text-lg'
    };

    // Crear estilos según la variante
    const getVariantStyles = () => {
        switch (variant) {
            case 'filled':
                return {
                    background: colorBase,
                    color: colorText,
                    boxShadow: `0 4px 10px ${colorShadow}`,
                    border: 'none'
                };
            case 'outlined':
                return {
                    background: 'transparent',
                    color: colorBase,
                    boxShadow: 'none',
                    border: `2px solid ${colorBase}`
                };
            case 'gradient':
            default:
                return {
                    background: `linear-gradient(135deg, ${color1}, ${color2})`,
                    color: colorText,
                    boxShadow: `0 4px 15px ${colorShadow}`,
                    border: 'none'
                };
        }
    };

    // Variantes para la animación
    const buttonVariants = {
        initial: {
            scale: 1,
            boxShadow: `0 4px 10px ${colorShadow}`
        },
        hover: {
            scale: 1.03,
            boxShadow: `0 6px 20px ${colorShadow}`
        },
        tap: {
            scale: 0.98,
            boxShadow: `0 2px 5px ${colorShadow}`
        }
    };

    return (
        <motion.button
            className={`relative flex items-center justify-center rounded-lg font-medium ${sizeClasses[size]} ${className}`}
            style={{
                ...getVariantStyles(),
                ...style
            }}
            onClick={onClick}
            variants={buttonVariants}
            initial="initial"
            whileHover="hover"
            whileTap="tap"
            transition={{
                type: 'spring',
                stiffness: 500,
                damping: 30
            }}
        >
            {/* Efecto de resplandor en hover */}
            <motion.div
                className="absolute inset-0 rounded-lg opacity-0"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 0.15 }}
                style={{
                    background: variant === 'outlined'
                        ? colorBase
                        : 'rgba(255, 255, 255, 0.2)'
                }}
            />

            {/* Contenido del botón */}
            <div className="flex items-center justify-center text-sm">
                {icon && <span className="mr-2">{icon}</span>}
                {children}
            </div>
        </motion.button>
    );
}