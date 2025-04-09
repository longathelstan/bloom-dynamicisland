"use client";

import { useState } from "react";
import DynamicIsland from "@/components/dynamic-island/DynamicIsland";
import { DynamicIslandDemo } from "@/components/dynamic-island/DynamicIslandDemo";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-[#1E1E1E]">
      <div className="flex flex-col items-center gap-8 w-full max-w-2xl">
        <h1 className="text-3xl minecraft-font text-white">Minecraft Dynamic Island</h1>
        <div className="w-full flex justify-center">
          <DynamicIslandDemo />
        </div>
        <div className="pt-8 text-center">
          <p className="minecraft-font text-zinc-400 mb-4">
            Click on a module to toggle notifications
          </p>
          <button className="minecraft-button">
            Minecraft Style Button
          </button>
        </div>
      </div>
    </main>
  );
}
