'use client';

import React, { useEffect, useState, useRef } from 'react';
import { CanvasProvider } from './vista3d/CanvasContext';
import ThreeScene from './vista3d/ThreeScene';
import ModelGlb from './vista3d/ModelGlb';

export default function Rosa3D() {
    const [isClient, setIsClient] = useState(false);
    const [windowSize, setWindowSize] = useState({ width: 1920, height: 1080 });
    const [isMobile, setIsMobile] = useState(false);
    const mountedRef = useRef(false);

    // Renderizar solo en el cliente y detectar tamaño de ventana
    useEffect(() => {
        // Prevenir múltiples inicializaciones
        if (mountedRef.current) return;
        mountedRef.current = true;

        setIsClient(true);

        // Capturar dimensiones reales de la ventana
        const handleResize = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;

            setWindowSize({ width, height });
            setIsMobile(width < 768); // Detectar si es móvil
        };

        // Llamar inmediatamente y configurar el listener
        handleResize();
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            mountedRef.current = false;
        };
    }, []);

    if (!isClient) {
        return <div style={{ width: '100%', height: '100%' }} />;
    }

    // Calcular escala base para diferentes tamaños de pantalla
    const getScaleFactor = () => {
        if (isMobile) {
            return 0.8; // Escala base más grande para móviles
        } else {
            return Math.min(windowSize.width / 1920, windowSize.height / 1080);
        }
    };

    const scaleFactor = getScaleFactor();

    // Calcular posiciones adaptadas para diferentes tamaños de pantalla
    const getPositions = () => {
        // Posiciones por defecto para escritorio
        let positions = {
            rosa1: {
                x: -windowSize.width / 4,
                y: 100,
                z: -100,
                scale: 120 * scaleFactor
            },
            rosa2: {
                x: windowSize.width / 4,
                y: 400,
                z: -200,
                scale: 140 * scaleFactor
            },
            avion: {
                x: -windowSize.width / 4 * 1.5,
                y: 450,
                z: -150,
                scale: 12 * scaleFactor
            },
            camion: {
                x: windowSize.width / 4 * 0.7,
                y: -200,
                z: -100,
                scale: 80 * scaleFactor
            }
        };

        // Ajustes para móvil
        if (isMobile) {
            positions = {
                rosa1: {
                    x: 0, // Centrado horizontalmente
                    y: 100, // Más arriba
                    z: -250, // Más atrás para dar perspectiva
                    scale: 80 // Escala fija más grande para móviles
                },
                rosa2: {
                    x: -windowSize.width / 1.5, // Centrado
                    y: -270, // Más abajo
                    z: -180, // Posición Z intermedia
                    scale: 90 // Escala fija más grande
                },
                avion: {
                    x: -windowSize.width / 1.5, // Menos desplazado
                    y: 450, // Posición vertical ajustada
                    z: -120, // Más cerca
                    scale: 5 // Escala fija para mejor visibilidad
                },
                camion: {
                    x: windowSize.width / 6, // Menos desplazado
                    y: -300, // Más arriba
                    z: -80, // Más cerca
                    scale: 25 // Escala fija mayor
                }
            };
        }

        return positions;
    };

    const positions = getPositions();

    return (
        <CanvasProvider>
            <ThreeScene>
                {/* Rosa 1 */}
                <ModelGlb
                    key="rosa-left"
                    posx={positions.rosa1.x}
                    posy={positions.rosa1.y}
                    posz={positions.rosa1.z}
                    rotx={0}
                    roty={isMobile ? 20 : 45} // Ajustar rotación para mejor visibilidad
                    rotz={10}
                    scale={positions.rosa1.scale}
                    anchorX={isMobile ? 0 : -windowSize.width / 8} // Menor desplazamiento en móviles
                    anchorElement={1}
                    scrollType={isMobile ? 2 : 1} // Cambiar comportamiento de scroll en móviles
                />

                {/* Rosa 2 */}
                <ModelGlb
                    key="rosa-right"
                    posx={positions.rosa2.x}
                    posy={positions.rosa2.y}
                    posz={positions.rosa2.z}
                    rotx={15}
                    roty={isMobile ? -20 : -30}
                    rotz={20}
                    scale={positions.rosa2.scale}
                    anchorX={isMobile ? 0 : windowSize.width / 8}
                    anchorElement={1}
                    scrollType={isMobile ? 2 : 1}
                />

                {/* Avión */}
                <ModelGlb
                    key="airplane"
                    posx={positions.avion.x}
                    posy={positions.avion.y}
                    posz={positions.avion.z}
                    rotx={20}
                    roty={30}
                    rotz={0}
                    scale={positions.avion.scale}
                    rutaGlb="/obj/airplane.glb"
                    anchorX={isMobile ? -windowSize.width / 10 : -windowSize.width / 4 * 0.3}
                    anchorY={isMobile ? 50 : 100}
                    scrollType={2}
                    anchorElement={2}
                />

                {/* Camión */}
                <ModelGlb
                    key="truck"
                    posx={positions.camion.x}
                    posy={positions.camion.y}
                    posz={positions.camion.z}
                    rotx={15}
                    roty={-15}
                    rotz={0}
                    scale={positions.camion.scale}
                    rutaGlb="/obj/truck.glb"
                    anchorX={isMobile ? windowSize.width / 10 : windowSize.width / 4 * 0.3}
                    scrollType={3}
                    anchorElement={2}
                />
            </ThreeScene>
        </CanvasProvider>
    );
}