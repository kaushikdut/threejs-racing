"use client";

import React from "react";
import { MeshProps } from "@react-three/fiber";
import { RigidBody } from "@react-three/rapier";

export function Floor(props: MeshProps) {
  return (
    <group name="floor">
      <RigidBody type="fixed" friction={1}>
        <mesh {...props} scale={Math.PI / 2}>
          <boxGeometry args={[100, 0.2, 100]} />
          <meshStandardMaterial color={"hotpink"} />
        </mesh>
      </RigidBody>
      <RigidBody type="fixed">
        <mesh
          {...props}
          rotation={[0, 0, Math.PI / 2]}
          position={[Math.PI / 0.064, 1, (Math.PI / 5) * 0.1]}
        >
          <boxGeometry args={[10, 0.2, 100]} />
          <meshStandardMaterial color={"yellow"} />
        </mesh>
      </RigidBody>
      <RigidBody type="fixed">
        <mesh
          {...props}
          rotation={[0, 0, Math.PI / 2]}
          position={[Math.PI / 0.064, 1, (Math.PI / 5) * 0.1]}
        >
          <boxGeometry args={[10, 0.2, 100]} />
          <meshStandardMaterial color={"yellow"} />
        </mesh>
      </RigidBody>
      <RigidBody type="fixed">
        <mesh
          {...props}
          rotation={[0, 0, Math.PI / 2]}
          position={[(Math.PI / 0.064) * -1, 1, (Math.PI / 5) * 0.1]}
        >
          <boxGeometry args={[10, 0.2, 100]} />
          <meshStandardMaterial color={"red"} />
        </mesh>
      </RigidBody>
      <RigidBody type="fixed">
        <mesh
          {...props}
          rotation={[0, Math.PI / 2, Math.PI / 2]}
          position={[(Math.PI / 0.064) * -0.01, 1, (Math.PI / 5) * 80]}
        >
          <boxGeometry args={[10, 0.2, 100]} />
          <meshStandardMaterial color={"green"} />
        </mesh>
      </RigidBody>
      <RigidBody type="fixed">
        <mesh
          {...props}
          rotation={[0, Math.PI / 2, Math.PI / 2]}
          position={[(Math.PI / 0.064) * -0.01, 1, (Math.PI / 5) * -75]}
        >
          <boxGeometry args={[10, 0.2, 100]} />
          <meshStandardMaterial color={"blue"} />
        </mesh>
      </RigidBody>
    </group>
  );
}
