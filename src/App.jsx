import { useState, useRef, useEffect, useLayoutEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html, Mask } from "@react-three/drei";
import * as THREE from "three";

function App() {
  const ref = useRef(null);
  const container = useRef(null);

  return (
    <>
      <div ref={container} className="w-full h-screen">
        <div
          style={{
            position: "absolute",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            overflow: "hidden",
          }}
          ref={ref}
        />
        <Canvas
          style={{ pointerEvents: "none" }}
          eventSource={container}
          eventPrefix="page" //need this to keep coord system consistent mouse in and out of <Content/>
        >
          <Wrapper portal={ref} />
        </Canvas>
      </div>
    </>
  );
}

function Wrapper({ portal }) {
  const meshRef = useRef(null);
  const [geo, setGeo] = useState();

  //need to apply geometry after meshRef as been loaded or will crash
  useLayoutEffect(() => {
    if (meshRef.current) {
      setGeo(meshRef.current.geometry);
    }
  }, []);

  useFrame((state) => {
    console.log(state.pointer.x * 500);
    state.camera.position.lerp(
      new THREE.Vector3(-state.pointer.x * 20, -state.pointer.y * 20, 100),
      0.1
    );
    state.camera.lookAt(0, 0, 0);
    state.camera.updateProjectionMatrix();
  });

  return (
    <group>
      <mesh ref={meshRef}>
        <planeGeometry args={[1, 1, 40, 40]} />
        {/* hide the plane since it will show unless it's not transparent */}
        <meshBasicMaterial opacity={0.1} transparent />
      </mesh>
      <Mask id={1} colorWrite={false} depthWrite={false} geometry={geo}>
        <Html portal={portal} scale={10} transform>
          <Content />
        </Html>
      </Mask>
    </group>
  );
}

function Content() {
  return (
    <div className="bg-purple-200 flex flex-col gap-y-2">
      <p>welcome home</p>
      <p>welcome home</p>
      <p>welcome home</p>
      <p>welcome home</p>
      <p>welcome home</p>
      <p>welcome home</p>
      <p>welcome home</p>
    </div>
  );
}

export default App;
