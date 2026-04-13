import React, { Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, OrbitControls, Stage, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

function Model({ url }) {
  const { scene } = useGLTF(url);
  
  useMemo(() => {
    scene.traverse((node) => {
      if (node.isMesh) {
        // Apply glass effect to meshes that likely represent the bottle
        // We look for names like 'bottle', 'glass', 'liquid' or just any mesh that should be transparent
        if (node.name.toLowerCase().includes('bottle') || node.name.toLowerCase().includes('glass') || node.name.toLowerCase().includes('liquid')) {
          node.material = new THREE.MeshPhysicalMaterial({
            roughness: 0,
            transmission: 0.8,
            thickness: 0.5, // Add some thickness for refraction
            ior: 1.5,
            reflectivity: 0.5,
            envMapIntensity: 1.5,
            clearcoat: 1,
            clearcoatRoughness: 0.1,
            color: 'transparent',
            transparent: true,
          });
        }
        
        // Ensure shadows are cast and received
        node.castShadow = true;
        node.receiveShadow = true;
      }
    });
  }, [scene]);

  return <primitive object={scene} scale={1.0} />;
}

const PerfumeModel = () => {
  return (
    <div className="model-container">
      <Canvas 
        shadows 
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, exposure: 1.2 }}
      >
        <Suspense fallback={null}>
          <Stage environment="city" intensity={0.5} contactShadow={false}>
            <Model url="/model/perfume.glb" />
          </Stage>
          
          <Environment preset="city" blur={0.8} />
          
          <ContactShadows 
            position={[0, -1.2, 0]} 
            opacity={1} 
            scale={10} 
            blur={2} 
            far={1.5} 
          />

          <OrbitControls 
            enableZoom={false} 
            autoRotate 
            autoRotateSpeed={1.5}
            minPolarAngle={Math.PI / 2.5}
            maxPolarAngle={Math.PI / 2.2}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default PerfumeModel;
