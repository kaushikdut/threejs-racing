"use client";
import { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { CollisionEnterPayload, Physics } from "@react-three/rapier";
import { Floor } from "./_components/floor";
import { KeyboardControls } from "@react-three/drei";
import Car from "./_components/car";
import { FallingShape } from "./_components/fallingObjects";
import { Vector3 } from "three";
import { Button } from "@/components/ui/button";
import Ecctrl from "ecctrl";
import { getScores, saveScore } from "@/lib/supabase";
import { Slider } from "@/components/ui/slider";
import { Pause, Play } from "lucide-react";

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
  const [paused, setPaused] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [camZoom, setCamZoom] = useState(5);

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

  // Manage game score
  useEffect(() => {
    if (start && !gameOver && !paused) {
      const scoreInterval = setInterval(() => {
        setScore((prevScore) => prevScore + 1);
      }, 1000);

      return () => clearInterval(scoreInterval);
    }
  }, [start, gameOver, paused]);

  // Generate falling objects
  useEffect(() => {
    if (start && !paused) {
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
        ]);
      }, 500);

      return () => clearInterval(interval);
    }
  }, [start, paused]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && start && !gameOver) {
        setPaused((prevPaused) => !prevPaused);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [start, gameOver]);

  // Toggle pause
  const togglePause = () => {
    setPaused((prevPaused) => !prevPaused);
  };

  const handleZoomChange = (e: number[]) => {
    setCamZoom(e[0]);
  };
  return (
    <div className="h-screen w-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-purple-500 overflow-hidden">
      <Canvas
        camera={{ position: [0, 10, 10], fov: 50 }}
        onPointerDown={(e) => (e.target as HTMLElement).requestPointerLock()}
      >
        <ambientLight intensity={Math.PI / 2} />

        <Physics>
          {start && !paused && (
            <KeyboardControls map={keyboardMap}>
              <Ecctrl
                capsuleHalfHeight={0.3}
                mode="CameraBasedMovement"
                maxVelLimit={20}
                onCollisionEnter={handleCollision}
                disableControl={gameOver}
                camInitDis={camZoom * -1}
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
      </Canvas>

      {!start && (
        <div className="absolute inset-0 bg-black text-white flex flex-col gap-y-10 items-center justify-center">
          <h1 className="text-4xl font-bold">Threejs Racing</h1>
          <Button size={"lg"} onClick={() => setStart(true)}>
            Start
          </Button>
        </div>
      )}

      {start && !gameOver && (
        <div className="w-full h-fit absolute inset-0 flex gap-y-2 p-3 ">
          <div className="w-full flex flex-col gap-y-2">
            <div className="text-white text-3xl font-bold w-fit">
              Score: {score}
            </div>
            <div className="text-white text-3xl font-bold w-fit">
              HighScore: {highScore}
            </div>
          </div>
          <Button onClick={togglePause} variant="ghost" className="mt-5">
            {!paused && <Pause className="w-10 h-10" />}
          </Button>
        </div>
      )}

      {paused && (
        <div className="absolute inset-0 bg-black bg-opacity-80 text-white flex flex-col gap-y-4 items-center justify-center ">
          <h1 className="text-4xl font-bold">Game Paused</h1>
          <Button onClick={togglePause} variant={"ghost"}>
            <Play className="w-10 h-10 " />
          </Button>
          <div className="bg-neutral-300 flex p-4 rounded-xl">
            <div className="w-[460px] flex items-center justify-center gap-x-4">
              <p className="text-lg text-gray-600 whitespace-nowrap">
                Camera Zoom
              </p>
              <Slider
                defaultValue={[camZoom]}
                min={2}
                max={12}
                step={1}
                onValueChange={handleZoomChange}
              />
            </div>
          </div>
        </div>
      )}

      {gameOver && (
        <div className="absolute inset-0 bg-black bg-opacity-80 text-white flex flex-col gap-y-2 items-center justify-center ">
          <h1 className="text-4xl font-bold">Game Over</h1>
          <p>Score: {score}</p>
          <Button onClick={() => window.location.reload()}>Play Again</Button>
        </div>
      )}
    </div>
  );
}
