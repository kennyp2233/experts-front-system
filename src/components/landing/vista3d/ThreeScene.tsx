'use client';

import React, { useRef, useEffect, useCallback } from 'react';
import * as THREE from 'three';
import { SceneContext, SceneContextProps } from './SceneContext';
import { useContext } from 'react';
import { CanvasContext } from './CanvasContext';

const ThreeScene: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const sceneRef = useRef<THREE.Scene | null>(null);
    const cameraRef = useRef<THREE.OrthographicCamera | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const requestRef = useRef<number | null>(null);
    const updatablesRef = useRef(new Set<() => void>());
    const mountedRef = useRef(false);

    const { dimensions } = useContext(CanvasContext);

    // Inicialización de la escena y limpieza
    useEffect(() => {
        if (!containerRef.current || mountedRef.current) return;
        mountedRef.current = true;

        // Crear nueva escena solo si no existe
        if (!sceneRef.current) {
            sceneRef.current = new THREE.Scene();
        }

        const width = containerRef.current.clientWidth;
        const height = containerRef.current.clientHeight;

        // Calcular el frustum para que se ajuste mejor al viewport
        const frustumSize = Math.max(width, height) * 1.0; // Factor reducido para mejor encuadre
        const aspect = width / height;

        // Configurar cámara ortográfica con centro ajustado
        const camera = new THREE.OrthographicCamera(
            frustumSize * aspect / -2,
            frustumSize * aspect / 2,
            frustumSize / 2,
            frustumSize / -2,
            0.1,
            10000
        );

        // Posicionar la cámara ligeramente hacia abajo para centrar los objetos
        camera.position.set(0, 0, 500);
        camera.lookAt(0, 0, 0);
        cameraRef.current = camera;

        // Configurar renderer
        const renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
            preserveDrawingBuffer: true
        });
        renderer.setSize(width, height);
        renderer.setClearColor(0x000000, 0); // Fondo transparente
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        if (containerRef.current) {
            // Limpiar cualquier elemento existente
            while (containerRef.current.firstChild) {
                containerRef.current.removeChild(containerRef.current.firstChild);
            }
            containerRef.current.appendChild(renderer.domElement);
        }

        rendererRef.current = renderer;

        // Añadir luz ambiente
        const ambientLight = new THREE.AmbientLight(0xffffff, 10);
        sceneRef.current.add(ambientLight);

        // Loop de animación
        const animate = () => {
            updatablesRef.current.forEach((updateFn) => updateFn());

            if (rendererRef.current && sceneRef.current && cameraRef.current) {
                rendererRef.current.render(sceneRef.current, cameraRef.current);
            }

            requestRef.current = requestAnimationFrame(animate);
        };

        requestRef.current = requestAnimationFrame(animate);

        // Usar ResizeObserver para detectar cambios en el contenedor
        const resizeObserver = new ResizeObserver(() => {
            if (!containerRef.current) return;

            const w = containerRef.current.clientWidth;
            const h = containerRef.current.clientHeight;

            // Recalcular frustum para mantener proporción
            const newFrustumSize = Math.max(w, h) * 1.0; // Mantener el factor
            const newAspect = w / h;

            if (cameraRef.current) {
                cameraRef.current.left = newFrustumSize * newAspect / -2;
                cameraRef.current.right = newFrustumSize * newAspect / 2;
                cameraRef.current.top = newFrustumSize / 2;
                cameraRef.current.bottom = newFrustumSize / -2;
                cameraRef.current.updateProjectionMatrix();
            }

            if (rendererRef.current) {
                rendererRef.current.setSize(w, h);
            }
        });

        if (containerRef.current) {
            resizeObserver.observe(containerRef.current);
        }

        return () => {
            mountedRef.current = false;
            resizeObserver.disconnect();

            // Limpiar loop de animación
            if (requestRef.current !== null) {
                cancelAnimationFrame(requestRef.current);
                requestRef.current = null;
            }

            // Limpiar memoria y DOM
            if (rendererRef.current) {
                rendererRef.current.dispose();

                if (containerRef.current && containerRef.current.contains(rendererRef.current.domElement)) {
                    containerRef.current.removeChild(rendererRef.current.domElement);
                }

                rendererRef.current = null;
            }

            // Limpiar escena
            if (sceneRef.current) {
                sceneRef.current.clear();
            }

            // Limpiar callbacks
            updatablesRef.current.clear();
        };
    }, []);

    // Funciones para registrar y eliminar callbacks de actualización
    const addUpdate = useCallback((callback: () => void) => {
        updatablesRef.current.add(callback);
    }, []);

    const removeUpdate = useCallback((callback: () => void) => {
        updatablesRef.current.delete(callback);
    }, []);

    const contextValue: SceneContextProps = {
        scene: sceneRef.current || new THREE.Scene(),
        camera: cameraRef.current as THREE.Camera,
        addUpdate,
        removeUpdate,
    };

    return (
        <SceneContext.Provider value={contextValue}>
            <div
                ref={containerRef}
                style={{
                    width: '100%',
                    height: '100%',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: -1,
                    pointerEvents: 'none' // Para permitir interacción con elementos debajo
                }}
            />
            {children}
        </SceneContext.Provider>
    );
};

export default ThreeScene;