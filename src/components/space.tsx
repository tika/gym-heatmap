"use client";

// 3D space
import { OrbitControls, Points, Text } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";

export type Point = {
  x: number;
  y: number;
  z: number;
  object: string;
  role: "person" | "machine";
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
    time: new Date("2025-02-22T10:00:00"),
  },
  {
    x: 5,
    y: 0,
    z: 0,
    type: "machine",
    paired: false,
    time: new Date("2025-02-22T10:00:00"),
  },
  {
    x: 5.5,
    y: 0,
    z: 0.5,
    role: "person",
    object: "Person1",
    paired: false,
    time: new Date("2025-02-22T10:00:00"),
  },
  {
    x: 0,
    y: 0,
    z: 0,
    object: "Machine1",
    role: "machine",
    paired: false,
    time: new Date("2025-02-22T10:01:12"),
  }, // Example points, replace with your array
  {
    x: 0.7,
    y: 0,
    z: 1,
    object: "Person2",
    role: "person",
    paired: false,
    time: new Date("2025-02-22T10:01:12"),
  },
  {
    x: 5,
    y: 0,
    z: 0,
    object: "Machine2",
    role: "machine",
    paired: false,
    time: new Date("2025-02-22T10:01:12"),
  },
  {
    x: 5.7,
    y: 0,
    z: 0.5,
    object: "Person3",
    role: "person",
    paired: false,
    time: new Date("2025-02-22T10:01:12"),
  },
];

const boxSize = 1;
const fontSize = 0.1;
const floorSize = 20; // Size of the floor (10x10 units)

type SpaceProps = {
  selectedTime: Date;
  isPreview?: boolean;
  gymData?: Point[];
};

export function Space({ selectedTime, isPreview, gymData }: SpaceProps) {
  console.log(gymData);

  return (
    <>
      {gymData?.filter(({ role }) => role === "person").length}
      <Canvas
        camera={{
          position: isPreview
            ? [floorSize / 2, 8, -5] // Fixed "screenshot" position
            : [0, 2, 3], // Interactive view position
          fov: isPreview ? 60 : 50,
          near: 0.1,
          far: 1000,
        }}
      >
        <ambientLight />
        {!isPreview && (
          <OrbitControls
            minDistance={2}
            maxDistance={50}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 2.1}
            enableDamping={true}
            dampingFactor={0.05}
            target={[floorSize / 2, 0, floorSize / 2]}
            onChange={(e) => {
              if (!e) return;
              const controls = e.target;
              const minY = -boxSize / 2;
              if (controls.target.y < minY) {
                controls.target.y = minY;
                controls.object.position.y = Math.max(
                  controls.object.position.y,
                  minY
                );
              }
            }}
          />
        )}
        <gridHelper
          args={[100, 100, "#444444", "#222222"]}
          position={[0, -boxSize / 2, 0]}
        />
        {gymData
          ?.filter(({ role }) => role === "machine")
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
          {gymData
            ?.filter(({ role }) => role === "person")
            .filter(({ time }) => time.toString() === selectedTime.toString())
            .map(({ x, y, z }, index) => (
              <mesh key={index} position={[x, y, z]}>
                <sphereGeometry args={[0.1, 4, 4]} />
                <meshStandardMaterial color="#ffffff" />
              </mesh>
            ))}
        </Points>
      </Canvas>
    </>
  );
}
