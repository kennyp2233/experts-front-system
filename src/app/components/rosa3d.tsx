import React, { Suspense, useEffect, useRef, useState } from 'react';
import { Canvas, useLoader, useThree, extend, useFrame } from 'react-three-fiber';
import { OrthographicCamera } from '@react-three/drei';

import { Group, Vector3 } from 'three';
import { MTLLoader, OBJLoader } from 'three-stdlib';
import * as THREE from 'three';


function Model({ posx, posy, posz, dir }: { posx: number, posy: number, posz: number, dir: number }) {
    const materials = useLoader(MTLLoader, '/obj/rose2/PUSHILIN_Rose_Bush.mtl');
    const obj = useLoader(OBJLoader, '/obj/rose2/PUSHILIN_Rose_Bush.obj', loader => {
        materials.preload();
        loader.setMaterials(materials);
    });

    const ref = useRef<Group>(); // Define the ref to be of type Group

    const scale = 50;

    useEffect(() => {
        if (obj) {
            obj.scale.set(scale, scale, scale);
            ref.current = obj;
            obj.position.x = posx;

        }
    }, [obj]);


    let targetX = 0;
    let targetY = 0;
    let targetZ = 0;

    useEffect(() => {
        const handleScroll = () => {
            if (ref.current) {
                const scrollY = window.scrollY;
                targetX = dir > 0 ? Math.max(0, posx + scrollY * 2) : Math.min(0, posx + scrollY * 2);
                targetY = posy + scrollY * 0.01;
                targetZ = posz + scrollY * 0.01;
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useFrame(() => {
        if (ref.current) {
            ref.current.position.x += (targetX - ref.current.position.x) * 0.05;
            ref.current.rotation.y += (targetY - ref.current.rotation.y) * 0.05;
            ref.current.rotation.z += (targetZ - ref.current.rotation.z) * 0.05;
        }
    });


    return <primitive object={obj} />;
}
/**

 <mesh>
                <boxGeometry args={[1, 1, 1]} />
                <meshBasicMaterial color="hotpink" />
            </mesh>
 */

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
        <div ref={ref}>
            <Canvas>
                <OrthographicCamera
                    position={[0, 0, 100]}
                    makeDefault
                    left={dimensions.width / -2}
                    right={dimensions.width / 2}
                    top={dimensions.height / 2}
                    bottom={dimensions.height / -2}
                    near={0.1}
                    far={1000}
                />

                <Suspense fallback={null}>
                    <Model
                        posx={-600}
                        posy={0}
                        posz={0}
                        dir={-1}
                    />

                    <Model
                        posx={100}
                        posy={0}
                        posz={0}
                        dir={1}
                    />
                </Suspense>

                <ambientLight intensity={3} />
                <pointLight position={[1000, 1000, 1000]} color="red" intensity={200} />
                <pointLight position={[-1000, -1000, -1000]} color="green" intensity={200} />
                <pointLight position={[1000, -1000, 1000]} color="blue" intensity={200} />
                <pointLight position={[-1000, 1000, -1000]} color="yellow" intensity={200} />
            </Canvas>
        </div>
    );
};