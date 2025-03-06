'use client';

import React, { createContext, useEffect, useRef, useState } from 'react';

export interface CanvasContextProps {
  dimensions: { width: number; height: number };
  scrollY: number;
  deltaY: number;
}

export const CanvasContext = createContext<CanvasContextProps>({
  dimensions: { width: 0, height: 0 },
  scrollY: 0,
  deltaY: 0,
});

export const CanvasProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [scrollY, setScrollY] = useState(0);
  const [deltaY, setDeltaY] = useState(0);
  const previousScrollYRef = useRef(0);
  const mountedRef = useRef(false);

  useEffect(() => {
    if (mountedRef.current) return;
    mountedRef.current = true;

    if (typeof window !== 'undefined') {
      const handleResize = () => {
        // Obtener dimensiones precisas
        const width = window.innerWidth;
        const height = window.innerHeight;

        // Aplicar inmediatamente para evitar retrasos
        setDimensions({ width, height });
      };

      const handleScroll = () => {
        const currentScrollY = window.scrollY;
        const delta = currentScrollY - previousScrollYRef.current;
        setDeltaY(delta);
        setScrollY(currentScrollY);
        previousScrollYRef.current = currentScrollY;
      };

      // Ejecutar antes de la primera renderización
      handleResize();
      handleScroll();

      // Configurar eventos con opciones de rendimiento
      window.addEventListener('resize', handleResize, { passive: true });
      window.addEventListener('scroll', handleScroll, { passive: true });

      return () => {
        mountedRef.current = false;
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('scroll', handleScroll);
      };
    }
  }, []);

  return (
    <CanvasContext.Provider value={{ dimensions, scrollY, deltaY }}>
      {children}
    </CanvasContext.Provider>
  );
};