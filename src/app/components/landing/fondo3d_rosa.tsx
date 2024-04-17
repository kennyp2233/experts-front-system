import * as THREE from 'three';
import { useEffect, useMemo, useRef, useState } from 'react';
import { EffectComposer, RenderPass, GaussianBlurPass, BoxBlurPass } from 'postprocessing';

const DEG_TO_RAD = Math.PI / 180; // Pre-calcular la constante


const colors = ["#A70404", "#C20A0A", "#F7DAD0", "#F27E02"].map(hex => new THREE.Color(hex));

var geometry = new THREE.BoxGeometry(1, 1, 1); // Crear una BoxGeometry
var eMaterial = new THREE.LineBasicMaterial({ color: colors[0], linewidth: 2, opacity: 0.08, transparent: true, blending: 2 });
const cubes: THREE.LineSegments[] = [];

var num = 20;

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
        // Usar useMemo para memorizar la creación de los cubos

        if (node) {
            // Crear una escena
            const scene = new THREE.Scene();

            // Crear una cámara
            const camera = new THREE.PerspectiveCamera(40, node.clientWidth / node.clientHeight, .1, 10000);
            camera.position.set(0.0, 0.0, 0.5);

            // Crear un renderizador
            const renderer = new THREE.WebGLRenderer({ antialias: false });
            renderer.setSize(node.clientWidth, node.clientHeight);
            renderer.setPixelRatio(window.devicePixelRatio / 2); // Reduce la resolución de renderizado
            for (let i = num; i--;) {
                const eGeometry = new THREE.EdgesGeometry(geometry);
                const edges = new THREE.LineSegments(eGeometry, eMaterial);
                scene.add(edges);
                cubes.push(edges);
            }

            /*
                        console.log("ANTES DE FOR")
                        for (let i = num; i--;) {
                            const eGeometry = new THREE.EdgesGeometry(geometry);
                            const edges = new THREE.LineSegments(eGeometry, eMaterial);
                            scene.add(edges);
                            cubes.push(edges);
                        }
                        console.log("DESPUES DE FOR")
            */
            /*
             let i = 0;
             const createCubes = () => {
                 if (i < num) {
                     const eGeometry = new THREE.EdgesGeometry(geometry);
                     const edges = new THREE.LineSegments(eGeometry, eMaterial);
                     scene.add(edges);
                     setCubes(cubes => [...cubes, edges]);
                     i++;
 
                 }
             };
             createCubes();
             */
            // Crear el EffectComposer
            const composer = new EffectComposer(renderer);

            // Agregar el RenderPass
            const renderPass = new RenderPass(scene, camera);
            composer.addPass(renderPass);

            const blurPass = new GaussianBlurPass({
                kernelSize: 25, // Aumenta este valor para más desenfoque
                iterations: 5, // Aumenta este valor para un desenfoque más suave
                resolutionScale: 0.05, // Ajusta este valor para cambiar la resolución del desenfoque (un valor más bajo puede aumentar el rendimiento)
                resolutionX: node.clientWidth, // Ajusta este valor para cambiar la resolución horizontal del desenfoque
                resolutionY: node.clientHeight // Ajusta este valor para cambiar la resolución vertical del desenfoque
            });

            /*
 const blurPass = new BoxBlurPass({
     kernelSize: 2.3, // Tamaño del kernel. Un valor más pequeño dará un desenfoque más suave.
     iterations: 15, // Número de iteraciones. Un valor más pequeño dará un desenfoque más suave.
     bilateral: false, // Si es true, se aplica un desenfoque bilateral que preserva los bordes. Esto puede ser más costoso en términos de rendimiento.
     resolutionScale: 0.05, // Escala de la resolución. Un valor más pequeño reducirá la resolución del desenfoque, lo que puede mejorar el rendimiento pero reducirá la calidad del desenfoque.
     resolutionX: node.clientWidth, // Resolución en el eje X. Debería ser igual al ancho del elemento en el que se está aplicando el desenfoque.
     resolutionY: node.clientHeight // Resolución en el eje Y. Debería ser igual a la altura del elemento en el que se está aplicando el desenfoque.
 });
 */
            blurPass.renderToScreen = true;
            composer.addPass(blurPass);

            node.appendChild(renderer.domElement);

            // Ajustar el tamaño del renderizador cuando se redimensiona la ventana
            window.addEventListener('resize', () => {
                const divWidth = node.clientWidth;
                const divHeight = node.clientHeight;
                renderer.setSize(divWidth, divHeight);
                camera.aspect = divWidth / divHeight;
                camera.updateProjectionMatrix();
            });

            /*
             const resizeObserver = new ResizeObserver(entries => {
                 for (let entry of entries) {
                     const divWidth = entry.contentRect.width;
                     const divHeight = entry.contentRect.height;
                     renderer.setSize(divWidth, divHeight);
 
                     camera.updateProjectionMatrix();
                 }
             });
             resizeObserver.observe(node);
             */

            // Función de animación

            const animate = function () {
                const time = performance.now() * 0.001;
                const sinTime = Math.sin(time * 0.5);
                for (let i = 0, il = cubes.length; i < il; i++) {
                    var scale = .01 * i + .001
                    var rotate = i + -15 * time;
                    var rotateInRadians = rotate * DEG_TO_RAD; // Convertir grados a radianes
                    cubes[i].rotation.set(rotateInRadians, rotateInRadians, rotateInRadians)

                    cubes[i].scale.set(scale, scale, scale);
                    const material = cubes[i].material as THREE.LineBasicMaterial; // Cast the material to THREE.LineBasicMaterial
                    material.color = lerpColors(colors, (sinTime + 1) / 2);

                }



                requestAnimationFrame(animate);
                //renderer.render(scene, camera);
                composer.render();
            };

            // Iniciar la animación
            animate();

            // Limpiar el efecto
            return () => {
                node.removeChild(renderer.domElement);
            };
        }
    }, []);

    return <div className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[-1] w-[100vw]  h-full' ref={ref} />;
}