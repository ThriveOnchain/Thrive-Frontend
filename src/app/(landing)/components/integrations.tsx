"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";

export default function Integrations() {
  return (
    <section className="flex flex-col items-center justify-between px-4 gap-6">
      <div className="flex items-center justify-center flex-col">
        <p className="text-xs">integrations and partnerships</p>
        <h1 className="text-lg font-bold">
          Our ecosystem is powered by the best of the best
        </h1>
      </div>
      <div className="flex items-center gap-4 justify-center">
        {integrations.map((tech, i) => {
          return <Badge key={i}>{tech}</Badge>;
        })}
      </div>
    </section>
  );
}

const integrations = ["Aave", "Biconomy", "Base", "Polygon"];
