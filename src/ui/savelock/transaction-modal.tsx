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
import { useState } from "react";
import Image from "next/image";
import { TextField } from "@/components/amount-input";
import { BalancePanel } from "@/components/wagmi/balance";
import { useAccount, useReadContracts } from "wagmi";
import { USDC_ADDRESS } from "@/lib/config/tokens";
import { Address, erc20Abi } from "viem";

export function CreateSafeLockDialogue() {
  const [preview, setPreview] = useState<boolean>(false);
  const [amount, setAmount] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const { address } = useAccount();
  const handleAmountChange = (value: string) => {
    setAmount(value);
  };
  const handleTitleChange = (value: string) => {
    setTitle(value);
  };

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

  const canPreview = amount !== "" && title !== "";
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
              Anyone who has this link will be able to view this.
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
          {preview ? (
            <div></div>
          ) : (
            <div className="flex items-center space-x-2 flex-col w-full gap-6">
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

              <Button
                onClick={() => setPreview(true)}
                disabled={!canPreview}
                className="w-full"
              >
                Preview
              </Button>
            </div>
          )}
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
