// Rosa3.tsx

'use client'; // Asegura que este componente se renderice solo en el cliente

import React, {
    Suspense,
    useEffect,
    useMemo,
    useRef,
    useState,
    createContext,
    useContext,
} from 'react';
import { Canvas, useFrame, useThree } from 'react-three-fiber';
import { OrthographicCamera, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

// ========================================
// Contexto para Compartir Dimensiones y Scroll
// ========================================

// CanvasContextProps actualizado
interface CanvasContextProps {
    dimensions: { width: number; height: number };
    scrollY: number;
    deltaY: number;
}

// CanvasContext actualizado
const CanvasContext = createContext<CanvasContextProps>({
    dimensions: { width: 0, height: 0 },
    scrollY: 0,
    deltaY: 0,
});

// CanvasProvider actualizado
const CanvasProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [dimensions, setDimensions] = useState({
        width: 0,
        height: 0,
    });
    const [scrollY, setScrollY] = useState(0);
    const [deltaY, setDeltaY] = useState(0);
    const previousScrollYRef = useRef(0);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const handleResize = () => {
                setDimensions({
                    width: window.innerWidth,
                    height: window.innerHeight,
                });
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
// ========================================
// Configuración Inicial del Renderer
// ========================================

const Setup: React.FC = () => {
    const { gl } = useThree();
    useEffect(() => {
        gl.shadowMap.enabled = true;
        gl.shadowMap.type = THREE.PCFSoftShadowMap;
    }, [gl]);
    return null;
};

// ========================================
// Configuración de la Cámara Ortográfica
// ========================================

const CameraSetup: React.FC = () => {
    const { dimensions } = useContext(CanvasContext);
    return (
        <OrthographicCamera
            position={[0, 0, 100]}
            makeDefault
            left={dimensions.width / -2}
            right={dimensions.width / 2}
            top={dimensions.height / 2}
            bottom={dimensions.height / -2}
            near={0.1}
            far={10000}
        />
    );
};

// ========================================
// Interfaz para las Propiedades de ModelGlb
// ========================================

interface ModelGlbProps {
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

// ========================================
// Componente para Renderizar Modelos GLB
// ========================================

const ModelGlb: React.FC<ModelGlbProps> = ({
    posx = 0,
    posy = 0,
    posz = 0,
    rotx = 0,
    roty = 0,
    rotz = 0,
    scale = 1,
    rutaGlb = "/obj/rose2/rose2.glb",
    anchorX = 0,
    anchorY = 0,
    scrollType = 1,
    anchorElement = 0,
}) => {
    const { scrollY, deltaY, dimensions } = useContext(CanvasContext);

    const ref = useRef<THREE.Group>(null);
    const lightRef = useRef<THREE.PointLight>(null);

    // Cargar el modelo GLTF
    const gltf = useGLTF(rutaGlb);
    const clonedScene = useMemo(() => gltf.scene.clone(true), [gltf.scene]);

    // Convertir rotaciones a radianes
    const rotxRad = useMemo(() => THREE.MathUtils.degToRad(rotx), [rotx]);
    const rotyRad = useMemo(() => THREE.MathUtils.degToRad(roty), [roty]);
    const rotzRad = useMemo(() => THREE.MathUtils.degToRad(rotz), [rotz]);

    // Targets para animación
    const targetX = useRef(posx);
    const targetY = useRef(posy);
    const targetYRot = useRef(rotyRad);
    const targetZRot = useRef(rotzRad);

    // Ref para anchorMaxX
    const anchorMaxXRef = useRef(anchorX);

    // Inicializar posición, rotación, escala y propiedades del material
    useEffect(() => {
        if (ref.current) {
            ref.current.position.set(posx, posy, posz);
            ref.current.rotation.set(rotxRad, rotyRad, rotzRad);
            ref.current.scale.set(scale, scale, scale);
            ref.current.traverse((node) => {
                if (
                    node instanceof THREE.Mesh &&
                    node.material instanceof THREE.MeshStandardMaterial
                ) {
                    node.material.roughness = 0.2;
                    node.material.metalness = 0.8;
                }
            });
        }
    }, [posx, posy, posz, rotxRad, rotyRad, rotzRad, scale]);

    // Manejar comportamiento responsivo basado en el ancho de la ventana
    useEffect(() => {
        if (dimensions.width <= 929) {
            switch (anchorElement) {
                case 1:
                    anchorMaxXRef.current =
                        posx >= 0
                            ? (1 * dimensions.width) / 2.5
                            : (-1 * dimensions.width) / 2.5;
                    targetY.current = (anchorY !== 0 ? anchorY : posy) - 100;
                    break;
                case 2:
                    targetY.current = (anchorY !== 0 ? anchorY : posy) - 150;
                    break;
                default:
                    break;
            }
        } else {
            anchorMaxXRef.current = anchorX;
        }
    }, [dimensions.width, anchorX, anchorY, posx, posy, anchorElement]);

    // Manejar scroll para actualizar targets de animación
    useEffect(() => {
        const deltaY = scrollY / 100;

        switch (scrollType) {
            case 1:
                targetX.current =
                    posx >= 0
                        ? Math.max(anchorMaxXRef.current, targetX.current - deltaY * 2)
                        : Math.min(anchorMaxXRef.current, targetX.current + deltaY * 2);
                targetYRot.current += deltaY * 0.01;
                targetZRot.current += deltaY * 0.01;
                break;
            case 2:
                targetX.current =
                    posx >= 0
                        ? Math.max(anchorMaxXRef.current, targetX.current - deltaY * 2)
                        : Math.min(anchorMaxXRef.current, targetX.current + deltaY * 2);
                targetY.current =
                    posy >= 0
                        ? Math.max(anchorY, targetY.current - deltaY * 2)
                        : Math.min(anchorY, targetY.current + deltaY * 2);
                break;
            case 3:
                targetX.current =
                    posx >= 0
                        ? Math.max(anchorMaxXRef.current, targetX.current - deltaY * 2)
                        : Math.min(anchorMaxXRef.current, targetX.current + deltaY * 2);
                break;
            default:
                break;
        }
    }, [scrollY, scrollType, posx, posy, anchorY, anchorElement, dimensions.width]);

    // Animar el modelo en cada frame
    useFrame(() => {
        if (ref.current) {
            ref.current.position.x += (targetX.current - ref.current.position.x) * 0.05;
            ref.current.position.y += (targetY.current - ref.current.position.y) * 0.05;
            ref.current.rotation.y += (targetYRot.current - ref.current.rotation.y) * 0.05;
            ref.current.rotation.z += (targetZRot.current - ref.current.rotation.z) * 0.05;

            if (lightRef.current) {
                lightRef.current.position.set(
                    ref.current.position.x,
                    ref.current.position.y + 200,
                    ref.current.position.z + 150
                );
            }
        }
    });

    return (
        <group>
            <primitive
                ref={ref}
                object={clonedScene}
                receiveShadow
                castShadow
            />
            <pointLight
                ref={lightRef}
                position={[posx, posy + 200, posz + 150]}
                intensity={1} // Ajusta según necesidad
                castShadow
            />
        </group>
    );
};

// ========================================
// Componente Principal Rosa3
// ========================================

const Rosa3: React.FC = () => {
    const ref = useRef<HTMLDivElement>(null);

    return (
        <CanvasProvider>
            <div
                ref={ref}
                id="myCanvas"
                className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[100vh] z-[-1] w-[100vw] max-lg:h-full'
            >
                <Canvas>
                    <Setup />
                    <CameraSetup />
                    <ambientLight intensity={10} />

                    <Suspense fallback={null}>
                        {/* Modelo 1 */}
                        <ModelGlb
                            posx={-800}
                            posy={180}
                            posz={0}
                            rotx={0}
                            roty={0}
                            rotz={0}
                            scale={80}
                            anchorX={-500}
                            anchorElement={1}
                        />

                        {/* Modelo 2 */}
                        <ModelGlb
                            posx={800}
                            posy={20}
                            posz={-500}
                            rotx={25}
                            roty={10}
                            rotz={50}
                            scale={80}
                            anchorX={400}
                            anchorElement={1}
                        />

                        {/* Modelo 3 */}
                        <ModelGlb
                            posx={-800}
                            posy={500}
                            posz={-100}
                            rotx={30}
                            roty={70}
                            rotz={0}
                            scale={5}
                            rutaGlb='/obj/airplane.glb'
                            anchorX={-190}
                            anchorY={-300}
                            scrollType={2}
                            anchorElement={2}
                        />

                        {/* Modelo 4 */}
                        <ModelGlb
                            posx={800}
                            posy={-250}
                            posz={-120}
                            rotx={30}
                            roty={10}
                            rotz={0}
                            scale={25}
                            rutaGlb='/obj/truck.glb'
                            anchorX={250}
                            scrollType={3}
                            anchorElement={2}
                        />
                    </Suspense>
                </Canvas>
            </div>
        </CanvasProvider>
    );
};

export default Rosa3;
