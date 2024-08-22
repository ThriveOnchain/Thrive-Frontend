"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useAccount } from "wagmi";
import { useEffect, useState } from "react";
import { shortenAddress } from "@/lib/address";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useRouter } from "next/navigation";
import { ThriveEvmConnectButton } from "@/components/wagmi/connect-button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu";
import Link from "next/link";

export default function Header() {
  const { isConnected, address } = useAccount();
  const { open, close } = useWeb3Modal();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="fixed top-0  w-full flex items-center justify-between left-0 right-0   px-8 py-4 border-b bg-background/90 backdrop-blur-lg">
      <div
        onClick={() => router.push("/")}
        className="flex  items-center cursor-pointer justify-between"
      >
        <Image src="/logo.svg" height={30} width={30} alt="thrive logo" />
        <span className="">Thrive</span>
      </div>
      <NavigationMenu className="">
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Save</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[400px] gap-6 p-6 md:w-[600px] md:grid-cols-2 lg:w-[800px] ">
                {saveitems.map((item) => (
                  <SaveListItem key={item.title} item={item} />
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/docs" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Docs
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/docs" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Protocol
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      <ThriveEvmConnectButton />
    </div>
  );
}
const saveitems = [
  {
    title: "Savelock",
    href: "/dashboard/safelock",
    description:
      "Lock funds to avoid temptations and also earn micro interests",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-8 h-8 text-primary group-hover:text-primary"
      >
        <path
          d="M17 11V7a5 5 0 00-10 0v4M12 15v3M7 12h10M12 15a2 2 0 110 4 2 2 0 010-4z"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: "Target Savings",
    href: "/dashboard/targetsave",
    description: "Smash your savings goals faster",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-8 h-8 text-primary group-hover:text-primary"
      >
        <path
          d="M12 8v4M12 16h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: "Automated Savings",
    href: "/dashboard/autosave",
    description: "Automate your savings and Smash your savings goals faster",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-8 h-8 text-primary group-hover:text-primary"
      >
        <path
          d="M12 19V5M5 12h14M5 12a7 7 0 1114 0 7 7 0 01-14 0z"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: "Earn Rewards",
    href: "/dashboard/rewards",
    description: "Earn rewards for your savings",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-8 h-8 text-primary group-hover:text-primary"
      >
        <path
          d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M14 8l-3 5h6l-3-5z"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

const SaveListItem: React.FC<{ item: (typeof saveitems)[number] }> = ({
  item,
}) => {
  return (
    <Link href={item.href} className="flex gap-4 group">
      <div className="relative flex items-center justify-center flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
        {item.icon}
      </div>
      <div>
        <h4 className="text-base font-semibold">{item.title}</h4>
        <p className="text-sm text-muted-foreground">{item.description}</p>
      </div>
    </Link>
  );
};
