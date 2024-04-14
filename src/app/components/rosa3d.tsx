import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useLoader, useThree, extend, useFrame } from 'react-three-fiber';
import { OrthographicCamera, useGLTF } from '@react-three/drei';

import { Group, Mesh, Vector3 } from 'three';
import { MTLLoader, OBJLoader } from 'three-stdlib';
import * as THREE from 'three';

interface ModelProps {
    posx?: number;
    posy?: number;
    posz?: number;
    rotx?: number;
    roty?: number;
    rotz?: number;
    scale?: number;
    rutaMtl?: string;
    rutaObj?: string;
}

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
}
function Setup() {
    const { gl } = useThree();
    gl.shadowMap.enabled = true;
    gl.shadowMap.type = THREE.PCFSoftShadowMap; // opcional, para sombras más suaves
    return null;
}




function ModelGlb({ posx = 0, posy = 0, posz = 0, rotx = 0, roty = 0, rotz = 0, scale = 1, rutaGlb = "/obj/rose2/rose2.glb", anchorX = 0, anchorY = 0, scrollType = 1 }: ModelGlbProps) {
    const ref = useRef<THREE.Group>();
    const gltf = useGLTF(rutaGlb);
    console.log(gltf);

    const [anchorMaxX, setAnchorMaxX] = useState(anchorX);

    const rotxInDegrees = rotx * (Math.PI / 180);
    const rotyInDegrees = roty * (Math.PI / 180);
    const rotzInDegrees = rotz * (Math.PI / 180);

    const targetX = useRef(posx);
    const targetY = useRef(posy);
    const targetYRot = useRef(rotyInDegrees);
    const targetZRot = useRef(rotzInDegrees);
    const lastScrollY = useRef(0);

    useEffect(() => {
        if (ref.current) {
            ref.current.position.set(posx, posy, posz);
            ref.current.rotation.set(rotxInDegrees, rotyInDegrees, rotzInDegrees);
            ref.current.scale.set(scale, scale, scale);
            setAnchorMaxX(anchorX);
            ref.current.traverse((node) => {
                if (node instanceof THREE.Mesh) {
                    // Ensure the material is a MeshStandardMaterial
                    if (node.material instanceof THREE.MeshStandardMaterial) {
                        node.material.roughness = 0.2;
                        node.material.metalness = 0.8;

                    }
                }
            });
        }
    }, [posx, posy, posz, rotxInDegrees, rotyInDegrees, rotzInDegrees, scale, anchorX]);




    useEffect(() => {
        const handleScroll = () => {
            if (ref.current) {
                const scrollY = window.scrollY;
                const deltaY = scrollY - lastScrollY.current;
                switch (scrollType) {
                    case 1:
                        targetX.current = posx >= 0 ? Math.max(anchorMaxX, targetX.current - deltaY * 2) : Math.min(anchorMaxX, targetX.current + deltaY * 2);
                        targetYRot.current += deltaY * 0.01;
                        targetZRot.current += deltaY * 0.01;

                        break;
                    case 2:
                        targetX.current = posx >= 0 ? Math.max(anchorMaxX, targetX.current - deltaY * 2) : Math.min(anchorMaxX, targetX.current + deltaY * 2);
                        targetY.current = posy >= 0 ? Math.max(anchorY, targetY.current - deltaY * 2) : Math.min(anchorY, targetY.current + deltaY * 2);
                        break;

                    case 3:
                        targetX.current = posx >= 0 ? Math.max(anchorMaxX, targetX.current - deltaY * 2) : Math.min(anchorMaxX, targetX.current + deltaY * 2);

                        break;
                    default:
                        break;
                }
                lastScrollY.current = scrollY;


            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [anchorMaxX, anchorY, posx, posy, scrollType]);

    useFrame(() => {
        if (ref.current) {
            ref.current.position.x += (targetX.current - ref.current.position.x) * 0.05;
            ref.current.position.y += (targetY.current - ref.current.position.y) * 0.05;
            ref.current.rotation.y += (targetYRot.current - ref.current.rotation.y) * 0.05;
            ref.current.rotation.z += (targetZRot.current - ref.current.rotation.z) * 0.05;
        }
    });
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 929) {
                setAnchorMaxX(anchorX + (posx >= 0 ? -10 : 10));
            } else {
                setAnchorMaxX(anchorX);
            }
        };

        window.addEventListener('resize', handleResize);

        // Call the function once to set the initial state
        handleResize();

        // Clean up the event listener when the component unmounts
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <group>
            <primitive ref={ref} object={gltf.scene.clone(true)} material={gltf.materials.default} receiveShadow castShadow />
            <pointLight position={[posx, posy + 200, posz]} intensity={10000} castShadow /> {/* Luz puntual para este modelo */}
        </group>
    );
}



export default function Rosa3() {
    const ref = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    useEffect(() => {
        if (ref.current) {
            setDimensions({
                width: ref.current.offsetWidth,
                height: ref.current.offsetHeight,
            });
        }
    }, [ref]);

    return (
        <div ref={ref} className='h-full w-full absolute'>
            <Canvas>
                <Setup />
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
                <ambientLight intensity={9} />
                <pointLight position={[10, 10, 100]} intensity={10000} castShadow />
                <pointLight position={[-100, 10, 10]} intensity={10000} castShadow /> {/* Nueva luz */}
                <pointLight position={[250, 0, -120]} intensity={10000} castShadow /> {/* Nueva luz */}
                <pointLight position={[10, -100, 10]} intensity={10000} castShadow /> {/* Nueva luz */}
                <pointLight position={[10, 10, -100]} intensity={10000} castShadow /> {/* Nueva luz */}

                <Suspense fallback={null}>
                    <ModelGlb
                        posx={-800}
                        posy={280}
                        posz={0}
                        rotx={0}
                        roty={0}
                        rotz={0}
                        scale={80}
                        anchorX={-500}
                    />

                    <ModelGlb
                        posx={800}
                        posy={120}
                        posz={-500}
                        rotx={25}
                        roty={10}
                        rotz={50}
                        scale={80}
                        anchorX={400}
                    />

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
                        anchorY={-200}
                        scrollType={2}
                    />
                    <ModelGlb
                        posx={800}
                        posy={-150}
                        posz={-120}
                        rotx={30}
                        roty={10}
                        rotz={0}
                        scale={25}
                        rutaGlb='/obj/truck.glb'
                        anchorX={250}
                        scrollType={3}
                    />
                </Suspense>

            </Canvas>
        </div>
    );
};