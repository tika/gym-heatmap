"use client";

// 3D space
import { OrbitControls, Points, Text } from "@react-three/drei";
import { Canvas, Vector3, useLoader } from "@react-three/fiber";
import { useEffect, useState } from "react";
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
  const [isMobile, setIsMobile] = useState(false);
  const [allGymData, setAllGymData] = useState<Point[]>([]);

  // Load the texture
  const texture = useLoader(THREE.TextureLoader, "/jumbo.png");

  // Handle mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Load gym data only once
  useEffect(() => {
    const loadGymData = async () => {
      try {
        const response = await fetch("/gym_data.csv");
        const rows = await response.text();

        // Create base time once outside the map
        const baseTime = new Date();

        const data = rows
          .split("\n")
          .slice(1)
          .map((row) => {
            const [x, y, z, timeSeconds, object, paired, role, state] =
              row.split(",");

            // Calculate time offset once
            const actualTime = new Date(
              baseTime.getTime() + parseInt(timeSeconds) * 1000
            );

            return {
              x: parseFloat(x),
              y: parseFloat(y),
              z: parseFloat(z),
              time: actualTime,
              object: object,
              paired: parseFloat(paired),
              role: role as "person" | "machine",
              state: state as "traveling" | "waiting" | "using",
            };
          });

        setAllGymData(data);
      } catch (error) {
        console.error("Error loading gym data:", error);
      }
    };

    loadGymData();
  }, []); // Empty dependency array - only run once

  const cameraPosition = isMobile
    ? [floorSize / 2, 12, 0] // Higher and further back view for mobile
    : isPreview
    ? [floorSize / 2, 8, -5]
    : [0, 2, 3];

  const cameraFov = isMobile
    ? 75 // Wider FOV for mobile
    : isPreview
    ? 60
    : 50;

  return (
    <div className="w-full h-full touch-none">
      <Canvas
        camera={{
          position: cameraPosition as Vector3,
          fov: cameraFov,
          near: 0.1,
          far: 1000,
        }}
      >
        <ambientLight />
        <directionalLight position={[0, 5, 0]} intensity={1} />
        {!isPreview && (
          <OrbitControls
            minDistance={isMobile ? 4 : 2}
            maxDistance={50}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 2.1}
            enableDamping={true}
            dampingFactor={0.05}
            target={[floorSize / 2, 0, floorSize / 2]}
            enableZoom={true}
            zoomSpeed={isMobile ? 0.5 : 1}
            rotateSpeed={isMobile ? 0.5 : 1}
            touches={{
              ONE: THREE.TOUCH.ROTATE,
              TWO: THREE.TOUCH.DOLLY_PAN,
            }}
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

        {/* Jumbo logo plane */}
        <mesh
          position={[0, -boxSize / 2 + 0.01, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <planeGeometry args={[5, 5]} />
          <meshBasicMaterial map={texture} transparent={true} />
        </mesh>

        <gridHelper
          args={[100, 100, "#444444", "#222222"]}
          position={[0, -boxSize / 2, 0]}
        />

        {gymData
          ?.filter(({ role }) => role === "machine")
          .map(({ x, y, z, object, paired }, index) => (
            <group
              key={`machine-${x}-${y}-${z}-${index}`}
              position={[x - 20, y, z - 10]}
            >
              <lineSegments>
                <edgesGeometry
                  args={[new THREE.BoxGeometry(boxSize, boxSize, boxSize)]}
                />
                <lineBasicMaterial
                  color={paired === 0.0 ? "#00ff00" : "#fc0d29"}
                />
              </lineSegments>
              <Text
                position={[boxSize / 2, boxSize / 2, boxSize / 2]}
                fontSize={isMobile ? fontSize * 1.5 : fontSize}
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
            .map(({ x, y, z }, index) => (
              <mesh key={index} position={[x - 20, y, z - 10]}>
                <sphereGeometry args={[isMobile ? 0.15 : 0.1, 4, 4]} />
                <meshStandardMaterial color="#ffffff" />
              </mesh>
            ))}
        </Points>
      </Canvas>
    </div>
  );
}
