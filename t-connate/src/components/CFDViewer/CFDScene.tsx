import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface CFDSceneProps {
  geometry: THREE.BufferGeometry | null;
  showStreamlines: boolean;
  showPressure: boolean;
  showVelocity: boolean;
  animationSpeed: number;
}

// Generate streamlines around geometry
function Streamlines({ geometry, speed }: { geometry: THREE.BufferGeometry | null; speed: number }) {
  const linesRef = useRef<THREE.Group>(null);
  const time = useRef(0);

  const streamlineData = useMemo(() => {
    const lines: THREE.Vector3[][] = [];
    const numLines = 30;
    
    for (let i = 0; i < numLines; i++) {
      const points: THREE.Vector3[] = [];
      const startY = (i / numLines - 0.5) * 4;
      const startZ = (Math.random() - 0.5) * 3;
      
      for (let j = 0; j < 50; j++) {
        const x = -4 + j * 0.2;
        const turbulence = Math.sin(x * 2 + startY) * 0.2 + Math.cos(x * 1.5 + startZ) * 0.15;
        const y = startY + turbulence;
        const z = startZ + Math.sin(x + startY * 0.5) * 0.1;
        points.push(new THREE.Vector3(x, y, z));
      }
      lines.push(points);
    }
    return lines;
  }, []);

  useFrame((_, delta) => {
    time.current += delta * speed;
    if (linesRef.current) {
      linesRef.current.children.forEach((child, idx) => {
        const line = child as THREE.Line;
        const positions = (line.geometry as THREE.BufferGeometry).attributes.position;
        const offset = (time.current + idx * 0.1) % 1;
        
        for (let i = 0; i < positions.count; i++) {
          const baseData = streamlineData[idx][i];
          if (baseData) {
            positions.setX(i, baseData.x + offset * 0.5);
          }
        }
        positions.needsUpdate = true;
      });
    }
  });

  return (
    <group ref={linesRef}>
      {streamlineData.map((points, idx) => (
        <line key={idx}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={points.length}
              array={new Float32Array(points.flatMap(p => [p.x, p.y, p.z]))}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial 
            color={new THREE.Color().setHSL(0.55 + idx * 0.01, 0.9, 0.6)} 
            transparent 
            opacity={0.7}
            linewidth={1}
          />
        </line>
      ))}
    </group>
  );
}

// Pressure contour visualization
function PressureContour({ geometry }: { geometry: THREE.BufferGeometry | null }) {
  const meshRef = useRef<THREE.Mesh>(null);

  const coloredGeometry = useMemo(() => {
    if (!geometry) {
      // Create default sphere for demo
      const geo = new THREE.SphereGeometry(1, 32, 32);
      const colors = new Float32Array(geo.attributes.position.count * 3);
      
      for (let i = 0; i < geo.attributes.position.count; i++) {
        const x = geo.attributes.position.getX(i);
        const y = geo.attributes.position.getY(i);
        const pressure = (x + 1) / 2; // Normalized pressure 0-1
        
        // Blue (low) to Red (high) gradient
        const color = new THREE.Color();
        color.setHSL(0.7 - pressure * 0.7, 0.9, 0.5);
        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;
      }
      
      geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      return geo;
    }
    
    const geo = geometry.clone();
    const positions = geo.attributes.position;
    const colors = new Float32Array(positions.count * 3);
    
    // Calculate bounding box for normalization
    geo.computeBoundingBox();
    const box = geo.boundingBox!;
    const size = new THREE.Vector3();
    box.getSize(size);
    
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const normalizedX = (x - box.min.x) / size.x;
      
      const color = new THREE.Color();
      color.setHSL(0.7 - normalizedX * 0.7, 0.9, 0.5);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }
    
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    return geo;
  }, [geometry]);

  return (
    <mesh ref={meshRef} geometry={coloredGeometry}>
      <meshStandardMaterial vertexColors side={THREE.DoubleSide} />
    </mesh>
  );
}

// Velocity vectors visualization
function VelocityVectors({ speed }: { speed: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const time = useRef(0);

  const arrows = useMemo(() => {
    const data: { position: THREE.Vector3; direction: THREE.Vector3; length: number }[] = [];
    const gridSize = 6;
    const spacing = 1.2;
    
    for (let x = -gridSize / 2; x <= gridSize / 2; x++) {
      for (let y = -gridSize / 2; y <= gridSize / 2; y++) {
        for (let z = -2; z <= 2; z += 2) {
          const pos = new THREE.Vector3(x * spacing, y * spacing * 0.6, z * spacing * 0.5);
          
          // Flow direction with some turbulence
          const turbX = Math.sin(y * 0.5) * 0.2;
          const turbY = Math.cos(x * 0.5) * 0.2;
          const dir = new THREE.Vector3(1 + turbX, turbY, 0).normalize();
          
          // Velocity magnitude
          const distFromCenter = Math.sqrt(pos.y * pos.y + pos.z * pos.z);
          const velocity = Math.max(0.3, 1 - distFromCenter * 0.15);
          
          data.push({ position: pos, direction: dir, length: velocity * 0.6 });
        }
      }
    }
    return data;
  }, []);

  useFrame((_, delta) => {
    time.current += delta * speed;
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(time.current * 0.1) * 0.02;
    }
  });

  return (
    <group ref={groupRef}>
      {arrows.map((arrow, idx) => (
        <group key={idx} position={arrow.position}>
          <arrowHelper 
            args={[
              arrow.direction, 
              new THREE.Vector3(0, 0, 0), 
              arrow.length,
              new THREE.Color().setHSL(0.1 + arrow.length * 0.3, 0.9, 0.5).getHex(),
              arrow.length * 0.3,
              arrow.length * 0.15
            ]} 
          />
        </group>
      ))}
    </group>
  );
}

// Main loaded model display
function LoadedModel({ geometry }: { geometry: THREE.BufferGeometry }) {
  const meshRef = useRef<THREE.Mesh>(null);

  const centeredGeometry = useMemo(() => {
    const geo = geometry.clone();
    geo.computeBoundingBox();
    geo.center();
    
    // Scale to fit
    const box = new THREE.Box3().setFromBufferAttribute(geo.attributes.position as THREE.BufferAttribute);
    const size = new THREE.Vector3();
    box.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = 2 / maxDim;
    geo.scale(scale, scale, scale);
    
    return geo;
  }, [geometry]);

  return (
    <mesh ref={meshRef} geometry={centeredGeometry}>
      <meshStandardMaterial 
        color="#4a90a4" 
        metalness={0.3} 
        roughness={0.6}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

export function CFDScene({ 
  geometry, 
  showStreamlines, 
  showPressure, 
  showVelocity,
  animationSpeed 
}: CFDSceneProps) {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
      <directionalLight position={[-5, 3, -5]} intensity={0.5} />
      <pointLight position={[0, 5, 0]} intensity={0.3} />

      {/* Grid helper */}
      <gridHelper args={[10, 20, "#1e3a5f", "#0d1f33"]} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -3]} />

      {/* Model or pressure contour */}
      {geometry && !showPressure && <LoadedModel geometry={geometry} />}
      {showPressure && <PressureContour geometry={geometry} />}

      {/* CFD Overlays */}
      {showStreamlines && <Streamlines geometry={geometry} speed={animationSpeed} />}
      {showVelocity && <VelocityVectors speed={animationSpeed} />}

      {/* Axis helper */}
      <axesHelper args={[2]} position={[-4, -2, 0]} />
    </>
  );
}
