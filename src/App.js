import "./App.css";
import React from "react";
import styled from "styled-components";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { Earth } from './components/Earth'

const CanvasContainer = styled.div`
  width: 100%;
  height: 80%;
`;

function App() {
  return (
    <CanvasContainer s>
      <Canvas camera={{ zoom: 1, position: [1000, 0, 0] }} frameloop="always">
        <Suspense fallback={null}>
          <Earth />
        </Suspense>
      </Canvas>
    </CanvasContainer>
  );
}

export default App;
