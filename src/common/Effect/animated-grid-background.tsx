"use client";

import { useEffect, useRef } from "react";

interface LightWave {
  x: number;
  y: number;
  direction: "horizontal" | "vertical";
  speed: number;
  intensity: number;
  width: number;
  reverse: boolean;
  startTime: number;
}

interface AnimatedGridBackgroundProps {
  gridSize?: number;
  gridOpacity?: number;
  waveFrequency?: number;
  waveIntensity?: number;
  waveSpeed?: number;
  className?: string;
}

export default function AnimatedGridBackground({ gridSize = 80, gridOpacity = 0.15, waveFrequency = 3000, waveIntensity = 0.25, waveSpeed = 1.5, className = "" }: AnimatedGridBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    let lightWaves: LightWave[] = [];
    let lastWaveTime = 0;

    const createLightWave = (currentTime: number) => {
      const direction = Math.random() > 0.5 ? "horizontal" : "vertical";
      const reverse = Math.random() > 0.5;

      const wave: LightWave = {
        x: direction === "horizontal" ? (reverse ? canvas.width : -100) : Math.random() * canvas.width,
        y: direction === "vertical" ? (reverse ? canvas.height : -100) : Math.random() * canvas.height,
        direction,
        speed: waveSpeed * (0.9 + Math.random() * 0.6),
        intensity: waveIntensity * (0.8 + Math.random() * 0.4),
        width: 50 + Math.random() * 100,
        reverse,
        startTime: currentTime,
      };

      return wave;
    };

    const drawGrid = (currentTime: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (currentTime - lastWaveTime > waveFrequency + Math.random() * waveFrequency) {
        lightWaves.push(createLightWave(currentTime));
        lastWaveTime = currentTime;
      }

      lightWaves = lightWaves.filter((wave) => {
        if (wave.direction === "horizontal") {
          wave.x += wave.reverse ? -wave.speed : wave.speed;
          return wave.reverse ? wave.x > -200 : wave.x < canvas.width + 200;
        } else {
          wave.y += wave.reverse ? -wave.speed : wave.speed;
          return wave.reverse ? wave.y > -200 : wave.y < canvas.height + 200;
        }
      });

      // Vertical lines
      for (let x = 0; x <= canvas.width; x += gridSize) {
        let lineIntensity = gridOpacity;

        lightWaves.forEach((wave) => {
          if (wave.direction === "horizontal") {
            const distance = Math.abs(x - wave.x);
            if (distance < wave.width) {
              const effect = (1 - distance / wave.width) * wave.intensity;
              lineIntensity = Math.max(lineIntensity, effect);
            }
          }
        });

        ctx.beginPath();
        ctx.strokeStyle = `rgba(50, 50, 50, ${lineIntensity})`;
        ctx.lineWidth = lineIntensity > gridOpacity * 2 ? 1 : 0.5;
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      // Horizontal lines
      for (let y = 0; y <= canvas.height; y += gridSize) {
        let lineIntensity = gridOpacity;

        lightWaves.forEach((wave) => {
          if (wave.direction === "vertical") {
            const distance = Math.abs(y - wave.y);
            if (distance < wave.width) {
              const effect = (1 - distance / wave.width) * wave.intensity;
              lineIntensity = Math.max(lineIntensity, effect);
            }
          }
        });

        ctx.beginPath();
        ctx.strokeStyle = `rgba(50, 50, 50, ${lineIntensity})`;
        ctx.lineWidth = lineIntensity > gridOpacity * 2 ? 1 : 0.5;
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Intersection points without glow
      for (let x = 0; x <= canvas.width; x += gridSize) {
        for (let y = 0; y <= canvas.height; y += gridSize) {
          let pointIntensity = gridOpacity * 0.7;

          lightWaves.forEach((wave) => {
            let distance = 0;
            if (wave.direction === "horizontal") {
              distance = Math.abs(x - wave.x);
            } else {
              distance = Math.abs(y - wave.y);
            }

            if (distance < wave.width) {
              const effect = (1 - distance / wave.width) * wave.intensity;
              pointIntensity = Math.max(pointIntensity, effect);
            }
          });

          ctx.beginPath();
          ctx.fillStyle = `rgba(80, 80, 80, ${pointIntensity})`;
          const pointSize = pointIntensity > gridOpacity * 2 ? 2 : 1;
          ctx.arc(x, y, pointSize, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Light waves
      //   lightWaves.forEach((wave) => {
      //     const gradient =
      //       wave.direction === "horizontal"
      //         ? ctx.createLinearGradient(wave.x - wave.width, 0, wave.x + wave.width, 0)
      //         : ctx.createLinearGradient(0, wave.y - wave.width, 0, wave.y + wave.width);

      //     gradient.addColorStop(0, "rgba(50, 70, 120, 0)");
      //     gradient.addColorStop(0.5, `rgba(50, 70, 120, ${wave.intensity * 0.15})`);
      //     gradient.addColorStop(1, "rgba(50, 70, 120, 0)");

      //     ctx.fillStyle = gradient;

      //     if (wave.direction === "horizontal") {
      //       ctx.fillRect(wave.x - wave.width, 0, wave.width * 2, canvas.height);
      //     } else {
      //       ctx.fillRect(0, wave.y - wave.width, canvas.width, wave.width * 2);
      //     }
      //   });

      requestAnimationFrame(() => drawGrid(performance.now()));
    };

    drawGrid(performance.now());

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [gridSize, gridOpacity, waveFrequency, waveIntensity, waveSpeed]);

  return <canvas ref={canvasRef} className={`fixed -z-10 inset-0 w-full h-full bg-black ${className}`} aria-hidden="true" />;
}
