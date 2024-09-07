import { RigidBody } from "@react-three/rapier";

const Car = () => {
  return (
    <group
      name="player"
      rotation={[Math.PI / 1, Math.PI / 1, 0]}
      position={[0, 0, 0]}
    >
      {/* Vehicle Body */}

      <mesh>
        <boxGeometry args={[1, 0.5, 2]} />
        <meshStandardMaterial color="orange" />
      </mesh>

      {/* Front Wheel */}
      <RigidBody colliders={false} position={[0, 0.25, 1]}>
        <mesh>
          <sphereGeometry args={[0.25, 32, 32]} />
          <meshStandardMaterial color="blue" />
        </mesh>
      </RigidBody>
      {/* Back Wheels */}
      <RigidBody colliders={false} position={[-0.5, 0.25, -0.8]}>
        <mesh rotation={[Math.PI / 2, 0, 1.6]}>
          <cylinderGeometry args={[0.2, 0.2, 0.5, 32]} />
          <meshStandardMaterial color="gray" />
        </mesh>
      </RigidBody>
      <RigidBody colliders={false} position={[0.5, 0.25, -0.8]}>
        <mesh rotation={[Math.PI / 2, 0, 1.6]}>
          <cylinderGeometry args={[0.2, 0.2, 0.5, 32]} />
          <meshStandardMaterial color="gray" />
        </mesh>
      </RigidBody>
    </group>
  );
};

export default Car;
