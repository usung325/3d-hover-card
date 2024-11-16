import { useState, useRef, useLayoutEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Html,
  Mask,
  Environment,
  Lightformer,
  OrbitControls,
} from "@react-three/drei";
import * as THREE from "three";

function App() {
  const ref = useRef(null);
  const container = useRef(null);

  return (
    <>
      <div ref={container} className="w-full h-screen">
        <div
          style={{
            position: "flex",
            width: "100%",
            height: "100%",
          }}
          ref={ref}
        />
        <Canvas
          camera={{ fov: 75, position: [0, 0, 200] }}
          style={{ pointerEvents: "none" }}
          eventSource={container}
          eventPrefix="page" //need this to keep coord system consistent mouse in and out of <Content/>
        >
          <OrbitControls />
          <Environment background blur={0.75}>
            {/* <color attach="background" args={[""]} /> */}
            <Lightformer
              intensity={2}
              color="white"
              position={[0, -1, 5]}
              rotation={[0, 0, Math.PI / 3]}
              scale={[100, 0.1, 1]}
            />
            <Lightformer
              intensity={3}
              color="white"
              position={[-1, -1, 1]}
              rotation={[0, 0, Math.PI / 3]}
              scale={[100, 0.1, 1]}
            />
            <Lightformer
              intensity={3}
              color="white"
              position={[1, 1, 1]}
              rotation={[0, 0, Math.PI / 3]}
              scale={[100, 0.1, 1]}
            />
          </Environment>

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
      new THREE.Vector3(-state.pointer.x * 200, -state.pointer.y * 100, 100),
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
        <Html
          portal={portal}
          scale={7}
          transform
          geometry={<planeGeometry args={[1, 1, 1, 1]} />}
        >
          <Content />
        </Html>
      </Mask>
      <mesh position={[0, 0, 10]}>
        <planeGeometry args={[50, 100, 100, 100]} />
        <meshStandardMaterial
          side={THREE.DoubleSide}
          metalness={0.9}
          roughness={0.1}
          color={new THREE.Color(0x111111)}
          envMapIntensity={1.5}
          transparent
          opacity={1.0}
        />
      </mesh>
    </group>
  );
}

function Content() {
  return (
    <div className="flex flex-col items-center text-white">
      <img src="/images/pfp.png" width={250} />
      <div className="flex flex-col gap-y-5">
        <p className="text-xs px-5 py-1 bg-gray-800 rounded-lg">
          Landing Page Design & Development
        </p>
        <p className="text-xs px-5 py-1 bg-gray-800 rounded-lg">
          Website Tempaltes{" "}
          <span className="underline">(one time purchase)</span>
        </p>

        <div className="flex text-xs w-[40%] text-gray-600">
          Framer, React, Javascript, Typescript, Framer Motion, TailwindCSS,
          ThreeJS, R3F, WebGL, GLSL
        </div>
      </div>
    </div>
  );
}

export default App;
