// src/utils/theme.ts

// Paleta de colores principal basada en los colores de la empresa
export const COLORS = {
    // Colores primarios
    PRIMARY: {
        MAIN: '#D10808',       // Rojo principal (más brillante para mejor contraste)
        LIGHT: '#FF1A1A',      // Rojo más claro (más vibrante)
        DARK: '#A70404',       // Rojo más oscuro (el anterior MAIN)
        CONTRAST: '#FFFFFF'    // Texto sobre rojo
    },
    // Colores secundarios
    SECONDARY: {
        MAIN: '#FF9020',       // Naranja principal (más brillante)
        LIGHT: '#FFAE5C',      // Naranja más claro (más vibrante)
        DARK: '#F27E02',       // Naranja más oscuro (el anterior MAIN)
        CONTRAST: '#000000'    // Texto sobre naranja (cambiado a negro para mejor legibilidad)
    },
    // Colores para el fondo
    BACKGROUND: {
        DEFAULT: '#0A0A0A',    // Fondo negro (más oscuro)
        PAPER: '#1A1A1A',      // Fondo para tarjetas (anterior DEFAULT)
        LIGHT: '#252525'       // Fondo ligeramente más claro (anterior PAPER)
    },
    // Colores para texto
    TEXT: {
        PRIMARY: '#FFFFFF',    // Texto principal
        SECONDARY: '#E0E0E0',  // Texto secundario (más claro para mejor contraste)
        DISABLED: '#999999',   // Texto deshabilitado (más claro)
        HINT: '#BBBBBB'        // Texto pista (más claro)
    },
    // Colores para acentos
    ACCENT: {
        CREAM: '#FFE6DD',      // Color crema (más claro para mejor contraste)
        GOLD: '#FFD700',       // Dorado para acentos
        TEAL: '#00CED1',       // Turquesa para complementar rojo/naranja
        PURPLE: '#9370DB'      // Púrpura para más variedad
    },
    // Colores de estado
    STATE: {
        SUCCESS: '#4CAF50',
        WARNING: '#FFC107',    // Amarillo más brillante para mejor visibilidad
        ERROR: '#FF5252',      // Rojo error más brillante
        INFO: '#42A5F5'        // Azul info más brillante
    }
};

// Tipografía
export const TYPOGRAPHY = {
    FONT_FAMILY: {
        PRIMARY: "'Poppins', sans-serif",
        SECONDARY: "'Montserrat', sans-serif"
    },
    FONT_SIZES: {
        XS: '0.75rem',     // 12px
        SM: '0.875rem',    // 14px
        BASE: '1rem',      // 16px
        LG: '1.125rem',    // 18px
        XL: '1.25rem',     // 20px
        '2XL': '1.5rem',   // 24px
        '3XL': '1.875rem', // 30px
        '4XL': '2.25rem',  // 36px
        '5XL': '3rem',     // 48px
        '6XL': '3.75rem',  // 60px
    },
    WEIGHTS: {
        LIGHT: 300,
        REGULAR: 400,
        MEDIUM: 500,
        SEMIBOLD: 600,
        BOLD: 700
    }
};

// Espaciados
export const SPACING = {
    XS: '0.25rem',      // 4px
    SM: '0.5rem',       // 8px
    BASE: '1rem',       // 16px
    MD: '1.5rem',       // 24px
    LG: '2rem',         // 32px
    XL: '2.5rem',       // 40px
    '2XL': '3rem',      // 48px
    '3XL': '4rem',      // 64px
    '4XL': '5rem',      // 80px
    '5XL': '6rem'       // 96px
};

// Bordes y radios
export const BORDER = {
    RADIUS: {
        XS: '0.125rem',   // 2px
        SM: '0.25rem',    // 4px
        BASE: '0.375rem', // 6px
        MD: '0.5rem',     // 8px
        LG: '0.75rem',    // 12px
        XL: '1rem',       // 16px
        PILL: '9999px'    // Pill shape
    },
    WIDTH: {
        DEFAULT: '1px',
        THICK: '2px',
        THICKER: '4px'
    }
};

// Sombras (ajustadas para fondo oscuro)
export const SHADOWS = {
    SM: '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
    BASE: '0 1px 3px 0 rgba(0, 0, 0, 0.4), 0 1px 2px 0 rgba(0, 0, 0, 0.24)',
    MD: '0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -1px rgba(0, 0, 0, 0.24)',
    LG: '0 10px 15px -3px rgba(0, 0, 0, 0.6), 0 4px 6px -2px rgba(0, 0, 0, 0.3)',
    XL: '0 20px 25px -5px rgba(0, 0, 0, 0.7), 0 10px 10px -5px rgba(0, 0, 0, 0.5)',
    '2XL': '0 25px 50px -12px rgba(0, 0, 0, 0.9)',
    GLOW: '0 0 10px rgba(255, 255, 255, 0.1)'  // Sombra tipo "glow" para destacar elementos
};

// Animaciones
export const ANIMATIONS = {
    DURATION: {
        FAST: '150ms',
        NORMAL: '300ms',
        SLOW: '500ms',
        SLOWER: '700ms',
        SLOWEST: '1000ms'
    },
    EASING: {
        LINEAR: 'linear',
        EASE: 'ease',
        EASE_IN: 'ease-in',
        EASE_OUT: 'ease-out',
        EASE_IN_OUT: 'ease-in-out'
    }
};

// Breakpoints para diseño responsivo
export const BREAKPOINTS = {
    XS: '0px',
    SM: '640px',
    MD: '768px',
    LG: '1024px',
    XL: '1280px',
    '2XL': '1536px'
};

// Configuraciones para z-index
export const Z_INDEX = {
    NEGATIVE: -1,      // Elementos que deben estar debajo de todo
    BASE: 0,           // Elementos normales
    LOW: 10,           // Elementos que deben estar ligeramente por encima
    MEDIUM: 100,       // Elementos como dropdowns
    HIGH: 1000,        // Elementos como modales o drawers
    OVERLAY: 2000,     // Overlays o backdrops
    POPOVER: 3000,     // Popovers, tooltips
    TOAST: 5000,       // Toasts o notificaciones
    HIGHEST: 9999      // Elementos críticos que deben estar sobre todo
};