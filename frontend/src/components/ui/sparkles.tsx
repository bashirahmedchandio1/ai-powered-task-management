"use client";
import React, { useId, useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { cn } from "@/lib/utils";

export const SparklesCore = (props: {
  id?: string;
  className?: string;
  background?: string;
  minSize?: number;
  maxSize?: number;
  particleDensity?: number;
  particleColor?: string;
  particleSpeed?: number;
  speed?: number;
}) => {
  const {
    id,
    className,
    background,
    minSize,
    maxSize,
    particleDensity,
    particleColor,
    particleSpeed,
    speed,
  } = props;
  const [particles, setParticles] = useState<Array<any>>([]);
  const controls = useAnimation();

  const generatedId = useId();

  useEffect(() => {
    const generateParticles = () => {
      const count = particleDensity || 100;
      const newParticles = [];
      for (let i = 0; i < count; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size:
            Math.random() * ((maxSize || 3) - (minSize || 1)) + (minSize || 1),
          opacity: Math.random(),
          duration: Math.random() * (speed || 5) + 2,
        });
      }
      setParticles(newParticles);
    };

    generateParticles();
  }, [maxSize, minSize, particleDensity, speed]);

  return (
    <div
      id={id || generatedId}
      className={cn("h-full w-full", className)}
      style={{
        background: background || "transparent",
      }}
    >
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            backgroundColor: particleColor || "#FFF",
          }}
          animate={{
            opacity: [0, particle.opacity, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};
