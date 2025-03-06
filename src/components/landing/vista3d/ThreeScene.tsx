'use client';

import React, { useRef, useEffect, useCallback } from 'react';
import * as THREE from 'three';
import { SceneContext, SceneContextProps } from './SceneContext';
import { useContext } from 'react';
import { CanvasContext } from './CanvasContext';

const ThreeScene: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const sceneRef = useRef(new THREE.Scene());
    const cameraRef = useRef<THREE.OrthographicCamera>();
    const rendererRef = useRef<THREE.WebGLRenderer>();
    const updatablesRef = useRef(new Set<() => void>());

    const { dimensions } = useContext(CanvasContext);

    useEffect(() => {
        if (!containerRef.current) return;

        const width = containerRef.current.clientWidth;
        const height = containerRef.current.clientHeight;

        const frustumSize = Math.max(width, height) * 1.2;
        const aspect = width / height;
        // Configurar cámara ortográfica
        const camera = new THREE.OrthographicCamera(
            frustumSize * aspect / -2,
            frustumSize * aspect / 2,
            frustumSize / 2,
            frustumSize / -2,
            0.1,
            10000
        );
        camera.position.set(0, 0, 500);
        camera.lookAt(0, 0, 0);
        cameraRef.current = camera;

        // Configurar renderer
        const renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
            preserveDrawingBuffer: true // Mejor para efectos visuales
        });
        renderer.setSize(width, height);
        renderer.setClearColor(0x000000, 0); // Fondo transparente
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limitar para rendimiento
        containerRef.current.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        // Añadir luz ambiente
        const ambientLight = new THREE.AmbientLight(0xffffff, 10);
        sceneRef.current.add(ambientLight);

        // Loop de animación
        const animate = () => {
            requestAnimationFrame(animate);
            // Ejecutar funciones de actualización registradas
            updatablesRef.current.forEach((updateFn) => updateFn());
            renderer.render(sceneRef.current, camera);
        };
        animate();

        // Usar ResizeObserver para detectar cambios en el contenedor mismo
        const resizeObserver = new ResizeObserver(() => {
            if (!containerRef.current) return;

            const w = containerRef.current.clientWidth;
            const h = containerRef.current.clientHeight;

            // Recalcular frustum para mantener proporción
            const newFrustumSize = Math.max(w, h) * 1.2;
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
            resizeObserver.disconnect();
            if (rendererRef.current) {
                rendererRef.current.dispose();
            }
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
        scene: sceneRef.current,
        camera: cameraRef.current!,
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
                }}
            />
            {children}
        </SceneContext.Provider>
    );
};

export default ThreeScene;