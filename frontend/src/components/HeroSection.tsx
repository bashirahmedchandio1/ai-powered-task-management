"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";

const words = ["ORGANIZE", "PRIORITIZE", "ACCOMPLISH"];

export function HeroSection() {
  const [currentWord, setCurrentWord] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentWord((prev) => (prev + 1) % words.length);
        setIsFlipping(false);
      }, 300);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden pt-16">
      {/* Background grid */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />

      {/* Gradient orbs */}
      <div className="pointer-events-none absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-accent/5 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-4 py-2 text-sm">
          <span className="h-2 w-2 animate-pulse rounded-full bg-accent" />
          <span className="text-muted-foreground">
            Now with AI-powered task suggestions
          </span>
        </div>

        <h1 className="mb-4 text-5xl font-bold tracking-tight sm:text-7xl lg:text-8xl">
          <span className="block text-muted-foreground">TASKS THAT</span>
          <span
            className={`relative inline-block min-w-[300px] transition-all duration-300 ${
              isFlipping
                ? "opacity-0 translate-y-4"
                : "opacity-100 translate-y-0"
            }`}
          >
            <span className="bg-gradient-to-r from-foreground via-accent to-foreground bg-clip-text text-transparent">
              {words[currentWord]}
            </span>
          </span>
        </h1>

        <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground sm:text-xl">
          A minimalist task management experience designed for focus. No
          clutter. No distractions. Just pure productivity.
        </p>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button
            size="lg"
            className="group h-14 gap-2 bg-accent px-8 text-accent-foreground hover:bg-accent/90 animate-pulse-glow"
          >
            Start for Free
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="h-14 gap-2 px-8 border-border bg-transparent"
          >
            <Play className="h-4 w-4" />
            Watch Demo
          </Button>
        </div>

        <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-foreground">50K+</span>
            <span>Active Users</span>
          </div>
          <div className="h-6 w-px bg-border" />
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-foreground">4.9</span>
            <span>App Store Rating</span>
          </div>
          <div className="h-6 w-px bg-border" />
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-foreground">10M+</span>
            <span>Tasks Completed</span>
          </div>
        </div>
      </div>
    </section>
  );
}
