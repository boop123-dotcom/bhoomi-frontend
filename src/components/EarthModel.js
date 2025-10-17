// frontend/src/components/EarthModel.js
import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import * as THREE from "three";

function Earth() {
  const meshRef = useRef();

  // Rotate slowly
  useFrame(() => {
    if (meshRef.current) meshRef.current.rotation.y += 0.001;
  });

  // ✅ Reliable NASA Earth texture (public CORS-safe)
  const texture = new THREE.TextureLoader().load(
    "https://raw.githubusercontent.com/rajatk16/3d-earth-react/main/public/8k_earth_daymap.jpg"
  );

  const bumpMap = new THREE.TextureLoader().load(
    "https://raw.githubusercontent.com/rajatk16/3d-earth-react/main/public/8k_earth_bump.jpg"
  );

  return (
    <mesh ref={meshRef} scale={[2.5, 2.5, 2.5]}>
      <sphereGeometry args={[1, 64, 64]} />
      <meshStandardMaterial
        map={texture}
        bumpMap={bumpMap}
        bumpScale={0.04}
        roughness={1}
        metalness={0.1}
      />
    </mesh>
  );
}

export default function EarthModel() {
  return (
    <div className="w-full h-[70vh] md:h-[80vh]">
      <Canvas
        camera={{ position: [0, 0, 3], fov: 50 }}
        style={{
          background: "radial-gradient(circle at center, #000814 10%, #001233 100%)",
          borderRadius: "12px",
          width: "100%",
          height: "100%",
        }}
      >
        {/* 💡 Lighting setup */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[3, 2, 3]} intensity={1.5} />
        <pointLight position={[-5, -3, -5]} intensity={0.4} color={"#88ccff"} />

        {/* 🌍 Earth + stars */}
        <Earth />
        <Stars radius={200} depth={60} count={4000} factor={4} fade />

        {/* 🎛 Orbit controls */}
        <OrbitControls enableZoom={false} enablePan={false} autoRotate />
      </Canvas>
    </div>
  );
}
