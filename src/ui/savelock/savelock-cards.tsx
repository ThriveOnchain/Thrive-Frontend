import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ThriveEvmConnectButton } from "@/components/wagmi/connect-button";
import { useAccount, useReadContracts } from "wagmi";
import thrive_base from "../../lib/config/abi/thrive.json";
import { THRIVE_BASE_SEPOLIA } from "@/lib/config/contract";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useThriveWriteContract } from "@/hooks/useThriveWriteContract";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { USDC_META } from "@/lib/config/tokens";

export interface SaveLock {
  id: bigint;
  owner: string;
  amount: bigint;
  withdrawnAmount: bigint;
  title: string;
  lockDuration: bigint;
  startTime: bigint;
  lockToken: string;
  withdrawn: boolean;
  accumulatedRewards: bigint;
}

export function SaveLockCard({
  id,
  saveLock,
  onWithdraw,
}: {
  id: bigint;
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

  const getProgressColor = () => {
    if (progress < 60) return "bg-gray-300";
    if (progress < 100) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getButtonStyle = () => {
    if (!canWithdraw) return "bg-gray-400 cursor-not-allowed";
    if (isCompleted) return "bg-green-500 hover:bg-green-600 hover:text-white";
    return "bg-yellow-500 hover:bg-yellow-600";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{saveLock.title}</CardTitle>
      </CardHeader>
      <CardContent className="text-muted-foreground text-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold">
            <p>Amount: {(Number(saveLock.amount) / 1e6).toFixed(2)} USDC</p>
            <Avatar className="w-4 h-4">
              <AvatarImage src={USDC_META.logoURI} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold">
            <p>
              Rewards accumulated:{" "}
              {(Number(saveLock.accumulatedRewards) / 1e6).toFixed(2)} USDC
            </p>
            <Avatar className="w-4 h-4">
              <AvatarImage src={USDC_META.logoURI} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>
        </div>
        <div className="mt-2">
          <p className="text-xs mb-0.5 text-muted-foreground font-semibold w-full text-right">
            Progress: {progress.toFixed(2)}%
          </p>
          <Progress value={progress} className="w-full h-2.5" />
        </div>
        <Button
          onClick={handleWithdraw}
          disabled={!canWithdraw || isPending}
          variant="ghost"
          className={`mt-4 w-full text-white ${getButtonStyle()}`}
        >
          {isPending
            ? "Processing..."
            : saveLock.withdrawn
            ? "Withdrawn"
            : isCompleted
            ? "Withdraw (with rewards)"
            : "Early Withdraw (with fee)"}
        </Button>
      </CardContent>
    </Card>
  );
}
