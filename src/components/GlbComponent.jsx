import { useState, useRef, useLayoutEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Html,
  Mask,
  Environment,
  Lightformer,
  OrbitControls,
  useGLTF,
} from "@react-three/drei";
import * as THREE from "three";

export function Model(props) {
  const ref = useRef(null);
  const container = useRef(null);
  const { nodes, materials } = useGLTF("/models/3dCard.glb");
  // const { nodes, materials } = useGLTF("/models/tag.glb");
  console.log(materials);
  return (
    <>
      <div ref={container} className="w-full h-screen">
        <div
          style={{
            position: "absolute",
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
          {/* MODEL */}
          {/* <group
            {...props}
            dispose={null}
            position={[0, 0, -2]}
            scale={24}
            rotation={[0, Math.PI * 0.5, Math.PI * 0.5]}
          >
            <mesh geometry={nodes.Plane.geometry}>
              <meshPhysicalMaterial
                // map={materials["Material.001"].map}
                // map-anisotropy={16}
                color={new THREE.Color(0xffffff)}
                clearcoat={1}
                clearcoatRoughness={0.15}
                roughness={0.1}
                metalness={0.9}
              />
            </mesh>
          </group> */}
          {/* MODEL */}

          {/* <OrbitControls /> */}
          <Environment background blur={0.75}>
            {/* <color attach="background" args={["black"]} /> */}
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
          <Wrapper portal={ref} nodes={nodes} />
        </Canvas>
      </div>
    </>
  );
}

function Content() {
  return (
    //html content will just always have to be fixed w & h
    <div className="flex flex-col items-center text-white bg-black w-[270px] h-[550px] gap-y-10">
      <img src="/images/pfp.png" width={250} />
      <div className="flex flex-col gap-y-5">
        <p className="text-xs px-5 py-1 bg-black rounded-lg">
          Landing Page Design & Development
        </p>
        <p className="text-xs px-5 py-1 bg-black rounded-lg">
          Website Tempaltes{" "}
          <span className="underline">(one time purchase)</span>
        </p>

        <div className="flex text-xs text-gray-600">
          Framer, React, Javascript, Typescript, Framer Motion, TailwindCSS,
          ThreeJS, R3F, WebGL, GLSL
        </div>
      </div>
    </div>
  );
}

function Wrapper({ portal, nodes }) {
  const meshRef = useRef(null);
  const occludeRef = useRef(null);
  const [geo, setGeo] = useState();

  //need to apply geometry after meshRef as been loaded or will crash
  useLayoutEffect(() => {
    if (meshRef.current) {
      setGeo(meshRef.current.geometry);
    }
  }, []);

  //this is where the mouse movement is happening
  useFrame((state) => {
    console.log(state.pointer.x * 500);
    state.camera.position.lerp(
      new THREE.Vector3(-state.pointer.x * 100, -state.pointer.y * 50, 100),
      0.08
    );
    state.camera.lookAt(0, 0, 0);
    state.camera.updateProjectionMatrix();
  });

  return (
    <group>
      <mesh ref={meshRef}>
        {/* have to hide this planeGeometry for occlude to not flicker bc of z fighting */}
        {/* <planeGeometry args={[1, 1, 1, 1]} /> */}
        {/* hide the plane since it will show unless it's not transparent */}
        {/* <meshBasicMaterial opacity={0.1} transparent /> */}
      </mesh>
      <Mask
        id={1}
        colorWrite={false}
        depthWrite={false}
        geometry={nodes.Plane.geometry}
        position={[0, 0, 0]}
      >
        <Html
          portal={portal}
          scale={7}
          transform
          occlude="blending" // ths makes it blend colors withe veyrthing.... i think.
          // geometry={<planeGeometry args={[1, 1, 1, 1]} />}
        >
          <Content />
        </Html>
      </Mask>
      <mesh position={[0, 0, 1]}>
        <planeGeometry args={[48, 95, 100, 100]} />
        <meshStandardMaterial
          metalness={1.0}
          roughness={0.1}
          color={new THREE.Color(0xffffff)}
          transparent
          opacity={0.1}
          clearcoat={1}
        />
      </mesh>
    </group>
  );
}

useGLTF.preload("/models/3dCard.glb");
