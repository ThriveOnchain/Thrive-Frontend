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

      <div className="lg:grid lg:grid-cols-2 flex flex-col items-center w-full gap-6">
        {savingPlans.map((item) => {
          return (
            <div
              key={item.name}
              className="w-full border flex gap-4 flex-col p-4 rounded-md cursor-pointer"
            >
              <div
                className="w-full flex justify-end items-end"
                onClick={() => router.push(`/${item.link.toLowerCase()}`)}
              >
                <span className="bg-primary text-xs text-white p-1 rounded">
                  {item.linkTitle}
                </span>
              </div>
              <div className="text-sm">
                <p className="font-semibold">{item.name}</p>
                <p>{item.desc}</p>
              </div>
            </div>
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
