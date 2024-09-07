import { Vector3 } from "@react-three/fiber";
import { RigidBody } from "@react-three/rapier";
import { useEffect, useRef, useState } from "react";

function randomValue(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export function FallingShape({ position }: { position: Vector3 }) {
  const shapeRef = useRef(null);
  const [destroy, setDestroy] = useState(false);

  const [type] = useState(
    ["cube", "sphere", "pyramid"][Math.floor(Math.random() * 3)]
  );
  const [size] = useState(randomValue(0.5, 1));

  useEffect(() => {
    const timer = setTimeout(() => {
      setDestroy(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, [shapeRef.current]);
  return (
    !destroy && (
      <RigidBody
        type="dynamic"
        position={position}
        ref={shapeRef}
        name="falling-shape"
      >
        {type === "cube" && (
          <mesh>
            <boxGeometry args={[size, size, size]} />
            <meshStandardMaterial color="red" />
          </mesh>
        )}
        {type === "sphere" && (
          <mesh>
            <sphereGeometry args={[size, 32, 32]} />
            <meshStandardMaterial color="green" />
          </mesh>
        )}
        {type === "pyramid" && (
          <mesh>
            <coneGeometry args={[size, size * 1.5, 4]} />
            <meshStandardMaterial color="purple" />
          </mesh>
        )}
      </RigidBody>
    )
  );
}
