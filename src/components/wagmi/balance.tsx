"use client";
import { formatUnits } from "viem";

import { Skeleton } from "../ui/skeleton";

export const BalancePanel = ({
  tokenBalance,
  tokenDecimal,
  isLoading,
  isSuccess,
  isError,
}: {
  tokenBalance: bigint;
  tokenDecimal: number;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
}) => {
  const formattedBalance = formatUnits(tokenBalance, tokenDecimal);

  if (isError) {
    return <div></div>;
  }

  return (
    <div className="w-full flex items-end justify-end text-xs text-muted-foreground px-3 ">
      {isLoading && <Skeleton className="h-4 w-[200px]" />}
      {isSuccess && <span>balance: {formattedBalance} USDC</span>}
    </div>
  );
};
