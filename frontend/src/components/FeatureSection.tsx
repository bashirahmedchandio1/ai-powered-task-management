"use client";

import { useRef, useEffect, useState } from "react";
import { Zap, Layers, Shield, Sparkles, Clock, Users } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description:
      "Create and organize tasks in milliseconds. Our optimized engine never slows you down.",
  },
  {
    icon: Layers,
    title: "Smart Projects",
    description:
      "Organize tasks into projects with smart folders, tags, and automatic categorization.",
  },
  {
    icon: Shield,
    title: "Privacy First",
    description:
      "End-to-end encryption ensures your tasks and data remain completely private.",
  },
  {
    icon: Sparkles,
    title: "AI Assistant",
    description:
      "Get intelligent task suggestions, time estimates, and priority recommendations.",
  },
  {
    icon: Clock,
    title: "Time Tracking",
    description:
      "Built-in time tracking helps you understand where your productivity goes.",
  },
  {
    icon: Users,
    title: "Team Sync",
    description:
      "Collaborate seamlessly with real-time sync and shared workspaces.",
  },
];

export function FeaturesSection() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    };

    const section = sectionRef.current;
    section?.addEventListener("mousemove", handleMouseMove);
    return () => section?.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section id="features" ref={sectionRef} className="relative py-32">
      {/* Custom cursor glow effect */}
      <div
        className="pointer-events-none absolute h-64 w-64 rounded-full bg-accent/20 blur-3xl transition-all duration-300 ease-out"
        style={{
          left: mousePosition.x - 128,
          top: mousePosition.y - 128,
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
            Built for the way you work
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Every feature designed to remove friction and help you achieve more
            with less effort.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group relative rounded-2xl border border-border bg-card p-8 transition-all duration-300 hover:border-accent/50 hover:bg-card/80"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
