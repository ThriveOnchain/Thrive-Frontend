"use client";

import Heros from "./components/heros";
import Features from "./components/features";
import Integrations from "./components/integrations";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center  gap-12">
      <Heros />
      <Features />
      <Integrations />
    </div>
  );
}
