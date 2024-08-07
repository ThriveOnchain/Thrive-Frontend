import { cookieStorage, createStorage, State } from "wagmi";
import { base, baseSepolia } from "wagmi/chains";

import { defaultWagmiConfig } from "@web3modal/wagmi/react/config";

export const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

export const metadata = {
  name: "Thrive",
  description: "Thrive",
  url: "https://web3modal.com", // origin must match your domain & subdomain
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
};

const chains = [base, baseSepolia] as const;

if (!projectId) throw new Error("Project ID is not defined");

export const config = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
  auth: {
    email: true, // default to true
    socials: [
      "google",
      "x",
      "github",
      "discord",
      "apple",
      "facebook",
      "farcaster",
    ],
    showWallets: false, // default to true
    walletFeatures: true, // default to true
  },
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
});
