"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useAccount } from "wagmi";
import { useEffect, useState } from "react";
import { shortenAddress } from "@/lib/address";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useRouter } from "next/navigation";

export default function Header() {
  const { isConnected, address } = useAccount();
  const { open, close } = useWeb3Modal();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <nav className="fixed top-0  left-0 right-0 w-full flex  items-center justify-between px-8 py-4 border-b bg-background/15 backdrop-blur-md">
      <div
        onClick={() => router.push("/")}
        className="flex  items-center cursor-pointer"
      >
        <Image src="/logo.svg" height={38} width={38} alt="thrive logo" />
        <span>Thrive</span>
      </div>
      <div>
        {!mounted ? (
          <Button variant="outline">Loading...</Button>
        ) : isConnected ? (
          <div className="flex items-center gap-3">
            <w3m-network-button />
            <Button onClick={() => open({ view: "Account" })}>
              {shortenAddress(address ?? "", 4)}
            </Button>
          </div>
        ) : (
          <w3m-button />
        )}
      </div>
    </nav>
  );
}
