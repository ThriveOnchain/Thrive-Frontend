"use client";
import { Badge } from "@/components/ui/badge";
import { BorderBeam } from "@/components/ui/border-beam";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
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

      <div className="lg:grid lg:grid-cols-2 flex flex-col items-center w-full gap-6">
        {savingPlans.map((item) => {
          return (
            <Link
              href={item.isCommingSoon ? "#" : `${item.link.toLowerCase()}`}
              key={item.name}
              className={`block transition-all duration-300 w-full ${
                item.isCommingSoon ? "opacity-70" : "hover:scale-105"
              }`}
            >
              <Card className="w-full h-full relative">
                {!item.isCommingSoon && (
                  <BorderBeam size={250} duration={8} delay={6} />
                )}
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <Badge className="bg-primary text-white">
                      {item.linkTitle}
                    </Badge>
                    {item.isCommingSoon && (
                      <Badge className="bg-amber-500">Coming Soon</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <CardTitle className="mb-3">{item.name}</CardTitle>
                  <CardDescription className="whitespace-normal">
                    {item.desc}
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </main>
  );
}

const savingPlans = [
  {
    name: " Thrive Bank",
    desc: "Automatically save daily, monthly or weekly",
    linkTitle: "SETUP",
    link: "/dashboard/thrivebank",
    isCommingSoon: true,
  },
  {
    name: "Save Lock",
    desc: "Lock funds to avoid temptations",
    linkTitle: "LOCKFUNDS",
    link: "/dashboard/savelock",
  },
  {
    name: "Target Savings",
    desc: "Smash your savings goals faster",
    linkTitle: "NEWGOAL",
    link: "/dashboard/targetsaving",
  },
];
