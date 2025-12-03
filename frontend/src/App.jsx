import React, { Suspense, useRef, useState, useLayoutEffect, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useLoader, useThree, invalidate } from '@react-three/fiber';
import { Physics, useBox, usePlane } from '@react-three/cannon';
import { OrbitControls, useGLTF, Html, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import './App.css'; 

// --- Configuration ---
// The URL for the shopping cart model
const CART_MODEL_URL = '/public/5_shopping_cart.glb'; 

// --- 1. The Physics Enabled Model ---
function PhysicsModel({ position = [0, 5, 0], scale = 2, url }) {
    // Load the 3D model data
    const { scene } = useGLTF(url);
    const model = scene.clone(); 
    
    // Calculate bounding box dimensions to correctly define the physics shape
    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    
    // Scale the physics body size proportionally
    const boxArgs = [size.x * scale, size.y * scale, size.z * scale];
    
    // The physics body (useBox)
    const [ref, api] = useBox(() => ({ 
        mass: 1, 
        position, 
        args: boxArgs,
        rotation: [0, Math.PI / 4, 0], 
        // Start the boxes high up and slightly randomized
        linearVelocity: [0, 0, 0] 
    }));

    // Apply scaling to the visual mesh (must be done in layout effect)
    useLayoutEffect(() => {
        if (ref.current) {
            ref.current.scale.set(scale, scale, scale);
        }
    }, [scale]);

    useFrame(() => {
        // Optional: Simple rotation for visual effect
        if (ref.current) {
            ref.current.rotation.y += 0.005; 
        }
    });

    return (
        <primitive 
            ref={ref} 
            object={model} 
            castShadow 
            dispose={null} 
        />
    );
}

// --- 2. The Physics Enabled Floor ---
function Floor(props) {
    const [ref] = usePlane(() => ({ 
        rotation: [-Math.PI / 2, 0, 0], // Lay flat
        ...props
    }));
    
    return (
        <mesh ref={ref} receiveShadow>
            <planeGeometry args={[100, 100]} />
            <shadowMaterial opacity={0.4} />
            <meshStandardMaterial color="#222222" />
        </mesh>
    );
}

// --- 3. Main Scene Setup (FALLING BOXES) ---
function FallingModelScene() {
    return (
        <Canvas 
            shadows 
            camera={{ position: [0, 5, 10], fov: 50 }}
            style={{ width: '100%', height: '100%', background: '#030303' }}
        >
            {/* Physics World: Set strong gravity */}
            <Physics gravity={[0, -20, 0]}>
                <Floor position={[0, -0.5, 0]} />
                
                {/* Create multiple Shopping Carts */}
                <PhysicsModel url={CART_MODEL_URL} position={[0, 15, 0]} scale={0.5} />
                <PhysicsModel url={CART_MODEL_URL} position={[1, 18, 0]} scale={0.4} />
                <PhysicsModel url={CART_MODEL_URL} position={[-1.5, 22, 1]} scale={0.6} />
                <PhysicsModel url={CART_MODEL_URL} position={[2, 25, -1]} scale={0.55} />
                
            </Physics>

            <ambientLight intensity={0.8} />
            <spotLight position={[10, 15, 10]} angle={0.3} penumbra={1} castShadow intensity={2} />
            <OrbitControls target={[0, 3, 0]} />
        </Canvas>
    );
}

// --- 4. THE MAIN APP COMPONENT (REPLACED BOILERPLATE) ---
// Note: PillNav component logic is omitted here for brevity; assume CSS is handling static look.
function App() {
    // Preload model to minimize loading delay
    useGLTF.preload(CART_MODEL_URL); 
    
    return (
        <div className="app-container">
            {/* 3D Falling Boxes Container */}
            <div style={{ width: '100vw', height: '100vh', position: 'fixed', top: 0, left: 0, zIndex: -1 }}>
                <Suspense fallback={<Html center>Loading 3D Physics...</Html>}>
                    <FallingModelScene />
                </Suspense>
            </div>

            {/* Placeholder for the main website content */}
            <main style={{ position: 'relative', zIndex: 10 }}>
                <div style={{ padding: '200px', textAlign: 'center', color: 'white', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <h1>3D Falling Cart Physics Demo</h1>
                    <p>The carts should be dropping behind this text.</p>
                </div>
                <div style={{ height: '150vh', padding: '50px' }}>
                    <h2>Scroll Down to Observe</h2>
                    <p>In a final app, this scroll height would be used to trigger the animation.</p>
                </div>
            </main>
        </div>
    );
}

export default App;