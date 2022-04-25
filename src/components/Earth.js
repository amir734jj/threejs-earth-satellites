import React, { useRef } from "react";
import { useLoader, useFrame } from "@react-three/fiber";
import { TextureLoader } from "three";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import data from "../data.json";

import EarthDayMap from "../assets/img/2k_earth_daymap.jpg";

const COLORS = {
  0: 'white',
  1: 'yellow',
  2: 'orange',
  3: 'cyan'
};

const EARTH_RADIUS = 6370;
const EARTH_TEXTURE = 64;

const SHAPE_RADUS = 25;
const SHAPE_TEXTURE = 8;

export function Earth(props) {
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
          {data.users.map(({ coordinate: { x, y, z }, id }, i) =>
            <mesh
              key={id}
              ref={el => usersRef.current[i] = el}
              position={[x, y, z]}>
              <sphereGeometry args={[SHAPE_RADUS, SHAPE_TEXTURE, SHAPE_TEXTURE]} />
              <meshPhongMaterial
                color='green'
                side={THREE.DoubleSide}
              />
            </mesh>)}
        </group>
        <group>
          {data.satellites.map(({ coordinate: { x, y, z }, id }, i) =>
            <mesh
              key={id}
              ref={el => satellitesRef.current[i] = el}
              position={[x, y, z]}>
              <sphereGeometry args={[SHAPE_RADUS, SHAPE_TEXTURE, SHAPE_TEXTURE]} />
              <meshPhongMaterial
                color='sienna'
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

            return <line key={id}>
              <bufferGeometry attach="geometry" setFromPoints={[
                new THREE.Vector3(satellite.coordinate.x, satellite.coordinate.y, satellite.coordinate.z),
                new THREE.Vector3(user.coordinate.x, user.coordinate.y, user.coordinate.z)
              ]} />
              <lineBasicMaterial attach="material" color={COLORS[color]} linewidth={10} linecap={'round'} linejoin={'round'} />
            </line>
          })}
        </group>
      </mesh>
    </group>
  );
}
