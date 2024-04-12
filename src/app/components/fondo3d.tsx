import * as THREE from 'three';
import { useEffect, useRef } from 'react';
import { BloomEffect, EffectComposer, EffectPass, Pass, RenderPass } from 'postprocessing';
import { BokehPass } from 'three/examples/jsm/postprocessing/BokehPass.js';


const colors = ["#A70404", "#C20A0A", "#F7DAD0", "#F27E02"].map(hex => new THREE.Color(hex));
function lerpColors(colors: any, ratio: any) {
    const lastIndex = colors.length - 1;
    const index = ratio * lastIndex;
    const lowerIndex = Math.floor(index);
    const upperIndex = Math.ceil(index);
    const color = colors[lowerIndex].clone();
    return color.lerp(colors[upperIndex], index - lowerIndex);
}

export default function Fondo3D() {
    const ref = useRef<HTMLDivElement | null>(null);
    useEffect(() => {
        const node = ref.current;
        if (node) {
            // Crear una escena
            const scene = new THREE.Scene();

            // Crear una cámara
            const camera = new THREE.PerspectiveCamera(75, node.clientWidth / node.clientHeight, 0.1, 1000);
            camera.position.z = 250;

            // Crear un renderizador
            const renderer = new THREE.WebGLRenderer();
            renderer.setSize(node.clientWidth, node.clientHeight);
            renderer.setPixelRatio(window.devicePixelRatio / 2); // Reduce la resolución de renderizado

            // Crear una geometría
            const geometry = new THREE.IcosahedronGeometry(100, 1);

            // Crear un material
            const color = new THREE.Color(0xA70404);
            const material = new THREE.MeshBasicMaterial({ color: color });

            // Crear una malla
            const mesh = new THREE.Mesh(geometry, material);
            //scene.add(mesh);

            // Crear una geometría de bordes
            const edgesGeometry = new THREE.EdgesGeometry(geometry);

            // Crear una malla de líneas para los bordes
            const lineMaterial = new THREE.LineBasicMaterial({ color: color });
            const lineSegments = new THREE.LineSegments(edgesGeometry, lineMaterial);
            scene.add(lineSegments);

            // Agregar el renderizador al nodo
            const nodeElement = node;
            nodeElement.appendChild(renderer.domElement);



            const resizeObserver = new ResizeObserver(entries => {
                for (let entry of entries) {
                    const divWidth = entry.contentRect.width;
                    const divHeight = entry.contentRect.height;
                    renderer.setSize(divWidth, divHeight);
                    camera.aspect = divWidth / divHeight;
                    camera.updateProjectionMatrix();
                }
            });
            resizeObserver.observe(node);
            // Función de animación
            const animate = function () {
                requestAnimationFrame(animate);

                // Rotar el cubo
                mesh.rotation.x += 0.01;
                mesh.rotation.y += 0.01;

                lineSegments.rotation.x += 0.01;
                lineSegments.rotation.y += 0.01;

                const ratio = (Math.sin(Date.now() * 0.001) + 1) / 2; // oscila entre 0 y 1
                const color = lerpColors(colors, ratio);

                // cambiar color a linesegments
                lineMaterial.color = color;
                material.color = color;

                renderer.render(scene, camera);
            };

            // Iniciar la animación
            animate();

            // Limpiar el efecto
            return () => {
                nodeElement.removeChild(renderer.domElement);
            };
        }
    }, []);

    return <div className='absolute top-1/2 left-1/2 -z-10 w-full max-w-5xl h-1/3 mx-auto -translate-x-1/2 -translate-y-full' ref={ref} />;
}