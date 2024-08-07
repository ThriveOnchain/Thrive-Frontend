"use client";

import Heros from "../../ui/home/heros";
import Features from "../../ui/home/features";
import Integrations from "../../ui/home/integrations";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center  gap-12">
      <Heros />
      <Features />
      <Integrations />
    </div>
  );
}
