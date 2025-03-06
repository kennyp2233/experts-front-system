'use client';

import React, { useEffect, useState } from 'react';
import { CanvasProvider } from './vista3d/CanvasContext';
import ThreeScene from './vista3d/ThreeScene';
import ModelGlb from './vista3d/ModelGlb';

export default function Rosa3D() {
    const [isClient, setIsClient] = useState(false);
    const [windowSize, setWindowSize] = useState({ width: 1920, height: 1080 });

    // Renderizar solo en el cliente y detectar tamaño de ventana
    useEffect(() => {
        setIsClient(true);

        // Capturar dimensiones reales de la ventana
        setWindowSize({
            width: window.innerWidth,
            height: window.innerHeight
        });

        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight
            });
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    if (!isClient) {
        return <div style={{ width: '100vw', height: '100vh' }} />;
    }

    // Ajustar posiciones basado en el tamaño de la pantalla
    const scaleFactor = Math.min(windowSize.width / 1920, windowSize.height / 1080);
    const xOffset = windowSize.width / 4; // Menor offset para mantener modelos más centrados

    return (
        <CanvasProvider>
            <ThreeScene>
                {/* Rosa 1 (izquierda) */}
                <ModelGlb
                    posx={-xOffset} // Posición relativa a la ventana
                    posy={100} // Ligeramente arriba
                    posz={-100} // Más cerca en el eje Z
                    rotx={0}
                    roty={45} // Girado para mejor visibilidad
                    rotz={10}
                    scale={60 * scaleFactor} // Escala adaptativa
                    anchorX={-xOffset / 2}
                    anchorElement={1}
                />

                {/* Rosa 2 (derecha) */}
                <ModelGlb
                    posx={xOffset} // Posición relativa al otro lado
                    posy={0}
                    posz={-200} // Más hacia atrás
                    rotx={15}
                    roty={-30} // Girado en dirección opuesta
                    rotz={20}
                    scale={70 * scaleFactor}
                    anchorX={xOffset / 2}
                    anchorElement={1}
                />

                {/* Avión */}
                <ModelGlb
                    posx={-xOffset * 0.7} // Menos desplazado
                    posy={300} // Más alto
                    posz={-150}
                    rotx={20}
                    roty={30}
                    rotz={0}
                    scale={4 * scaleFactor}
                    rutaGlb="/obj/airplane.glb"
                    anchorX={-xOffset * 0.3} // Menor distancia de anclaje
                    anchorY={100}
                    scrollType={2}
                    anchorElement={2}
                />

                {/* Camión */}
                <ModelGlb
                    posx={xOffset * 0.7} // Menos desplazado
                    posy={-200}
                    posz={-100} // Más cerca
                    rotx={15}
                    roty={-15} // Girado para mejor visibilidad
                    rotz={0}
                    scale={20 * scaleFactor}
                    rutaGlb="/obj/truck.glb"
                    anchorX={xOffset * 0.3} // Menor distancia de anclaje
                    scrollType={3}
                    anchorElement={2}
                />
            </ThreeScene>
        </CanvasProvider>
    );
}