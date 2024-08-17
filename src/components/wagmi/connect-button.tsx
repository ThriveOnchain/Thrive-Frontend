"use client";

import { Button } from "@/components/ui/button";
import { useAccount } from "wagmi";
import { useEffect, useState } from "react";
import { shortenAddress } from "@/lib/address";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useRouter } from "next/navigation";

export function ThriveEvmConnectButton() {
  const { isConnected, address } = useAccount();
  const { open, close } = useWeb3Modal();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  useEffect(() => {
    setMounted(true);
  }, []);
  return (
    <div>
      {!mounted ? (
        <Button variant="outline">Loading...</Button>
      ) : isConnected ? (
        <div className="flex items-center gap-3">
          <w3m-network-button />
          <Button onClick={() => open({ view: "Account" })}>
            {shortenAddress(address ?? "", 2)}
          </Button>
        </div>
      ) : (
        <w3m-button />
      )}
    </div>
  );
}
