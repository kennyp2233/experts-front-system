'use client';

import React, { useEffect, useRef, useContext } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { SceneContext } from './SceneContext';
import { CanvasContext } from './CanvasContext';

export interface ModelGlbProps {
    posx?: number;
    posy?: number;
    posz?: number;
    rotx?: number;
    roty?: number;
    rotz?: number;
    scale?: number;
    rutaGlb?: string;
    anchorX?: number;
    anchorY?: number;
    scrollType?: number;
    anchorElement?: number;
}

const ModelGlb: React.FC<ModelGlbProps> = ({
    posx = 0,
    posy = 0,
    posz = 0,
    rotx = 0,
    roty = 0,
    rotz = 0,
    scale = 1,
    rutaGlb = '/obj/rose2/rose2.glb',
    anchorX = 0,
    anchorY = 0,
    scrollType = 1,
    anchorElement = 0,
}) => {
    const { scene, addUpdate, removeUpdate } = useContext(SceneContext)!;
    const { scrollY, dimensions } = useContext(CanvasContext);
    const modelRef = useRef<THREE.Group | null>(null);
    const lightRef = useRef<THREE.PointLight | null>(null);
    const mountedRef = useRef(false);

    // Ref para controlar si el modelo ya ha sido cargado
    const modelLoadedRef = useRef(false);

    // Refs para mantener los valores de scroll actualizados
    const scrollYRef = useRef(0);
    const initialScrollRef = useRef(0);

    useEffect(() => {
        scrollYRef.current = scrollY;

        // Solo establecer el scroll inicial una vez al principio
        if (!modelLoadedRef.current) {
            initialScrollRef.current = scrollY;
        }
    }, [scrollY]);

    // Cargar el modelo GLTF
    useEffect(() => {
        if (!scene || mountedRef.current) return;
        mountedRef.current = true;

        const loader = new GLTFLoader();

        // Crear luz solo si aún no existe
        if (!lightRef.current) {
            const light = new THREE.PointLight(0xffffff, 1);
            light.position.set(posx, posy + 200, posz + 150);
            scene.add(light);
            lightRef.current = light;
        }

        // Cargar el modelo
        loader.load(
            rutaGlb,
            (gltf: { scene: { clone: (arg0: boolean) => any; }; }) => {
                // Limpiar modelo anterior si existe
                if (modelRef.current) {
                    scene.remove(modelRef.current);
                }

                const loadedModel = gltf.scene.clone(true);
                modelRef.current = loadedModel;

                // Configurar posición, rotación y escala inicial
                loadedModel.position.set(posx, posy, posz);
                loadedModel.rotation.set(
                    THREE.MathUtils.degToRad(rotx),
                    THREE.MathUtils.degToRad(roty),
                    THREE.MathUtils.degToRad(rotz)
                );
                loadedModel.scale.set(scale, scale, scale);

                // Optimizar materiales
                loadedModel.traverse((node: any) => {
                    if (node instanceof THREE.Mesh && node.material instanceof THREE.MeshStandardMaterial) {
                        node.material.roughness = 0.2;
                        node.material.metalness = 0.8;
                    }
                });

                scene.add(loadedModel);
                modelLoadedRef.current = true;
            },
            // Progress callback
            (xhr: any) => {
                // console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
            },
            // Error callback
            (error: any) => {
                console.error('Error al cargar el modelo:', error);
            }
        );

        // Limpieza al desmontar
        return () => {
            mountedRef.current = false;
            if (modelRef.current) {
                scene.remove(modelRef.current);
                modelRef.current = null;
            }
            if (lightRef.current) {
                scene.remove(lightRef.current);
                lightRef.current = null;
            }
        };
    }, [rutaGlb, posx, posy, posz, rotx, roty, rotz, scale, scene]);

    // Refs para animación y targets
    const targetX = useRef(posx);
    const targetY = useRef(posy);
    const targetRotY = useRef(THREE.MathUtils.degToRad(roty));
    const targetRotZ = useRef(THREE.MathUtils.degToRad(rotz));
    const anchorMaxXRef = useRef(anchorX);
    const updateFunctionRef = useRef<() => void>();

    // Ajustar valores responsivos según el ancho de la ventana
    useEffect(() => {
        if (dimensions.width <= 929) {
            if (anchorElement === 1) {
                anchorMaxXRef.current = posx >= 0 ? dimensions.width / 2.5 : -dimensions.width / 2.5;
                targetY.current = (anchorY !== 0 ? anchorY : posy) - 100;
            } else if (anchorElement === 2) {
                targetY.current = (anchorY !== 0 ? anchorY : posy) - 150;
            }
        } else {
            anchorMaxXRef.current = anchorX;
            // Restablecer targetY a su valor original cuando no es pantalla pequeña
            if (anchorElement === 1 || anchorElement === 2) {
                targetY.current = anchorY !== 0 ? anchorY : posy;
            }
        }
    }, [dimensions.width, anchorElement, anchorX, anchorY, posx, posy]);

    // Registrar callback de actualización para animar el modelo
    useEffect(() => {
        // Definir la función de actualización
        const update = () => {
            if (!modelRef.current) return;

            // Factor de suavizado para que los movimientos sean menos sensibles
            const scrollFactor = 0.08;

            // Usar la diferencia de scroll con respecto al inicial
            const normalizedScroll = (scrollYRef.current - initialScrollRef.current) * scrollFactor;

            // Actualizar targets según el tipo de scroll
            switch (scrollType) {
                case 1: // Solo movimiento X y rotación
                    targetX.current = posx >= 0
                        ? Math.max(anchorMaxXRef.current, posx - normalizedScroll)
                        : Math.min(anchorMaxXRef.current, posx + normalizedScroll);
                    targetRotY.current = THREE.MathUtils.degToRad(roty) + normalizedScroll * 0.01;
                    targetRotZ.current = THREE.MathUtils.degToRad(rotz) + normalizedScroll * 0.01;
                    break;
                case 2: // Movimiento X e Y
                    targetX.current = posx >= 0
                        ? Math.max(anchorMaxXRef.current, posx - normalizedScroll)
                        : Math.min(anchorMaxXRef.current, posx + normalizedScroll);
                    targetY.current = posy >= 0
                        ? Math.max(anchorY, posy - normalizedScroll)
                        : Math.min(anchorY, posy + normalizedScroll);
                    break;
                case 3: // Solo movimiento X
                    targetX.current = posx >= 0
                        ? Math.max(anchorMaxXRef.current, posx - normalizedScroll)
                        : Math.min(anchorMaxXRef.current, posx + normalizedScroll);
                    break;
                default:
                    break;
            }

            // Factor de amortiguación para animaciones suaves
            const dampingFactor = 0.02;

            // Aplicar interpolación suave
            modelRef.current.position.x += (targetX.current - modelRef.current.position.x) * dampingFactor;
            modelRef.current.position.y += (targetY.current - modelRef.current.position.y) * dampingFactor;
            modelRef.current.rotation.y += (targetRotY.current - modelRef.current.rotation.y) * dampingFactor;
            modelRef.current.rotation.z += (targetRotZ.current - modelRef.current.rotation.z) * dampingFactor;

            // Actualizar posición de la luz para que siga al modelo
            if (lightRef.current) {
                lightRef.current.position.set(
                    modelRef.current.position.x,
                    modelRef.current.position.y + 200,
                    modelRef.current.position.z + 150
                );
            }
        };

        // Guardar referencia para limpieza
        updateFunctionRef.current = update;

        // Registrar la función de actualización
        if (addUpdate) {
            addUpdate(update);
        }

        // Limpieza al desmontar
        return () => {
            if (removeUpdate && updateFunctionRef.current) {
                removeUpdate(updateFunctionRef.current);
            }
        };
    }, [addUpdate, removeUpdate, scrollType, posx, posy, roty, rotz, anchorX, anchorY, anchorElement]);

    return null;
};

export default ModelGlb;