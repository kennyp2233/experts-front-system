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

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleResize = () => {
        setDimensions({ width: window.innerWidth, height: window.innerHeight });
      };

      const handleScroll = () => {
        const currentScrollY = window.scrollY;
        const delta = currentScrollY - previousScrollYRef.current;
        setDeltaY(delta);
        setScrollY(currentScrollY);
        previousScrollYRef.current = currentScrollY;
      };

      window.addEventListener('resize', handleResize);
      window.addEventListener('scroll', handleScroll);

      // Llamadas iniciales
      handleResize();
      handleScroll();

      return () => {
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
