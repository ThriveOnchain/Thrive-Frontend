"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Features() {
  const router = useRouter();
  return (
    <section className="flex flex-col items-center justify-between px-4 gap-8 py-14">
      <div className="flex flex-col items-center">
        <p className="text-xs">Key Features</p>
        <h1 className="font-bold text-lg">Four ways to save on thrive</h1>
        <p className="text-sm">
          Earn 4%-10% APR when you save with any of these Thrive.
        </p>
      </div>

      <div className="flex flex-col items-center gap-4 lg:grid lg:grid-cols-2">
        {features.map((feature, i) => {
          return (
            <Card key={i}>
              <CardHeader>
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.desc}</CardDescription>
              </CardHeader>
              <CardContent></CardContent>
              <CardFooter>
                <Badge>{feature.thicker}</Badge>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </section>
  );
}

type Feature = {
  title: string;
  thicker: string;
  desc: string;
  url: string;
};
const features: Feature[] = [
  {
    title: "Automated savings",
    thicker: "Thrive Bank",
    desc: "Smart algorithm saves for you. Grow wealth effortlessly.",
    url: "/dashboard/thriveBank",
  },
  {
    title: "Fixed Savings",
    thicker: "Safe Lock",
    desc: "Lock in high rates. Multiply your money securely.",
    url: "/dashboard/safeLock",
  },
  {
    title: "Goal Oriented Saving",
    thicker: "Target Saving",
    desc: "Set goals, track progress. Your dreams, realized.",
    url: "/dashboard/targetsaving",
  },
];
