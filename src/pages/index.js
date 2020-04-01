import React, { useRef, useState, useEffect, useLayoutEffect } from "react"
import { Canvas, useFrame, useThree, extend } from "react-three-fiber"

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

import { getState } from "../utils/store"

import "../styles/index.scss"

extend({ OrbitControls })

const Rock = () => {
  const rockRef = useRef()
  const [hover, setHover] = useState(false)
  const onHover = () => {
    setHover(!hover)
  }

  const { gl } = useThree()
  useLayoutEffect(() => {
    if (hover) {
      gl.domElement.classList.add("onHover")
      return
    }
    gl.domElement.classList.remove("onHover")
  }, [hover, gl])

  const [toggle, setToggle] = useState(true)
  useFrame(() => {
    if (toggle && rockRef.current) {
      const { advance } = getState()
      const rotations = advance("rock", "rotation", state => {
        const [x, y, z] = state.rock.rotation
        return [x + 0.01, y + 0.01, z + 0.01]
      })
      rockRef.current.rotation.set(...rotations)
    }
  })

  useEffect(() => {
    const { setInitialState } = getState()
    setInitialState("rock", {
      rotation: [0, 0, 0],
    })
  }, [])

  return (
    <mesh
      ref={rockRef}
      castShadow
      position={[0, 0.5, 0]}
      scale={hover ? [1.25, 1.25, 1.25] : [1, 1, 1]}
      onPointerDown={() => {
        setToggle(!toggle)
      }}
      onPointerOver={onHover}
      onPointerOut={onHover}
    >
      <dodecahedronBufferGeometry attach="geometry" args={[1, 0]} />
      <meshPhysicalMaterial attach="material" color="pink" />
    </mesh>
  )
}

const Ground = () => {
  return (
    <mesh receiveShadow position={[0, -1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeBufferGeometry attach="geometry" args={[100, 100, 100]} />
      <meshPhysicalMaterial attach="material" color="brown" />
    </mesh>
  )
}

const Controls = props => {
  const { gl, camera } = useThree()
  const orbitRef = useRef()

  useFrame(({ gl, scene, camera }) => {
    orbitRef.current.update()
  })

  return (
    <orbitControls ref={orbitRef} args={[camera, gl.domElement]} {...props} />
  )
}
const App = () => {
  return (
    <Canvas shadowMap>
      <ambientLight intensity={0.75} />
      <pointLight intensity={0.25} position={[5, 0, 5]} />
      <spotLight
        castShadow
        position={[-5, 2.5, 5]}
        intensity={0.25}
        penumbra={1}
      />
      <Rock />
      <Ground />
      <Controls
        autoRotate={false}
        enablePan={false}
        enableZoom={true}
        enableDamping
        dampingFactor={0.5}
        rotateSpeed={1}
        minDistance={0.5}
        maxDistance={9}
      />
    </Canvas>
  )
}

export default App
