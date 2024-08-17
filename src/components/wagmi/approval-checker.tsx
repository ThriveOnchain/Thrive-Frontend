import { USDC_ADDRESS } from "@/lib/config/tokens";
import { ChevronDown, Info } from "lucide-react";
import { Address, erc20Abi } from "viem";
import { useReadContracts } from "wagmi";
import { THRIVE_BASE_SEPOLIA } from "@/lib/config/contract";
import { ReactNode, useEffect, useMemo } from "react";
import { Button } from "../ui/button";
import { useThriveWriteContract } from "@/hooks/useThriveWriteContract";

export const Erc20ApprovalChecker = ({
  userAddress,
  askingAmount,
  children,
}: {
  userAddress: Address;
  children: ReactNode;
  askingAmount: bigint;
}) => {
  const {
    isLoading,
    isSuccess,
    data,
    refetch: refetchAllowance,
    isError,
  } = useReadContracts({
    contracts: [
      {
        abi: erc20Abi,
        address: USDC_ADDRESS,
        functionName: "allowance",
        args: [userAddress, THRIVE_BASE_SEPOLIA],
      },
    ],
  });

  const {
    write,
    isPending,
    isConfirming,
    isTrxSubmitted,
    isConfirmed,
    isWriteContractError,
    reset,
  } = useThriveWriteContract({
    fn: "approve",
    trxTitle: "Approving USDC",
    abi: erc20Abi,
    contractAddress: USDC_ADDRESS,
    args: [THRIVE_BASE_SEPOLIA, (askingAmount * BigInt(12)) / BigInt(10)],
  });

  console.log(
    "askingAmount approval checker",
    (askingAmount * BigInt(12)) / BigInt(10),
    askingAmount,
  );

  const isApproved = useMemo(() => {
    if (!data || !data[0]?.result) return false;
    return data[0].result >= askingAmount;
  }, [data, askingAmount, isLoading, isSuccess]);

  useEffect(() => {
    if (isConfirmed) {
      refetchAllowance();
    }
  }, [isConfirmed, isConfirming, askingAmount]);

  if (isApproved) {
    return <>{children}</>;
  }

  if (isLoading) {
    return (
      <Button className="w-full" disabled>
        Checking allowance...
      </Button>
    );
  }

  if (isError || !data) {
    return (
      <Button className="w-full" disabled>
        Error checking allowance, check your wifi
      </Button>
    );
  }

  return (
    <div className="w-full">
      <Button
        className="w-full"
        onClick={write}
        disabled={isPending || isConfirming}
      >
        {isPending || isConfirming ? (
          <>
            Approving... <ChevronDown className="ml-2 h-4 w-4 animate-spin" />
          </>
        ) : (
          <>
            Approve USDC
            <Info className="ml-2 h-4 w-4" />
          </>
        )}
      </Button>
    </div>
  );
};
