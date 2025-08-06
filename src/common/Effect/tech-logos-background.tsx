"use client";

import { useEffect, useState } from "react";
import { Code2, Database, Cloud, Cpu, Globe, Smartphone, Server, GitBranch, Layers, Zap, Box, Terminal } from "lucide-react";

// Tech logos with much darker (lower opacity) colors for a more subdued background effect.
const techLogos = [
  { name: "React", component: Code2, color: "text-blue-400/10", size: "w-8 h-8", delay: "0s" },
  { name: "Next.js", component: Layers, color: "text-white/10", size: "w-7 h-7", delay: "0.5s" },
  { name: "TypeScript", component: Code2, color: "text-blue-500/10", size: "w-8 h-8", delay: "1s" },
  { name: "JavaScript", component: Zap, color: "text-yellow-400/10", size: "w-7 h-7", delay: "1.5s" },
  { name: "Angular", component: Code2, color: "text-red-500/10", size: "w-8 h-8", delay: "3.5s" },
  { name: "Docker", component: Box, color: "text-blue-400/10", size: "w-8 h-8", delay: "4s" },
  { name: "Git", component: GitBranch, color: "text-orange-500/10", size: "w-7 h-7", delay: "4.5s" },
  { name: "AWS", component: Cloud, color: "text-orange-400/10", size: "w-8 h-8", delay: "5s" },
  { name: "PostgreSQL", component: Database, color: "text-blue-600/10", size: "w-8 h-8", delay: "6s" },
  { name: "Redis", component: Database, color: "text-red-500/10", size: "w-7 h-7", delay: "6.5s" },
  { name: "GraphQL", component: Globe, color: "text-pink-400/10", size: "w-8 h-8", delay: "7s" },
  { name: "Kubernetes", component: Cpu, color: "text-blue-500/10", size: "w-8 h-8", delay: "7.5s" },
  { name: "Rust", component: Code2, color: "text-orange-600/10", size: "w-8 h-8", delay: "8s" },
  { name: "Go", component: Code2, color: "text-cyan-400/10", size: "w-7 h-7", delay: "8.5s" },
  { name: "Java", component: Code2, color: "text-red-600/10", size: "w-8 h-8", delay: "9s" },
  { name: "C++", component: Terminal, color: "text-purple-400/10", size: "w-7 h-7", delay: "9.5s" },
  { name: "Flutter", component: Smartphone, color: "text-blue-400/10", size: "w-7 h-7", delay: "10s" },
  { name: "Swift", component: Smartphone, color: "text-orange-500/10", size: "w-7 h-7", delay: "10.5s" },
  { name: "Kotlin", component: Smartphone, color: "text-purple-500/10", size: "w-7 h-7", delay: "11s" },
  { name: "Firebase", component: Zap, color: "text-yellow-500/10", size: "w-7 h-7", delay: "11.5s" },
];

export default function TechLogosBackground() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="fixed top-0 left-0 w-full h-full">
      <div className="relative  min-h-screen overflow-hidden">
        {/* Animated background particles */}
        <div className="absolute inset-0">
          {[...Array(60)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-blue-400/40 rounded-full opacity-20 animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
              }}
            />
          ))}
        </div>

        {/* Tech logos */}
        <div className="absolute inset-0">
          {techLogos.map((logo, index) => {
            const IconComponent = logo.component;
            return (
              <div
                key={logo.name}
                className={`absolute ${logo.size} flex items-center justify-center rounded-lg border border-white/5 hover:scale-125 hover:border-white/10 transition-all duration-300 cursor-pointer group`}
                style={{
                  left: `${5 + ((index * 13) % 85)}%`,
                  top: `${10 + ((index * 19) % 75)}%`,
                  animation: `float 8s ease-in-out infinite, rotate 15s linear infinite`,
                  animationDelay: logo.delay,
                }}
                title={logo.name}
              >
                <IconComponent className={`${logo.color} group-hover:scale-110 transition-transform duration-300`} />
              </div>
            );
          })}
        </div>

        {/* Additional floating geometric shapes */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={`shape-${i}`}
              className={`absolute ${i % 3 === 0 ? "w-6 h-6 rounded-full" : i % 3 === 1 ? "w-4 h-4 rotate-45" : "w-5 h-5 rounded-sm"} border border-cyan-400/30`}
              style={{
                left: `${Math.random() * 90}%`,
                top: `${Math.random() * 90}%`,
                animation: `pulse 6s ease-in-out infinite, float 10s ease-in-out infinite`,
                animationDelay: `${Math.random() * 6}s`,
              }}
            />
          ))}
        </div>

        {/* Custom CSS animations */}
        <style jsx>{`
          @keyframes float {
            0%,
            100% {
              transform: translateY(0px);
            }
            25% {
              transform: translateY(-15px);
            }
            50% {
              transform: translateY(-8px);
            }
            75% {
              transform: translateY(-12px);
            }
          }

          @keyframes rotate {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }

          @keyframes pulse {
            0%,
            100% {
              opacity: 0.2;
              transform: scale(1);
            }
            50% {
              opacity: 0.6;
              transform: scale(1.05);
            }
          }
        `}</style>
      </div>
    </div>
  );
}
