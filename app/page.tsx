"use client";
import { Canvas } from "@react-three/fiber";
import { CollisionEnterPayload, Physics } from "@react-three/rapier";
import { Floor } from "./_components/floor";
import { KeyboardControls, OrbitControls } from "@react-three/drei";
import Car from "./_components/car";
import { useEffect, useState } from "react";
import { FallingShape } from "./_components/fallingObjects";
import { Vector3 } from "three";
import { Button } from "@/components/ui/button";
import Ecctrl from "ecctrl";
import { getScores, saveScore } from "@/lib/supabase";

interface Shape {
  id: number;
  position: Vector3;
}
export default function Home() {
  const keyboardMap = [
    { name: "forward", keys: ["ArrowUp", "KeyW"] },
    { name: "backward", keys: ["ArrowDown", "KeyS"] },
  ];
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [start, setStart] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  useEffect(() => {
    async function fetchScores() {
      const scoresData: { score: number }[] = await getScores();
      setHighScore(scoresData[0].score);
    }

    fetchScores();
  }, []);
  const handleCollision = (event: CollisionEnterPayload) => {
    if (event.colliderObject?.parent?.name === "falling-shape") {
      setGameOver(true);
      if (score > highScore) {
        saveScore(score);
      }
    }
  };

  useEffect(() => {
    if (start && !gameOver) {
      const scoreInterval = setInterval(() => {
        setScore((prevScore) => prevScore + 1);
      }, 1000);

      return () => clearInterval(scoreInterval);
    }
  }, [start, gameOver]);

  /* Falling Objects */

  useEffect(() => {
    const interval = setInterval(() => {
      setShapes((prevShapes) => [
        ...prevShapes,
        {
          id: Math.random(),
          position: new Vector3(
            (Math.random() - 0.5) * -50,
            10,
            (Math.random() - 0.5) * 50
          ),
        },
        {
          id: Math.random(),
          position: new Vector3(
            (Math.random() - 0.5) * -50,
            10,
            (Math.random() - 0.5) * 50
          ),
        },
      ]);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setShapes((prevShapes) => [
        ...prevShapes,
        {
          id: Math.random(),
          position: new Vector3(
            (Math.random() - 0.5) * -80,
            10,
            (Math.random() - 0.5) * 100
          ),
        },
      ]);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-screen w-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-purple-500 overflow-hidden">
      {start && !gameOver && (
        <>
          <div className="text-white text-3xl font-bold">Score: {score}</div>
          <div className="text-white text-3xl font-bold">
            HighScore: {highScore}
          </div>
        </>
      )}
      <Canvas
        camera={{ position: [0, 10, 10], fov: 50 }}
        onPointerDown={(e) => (e.target as HTMLElement).requestPointerLock()}
      >
        <ambientLight intensity={Math.PI / 2} />

        <Physics>
          {start && (
            <KeyboardControls map={keyboardMap}>
              <Ecctrl
                capsuleHalfHeight={0.3}
                mode="CameraBasedMovement"
                maxVelLimit={20}
                onCollisionEnter={handleCollision}
                disableControl={gameOver}
              >
                <Car />
              </Ecctrl>
            </KeyboardControls>
          )}

          {start &&
            shapes.map((shape) => (
              <FallingShape key={shape.id} position={shape.position} />
            ))}
          <Floor />
        </Physics>
        <OrbitControls />
      </Canvas>
      {!start && (
        <div className="absolute inset-0 bg-black text-white flex flex-col gap-y-10 items-center justify-center">
          <h1 className="text-4xl font-bold">Threejs Racing</h1>
          <Button size={"lg"} onClick={() => setStart(true)}>
            Start
          </Button>
        </div>
      )}

      {gameOver && (
        <div className="absolute inset-0 bg-black bg-opacity-80 text-white flex flex-col gap-y-2 items-center justify-center ">
          <h1 className="text-4xl font-bold"> Game Over</h1>
          <p>Score: {score}</p>
          <Button onClick={() => window.location.reload()}>Play Again</Button>
        </div>
      )}
    </div>
  );
}
