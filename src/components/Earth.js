import React, { useRef } from "react";
import { useLoader, useFrame, useThree } from "@react-three/fiber";
import { TextureLoader } from "three";
import { OrbitControls, Stars } from "@react-three/drei";
import * as THREE from "three";
import data from "../data.json";

import EarthDayMap from "../assets/img/earth_texture_map_1000px.jpg";

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
      <pointLight color="#f6f3ea" position={[2, 0, 5]} intensity={1.2} />
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
          depthWrite={true}
          transparent={true}
          side={THREE.DoubleSide}
        />
      </mesh>
      {data.users.map((satellite, i) => <mesh
        key={satellite.id}
        ref={el => satellitesRef.current[i] = el}
        position={[satellite.coordinate.x, satellite.coordinate.y, satellite.coordinate.z]}>
        <sphereGeometry args={[0.1, 32, 32]} />
        <meshPhongMaterial
          color='red'
          side={THREE.DoubleSide}
        />
      </mesh>)}
      {data.users.map((user, i) => <mesh
        key={user.id}
        ref={el => usersRef.current[i] = el}
        position={[user.coordinate.x, user.coordinate.y, user.coordinate.z]}>
        <sphereGeometry args={[0.1, 32, 32]} />
        <meshPhongMaterial
          color='green'
          side={THREE.DoubleSide}
        />
      </mesh>)}
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
