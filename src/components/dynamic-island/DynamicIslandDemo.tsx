"use client";

import { useState, type ReactNode } from "react";
import DynamicIsland, { type DynamicIslandState, DynamicIslandVariant } from "./DynamicIsland";
import { motion } from "framer-motion";

// Icons for different modules
const ModuleIcons = {
  KillAura: (className = "") => (
    <div className={`flex items-center justify-center w-6 h-6 rounded-full bg-red-500/20 ${className}`}>
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500">
        <circle cx="12" cy="12" r="10" />
        <path d="m15 9-6 6" />
        <path d="m9 9 6 6" />
      </svg>
    </div>
  ),
  Speed: (className = "") => (
    <div className={`flex items-center justify-center w-6 h-6 rounded-full bg-blue-500/20 ${className}`}>
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
        <path d="m4.9 15 .7.7" />
        <path d="m9 4.4.7.7" />
        <path d="m14.5 5 .7.7" />
        <path d="m19.1 9.5.7.7" />
        <path d="m3.5 10 .7.7" />
        <path d="m8 19.5.7.7" />
      </svg>
    </div>
  ),
  Scaffold: (className = "") => (
    <div className={`flex items-center justify-center w-6 h-6 rounded-full bg-gray-500/20 ${className}`}>
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300">
        <rect width="18" height="18" x="3" y="3" rx="2" />
        <path d="M3 9h18" />
        <path d="M9 21V9" />
      </svg>
    </div>
  ),
  Client: (className = "") => (
    <div className={`flex items-center justify-center w-6 h-6 rounded-full bg-purple-500/20 ${className}`}>
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-400">
        <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
        <path d="M3 15v4a2 2 0 0 0 2 2h16v-5" />
        <path d="M12 15v6" />
      </svg>
    </div>
  ),
};

type ModuleType = "KillAura" | "Speed" | "Scaffold" | "Client";

interface ModuleState {
  name: ModuleType;
  enabled: boolean;
  Icon: (className?: string) => ReactNode;
}

export function DynamicIslandDemo() {
  const [currentState, setCurrentState] = useState<DynamicIslandState>("idle");
  const [moduleStates, setModuleStates] = useState<ModuleState[]>([
    { name: "KillAura", enabled: false, Icon: ModuleIcons.KillAura },
    { name: "Speed", enabled: false, Icon: ModuleIcons.Speed },
    { name: "Scaffold", enabled: false, Icon: ModuleIcons.Scaffold },
  ]);
  const [activeModule, setActiveModule] = useState<ModuleState | null>(null);
  const [clientInfo, setClientInfo] = useState({
    name: "Bloom | Lowng",
    fps: "405fps",
    ping: "116ms"
  });

  const handleModuleToggle = (module: ModuleState) => {
    // Update state
    const newStates = moduleStates.map(m =>
      m.name === module.name
        ? { ...m, enabled: !m.enabled }
        : m
    );
    setModuleStates(newStates);

    // Set active module for notification
    const updatedModule = newStates.find(m => m.name === module.name);
    if (updatedModule) {
      setActiveModule(updatedModule);

      // Show appropriate notification
      setCurrentState(updatedModule.enabled ? "enabled" : "disabled");

      // Return to idle after notification
      setTimeout(() => {
        setCurrentState("idle");
        setActiveModule(null);
      }, 3000);
    }
  };

  const showClientInfo = () => {
    setCurrentState("info");
    setTimeout(() => {
      setCurrentState("idle");
    }, 3000);
  };

  return (
    <div className="flex flex-col items-center gap-10 w-full">
      {/* Dynamic Island Display */}
      <div className="relative">
        {currentState === "idle" ? (
          // @ts-ignore
          <DynamicIsland
            state="idle"
            icon={<ModuleIcons.Client />}
            onComplete={() => setCurrentState("idle")}
          />
        ) : currentState === "info" ? (
          // @ts-ignore
          <DynamicIsland
            state="info"
            variant="info"
            icon={<ModuleIcons.Client />}
            title={clientInfo.name}
            subtitle={`${clientInfo.fps} | ${clientInfo.ping}`}
            onComplete={() => setCurrentState("idle")}
          />
        ) : activeModule && (
          // @ts-ignore
          <DynamicIsland
            state={currentState}
            variant={activeModule.enabled ? "success" : "danger"}
            icon={<activeModule.Icon />}
            title="Module Toggled"
            subtitle={`${activeModule.name} has been ${activeModule.enabled ? 'Enabled' : 'Disabled'}!`}
            onComplete={() => setCurrentState("idle")}
          />
        )}
      </div>

      {/* Demo Controls */}
      <div className="grid grid-cols-3 gap-4 w-full max-w-md">
        {moduleStates.map((module) => (
          <button
            key={module.name}
            onClick={() => handleModuleToggle(module)}
            className={`p-4 rounded-lg flex flex-col items-center gap-2 transition-colors minecraft-font ${
              module.enabled
                ? "bg-zinc-800 border border-green-500/30 text-green-400"
                : "bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-white"
            }`}
          >
            {/* @ts-ignore */}
            <module.Icon className={module.enabled ? "bg-green-500/30" : ""} />
            <span className="text-sm font-medium">{module.name}</span>
          </button>
        ))}
        <button
          onClick={showClientInfo}
          className="p-4 rounded-lg flex flex-col items-center gap-2 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 col-span-3 minecraft-font text-white"
        >
          {/* @ts-ignore */}
          <ModuleIcons.Client />
          <span className="text-sm font-medium">Show Client Info</span>
        </button>
      </div>
    </div>
  );
}
