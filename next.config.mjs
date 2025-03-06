/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ['three', '@react-three/fiber', '@react-three/drei'],
    webpack: (config) => {
        // Para manejar correctamente los módulos de worker de Three.js
        config.module.rules.push({
            test: /\.(glb|gltf)$/,
            use: {
                loader: 'file-loader',
            },
        });
        return config;
    },
};


export default nextConfig;
