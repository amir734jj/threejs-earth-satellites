import React, { useRef, useCallback, useMemo } from "react";
import { useLoader, useFrame } from "@react-three/fiber";
import { TextureLoader } from "three";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

import EarthDayMap from "../assets/img/2k_earth_daymap.jpg";

const COLORS = {
  0: 'cyan',
  1: 'darkyellow',
  2: 'lightred',
  3: 'green'
};

// Earth radius in km
const EARTH_RADIUS = 6371;
const EARTH_TEXTURE = 64;

const SHAPE_RADUS = 25;
const SHAPE_TEXTURE = 8;

function Line({ start, end, color }) {
  const points = useMemo(() => [new THREE.Vector3(start.x, start.y, start.z), new THREE.Vector3(end.x, end.y, end.z)], [start, end])
  const onUpdate = useCallback(self => self.setFromPoints(points), [points])
  return (
    <line position={[0, 0, 0]}>
      <bufferGeometry attach="geometry" onUpdate={onUpdate} />
      <lineBasicMaterial attach="material" color={color} linewidth={3} linecap={'round'} linejoin={'round'} />
    </line>
  )
}

export function Earth({ data }) {
  const [colorMap, normalMap, specularMap] = useLoader(
    TextureLoader,
    [EarthDayMap]
  );

  const earthRef = useRef();
  const satellitesRef = useRef([]);
  const usersRef = useRef([]);
  const interferesRef = useRef([]);

  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime();

    earthRef.current.rotation.y = elapsedTime / 24;
    satellitesRef.current.forEach(x => x.rotation.y = elapsedTime / 24);
    usersRef.current.forEach(x => x.rotation.y = elapsedTime / 24);
    interferesRef.current.forEach(x => x.rotation.y = elapsedTime / 24);
  });

  return (
    <group>
      <ambientLight intensity={1} />
      <pointLight color="#f6f3ea" position={[5000, 0, 5]} intensity={1.2} />
      <mesh ref={earthRef} position={[0, 0, 0]}>
        <sphereGeometry args={[EARTH_RADIUS, EARTH_TEXTURE, EARTH_TEXTURE]} />
        <meshPhongMaterial specularMap={specularMap} />
        <meshStandardMaterial
          map={colorMap}
          normalMap={normalMap}
          metalness={0.4}
          roughness={0.7}
        />
        <OrbitControls
          enableZoom={true}
          enablePan={true}
          enableRotate={true}
          zoomSpeed={1}
          panSpeed={1}
          rotateSpeed={1}
        />
        <group>
          {data.users.map(({ coordinate: { x, y, z }, id }, i) => <mesh
            key={id}
            ref={el => usersRef.current[i] = el}
            position={[x, y, z]}>
            <sphereGeometry args={[SHAPE_RADUS, SHAPE_TEXTURE, SHAPE_TEXTURE]} />
            <meshPhongMaterial
              color={data.mappings.find(m => m.user === id) ? "green" : "red"}
              side={THREE.DoubleSide}
            />
          </mesh>
          )}
        </group>
        <group>
          {data.satellites.map(({ coordinate: { x, y, z }, id }, i) =>
            <mesh
              key={id}
              ref={el => satellitesRef.current[i] = el}
              position={[x, y, z]}>
              <sphereGeometry args={[SHAPE_RADUS, SHAPE_TEXTURE, SHAPE_TEXTURE]} />
              <meshPhongMaterial
                color='#A0522D'
                side={THREE.DoubleSide}
              />
            </mesh>)}
        </group>
        <group>
          {data.interferes.map(({ coordinate: { x, y, z }, id }, i) =>
            <mesh
              key={id}
              ref={el => interferesRef.current[i] = el}
              position={[x, y, z]}>
              <sphereGeometry args={[SHAPE_RADUS, SHAPE_TEXTURE, SHAPE_RADUS]} />
              <meshPhongMaterial
                color='red'
                side={THREE.DoubleSide}
              />
            </mesh>)}
        </group>
        <group>
          {data.mappings.map(({ satellite: satelliteId, user: userId, color }, id) => {

            const satellite = data.satellites.find(s => s.id === satelliteId);
            const user = data.users.find(u => u.id === userId);

            return <Line key={id} start={satellite.coordinate} end={user.coordinate} color={COLORS[color]} />
          })}
        </group>
      </mesh>
    </group>
  );
}
