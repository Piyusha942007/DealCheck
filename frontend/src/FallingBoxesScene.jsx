import { Canvas, useFrame } from '@react-three/fiber';
import { Physics, useBox, usePlane } from '@react-three/cannon';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

// --- UTILITY: Load the GLB Model ---
// This is the model you uploaded previously.
const CART_MODEL_URL = 'public/5_shopping_cart.glb'; 

// Preload the model outside the component (best practice)
useGLTF.preload(CART_MODEL_URL);

// --- 1. The Physics Enabled Model (Replaces FallingBox) ---
function PhysicsModel({ position = [0, 5, 0], scale = 1 }) {
    // Load the 3D model data
    const { scene } = useGLTF(CART_MODEL_URL);
    const model = scene.clone(); // Clone to reuse model if needed

    // 1. Calculate bounding box dimensions to correctly define the physics shape (useBox)
    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    const boxArgs = [size.x * scale, size.y * scale, size.z * scale];
    
    // The physics body (useBox)
    const [ref, api] = useBox(() => ({ 
        mass: 1, 
        position, 
        // We use the calculated size for the physics shape
        args: boxArgs,
        // Adjust the rotation slightly so it drops realistically
        rotation: [0, Math.PI / 4, 0], 
    }));

    // 2. Adjust the visual mesh
    useLayoutEffect(() => {
        // Apply scaling to the visual mesh
        if (ref.current) {
            ref.current.scale.set(scale, scale, scale);
        }
    }, [scale]);

    // 3. Simple rotation (optional visual effect)
    useFrame(() => {
        if (ref.current) {
            ref.current.rotation.y += 0.005; 
        }
    });

    return (
        // The mesh object linked to the physics body
        <primitive 
            ref={ref} 
            object={model} 
            castShadow 
            dispose={null} 
        />
    );
}

// --- 2. The Physics Enabled Floor (Unchanged) ---
function Floor(props) {
    const [ref] = usePlane(() => ({ 
        rotation: [-Math.PI / 2, 0, 0],
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

// --- 3. Main Scene Setup (Updated to use PhysicsModel) ---
export default function FallingModelScene() {
    return (
        <Canvas 
            shadows 
            camera={{ position: [0, 5, 10], fov: 50 }}
            style={{ width: '100%', height: '400px', background: '#101010' }}
        >
            <Physics gravity={[0, -9.81, 0]}>
                <Floor position={[0, 0, 0]} />
                
                {/* Create Shopping Carts */}
                <PhysicsModel position={[0, 10, 0]} scale={2} />
                <PhysicsModel position={[1, 15, 1]} scale={1.5} />
                <PhysicsModel position={[-1, 20, -1]} scale={1.8} />
                
            </Physics>

            <ambientLight intensity={0.8} />
            <spotLight position={[10, 15, 10]} angle={0.3} penumbra={1} castShadow intensity={2} />
            <OrbitControls target={[0, 3, 0]} />
        </Canvas>
    );
}