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
  const [clicked, setClicked] = useState(false);
  return (
    <>
      <div
        ref={container}
        className="w-full h-screen"
        onPointerDown={() => {
          setClicked(true);
        }}
        onPointerUp={() => {
          setClicked(false);
          console.log("clicked");
        }}
      >
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
          position={[0, 0, 1]}
        >
          {/* MODEL */}
          <group
            {...props}
            dispose={null}
            position={[0, 0, -2]}
            scale={29}
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
          </group>
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
          <Wrapper portal={ref} nodes={nodes} clicked={clicked} />
        </Canvas>
      </div>
    </>
  );
}

function Content() {
  return (
    //html content will just always have to be fixed w & h
    <>
      <div className="w-[320px] flex flex-col items-start">
        {/* <div className="w-full h-[10px] rounded-t-md bg-[#D1D1D1]" /> */}
        <div className="flex flex-col items-start text-white bg-[#151515] w-full h-[620px] gap-y-3 px-4 py-5 rounded-b-md">
          <div className="flex w-full justify-center">
            <img src="/images/pfp.png" width={290} />
          </div>
          <div className="flex flex-col gap-y-2 text-xs ">
            <p className="text-xs text-[#444444] underline -mb-1">services</p>
            <div className="flex gap-x-2 px-5 py-1 bg-black text-[#EEEEEE] rounded-lg border border-[#3d3d3d] items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={16}
                height={16}
                fill="none"
              >
                <path
                  fill="#EEE"
                  fillOpacity={0.933}
                  d="M12.679 2.097h-10c-.69 0-1.25.56-1.25 1.25v6.25c0 .69.56 1.25 1.25 1.25h10c.69 0 1.25-.56 1.25-1.25v-6.25c0-.69-.56-1.25-1.25-1.25"
                />
                <path
                  stroke="#EEE"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeOpacity={0.933}
                  d="M7.679 10.847v2.5M5.179 13.347h5"
                />
                <path
                  stroke="#000"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="m5.804 6.636 1.25 1.25 2.5-2.5"
                />
              </svg>
              <p className="">Landing Page Design & Development</p>
            </div>
            <div className="flex gap-x-2 px-5 py-1 bg-black rounded-lg border border-[#3d3d3d] items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={10}
                height={14}
                fill="none"
              >
                <path
                  fill="#EEE"
                  d="M.304 9.192V4.817h8.75V.442H.304l8.75 8.75H4.679m-4.375 0 4.375 4.375V9.192m-4.375 0h4.375z"
                />
              </svg>
              <p className="">
                Website Tempaltes{" "}
                <span className="underline">(one time purchase)</span>
              </p>
            </div>

            <p className="text-xs text-[#444444] underline -mb-1">skills</p>
            <div className="flex text-xs text-[#747474]">
              Framer, React, Javascript, Typescript, Framer Motion, TailwindCSS,
              ThreeJS, R3F, WebGL, GLSL
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function Wrapper({ portal, nodes, clicked }) {
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
      new THREE.Vector3(-state.pointer.x * 100, -state.pointer.y * 50, 150),
      0.08
    );
    state.camera.zoom = THREE.MathUtils.lerp(
      state.camera.zoom,
      clicked ? 1.2 : 0.7,
      clicked ? 0.07 : 0.1
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
      <mesh position={[0, 0, 2]}>
        <planeGeometry args={[55, 110, 100, 100]} />
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
