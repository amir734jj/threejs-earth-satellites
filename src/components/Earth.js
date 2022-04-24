import React, { useRef } from "react";
import { useLoader, useFrame, useThree } from "@react-three/fiber";
import { TextureLoader } from "three";
import { OrbitControls, Stars } from "@react-three/drei";
import * as THREE from "three";
import data from "../data.json";

import EarthDayMap from "../assets/img/earth_texture_map_1000px.jpg";

const COLORS = {
  [0]: 'white',
  [1]: 'lightgrey',
  [2]: 'orange',
  [3]: 'pink'
}

export function Earth(props) {
  const [colorMap, normalMap, specularMap, cloudsMap] = useLoader(
    TextureLoader,
    [EarthDayMap]
  );

  const earthRef = useRef();
  const cloudsRef = useRef();
  const satellitesRef = useRef([]);
  const usersRef = useRef([]);

  useThree(({ camera }) => {
    // camera.position.set(10000, 0, 0)
    // camera.lookAt.set(0, 0, 0)
  });

  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime();

    earthRef.current.rotation.y = elapsedTime / 6;
    cloudsRef.current.rotation.y = elapsedTime / 6;
  });

  return (
    <>
      <ambientLight intensity={1} />
      <pointLight color="#f6f3ea" position={[5000, 0, 5]} intensity={1.2} />
      <Stars
        radius={30000}
        depth={60}
        count={20000}
        factor={7}
        saturation={0}
        fade={true}
      />
      <mesh ref={cloudsRef} position={[0, 0, 0]}>
        <sphereGeometry args={[4005, 32, 32]} />
        <meshPhongMaterial
          map={cloudsMap}
          opacity={0.1}
          transparent={true}
          side={THREE.DoubleSide}
        />
      </mesh>
      {data.satellites.map(({ coordinate: { x, y, z }, id }, i) => <mesh
        key={id}
        ref={el => satellitesRef.current[i] = el}
        position={[x, y, z]}>
        <sphereGeometry args={[0.1, 32, 32]} />
        <meshPhongMaterial
          color='red'
          side={THREE.DoubleSide}
        />
      </mesh>)}
      {data.satellites.map(({ coordinate: { x, y, z }, id }, i) => <mesh
        key={id}
        ref={el => usersRef.current[i] = el}
        position={[x, y, z]}>
        <sphereGeometry args={[0.1, 32, 32]} />
        <meshPhongMaterial
          color='green'
          side={THREE.DoubleSide}
        />
      </mesh>)}
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
      <mesh ref={earthRef} position={[0, 0, 0]}>
        <sphereGeometry args={[4000, 32, 32]} />
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
          zoomSpeed={0.6}
          panSpeed={0.5}
          rotateSpeed={0.4}
        />
      </mesh>
    </>
  );
}
