import * as THREE from 'three';
import { Suspense, useEffect, useLayoutEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ScrollControls, useScroll, useGLTF, useAnimations } from '@react-three/drei';
import { Physics, useSphere } from '@react-three/cannon';

window.addEventListener('message', function(event) {
    var scrollPosition = event.data;
    // Update your Three.js camera position based on the scrollPosition
    // Example:
    // camera.position.z = initialZPosition - scrollPosition * scrollFactor;
});

export default function App() {
  return (
    <Canvas shadows camera={{ position: [1, 2, 10] }}>
      <ambientLight intensity={0.5} /> {/* Lower ambient light intensity */}
      <fog attach="fog" args={['#000000', 5, 18]} /> {/* Darker fog color */}
      <directionalLight
        position={[75, 10, 0]}
        intensity={1.5}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.001}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
        shadow-camera-near={0.1}
        shadow-camera-far={50}
      />
      <directionalLight
        position={[-75, 10, 0]}
        intensity={1.5}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.001}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
        shadow-camera-near={0.1}
        shadow-camera-far={50}
      />
      <directionalLight
        position={[0, 75, 0]}
        intensity={2.5}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.001}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={40}
        shadow-camera-bottom={-10}
        shadow-camera-near={0.1}
        shadow-camera-far={50}
      />
      <directionalLight
        position={[0, -75, 0]}
        intensity={1.5}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.001}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
        shadow-camera-near={0.1}
        shadow-camera-far={50}
      />
      <Suspense fallback={null}>
        <ScrollControls pages={6}>
          <RomeModel scale={0.02} position={[0, 2.5, 0]} />
          <GlassSphere position={[-1.4, 5.3, 5.5]} /> {/* Add Glass Sphere */}
          <LightRedBlurrySphere position={[-1.4, 5.3, 5.5]} /> {/* Add Glass Sphere */}
          <GlassDonut position={[-1, 2.5, -6]} /> {/* Add Glass Donut */}
          <GlassWall position={[3, 4, -7]} size={[-14, -15, 0.2]} rotation={[0, -0, 0]} />
          <SpiralSphere position={[0.5, 3.5, -0.61]} /> {/* Add Spiral Sphere */}
          <SpiralCylinder position={[2.5, 3, 6.9]} /> {/* Add Spiral Cylinder */}
          <CustomSquare position={[3,2, 2]} /> {/* Add Custom Square */}
          <RainbowBall position={[6, 8, 9]} /> {/* Add Rainbow Ball */}
          <Balls  /> {/* Add Rainbow Ball */}
        </ScrollControls>
      </Suspense>
    
      <color attach="background" args={['#000000']} /> {/* Dark background color */}
    </Canvas>
  );
}

function Balls({ ...props }) {
  const ballRefs = useRef([]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const speeds = [0.99, 1, 1, 0.4, 0.2, 0.5]; // Different speeds for each ball
    

    ballRefs.current.forEach((ball, index) => {
      if (ball) {
        const speed = speeds[index];
        const y = initialPositions[index][1] + Math.sin(time * speed) * 0.3; // Moves up and down
        ball.position.y = y;
      }
    });
  });

  const ballColors = ["red", "blue", "green", "yellow", "purple", "orange"];
  const ballScales = [1, 1.3, 1.7, 1.6, 1.7, 2.8];
  const initialPositions = [
    [7.8, 2.7, -3.6],
    [4.6, 3.3, -0.7],
    [4, 3, 4],
    [2.5, 5.9, 2],
    [5.6, 1.4,1],
    [3, 3.2, -2.3],
  ]; // Different initial positions (x, y, z)

  return (
    <>
      {ballColors.map((color, index) => (
        <mesh
          key={index}
          ref={(el) => (ballRefs.current[index] = el)}
          scale={[ballScales[index], ballScales[index], ballScales[index]]}
          position={initialPositions[index]}
          {...props}
          castShadow
          receiveShadow
        >
          <sphereGeometry args={[0.3, 64, 64]} />
          <meshPhysicalMaterial
            transmission={1} // Make material transparent
            thickness={1.5} // Add refraction
            roughness={0} // Smooth surface
            clearcoat={1} // Add reflective clear coat
            clearcoatRoughness={0} // Smooth clear coat
            metalness={0} // No metalness for a glass-like finish
            reflectivity={1} // Reflective material
            color={color} // Use the color for glass tint
          />
        </mesh>
      ))}
    </>
  );
}


function RainbowBall({ ...props }) {
  const ballRef = useRef();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    // Calculate position using a sine wave for smooth back-and-forth motion
    const x = -2 + Math.sin(time) * 1; // Moves between 2 and 3.5
    const y = 4 + Math.sin(time) * 1; // Moves between 2 and 3.5

    if (ballRef.current) {
      ballRef.current.position.z = x;
      ballRef.current.position.y = y;
    }
  });

  return (
    <mesh ref={ballRef} {...props} castShadow receiveShadow>
      <sphereGeometry args={[0.3, 64, 64]} />
      <meshStandardMaterial
        metalness={1}
        roughness={0.1}
        color="red"
        emissive="black"
        emissiveIntensity={0.5}
        envMapIntensity={1}
        clearcoat={1}
        clearcoatRoughness={0.1}
        reflectivity={1}
      />
    </mesh>
  );
}

function CustomSquare({ ...props }) {
  const squareRef = useRef();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    // Calculate position using a sine wave for smooth up-and-down motion
    const y = 2 + Math.sin(time) * 1.5; // Moves between 0.5 and 3.5

    if (squareRef.current) {
      squareRef.current.position.y = y;
    }
  });

  return (
    <mesh ref={squareRef} {...props} castShadow receiveShadow>
      <boxGeometry args={[0.19, 5, 5]} />
      <meshPhysicalMaterial
        background={new THREE.Color('#839681')}
        backside={false}
        samples={10}
        resolution={2048}
        transmission={1} // Make material transparent
        roughness={0} // Smooth surface
        thickness={3.5} // Add refraction
        color="#c9ffa1" // Base color
      />
    </mesh>
  );
}



function SpiralCylinder({ ...props }) {
  const cylinderRef = useRef();

  useFrame(() => {
    if (cylinderRef.current) {
      cylinderRef.current.rotation.x += 0.00;
      cylinderRef.current.rotation.y += 0.01;
    }
  });

  const texture = new THREE.CanvasTexture(generateMetallicSpiralTexture());

  return (
    <mesh ref={cylinderRef} {...props} castShadow receiveShadow>
      <cylinderGeometry args={[0.7, 0.7, 9, 90, 64]} /> {/* Adjust dimensions as needed */}
      <meshStandardMaterial map={texture} metalness={1} roughness={0.3} />
    </mesh>
  );
}

function generateMetallicSpiralTexture() {
  const size = 612;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  // Metallic spiral pattern generation
  const centerX = size / 5;
  const centerY = size / 5;
  const lineWidth = 7;
  const turns = 20;

  // Gradient for metallic effect
  const gradient = ctx.createLinearGradient(0, 0, size, size);
  gradient.addColorStop(0, '#ffffff');
  // gradient.addColorStop(0.5, '#aaaaaa');
  // gradient.addColorStop(1, '#000000');

  ctx.strokeStyle = gradient;
  ctx.lineWidth = lineWidth;
  ctx.beginPath();

  for (let i = 0; i < turns * Math.PI * 2; i += 0.1) {
    const x = centerX + (i * size / (turns * Math.PI * 2)) * Math.cos(i);
    const y = centerY + (i * size / (turns * Math.PI * 2)) * Math.sin(i);
    ctx.lineTo(x, y);
  }

  ctx.stroke();
  return canvas;
}

function SpiralSphere({ ...props }) {
  const sphereRef = useRef();

  useFrame(() => {
    if (sphereRef.current) {
      sphereRef.current.rotation.x += 0.01;
      sphereRef.current.rotation.y += 0.01;
    }
  });

  const texture = new THREE.CanvasTexture(generateSpiralTexture());

  return (
    <mesh ref={sphereRef} {...props} castShadow receiveShadow>
      <sphereGeometry args={[1, 90, 64]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  );
}

function generateSpiralTexture() {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  // Spiral pattern generation
  const centerX = size / 2;
  const centerY = size / 2;
  const lineWidth = 5;
  const turns = 20;

  ctx.strokeStyle = '#FFFFFF'; // Spiral color
  ctx.lineWidth = lineWidth;
  ctx.beginPath();
  
  for (let i = 0; i < turns * Math.PI * 2; i += 0.1) {
    const x = centerX + (i * size / (turns * Math.PI * 2)) * Math.cos(i);
    const y = centerY + (i * size / (turns * Math.PI * 2)) * Math.sin(i);
    ctx.lineTo(x, y);
  }

  ctx.stroke();
  return canvas;
}

function LightRedBlurrySphere({ ...props }) {
  const sphereRef = useRef();

  useFrame(() => {
    if (sphereRef.current) {
      sphereRef.current.rotation.y += 0.01; // Rotate around y-axis
    }
  });

  return (
    <mesh ref={sphereRef} {...props} castShadow receiveShadow>
      <sphereGeometry args={[1, 70, 60]} />
      <meshPhysicalMaterial
        color="red"
        transparent
        opacity={0.8}
        roughness={0.7}
        transmission={1}
        thickness={0.5}
        clearcoat={1}
        clearcoatRoughness={0.5}
        metalness={0.1}
        reflectivity={0.5}
      />
    </mesh>
  );
}

function GlassDonut({ ...props }) {
  const donutRef = useRef();

  useFrame(() => {
    if (donutRef.current) {
      donutRef.current.rotation.x += 0.01;
      donutRef.current.rotation.y += 0.01;
    }
  });
  return (
    <mesh ref={donutRef} {...props} castShadow receiveShadow>
      <torusGeometry args={[1, 0.4, 90, 64]} />
      <meshPhysicalMaterial
        transmission={1} // Make material transparent
        thickness={0.6} // Add refraction
        roughness={0} // Smooth surface
        clearcoat={1} // Add reflective clear coat
        clearcoatRoughness={0} // Smooth clear coat
        metalness={0} // No metalness for a glass-like finish
        reflectivity={2} // Reflective material
        color="red"
      />
      
    </mesh>
  );
}

function GlassSphere({ ...props }) {
  return (
    <mesh {...props} castShadow receiveShadow>
      <sphereGeometry args={[1, 90, 64]} />
      <meshPhysicalMaterial
        transmission={1} // Make material transparent
        thickness={0.2} // Add refraction
        roughness={0} // Smooth surface
        clearcoat={1} // Add reflective clear coat
        clearcoatRoughness={0} // Smooth clear coat
        metalness={0} // High metalness for a chrome-like finish
        reflectivity={2} // Reflective material
        color="red"
      />
    </mesh>
  );
}

function GlassWall({ ...props }) {
  const meshRef = useRef();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    // Calculate position using a sine wave for smooth back-and-forth motion
    const x = 3 + Math.sin(time) * (4 - 3); // Moves between 3 and 4
    if (meshRef.current) {
      meshRef.current.position.x = x;
    }
  });

  return (
    <mesh ref={meshRef} receiveShadow {...props}>
      <boxGeometry args={[3, 4, 0.2]} /> {/* Adjust dimensions as needed */}
      <meshPhysicalMaterial
        transmission={1} // Make material transparent
        thickness={0.5} // Add refraction
        roughness={0} // Smooth surface
        clearcoat={1} // Add reflective clear coat
        clearcoatRoughness={1} // Smooth clear coat
        metalness={0} // No metalness for a glass-like finish
        reflectivity={0.05} // Reflective material
        color="yellow" // Red color
      />
    </mesh>
  );
}


function RomeModel({ ...props }) {
  const scroll = useScroll();
  const { scene, nodes, animations } = useGLTF('/Rome3.glb');
  const { actions } = useAnimations(animations, scene);
  const cameraRef = useRef();

  useLayoutEffect(() => {
    Object.values(nodes).forEach((node) => {
      node.receiveShadow = node.castShadow = true;
    });
  }, [nodes]);

  // Define more target positions for smoother movement
  // Define circular target positions for smoother movement around the model
  const targetPositions = [
    new THREE.Vector3(1,24, -14),   // Adjusted left position
    new THREE.Vector3(1, 16, 11),   // Adjusted top position
    new THREE.Vector3(0, 5, 15),   // Adjusted top position
    new THREE.Vector3(15, 5, 0),   // Adjusted right position
    new THREE.Vector3(0, 5, -15),  // Adjusted bottom position
    new THREE.Vector3(-16, -15, -15),  // Adjusted bottom position
  ];


  useEffect(() => {
    const action = actions['Take 001'];
    if (action) {
      action.play().paused = true;
    }
  }, [actions]);

  useFrame((state) => {
    const offset = scroll.offset;

    // Calculate the current target index based on the scroll offset
    const targetIndex = Math.floor(offset * (targetPositions.length - 1));
    const nextIndex = (targetIndex + 1) % targetPositions.length;

    // Smoothly interpolate between current and target position
    const currentPos = state.camera.position.clone();
    const startPos = targetPositions[targetIndex];
    const endPos = targetPositions[nextIndex];
    const easedOffset = easeInOutQuad((offset * (targetPositions.length - 1)) % 1);

    currentPos.lerpVectors(startPos, endPos, easedOffset);
    state.camera.position.copy(currentPos);

    state.camera.lookAt(new THREE.Vector3(0, 0, 0)); // Look at the center

    // More pronounced ease-in and ease-out function
    function easeInOutQuad(t) {
      return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }
  });

  return <primitive object={scene} {...props} />;
}


useGLTF.preload('/Rome3.glb');
