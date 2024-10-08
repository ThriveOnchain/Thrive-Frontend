"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Heros() {
  const router = useRouter();
  return (
    <main className="flex flex-col items-center justify-between p-4 gap-5 w-full py-14">
      <h1 className="text-2xl font-bold text-center">
        A Better way to Save and Invest Onchain
      </h1>
      <p className="lg:max-w-[60%] text-center mx-auto">
        Thrive is helping you achieve your financial goals by helping you save
        with ease while earning interest
      </p>
      <div className="flex items-center gap-2">
        <Button onClick={() => router.push("/dashboard")}>
          Start Saving Now
        </Button>
        <Button variant="outline">Learn More</Button>
      </div>
    </main>
  );
}
