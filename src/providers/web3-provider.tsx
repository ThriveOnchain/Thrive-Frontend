import { WagmiProvider, createConfig, http } from "wagmi";
import {} from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";
import { defaultWagmiConfig } from "@web3modal/wagmi/react/config";
import { createWeb3Modal } from "@web3modal/wagmi/react";
import { cookieStorage, createStorage, State } from "wagmi";
import { base, baseSepolia } from "wagmi/chains";
import { metadata, config, projectId } from "@/lib/config/wagmi";
// [baseSepolia.id]: http(
//   `https://lb.drpc.org/ogrpc?network=base-sepolia&dkey=${process.env.NEXT_PUBLIC_DRPC_ID}`,
// ),
const queryClient = new QueryClient();
if (!projectId) throw new Error("Project ID is not defined");

createWeb3Modal({
  metadata,
  wagmiConfig: config,
  projectId,
  enableSwaps: true,
  enableOnramp: true,
  enableAnalytics: true, // Optional - defaults to your Cloud configuration
});

export const Web3Provider = ({
  children,
  initialState,
}: {
  children: ReactNode;
  initialState?: State;
}) => {
  return (
    <WagmiProvider config={config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
};
