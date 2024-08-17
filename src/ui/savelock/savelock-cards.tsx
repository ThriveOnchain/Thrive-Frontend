import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ThriveEvmConnectButton } from "@/components/wagmi/connect-button";
import { useAccount, useReadContracts } from "wagmi";
import thrive_base from "../../lib/config/abi/thrive.json";
import { THRIVE_BASE_SEPOLIA } from "@/lib/config/contract";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useThriveWriteContract } from "@/hooks/useThriveWriteContract";

export interface SaveLock {
  owner: string;
  amount: bigint;
  title: string;
  lockDuration: bigint;
  startTime: bigint;
  lockToken: string;
}

export function SaveLockCard({
  id,
  saveLock,
  onWithdraw,
}: {
  id: number;
  saveLock: SaveLock;
  onWithdraw: () => void;
}) {
  const currentTime = Math.floor(Date.now() / 1000);
  const endTime = Number(saveLock.startTime) + Number(saveLock.lockDuration);
  const progress = Math.min(
    100,
    ((currentTime - Number(saveLock.startTime)) /
      Number(saveLock.lockDuration)) *
      100,
  );
  const canWithdraw = progress >= 60;
  const isCompleted = currentTime >= endTime;

  const { write, isPending } = useThriveWriteContract({
    fn: "withdrawLockedFunds",
    trxTitle: "Withdrawing Funds",
    abi: thrive_base,
    contractAddress: THRIVE_BASE_SEPOLIA,
    args: [id],
  });

  const handleWithdraw = async () => {
    await write();
    onWithdraw();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{saveLock.title}</CardTitle>
      </CardHeader>
      <CardContent className="text-muted-foreground text-sm">
        <p>Amount: {(Number(saveLock.amount) / 1e6).toFixed(2)} USDC</p>
        <p>Progress: {progress.toFixed(2)}%</p>
        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mt-2">
          <div
            className="bg-blue-600 h-2.5 rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <Button
          onClick={handleWithdraw}
          disabled={!canWithdraw || isPending}
          className={`mt-4 w-full ${
            !canWithdraw
              ? "opacity-50"
              : isCompleted
              ? "bg-green-700"
              : "bg-yellow-500"
          }`}
        >
          {isPending
            ? "Processing..."
            : isCompleted
            ? "Withdraw (with rewards)"
            : "Early Withdraw (with fee)"}
        </Button>
      </CardContent>
    </Card>
  );
}
