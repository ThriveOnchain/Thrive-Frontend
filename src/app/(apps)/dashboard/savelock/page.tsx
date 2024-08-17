"use client";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { CreateSafeLockDialogue } from "@/ui/savelock/transaction-modal";
import { SafeLockAnalyticsTabs } from "../../../../ui/savelock/tabs";

export default function Dashboard() {
  const router = useRouter();

  return (
    <main className="flex flex-col items-center justify-between px-4  max-w-4xl mx-auto gap-4 ">
      <div className="w-full border p-8 rounded-md bg-muted gap-5 justify-between">
        <div className="flex items-center justify-between ">
          <Badge className="bg-orange-500">+ Quick save</Badge>
          <Badge>Up to 3% APR</Badge>
        </div>

        <div>
          <p className="text-xs"> Total Savings</p>
          <p className="text-lg font-bold">$**</p>
        </div>

        <CreateSafeLockDialogue />
      </div>

      <div className="bg-primary/20 rounded-md p-5 text-primary">
        <h1 className="font-bold"> What is Safelock</h1>
        <p className="font-thin">
          SafeLock is a cash lock that helps you prevent temptation and earn
          micro rewards on your cash base on protocol supply to aave.
        </p>
      </div>

      <SafeLockAnalyticsTabs />
    </main>
  );
}
