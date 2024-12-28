import React, { useRef } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';

function RotatingCube() {
    const texture = useLoader(TextureLoader, './cubetexture.png'); // Update the path to your texture
    const meshRef = useRef();

    useFrame(() => {
        if (meshRef.current) {
            meshRef.current.rotation.x += 0.01;
            meshRef.current.rotation.y += 0.01;

        }
    });

    return (
        <mesh ref={meshRef}>
            <boxGeometry args={[5, 5, 5]} />
            <meshStandardMaterial
                map={texture}
                // emissive={"#ffffff"} // Add emissive color
                emissiveIntensity={0.3} // Adjust the intensity
                metalness={3} // Adjust metalness
                roughness={3} // Adjust roughness
            />
        </mesh>
    );
}

export default function Cube() {
    return (
        <div className='flex flex-col items-center justify-center h-[70vh] z-10'>
            <span className='font-kanit text-white text-2xl flex items-center justify-center'>
                What can I help with?
            </span>
            <Canvas camera={{ position: [10, 10, 10] }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} />
                <RotatingCube />
            </Canvas>
        </div>
    );
}