### \*\*\*WRITE AN INTRO, PART1

### Dependencies

[Gatsby](https://www.gatsbyjs.org/docs/quick-start/) & [Sass plugin](https://www.gatsbyjs.org/packages/gatsby-plugin-sass/) [ThreeJS](https://www.npmjs.com/package/three) [React-Three-Fiber](https://github.com/react-spring/react-three-fiber)

 

### Environment setup

1.  Let’s start with a Gatsby boilerplate project. Go into command line of your favorite directory and type:
    
```javascript
gatsby new my-hello-world-starter https://github.com/gatsbyjs/gatsby-starter-hello-world
```
    
2.  After installation, let's add our needed dependencies to our project:
    
```javascript
cd my-hello-world-starter
yarn add three react-three-fiber && yarn add node-sass gatsby-plugin-sass -D
```
    
3.  Now, let’s register the Sass plugin in Gatsby's config file. Within 'gatsby-config.js', look for module.exports and add the line `plugins: ['gatsby-plugin-sass']`.
    
4.  Next, our 3D world needs to be the full height and width of the viewport. So, create a new index.scss within the following new directory [ src > styles > index.scss]. Copy the code snippet below & save. Finally, go to our index.js file and import "../styles/index.scss”.
```scss    
  html,
  body,
  #\_\_\_gatsby,
  #gatsby-focus-wrapper,
  canvas {
    height: 100%;
    margin: 0;
    padding: 0;
    width: 100%;
  }
```

5.  Let's call `yarn run develop` from the command line to spin up our local development server and enable hot module replacement.

Awesome, now we have a base website for development and can use our two main javascript libraries : [Three.js](https://threejs.org/) (THREE) and [React-three-fiber](https://inspiring-wiles-b4ffe0.netlify.com/) (RTF). THREE is a javascript library that allows developers to author 3D scenes via the [`<canvas>`](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API) without a plugin. In those scenes, developers can add lights, objects, a camera, add animations, and much more. THREE helps developers quickily start building complex 3D worlds with interactions that go beyond what was reasonable possible with the low-level[WebGL API](https://www.khronos.org/webgl/) used for drawing objects directly on canvas. RTF goes one step further and helps developers build re-usable components from THREE objects using a familiar JSX syntax in React. These new components can react to state changes and pull in hooks including specialized RTF hooks like `useFrame()`. Let's get started adding a canvas element and our first 3D object.  

### Getting Started - Our first 3D Object

1.  Back in your favorite IDE, let's `import { Canvas } from "react-three-fiber”` within 'index.js'.
2.  Then remove the default content that Gatsby added and replace it with <Canvas>. Let's also write our App as an exported const (see below).
3.  Add an open <mesh> object with no properties as a child of <Canvas>.‌
4.  Add the <boxBufferGeometry> node with the properties of `args={[1,1,1]}` and `attach="geometry"`.
5.  Then add a <meshBasicMaterial> object with the properties of `color="pink"` and `attach="material"`.

```javascript
import React from "react"
import { Canvas } from "react-three-fiber"

import "../styles/index.scss"

const App = () => {
  return (
    <Canvas>
      <mesh>
        <boxBufferGeometry attach="geometry" args={[1, 1, 1]} />
        <meshBasicMaterial attach="material" color="pink" />
      </mesh>
    </Canvas>
  )
}

export default App;
```

  Every <mesh> we used here is a shortcut for the object [THREE.MESH](https://threejs.org/docs/index.html#api/en/objects/Mesh) which requires two child components -- those being geometry & material. In our case, we added two special types: [<boxBufferGeometry>](https://threejs.org/docs/index.html#api/en/geometries/BoxBufferGeometry) and [<meshBasicMaterial>](https://threejs.org/docs/index.html#api/en/materials/MeshBasicMaterial). We'll discuss some other types later.‌‌⁣ Okay, save this and look at the browser. Wow, we have a pink rectangle. By now, you must be thinking that we could have made this faster in css. Remember, there is a 3D scene there and our cube is positioned at the  coordinates of [0,0,0]. Next, we will start adding some rotational transforms but first...

### So, how does React-Three-Fiber help componentize 3D workflows?

Beyond being a boilerplate that adds a scene, camera and access to [requestAnimationFrame()](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame), RTF lets developers declaratively define THREE properties. Check out the sample code below from [THREE](https://threejs.org/docs/#manual/en/introduction/Creating-a-scene) that illustrates what our <Canvas> element from RTF does in react.

```javascript
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var geometry = new THREE.BoxBufferGeometry([1,1,1]);
var material = new THREE.MeshBasicMaterial( { color: 'pink' } );
var cube = new THREE.Mesh( geometry, material );
scene.add( cube );

camera.position.z = 0;

var animate = function () {
    requestAnimationFrame( animate );
    renderer.render( scene, camera );
};

animate();
```

Take our <mesh> in react for example,

```javascript
<mesh 
  geometry={new THREE.BoxBufferGeometry(1, 1, 1)}
  material={new THREE.MeshBasicMaterial({ color: new THREE.Color('pink')})}
/>
```

It could have been written as showcased above, however a new THREE object would have been re-created on each render cycle— thus wasting resources. RTF instead allows THREE objects like <material> and <geometry> to be defined once, reused and then assigned as constructor arguments of the parent component via their `args` & `attach` properties. In this case, `attach` should be equal to `geometry` since it's parent <mesh> property. This works for all all constructor objects in THREE. ie `<threeObject args={} attach={parent.propertyName} />`

or

Additional, any properties in THREE that have a `.set()` method can be declared like our color on <meshBasicMaterial>. For example [THREE.Color.set](https://threejs.org/docs/index.html#api/en/math/Color.set) can take a color string, hence instead of `color={new THREE.Color(‘pink’)}` you can write `color='pink'`. The same ideal applies to changing the position of a <mesh>. It should be noted that <Mesh> for example in THREE is an extended class based off of [THREE.Object3D](https://threejs.org/docs/#api/en/core/Object3D) which has the .set() method for position. Later for example, we will change `<mesh position={[0, -1, 0]} >`.

Let’s go ahead and change the position of our mesh, rotate it some for effect, and add a plane for reference.

### We have a scene

1.  First, make a re-usable react component out of our existing box mesh with a name of Rock. Be sure to add <Rock> to the canvas for it renders.
    
2.  Add the position property to our current <mesh> with an ordered triplet of numbers `[x,y,z] = [0, 0.5, 0]`. So `<mesh position={[0, 0.5, 0]} …`
    
    This array represents a point in 3D space called a [Vector3](https://threejs.org/docs/#api/en/math/Vector3). Change Y to some positive value like 0.5.
3.  Add the rotation property to our current <mesh> with an array of three angles. `[x,y,z] = [-Math.PI / 3, Math.PI / 5, 0]`. So `<mesh rotation={[-Math.PI / 3, Math.PI / 5, 0]} ...`
    
    This array represents an [Euler](https://threejs.org/docs/#api/en/math/Euler) or angles describing a rotational transformation of a 3D object.
    
4.  Next, because i'm bored of looking at a box. Let's update the geometry. So, replace <boxBufferGeometry> with [<dodecahedronBufferGeometry>](https://threejs.org/docs/#api/en/geometries/DodecahedronBufferGeometry) and change the `args={[1,0]}`
5.  Next copy the <Rock> component and rename to <Ground>. Add a reference in <Canvas> to this new component.
6.  Let's update our <Ground> position and rotation to `<mesh position={[0, -1, 0]} rotation={[-Math.PI / 2, 0, 0]}>`. Don't forget to rotate that plane on the x-axis or our <Ground> will cut the <Rock> in half.
7.  Change the geometry of <Ground> to use [<planeBufferGeometry>](https://threejs.org/docs/#api/en/geometries/PlaneBufferGeometry) and update the args so we can change the size to `args={[100, 100, 100]}`. Yeah, we just made a plane!!!
8.  Change the color prop on <meshBasicMaterial> to brown.
    
```javascript
import React from "react"
import { Canvas } from "react-three-fiber"

import "../styles/index.scss"

const Rock = () => {
  return (
    <mesh position={[0, 0.5, 0]} rotation={[-Math.PI / 3, Math.PI / 5, 0]}>
      <dodecahedronBufferGeometry attach="geometry" args={[1, 0]} />
      <meshBasicMaterial attach="material" color="pink" />
    </mesh>
  )
}

const Ground = () => {
  return (
    <mesh position={[0, -1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeBufferGeometry attach="geometry" args={[100, 100, 100]} />
      <meshBasicMaterial attach="material" color="brown" />
    </mesh>
  )
}

const App = () => {
  return (
    <Canvas>
      <Rock />
      <Ground />
    </Canvas>
  )
}

export default App
```
   

### Light -- in the dark?

If we look at our scene again, it is going to look dull but visible with color. But if we have not added any light sources, should it not be dark? Well, no because our current materials don't react to light. So let’s change our materials to work with light and add a Key Light, Fill Light, and Rim Light or otherwise referred to as [3-point lighting](https://en.wikipedia.org/wiki/Three-point_lighting). We may deviate some here in that lighting technique but the core concept is used across many arts.

*   Key Light = Main light or spotlight that highlights the object
*   Fill Light = Secondary light used to reduce the contrast, often opposite of the key light.
*   Rim Light = A light behind the object that creates a glow. Also called backlighting, hair or shoulder light.

 

1.  Change both of the materials for <Rock> and <Ground> from <meshBasicMaterial> to <meshPhysicalMaterial>. Same props apply here. We are no longer basic!!! If you render this currently, the scene materials would look black. So let’s add some light.
2.  Back in the <Canvas>, add an <ambientLight> as a child with an intensity set to 0.75. We don’t need to set color since it defaults to ‘0xffffff’ `<ambientLight intensity={0.75} />`.
    
    The <Rock> & <Ground> should be dimly lit now but keep in mind this type <ambientLight> won’t cast shadows.
    
3.  Next, we are going to add a fill light from the right side `<pointLight intensity={0.25} position={[5, 0, 5]} />`.
    
4.  Add a key light from the left side `<spotLight position={[-5, 2.5, 5]} intensity={0.25} penumbra={1}/>`.
    
    For our purpose, [penumbra](https://en.wikipedia.org/wiki/Umbra,_penumbra_and_antumbra) is the region on the edges of the light source. Increasing the number will blur the edges of the shadow the light makes.
    
5.  Let's tell THREE that our <Rock> <mesh> material can castShadow. <mesh castShadow>  Additionally, <spotLight castShadow>.
6.  <Ground> needs to be able to receiveShadow on it’s <mesh receiveShadow>
7.  Finally, we need to let the the <Canvas> know to enable shadowMap. <Canvas shadowMap />

 
```javascript
import React from "react"
import { Canvas } from "react-three-fiber"

import "../styles/index.scss"

const Rock = () => {
  return (
    <mesh
      castShadow
      position={[0, 0.5, 0]}
      rotation={[-Math.PI / 3, Math.PI / 5, 0]}
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
    </Canvas>
  )
}

export default App
```

  In last section, we placed light sources in the scene, told THREE which objects cast and receive shadows, and enabled shadowMaps on the <Canvas> thus indirectly telling the [WebGLRenderer](https://threejs.org/docs/#api/en/constants/Renderer) to use a shadowMap.type of [THREE.PCFSoftShadowMap](https://threejs.org/docs/#api/en/renderers/WebGLRenderer.shadowMap.type). In computer graphics, a [shadow map](https://www.youtube.com/watch?v=0e01qWckKD4) basically is a rendering of the scene from a light source's point-of-view, which than stores the z-depth of every point that the light touches in a buffer of sorts. When the scene renders from the camera's perspective, then point B depth can be compared to point A. See picture below: ![](https://engineering.icf.com/wp-content/uploads/2020/03/lighting-01-1024x655.png)  

### Animation Loop and Interactivity

The basics of our sample scene are almost done however, we will need to setup some state-management for variables that we are going to update in a render loop within our component. To start it must be noted, DO NOT SET a state variable using the useState() hook within these animation loops.  Otherwise, our whole component would re-render far too often. Instead, we are going to use [Zustand](https://github.com/react-spring/zustand) for state-management and transiently update the value without rendering the whole component.  Let's start by adding a helper file and then adding some animation to our <Rock> using useRef() and RTF's [useFrame()](https://github.com/react-spring/react-three-fiber#user-content-useframe) hook. Finally, we will toggle that animation using a click event.

#### Animation & Store Setup:

1.  Create new directory called 'utils' with a file called 'store.js' [src > utils > store.js]. Copy the code below into that file and save. This file will help us store an initial state via setInititalState() and later update the current state via advance().

```javascript 
import create from "zustand"

const [useStore, { subscribe, getState, setState }] = create(
  (set, get, api) => ({
    advance: (type, key, callback) => {
      set(state => {
        const newValue = callback(state)
        return {
          ...state,
          [type]: {
            ...state[type],
            [key]: newValue,
          },
        }
      })
      return get()[type][key]
    },
    setInitialState: (type, initialState) => {
      set(state => {
        return {
          ...state,
          [type]: initialState,
        }
      })
    },
  })
)

export { useStore, subscribe, getState, setState }
```
    
2.  Let's update all the imports we are going to use for both our animation and interactivity.
    
```javascript
import React, { useRef, useEffect, useLayoutEffect, useState } from "react"
import { Canvas, useFrame, useThree } from "react-three-fiber"

import { getState } from "../utils/store"

import "../styles/index.scss"
```
    
3.  In the <Rock> component, make a `const rockRef = useRef()`;
4.  Assign the ref to the `<mesh ref={rockRef}>`
5.  Delete our current rotational properties on the <mesh> as we will update those in a new manner.
6.  Use the hook useEffect() on component mount and deconstruct `{ setIntialState }` from getState() that we imported earlier. Call setIntialState() and pass a string of 'rock' and a new object with our rotational starting values as an array;
    
```javascript
useEffect(() => {
  const { setInitialState } = getState()
  setInitialState("rock", {
    rotation: [0, 0, 0],
  })
}, [])
```
    
7.  In the <Rock> component, we are now going to set the rotational properties within the [useFrame()](https://github.com/react-spring/react-three-fiber#user-content-useframe) loop. This is basically the browser’s native [requestAnimationFrame()](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame) but returns `{ gl, scene, camera }`  in a function you supply. [ gl = [webGLRender](https://threejs.org/docs/index.html#api/en/renderers/WebGLRenderer), scene = [THREE.Scene](https://threejs.org/docs/index.html#api/en/scenes/Scene), camera = [THREE.Camera](https://threejs.org/docs/index.html#api/en/cameras/Camera)]
    
    Add useFrame() to our <Rock > component and  conditional check for our `rockRef.current`.
8.  Next in the conditional, deconstruct { advance } from getState() and copy the lines below:

```javascript  
const rotations = advance("rock", "rotation", state => {
  const [x, y, z] = state.rock.rotation
  return [x + 0.01, y + 0.01, z + 0.01]
})
```
    
At this point, the code to manage our store could vary but we called advance() with the parameters of type, key, and a callback. I basically set this uto categorize the store state according to a type string, key being the property we are going to change on type, and a callback function to update oustate. This should work nicely later when we expand our components depth in the future. Advance() will return the current state without re-renderin<Rock> and allow us to use it within useFrame();
    
9.  Finally, add `rockRef.current.rotation.set(...rotations)` after const rotations. to update the current rotational value of our <mesh>.

```javascript  
useFrame(() => {
  if (rockRef.current) {
    const { advance } = getState();
    const rotations = advance("rock", "rotation", state => {
      const [x, y, z] = state.rock.rotation
      return [x + 0.01, y + 0.01, z + 0.01]
    })
    rockRef.current.rotation.set(...rotations);
  }
})
```


#### Interactivity

Our last task for today will be to add in some interactivity. It’s important to understand mouse events or [pointerEvents](https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events), as we will use here, on ThreeJS objects are inherently different than normal click events for DOM elements. Normally nothing but the <canvas> element would be clickable if not for a technique called ray casting that acts as a collision detection sytem and depth sensor. For our purpose, remember if a THREE object implements or inherits a raycast method  (check the [THREE docs](https://threejs.org/docs/)) then events can be declared on the object. If you’d like to know more about ray casting and how it's similarly used in lighting and shadow maps beyond what we went over in the lighting section, then check out this [2-D tech demo on making your own ray-caster](https://www.youtube.com/watch?v=TOEi6T2mtHo) or for a deeper dive checkout the whole Udacity series on youtube for free about computer graphics, which includes ray casting, [here](https://www.youtube.com/watch?v=8fe9RaEEGQU).

1.  Let's toggle rotating <Rock> on click of the component. Our imports were covered earlier, so assign a new const `[toggle, setToggle]` from the useState() hook with the default state of true. Then add `[toggle]` as an added condition of our existing render loop in useFrame();

```javascript 
const [toggle, setToggle] = useState(true)
useFrame(() => {
  if (toggle && rockRef.current) {
    const { advance } = getState();
    const rotations = advance("rock", "rotation", state => {
      const [x, y, z] = state.rock.rotation
      return [x + 0.01, y + 0.01, z + 0.01]
    })
    rockRef.current.rotation.set(...rotations)
  }
})
```

     
2.  Next, we need to adjust the state of `[toggle]` by adding an event on the <mesh>. Use the [onPointerDown()](https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers/onpointerdown) event handler for our code works independent of a physical mouse. Add onPointerDown() to the <mesh> and within the handler call `setToggle(!toggle)`.

```javascript 
<mesh
  ref={rockRef}
  castShadow
  position={[0, 0.5, 0]}
  onPointerDown={() => {
    setToggle(!toggle)
  }}
>
```
    
     
3.  The remaining steps are to add a css class to our <canvas> element when hovering over the <Rock> and scale the <mesh> on hover for added effect. We will toggle a css <canvas> class on [pointerOver](https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers/onpointerover) and [pointerOut](https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers/onpointerout) events. To target the <canvas> element, we can use the [useThree()](https://github.com/react-spring/react-three-fiber#usethree-sharedcanvascontext) hook from RTF which returns the webGLRenderer and stores a reference to the element at `gl.domElement`. We've already `imported { useThree } from ‘react-three-fiber’` earlier. Thus,...
    
    Within <Rock>, declare a new `const { gl } = useThree()` and declare `const [hover, setHover] = useState(false)` in our component.
4.  Add `onPointerOver={onHover}`, `onPointerOut={onHover}`, and update the scale based on the `[hover]` state on our <mesh>. Any values can be used here that you like.

```javascript  
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
```
    
5.   Next, declare a new function named 'onHover' and toggle `[hover]` via setHover(). Within a new useLayoutEffect() hook, write a conditional that checks for `[hover]` and adds a css class of 'onHover' to the <canvas>; otherwise, useLayoutEffect() should remove the same class. In useLayoutEffect(), it's   dependencies to update are `[ hover, gl ]`;

```javascript 
import React, { useRef, useState, useEffect, useLayoutEffect } from "react"
import { Canvas, useFrame, useThree } from "react-three-fiber"

import { getState } from "../utils/store"

import "../styles/index.scss"

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
    </Canvas>
  )
}

export default App

```

 
6.  Finally add the scss below to our styles and run.

```scss    
canvas {
  &.onHover {
    cursor: pointer;
  }
}
```

 

### Next Time:

In my next blog post, we will use the basic environment setup to extend these principles and start developing a viable product demo that uses RTF. I will talk about loading a pre-built model from a popular free 3D modeling software called [Blender](https://www.blender.org/). We will use THREE's [GLTFLoader](https://threejs.org/docs/#examples/en/loaders/GLTFLoader) to import a model, trigger a dynamic animation, talk quickly about a low-poly model and textures, and of course, control the camera. See you then. -Tyler
    