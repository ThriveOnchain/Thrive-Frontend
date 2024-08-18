"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ThriveEvmConnectButton } from "@/components/wagmi/connect-button";
import { useAccount } from "wagmi";
import thrive_base from "../../lib/config/abi/thrive.json";
import { useReadContracts } from "wagmi";
import { THRIVE_BASE_SEPOLIA } from "@/lib/config/contract";
import { useEffect, useState } from "react";
import { Address } from "viem";
import { SaveLock, SaveLockCard } from "./savelock-cards";
import { Badge } from "@/components/ui/badge";
import { LoaderCircle, Lightbulb, RefreshCw } from "lucide-react";
import { motion, useAnimation } from "framer-motion";
import { Button } from "@/components/ui/button";
interface SortedLocks {
  ongoingLocks: SaveLock[];
  completedLocks: SaveLock[];
  withdrawnLocks: SaveLock[];
}

export function SafeLockAnalyticsTabs() {
  const controls = useAnimation();

  const { address } = useAccount();

  const [sortedLocks, setSortedLocks] = useState<SortedLocks>({
    ongoingLocks: [],
    completedLocks: [],
    withdrawnLocks: [],
  });

  const {
    data: userSaveLocks,
    isLoading,
    isError,
    refetch,
  } = useReadContracts({
    contracts: [
      {
        abi: thrive_base,
        address: THRIVE_BASE_SEPOLIA,
        functionName: "getUserActiveSaveLockIds",
        args: [address],
      },
      {
        abi: thrive_base,
        address: THRIVE_BASE_SEPOLIA,
        functionName: "getUserInActiveSaveLockIds",
        args: [address],
      },
    ],
  });

  const {
    data: saveLockDetails,
    isLoading: isLoadingDetails,
    refetch: refetchLockdetails,
  } = useReadContracts({
    //@ts-ignore
    contracts:
      userSaveLocks?.flatMap((result) =>
        result.result
          ? (result.result as number[]).map((id) => ({
              abi: thrive_base,
              address: THRIVE_BASE_SEPOLIA,
              functionName: "getSaveLockDetails",
              args: [BigInt(id)],
            }))
          : [],
      ) ?? [],
  });

  const lockSorter = (locks: SaveLock[]): SortedLocks => {
    const currentTime = Math.floor(Date.now() / 1000);
    return locks.reduce(
      (acc, lock) => {
        const endTime = Number(lock.startTime) + Number(lock.lockDuration);
        if (lock.withdrawn) {
          acc.withdrawnLocks.push(lock);
        } else if (currentTime >= endTime) {
          acc.completedLocks.push(lock);
        } else {
          acc.ongoingLocks.push(lock);
        }
        return acc;
      },
      {
        ongoingLocks: [],
        completedLocks: [],
        withdrawnLocks: [],
      } as SortedLocks,
    );
  };

  useEffect(() => {
    if (saveLockDetails) {
      const locks = saveLockDetails
        .filter((detail) => detail.status === "success")
        .map((detail) => detail.result as SaveLock);
      setSortedLocks(lockSorter(locks));
    }
  }, [saveLockDetails]);

  const handleWithdraw = () => {
    controls.start({
      rotate: 360,
      transition: { duration: 1, ease: "linear" },
    });
    refetch();
    console.log("fuuck");
    refetchLockdetails();
    controls.stop();
    console.log("fuuck....");
  };

  const renderSaveLocks = (
    locks: SaveLock[],
    type: "ongoing" | "completed" | "withdrawn",
  ) => {
    if (isLoading || isLoadingDetails) return <LoadingState />;
    if (locks.length === 0) return <NoLocksState type={type} />;

    return (
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full border-3 border-red-600"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {locks.map((saveLock, index) => (
          <SaveLockCard
            key={index}
            id={saveLock.id}
            saveLock={saveLock}
            onWithdraw={() => handleWithdraw()}
          />
        ))}
      </motion.div>
    );
  };

  return (
    <>
      <div className="flex justify-end items-center mt-7 w-full ">
        <Button
          onClick={handleWithdraw}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
          disabled={isLoading || isLoadingDetails}
        >
          <motion.div animate={controls}>
            <RefreshCw className="w-4 h-4" />
          </motion.div>
          Refresh
        </Button>
      </div>
      <Tabs defaultValue="ongoing" className="w-full">
        <TabsList className="w-full justify-between">
          <TabsTrigger className="flex-1 w-1/3" value="ongoing">
            Ongoing{" "}
            {sortedLocks.ongoingLocks.length > 0 ? (
              <Badge className="ml-2">{sortedLocks.ongoingLocks.length}</Badge>
            ) : (
              ""
            )}
          </TabsTrigger>
          <TabsTrigger className="flex-1 w-1/3" value="completed">
            Completed{" "}
            {sortedLocks.completedLocks.length > 0 ? (
              <Badge className="ml-2">
                {sortedLocks.completedLocks.length}
              </Badge>
            ) : (
              ""
            )}
          </TabsTrigger>
          <TabsTrigger className="flex-1 w-1/3" value="withdrawn">
            Withdrawn{" "}
            {sortedLocks.withdrawnLocks.length > 0 ? (
              <Badge className="ml-2">
                {sortedLocks.withdrawnLocks.length}
              </Badge>
            ) : (
              ""
            )}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="ongoing">
          <div className="w-full min-h-52 py-6">
            {address ? (
              renderSaveLocks(sortedLocks.ongoingLocks, "ongoing")
            ) : (
              <ThriveEvmConnectButton />
            )}
          </div>
        </TabsContent>
        <TabsContent value="completed">
          <div className="w-full min-h-52 py-6">
            {address ? (
              renderSaveLocks(sortedLocks.completedLocks, "completed")
            ) : (
              <ThriveEvmConnectButton />
            )}
          </div>
        </TabsContent>
        <TabsContent value="withdrawn">
          <div className="w-full min-h-52 py-6">
            {address ? (
              renderSaveLocks(sortedLocks.withdrawnLocks, "withdrawn")
            ) : (
              <ThriveEvmConnectButton />
            )}
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
}

function LoadingState() {
  return (
    <motion.div
      className="flex flex-col items-center justify-center w-full h-52"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <LoaderCircle className="w-12 h-12 text-primary animate-spin" />
      <p className="mt-4 text-lg font-medium text-muted-foreground">
        Loading your locks...
      </p>
    </motion.div>
  );
}

function NoLocksState({
  type,
}: {
  type: "ongoing" | "completed" | "withdrawn";
}) {
  const messages = {
    ongoing: "You don't have any ongoing locks.",
    completed: "You don't have any completed locks.",
    withdrawn: "You don't have any withdrawn locks.",
  };

  return (
    <motion.div
      className="flex flex-col items-center justify-center w-full h-52 bg-secondary/20 rounded-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <Lightbulb className="w-12 h-12 text-yellow-500" />
      <p className="mt-4 text-lg font-medium text-center">{messages[type]}</p>
      {type === "ongoing" && (
        <Button variant="outline" className="mt-4">
          Create a new lock
        </Button>
      )}
    </motion.div>
  );
}
