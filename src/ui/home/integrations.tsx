"use client";
import { useRouter } from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function Integrations() {
  return (
    <section className="flex flex-col items-center justify-between px-4 gap-6 py-14">
      <div className="flex items-center justify-center flex-col">
        <p className="text-xs">integrations and partnerships</p>
        <h1 className="text-lg font-bold text-center">
          Our ecosystem is powered by the best of the best
        </h1>
      </div>
      <div className="flex items-center gap-6 flex-wrap justify-center">
        {integrations.map((brand) => {
          return (
            <div key={brand.brand}>
              <BrandToolTip
                logo={brand.logo}
                url={brand.url}
                brand={brand.brand}
                width={brand.width}
                height={brand.height}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}

const integrations = [
  {
    brand: "Wallet Connect",
    logo: "/assets/integrations/walletconnect.svg",
    url: "https://walletconnect.com/",
    width: 120,
    height: 14,
  },
  {
    brand: "Gelato Network",
    logo: "/assets/integrations/Gelato_Log.png",
    url: "https://www.gelato.network/",
    bg: "white",
    width: 120,
    height: 12,
  },
  {
    brand: "Aave",
    logo: "/assets/integrations/Aave_Logo.svg",
    url: "https://aave.com/",
    width: 120,
    height: 8,
  },
  {
    brand: "Base",
    logo: "/assets/integrations/Base_Logo.svg",
    url: "https://www.base.org/",
    width: 120,
    height: 8,
    bg: "black",
  },
  {
    brand: "Optimism",
    logo: "/assets/integrations/Optimism_Logo.svg",
    url: "https://www.optimism.io/",
    width: 120,
    height: 12,
    bg: "black",
  },
];

import Image from "next/image";

export function BrandToolTip({
  logo,
  url,
  brand,
  width,
  height,
}: {
  logo: string;
  url: string;
  brand: string;
  height: number;
  width: number;
}) {
  const router = useRouter();
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="cursor-pointer" onClick={() => router.push(url)}>
            <Image
              src={logo}
              width={width}
              height={height}
              alt={`${brand} _logo`}
            />
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{brand}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
