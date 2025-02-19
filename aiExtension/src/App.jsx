import React, { useState, useEffect } from 'react';
import { useRef } from 'react';
import { useFrame, useThree, Canvas } from '@react-three/fiber';
import Auth from './pages/Auth';
import { useSelector } from 'react-redux';
import Home from './pages/Home';
import SetName from './components/SetName';

// Component to load and display the GLTF model
const Model = (props) => {
  const { scene } = useGLTF('./cube.glb'); // Change this to the actual path to your model
  const modelRef = useRef();
  const { mouse } = useThree();

  // Optional: Apply animations or movement to the model
  useFrame(() => {
    modelRef.current.rotation.y += 0.005; // Rotate the model
  });

  return <primitive object={scene} ref={modelRef} {...props} />;
};

export const SphereComponent = ({ radius, color, initialPosition }) => {
  const [width, setWidth] = useState(32);
  const [height, setHeight] = useState(16);
  const meshRef = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const speed = 1; // Adjust speed as needed
    meshRef.current.position.x = initialPosition[0];
    meshRef.current.position.y -= speed * 0.01; // Move down continuously
    meshRef.current.position.z = initialPosition[2];

    if (meshRef.current.position.y < -5) {
      meshRef.current.position.y = initialPosition[1];
    }
  });

  return (
    <mesh ref={meshRef} position={initialPosition}>
      <sphereGeometry args={[radius, width, height]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
};

export default function App() {
  const name = useSelector(state => state.auth.name);


  const fixedRadius = 0.01;
  const spheres = Array.from({ length: 200 }, (_, i) => ({
    radius: fixedRadius,
    // color: `hsl(${Math.random() * 360}, 100%, 50%)`,
    color: "green",
    initialPosition: [
      (Math.random() - 0.5) * 10,
      5 + Math.random() * 5,
      (Math.random() - 0.5) * 10,
    ],
  }));


  return (
    <>
      <div className='bg-secondary-100'>
        <div className=''>
          {/* <Home /> */}
        </div>
        <div className=''>
          {name == null
            ?
            <div className='bg-secondary-200 p-4 h-screen mx-auto items-center justify-center flex flex-col'>
              <SetName />
            </div>
            :
            <Home />}
        </div>
      </div >
    </>
  );
}

