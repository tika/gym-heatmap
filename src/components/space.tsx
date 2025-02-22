"use client";

import * as THREE from "three";
// 3D space
import { OrbitControls, Points, Text } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";

type Point = {
  x: number;
  y: number;
  z: number;
  type: "person" | "machine";
  time: Date;
  paired: boolean; // if the person is using the machine
};

const points: Point[] = [
  {
    x: 0,
    y: 0,
    z: 0,
    type: "machine",
    paired: false,
    time: new Date("2025-02-22T10:00:00"),
  }, // Example points, replace with your array
  {
    x: 0.5,
    y: 0,
    z: 1,
    type: "person",
    paired: false,
    time: new Date("2025-02-22T10:00:01"),
  },
  {
    x: 5,
    y: 0,
    z: 0,
    type: "machine",
    paired: false,
    time: new Date("2025-02-22T10:00:02"),
  },
  {
    x: 5.5,
    y: 0,
    z: 0.5,
    type: "person",
    paired: false,
    time: new Date("2025-02-22T10:00:03"),
  },
];

const boxSize = 1;
const fontSize = 0.1;
const floorSize = 20; // Size of the floor (10x10 units)

export function Space() {
  console.log(points.filter(({ type }) => type === "machine"));

  return (
    <Canvas camera={{ position: [5, 5, 5] }}>
      <ambientLight />
      <OrbitControls
        minDistance={2}
        maxDistance={10}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 2.1}
        enableDamping={true}
        dampingFactor={0.05}
        target={[floorSize / 2, 0, floorSize / 2]} // Center the controls on the floor
        onChange={(e) => {
          if (!e) return;
          const controls = e.target;
          const minY = -boxSize / 2; // Set this to your desired minimum y-value
          if (controls.target.y < minY) {
            controls.target.y = minY;
            controls.object.position.y = Math.max(
              controls.object.position.y,
              minY
            );
          }
        }}
      />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -boxSize / 2, 0]}>
        <planeGeometry args={[floorSize, floorSize]} />
        <meshStandardMaterial color="darkgray" />
      </mesh>

      {points
        .filter(({ type }) => type === "machine")
        .map(({ x, y, z }, index) => (
          <group key={`machine-${x}-${y}-${z}-${index}`} position={[x, y, z]}>
            <lineSegments>
              <edgesGeometry
                args={[new THREE.BoxGeometry(boxSize, boxSize, boxSize)]}
              />
              <lineBasicMaterial color="#00ff00" />
            </lineSegments>
            <Text
              position={[boxSize / 2, boxSize / 2, boxSize / 2]} // Adjusted to be relative to the group
              fontSize={fontSize}
              color="#00ff00"
              anchorX="center"
              anchorY="middle"
            >
              Squat Rack
            </Text>
          </group>
        ))}

      <Points>
        {points
          .filter(({ type }) => type === "person")
          .map(({ x, y, z }, index) => (
            <mesh key={index} position={[x, y, z]}>
              <sphereGeometry args={[0.1, 4, 4]} />
              <meshStandardMaterial color="#ffffff" />
            </mesh>
          ))}
      </Points>
    </Canvas>
  );
}
