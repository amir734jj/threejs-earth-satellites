import React, { useRef } from "react";
import { useLoader, useFrame } from "@react-three/fiber";
import { TextureLoader } from "three";
import { OrbitControls, Stars } from "@react-three/drei";
import * as THREE from "three";
import data from "../data.json";

import EarthDayMap from "../assets/img/earth_texture_map_1000px.jpg";

const COLORS = {
  0: 'white',
  1: 'lightgrey',
  2: 'orange',
  3: 'pink'
};

const EARTH_RADIUS = 4000;

export function Earth(props) {
  const [colorMap, normalMap, specularMap, cloudsMap] = useLoader(
    TextureLoader,
    [EarthDayMap]
  );

  const earthRef = useRef();
  const cloudsRef = useRef();
  const satellitesRef = useRef([]);
  const usersRef = useRef([]);

  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime();

    earthRef.current.rotation.y = elapsedTime / 24;
    cloudsRef.current.rotation.y = elapsedTime / 24;
  });

  return (
    <>
      <ambientLight intensity={1} />
      <pointLight color="#f6f3ea" position={[5000, 0, 5]} intensity={1.2} />
      <Stars
        radius={30000}
        count={20000}
        factor={7}
        saturation={0}
        fade={true}
      />
      <mesh ref={cloudsRef} position={[0, 0, 0]}>
        <sphereGeometry args={[0, 32, 32]} />
        <meshPhongMaterial
          map={cloudsMap}
          opacity={0.1}
          transparent={true}
          side={THREE.DoubleSide}
        />
      </mesh>
      <group>
        {data.satellites.map(({ coordinate: { x, y, z }, id }, i) => <mesh
          key={id}
          ref={el => satellitesRef.current[i] = el}
          position={[x, y, z]}>
          <sphereGeometry args={[100, 32, 32]} />
          <meshPhongMaterial
            color='red'
            side={THREE.DoubleSide}
          />
        </mesh>)}
      </group>
      <group>
        {data.satellites.map(({ coordinate: { x, y, z }, id }, i) => <mesh
          key={id}
          ref={el => usersRef.current[i] = el}
          position={[x, y, z]}>
          <sphereGeometry args={[100, 32, 32]} />
          <meshPhongMaterial
            color='green'
            side={THREE.DoubleSide}
          />
        </mesh>)}
      </group>
      <group>
        {data.mappings.map(({ satellite: satelliteId, user: userId, color }, id) => {

          const satellite = data.satellites.find(s => s.id === satelliteId);
          const user = data.users.find(u => u.id === userId);

          return <line key={id}
            points={[
              [satellite.coordinate.x, satellite.coordinate.y, satellite.coordinate.z],
              [user.coordinate.x, user.coordinate.y, user.coordinate.z]
            ]}
            color={COLORS[color]}
          />
        })}
      </group>
      <mesh ref={earthRef} position={[0, 0, 0]}>
        <sphereGeometry args={[EARTH_RADIUS, 256, 256]} />
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
      </mesh>
    </>
  );
}
