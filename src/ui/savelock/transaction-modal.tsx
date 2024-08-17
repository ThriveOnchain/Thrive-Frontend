"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight } from "lucide-react";
import {
  FloatingInput,
  FloatingLabel,
} from "@/components/ui/floating-input-label";
import { useMemo, useState } from "react";
import Image from "next/image";
import { TextField } from "@/components/amount-input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

import { BalancePanel } from "@/components/wagmi/balance";
import { useAccount, useReadContracts, useWriteContract } from "wagmi";
import { USDC_ADDRESS } from "@/lib/config/tokens";
import { Address, erc20Abi, parseUnits } from "viem";
import thrive_base from "../../lib/config/abi/thrive.json";
import { useThriveWriteContract } from "@/hooks/useThriveWriteContract";
import { THRIVE_BASE_SEPOLIA } from "@/lib/config/contract";
import { lockPeriods } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Erc20ApprovalChecker } from "@/components/wagmi/approval-checker";
import { ThriveEvmConnectButton } from "@/components/wagmi/connect-button";

const RECOMENDED_LOCK_PERIOD = lockPeriods[2].value;
export function CreateSafeLockDialogue() {
  const [preview, setPreview] = useState<boolean>(false);
  const [amount, setAmount] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [selectedLockPeriod, setSelectedLockPeriod] = useState<string>(
    RECOMENDED_LOCK_PERIOD,
  );
  const [userSelected, setUserSelected] = useState<boolean>(false);

  const { address } = useAccount();

  //FORM CONTROL FUNCTIONS
  const handleAmountChange = (value: string) => {
    setAmount(value);
  };
  const handleTitleChange = (value: string) => {
    setTitle(value);
  };
  const handleLockPeriodChange = (value: string) => {
    setSelectedLockPeriod(value);
    setUserSelected(true);
  };

  //READ TOKEN DETAILS AND USER BALANCE

  const { isLoading, isSuccess, data, isError } = useReadContracts({
    contracts: [
      {
        abi: erc20Abi,
        address: USDC_ADDRESS,
        functionName: "balanceOf",
        args: [address as Address],
      },
      {
        abi: erc20Abi,
        address: USDC_ADDRESS,
        functionName: "decimals",
      },
    ],
  });

  const tokenDecimals = data?.[1].result ?? 6;

  const parsedAmount = useMemo(() => {
    if (!amount)
      return {
        bigint_value: 0n,
        string_value: "0",
      };
    try {
      return {
        bigint_value: parseUnits(amount, tokenDecimals),
        string_value: parseUnits(amount, tokenDecimals).toString(),
      };
    } catch (error) {
      console.error("Error parsing amount:", error);
      return {
        bigint_value: 0n,
        string_value: "0",
      };
    }
  }, [amount, tokenDecimals]);

  const {
    write,
    isPending,
    isConfirming,
    isTrxSubmitted,
    isConfirmed,
    isWriteContractError,
    reset,
  } = useThriveWriteContract({
    fn: "saveLockFunds",
    trxTitle: "Creating Safelock",
    abi: thrive_base,
    contractAddress: THRIVE_BASE_SEPOLIA,
    args: [
      USDC_ADDRESS,
      title,
      parsedAmount.string_value,
      parseInt(selectedLockPeriod),
    ],
  });

  //WRITE FUNCTIONS
  const handleCreateSafeLock = () => {
    if (canPreview) {
      write();
    }
  };

  const canPreview =
    amount !== "" &&
    title !== "" &&
    parseFloat(amount) >= 1 &&
    selectedLockPeriod !== "";

  // const [isSuccessSave, setIsSuccessSave] = useState(false);

  const resetState = () => {
    setPreview(false);
    setAmount("");
    setTitle("");
    setSelectedLockPeriod(RECOMENDED_LOCK_PERIOD);
    setUserSelected(false);
    // setIsSuccessSave(false);
    reset();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <span>Create a safe lock</span>
          <ChevronRight className="w-4 h-4 ml-1" />{" "}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create a safe lock</DialogTitle>
          <div className="flex w-full my-4">
            <DialogDescription className="flex-1 w-[65%]">
              Lock yout funds for important things to avoid tempatation.
            </DialogDescription>
            <div className="relative w-[35%] flex-1 h-16 float-right">
              <Image
                src="/assets/thrive/piggy-slice.png"
                fill
                objectFit="contain"
                alt="piggy baby"
              />
            </div>
          </div>
        </DialogHeader>
        <div>
          {isConfirmed ? (
            <div className="text-center">
              <h3 className="text-lg font-semibold text-green-600 mb-2">
                Success!
              </h3>
              <p className="mb-4">
                Your safe lock has been created successfully.
              </p>
              <Button onClick={() => resetState()} className="w-full">
                Create Another Safe Lock
              </Button>
            </div>
          ) : preview ? (
            <div className="text-muted-foreground ">
              <p className="px-4 my-5">
                You are about to create a safe lock
                <span className="text-primary font-semibold">
                  {" "}
                  (for {title})
                </span>{" "}
                <span className="text-primary font-semibold">
                  {amount} USDC
                </span>{" "}
                for{" "}
                <span className="text-primary font-semibold">
                  {lockPeriods[parseInt(selectedLockPeriod)].label}.
                </span>
              </p>
              <Button
                onClick={handleCreateSafeLock}
                disabled={isPending || isConfirming}
                className="w-full"
              >
                {isPending || isConfirming
                  ? "Processing..."
                  : "Confirm Safe Lock"}
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-2 flex-col w-full gap-6">
              <ToggleGroup
                type="single"
                value={selectedLockPeriod.toString()}
                onValueChange={handleLockPeriodChange}
              >
                {lockPeriods.map((period) => (
                  <ToggleGroupItem
                    key={period.value}
                    value={period.value.toString()}
                    className="relative w-fit border "
                  >
                    {period.label}
                    {period.value === RECOMENDED_LOCK_PERIOD &&
                      !userSelected && (
                        <div className="absolute -bottom-2 right-0 p-0  text-[8px] bg-green-500 text-white px-[3px] py-[1px] rounded-full">
                          Recommended
                        </div>
                      )}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
              <div className="relative w-full">
                <div>
                  <TextField
                    type="number"
                    onValueChange={handleAmountChange}
                    className="text-right bg-background border"
                    id="token-amount-input"
                    placeholder="0.00"
                    value={amount}
                    maxDecimals={6}
                  />
                  {address && data && data[0].result && data[1].result && (
                    <BalancePanel
                      tokenBalance={data[0].result}
                      tokenDecimal={data[1].result}
                      isLoading={isLoading}
                      isSuccess={isSuccess}
                      isError={isError}
                    />
                  )}
                </div>

                <FloatingLabel htmlFor="token-amount-input">
                  Token amount
                </FloatingLabel>
              </div>

              <div className="relative w-full">
                <FloatingInput
                  id="safelock-title"
                  type="text"
                  placeholder=""
                  onChange={(e) => handleTitleChange(e.target.value)}
                />
                <FloatingLabel htmlFor="safelock-title">
                  Safe lock title
                </FloatingLabel>
              </div>
              {address ? (
                <Erc20ApprovalChecker
                  userAddress={address}
                  askingAmount={parsedAmount.bigint_value}
                >
                  <Button
                    onClick={() => setPreview(true)}
                    disabled={!canPreview}
                    className="w-full"
                  >
                    Preview
                  </Button>
                </Erc20ApprovalChecker>
              ) : (
                <ThriveEvmConnectButton />
              )}
            </div>
          )}
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild></DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
