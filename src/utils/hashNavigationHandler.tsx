// src/utils/hashNavigationHandler.tsx
'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';

interface SectionRefs {
    [key: string]: React.RefObject<HTMLElement>;
}

export default function useHashNavigation(sectionRefs: SectionRefs) {
    const router = useRouter();
    const pathname = usePathname();
    const initialLoadDone = useRef(false);

    // Función para manejar el cambio de hash en la URL
    const scrollToSection = (hash: string) => {
        // Remover el # del inicio si existe
        const sectionId = hash.startsWith('#') ? hash.substring(1) : hash;

        // Verificar si existe la referencia para esta sección
        if (sectionRefs[sectionId] && sectionRefs[sectionId].current) {
            // Scroll hacia la sección
            sectionRefs[sectionId].current?.scrollIntoView({
                behavior: 'smooth'
            });

            // Actualizar la URL sin causar navegación adicional
            if (typeof window !== 'undefined') {
                window.history.pushState(null, '', `/#${sectionId}`);
            }
        }
    };

    // Efecto para manejar la navegación inicial basada en el hash
    useEffect(() => {
        if (typeof window !== 'undefined' && !initialLoadDone.current) {
            // Obtener el hash actual de la URL al cargar la página
            const hash = window.location.hash;

            if (hash) {
                // Pequeño retraso para asegurar que los componentes estén montados
                setTimeout(() => {
                    scrollToSection(hash);
                }, 500);
            }

            initialLoadDone.current = true;
        }
    }, []);

    // Efecto para manejar cambios en la URL durante la navegación
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const handleHashChange = () => {
                const hash = window.location.hash;
                if (hash) {
                    scrollToSection(hash);
                }
            };

            // Escuchar eventos de cambio de hash
            window.addEventListener('hashchange', handleHashChange);

            // Limpiar listener al desmontar
            return () => {
                window.removeEventListener('hashchange', handleHashChange);
            };
        }
    }, []);

    // Función para navegar programáticamente y actualizar la URL
    const navigateToSection = (sectionId: string) => {
        if (sectionRefs[sectionId] && sectionRefs[sectionId].current) {
            // Scroll a la sección
            sectionRefs[sectionId].current?.scrollIntoView({
                behavior: 'smooth'
            });

            // Actualizar la URL con el hash
            if (typeof window !== 'undefined') {
                window.history.pushState(null, '', `/#${sectionId}`);
            }
        }
    };

    return { navigateToSection };
}