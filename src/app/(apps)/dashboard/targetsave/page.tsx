"use client";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { CreateSafeLockDialogue } from "@/ui/savelock/transaction-modal";
import { SafeLockAnalyticsTabs } from "../../../../ui/savelock/tabs";
import { useAccount, useReadContract } from "wagmi";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { THRIVE_BASE_SEPOLIA } from "@/lib/config/contract";
import thrive_base from "@/lib/config/abi/thrive.json";
import { useThriveWriteContract } from "@/hooks/useThriveWriteContract";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatEther } from "viem";

export default function Dashboard() {
  const router = useRouter();
  const { isConnected, address } = useAccount();

  const { toast } = useToast();

  const { data: accumulatedRewards, isLoading } = useReadContract({
    address: THRIVE_BASE_SEPOLIA,
    abi: thrive_base,
    functionName: "getUserAccumulatedRewards",
    args: [address],
  });

  const {
    write: claimRewards,
    isPending,
    isConfirming,
  } = useThriveWriteContract({
    fn: "claimRewards",
    trxTitle: "Claiming accumulated rewards",
    args: [],
    abi: thrive_base,
    contractAddress: THRIVE_BASE_SEPOLIA,
  });

  const handleClaimRewards = () => {
    claimRewards();
  };
  return (
    <main className="flex flex-col items-center justify-between px-4  max-w-4xl mx-auto gap-4 ">


      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-bold">
            Safe Locks Dashboard
          </CardTitle>
          <Badge className="bg-orange-500">Up to 3% APR</Badge>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Total Savings</p>
              <p className="text-2xl font-bold">$**</p>
            </div>
            {isConnected ? (
              <CreateSafeLockDialogue />
            ) : (
              <Button
                onClick={() => {
                  toast({
                    title: "Wallet not Connected",
                    variant: "destructive",
                    description:
                      "Kindly connect wallet, Sign in with socials is recommended",
                  });
                }}
              >
                Create a safe lock
              </Button>
            )}
          </div>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Accumulated Rewards</p>
            <p className="text-2xl font-bold">
              {accumulatedRewards
                ? (Number(accumulatedRewards) / 1e6).toFixed(2)
                : "0"}{" "}
              USDC
            </p>
            <Button
              onClick={handleClaimRewards}
              disabled={!accumulatedRewards || isPending || isConfirming}
              className="w-full mt-2"
            >
              {isPending
                ? "Confirming in wallet..."
                : isConfirming
                ? "Claiming..."
                : "Claim Rewards"}
            </Button>
          </div>
        </CardContent>
      </Card>

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
