import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useLoader, useThree, extend, useFrame } from 'react-three-fiber';
import { OrthographicCamera } from '@react-three/drei';

import { Group, Vector3 } from 'three';
import { MTLLoader, OBJLoader } from 'three-stdlib';
import * as THREE from 'three';


function Model({ posx, posy, posz, rotx, roty, rotz, scale }: { posx: number, posy: number, posz: number, rotx: number, roty: number, rotz: number, scale: number }) {
    const ref = useRef<Group>(); // Define the ref to be of type Group
    const { camera, size } = useThree();


    const materials = useLoader(MTLLoader, '/obj/rose2/PUSHILIN_Rose_Bush.mtl');
    const obj = useLoader(OBJLoader, '/obj/rose2/PUSHILIN_Rose_Bush.obj', loader => {
        materials.preload();
        loader.setMaterials(materials);
    });




    if (obj) {
        obj.position.set(posx, posy, posz);
        obj.scale.set(scale, scale, scale);
        ref.current = obj;

        ref.current.position.x = posx;
        ref.current.position.y = posy;
        ref.current.position.z = posz;

        ref.current.rotation.x = rotx;
        ref.current.rotation.y = roty;
        ref.current.rotation.z = rotz;
        // Cambiar el material de cada malla a un material de wireframe
        /*
        obj.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                child.material = new THREE.MeshBasicMaterial({
                    wireframe: true,
                    color: 'hotpink'
                });
            }
        });
        */
    }


    let [targetX, setTargetX] = useState(posx);
    let [targetYRot, setTargetYRot] = useState(roty);
    let [targetZRot, setTargetZRot] = useState(rotz);



    useEffect(() => {
        const handleScroll = () => {
            if (ref.current) {
                const scrollY = window.scrollY;
                targetX = posx >= 0 ? Math.max(500, posx - scrollY * 2) : Math.min(-400, posx + scrollY * 2);
                targetYRot = roty + scrollY * 0.01;
                targetZRot = rotz + scrollY * 0.01;
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);


    useFrame(() => {
        if (ref.current) {
            ref.current.position.x += (targetX - ref.current.position.x) * 0.05;
            ref.current.rotation.y += (targetYRot - ref.current.rotation.y) * 0.05;
            ref.current.rotation.z += (targetZRot - ref.current.rotation.z) * 0.05;
        }
    });



    return <primitive ref={ref} object={obj.clone(true)} />;
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
        <div ref={ref} className='h-80 w-full absolute'>
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
                        posx={-800}
                        posy={80}
                        posz={0}
                        rotx={0}
                        roty={0}
                        rotz={0}
                        scale={80}
                    />

                    <Model
                        posx={800}
                        posy={-80}
                        posz={0}
                        rotx={5}
                        roty={5}
                        rotz={5}
                        scale={80}
                    />

                </Suspense>

                <ambientLight intensity={3} />
                <pointLight position={[0, 0, 20]} color="red" intensity={200} />
                <pointLight position={[-1000, -1000, -1000]} color="green" intensity={200} />
                <pointLight position={[1000, -1000, 1000]} color="blue" intensity={200} />
                <pointLight position={[-1000, 1000, -1000]} color="yellow" intensity={200} />
            </Canvas>
        </div>
    );
};