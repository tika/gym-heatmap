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
  paired: number; // 0 = no, 1 = yes
  state: "traveling" | "waiting" | "using" | "finished";
};

const boxSize = 1;
const fontSize = 0.1;
const floorSize = 20; // Size of the floor (10x10 units)

type SpaceProps = {
  selectedTime: Date;
  isPreview?: boolean;
  gymData?: Point[];
};

export function Space({ selectedTime, isPreview, gymData }: SpaceProps) {
  return (
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
        .map(({ x, y, z, object, paired }, index) => (
          <group key={`machine-${x}-${y}-${z}-${index}`} position={[x, y, z]}>
            <lineSegments>
              <edgesGeometry
                args={[new THREE.BoxGeometry(boxSize, boxSize, boxSize)]}
              />
              <lineBasicMaterial
                color={paired === 0.0 ? "#00ff00" : "#fc0d29"}
              />
            </lineSegments>
            <Text
              position={[boxSize / 2, boxSize / 2, boxSize / 2]} // Adjusted to be relative to the group
              fontSize={fontSize}
              color="#ffffff"
              anchorX="center"
              anchorY="middle"
            >
              {object}
            </Text>
          </group>
        ))}
      <Points>
        {gymData
          ?.filter(({ role }) => role === "person")
          .filter(({ time }) => time.toString() === selectedTime.toString())
          .filter(({ state }) => state !== "finished")
          .map(({ x, y, z, state }, index) => (
            <mesh key={index} position={[x, y, z]}>
              <sphereGeometry args={[0.1, 4, 4]} />
              <meshStandardMaterial color="#ffffff" />
            </mesh>
          ))}
      </Points>
    </Canvas>
  );
}
