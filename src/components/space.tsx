"use client";

// 3D space
import { OrbitControls, Points } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";

const points = [
  [1, 2, 3],
  [-2, -1, 0],
  [4, 5, -2],
  [-3, 2, 1],
  [0, 0, 0], // Example points, replace with your array
];

export function Space() {
  return (
    <Canvas camera={{ position: [5, 5, 5] }}>
      <ambientLight />
      <OrbitControls
        minDistance={2} // Minimum zoom distance
        maxDistance={10} // Maximum zoom distance
      />
      <Points>
        {points.map(([x, y, z], index) => (
          <mesh key={index} position={[x, y, z]}>
            <sphereGeometry args={[0.1, 16, 16]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
        ))}
      </Points>
    </Canvas>
  );
}
