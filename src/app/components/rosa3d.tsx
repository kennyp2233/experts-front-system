import React, { Suspense, useEffect, useRef, useState } from 'react';
import { Canvas, useLoader, useThree, extend, useFrame } from 'react-three-fiber';
import { OrthographicCamera } from '@react-three/drei';

import { Group, Vector3 } from 'three';
import { MTLLoader, OBJLoader } from 'three-stdlib';
import * as THREE from 'three';


function Model() {
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
            ref.current.position.x = -20;
        }
    }, [obj]);

    let targetX = 0;
    let targetY = 0;
    let targetZ = 0;

    useEffect(() => {
        const handleScroll = () => {
            if (ref.current) {
                const scrollY = window.scrollY;
                targetX = -20 + scrollY * 0.01;
                targetY = scrollY * 0.01;
                targetZ = scrollY * 0.01;
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
                    <Model />
                </Suspense>

                <ambientLight />
                <pointLight position={[10, 10, 10]} color="red" />
                <pointLight position={[-10, -10, -10]} color="green" />
                <pointLight position={[10, -10, 10]} color="blue" />
                <pointLight position={[-10, 10, -10]} color="yellow" />
            </Canvas>
        </div>
    );
};