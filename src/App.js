import "./App.css";
import React from "react";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { Earth } from './components/Earth'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useParams
} from "react-router-dom";
import { Home } from "./components/Home";
import files from './data';

const canvasStyle = {
  width: '100%',
  height: '80%',
  backgroundColor: '#01040c'
};

function CanvasContainer() {
  const { filename } = useParams();

  if (!files[filename]) {
    return <div style={{ margin: '3rem' }}>
      <h3>File not found.</h3>
    </div>
  }

  return <div style={canvasStyle}>
    <Canvas camera={{ zoom: 1, position: [12000, 0, 5000], far: 20000 }} frameloop="always">
      <Suspense fallback={null}>
        <Earth data={files[filename]} />
      </Suspense>
    </Canvas>
  </div>
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route exact path="/:filename" element={<CanvasContainer />} />
      </Routes>
    </Router>
  );
}

export default App;
