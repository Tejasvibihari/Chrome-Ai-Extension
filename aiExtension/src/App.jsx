import React, { useState, useEffect } from 'react';


import { useGLTF, PerspectiveCamera, OrbitControls } from "@react-three/drei";
import { PhoneForwarded, Download } from 'lucide-react';
import { useRef } from 'react';
import { useFrame, useThree, Canvas } from '@react-three/fiber';
import Cube from './components/Signin';


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
  const [scrapedData, setScrapedData] = useState('');
  const [tabUrl, setTabUrl] = useState('');
  const [wdata, setWdata] = useState('');

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

  // useEffect(() => {
  //   // Function to get the current tab's URL
  //   const getCurrentTabUrl = () => {
  //     chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  //       if (tabs.length > 0) {
  //         const url = tabs[0].url;
  //         setTabUrl(url);
  //         console.log('Initial Tab URL:', url);
  //       }
  //     });
  //   };

  //   // Get the current tab's URL when the component mounts
  //   getCurrentTabUrl();

  //   // Listen for messages from the background script
  //   chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  //     if (message.type === "updateSidebar") {
  //       console.log('Message from Background Script:', message); // Log the message
  //       setScrapedData(message.data.text);
  //       setTabUrl(message.data.url);
  //       setWdata(message.data.wdata);
  //       console.log('Tab URL from App.js:', message.data.url);
  //       console.log('Whole Data Line 31:', message.data.wdata);
  //     }
  //   });
  // }, []);

  return (
    <>


    </>
  );
}



// <Canvas>
//   <ambientLight position={[0, 0, 5]} />
//   {/* {spheres.map((sphere, index) => (
//             <SphereComponent
//               key={index}
//               radius={sphere.radius}
//               color={sphere.color}
//               initialPosition={sphere.initialPosition}
//             />
//           ))} */}

// </Canvas>



// <div className='p-4 bg-red-400 text-white h-screen flex md:flex-row flex-col justify-center items-center'>

//   <br />



//   <Canvas className="h-full">
//     <ambientLight position={[0, 0, 5]} intensity={10} />
//     <PerspectiveCamera makeDefault position={[0, 5, 15]} />
//     {/* <OrbitControls /> */}
//     <Model position={[0, -3, 0]} scale={2} />
//   </Canvas>

//   <div>
//     {scrapedData ? scrapedData : 'Loading...'}

//     <Cube />
//   </div>
// </div>