"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();
  return (
    <main className="flex flex-col items-center justify-between px-4  max-w-4xl mx-auto gap-4 ">
      <div className="w-full border p-8 rounded-md bg-muted gap-5 justify-between">
        <div className="flex items-center justify-between ">
          <Badge className="bg-orange-500">+ Quick save</Badge>
          <Badge>Up to 9% APR</Badge>
        </div>

        <div>
          <p className="text-xs"> Total Savings</p>
          <p className="text-lg font-bold">$**</p>
        </div>
      </div>

    
    </main>
  );
}


