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

export function SafeLockAnalyticsTabs() {
  const { address } = useAccount();

  const [activeLocks, setActiveLocks] = useState<number[]>([]);
  const [completedLocks, setCompletedLocks] = useState<number[]>([]);
  const [withdrawnLocks, setWithdrawnLocks] = useState<number[]>([]);

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

  useEffect(() => {
    if (userSaveLocks && userSaveLocks[0]?.result && userSaveLocks[1]?.result) {
      const active = userSaveLocks[0].result as number[];
      const inactive = userSaveLocks[1].result as number[];
      setActiveLocks(active);
      setCompletedLocks(inactive.filter((id) => !withdrawnLocks.includes(id)));
      setWithdrawnLocks(inactive.filter((id) => withdrawnLocks.includes(id)));
    }
  }, [userSaveLocks, withdrawnLocks]);

  const { data: saveLockDetails, isLoading: isLoadingDetails } =
    useReadContracts({
      //@ts-ignore
      contracts: [...activeLocks, ...completedLocks, ...withdrawnLocks].map(
        (id) => ({
          abi: thrive_base,
          address: THRIVE_BASE_SEPOLIA,
          functionName: "getSaveLockDetails",
          args: [BigInt(id)],
        }),
      ),
    });

  const handleWithdraw = (id: number) => {
    setWithdrawnLocks((prev) => [...prev, id]);
    refetch();
  };
  const renderSaveLocks = (ids: number[]) => {
    if (isLoading || isLoadingDetails) return <p>Loading...</p>;
    if (!saveLockDetails) return <p>No save locks found.</p>;

    return ids.map((id, index) => {
      const saveLock = saveLockDetails[index]?.result as SaveLock | undefined;
      if (!saveLock) return null;
      return (
        <SaveLockCard
          key={id}
          id={id}
          saveLock={saveLock}
          onWithdraw={() => handleWithdraw(id)}
        />
      );
    });
  };
  return (
    <Tabs defaultValue="ongoing" className="w-full">
      <TabsList className="w-full justify-between">
        <TabsTrigger className="flex-1 w-1/3" value="ongoing">
          Ongoing
        </TabsTrigger>
        <TabsTrigger className="flex-1 w-1/3" value="completed">
          Completed
        </TabsTrigger>
        <TabsTrigger className="flex-1 w-1/3" value="withdrawn">
          Withdrawn
        </TabsTrigger>
      </TabsList>
      <TabsContent value="ongoing">
        <div className="w-full min-h-40 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-6">
          {address ? renderSaveLocks(activeLocks) : <ThriveEvmConnectButton />}
        </div>
      </TabsContent>
      <TabsContent value="completed">
        <div className="w-full min-h-40 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4  py-6">
          {address ? (
            renderSaveLocks(completedLocks)
          ) : (
            <ThriveEvmConnectButton />
          )}
        </div>
      </TabsContent>
      <TabsContent value="withdrawn">
        <div className="w-full min-h-40 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-6">
          {address ? (
            renderSaveLocks(withdrawnLocks)
          ) : (
            <ThriveEvmConnectButton />
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
}
