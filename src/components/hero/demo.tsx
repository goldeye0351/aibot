"use client";
// this is a client component
import { useEffect } from "react";
import { renderCanvas } from "./canvas";


export function Hero() {
  useEffect(() => {
    renderCanvas();
  }, []);

  return (
    <canvas
      className="bg-skin-base border-ring pointer-events-none absolute inset-0 mx-auto"
      id="canvas"
    ></canvas>
  );
}
