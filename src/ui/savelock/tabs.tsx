import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ThriveEvmConnectButton } from "@/components/wagmi/connect-button";
import { useAccount } from "wagmi";
import thrive_base from "../../lib/config/abi/thrive.json";
import { useReadContracts } from "wagmi";
import { THRIVE_BASE_SEPOLIA } from "@/lib/config/contract";
export function SafeLockAnalyticsTabs() {
  const { address } = useAccount();

  const {
    data: userSaveLocks,
    isLoading,
    isError,
  } = useReadContracts({
    contracts: [
      {
        abi: thrive_base,
        address: THRIVE_BASE_SEPOLIA,
        functionName: "getUserActiveSaveLockIds",
        args: [address],
      },
      {
        abi: thrive_base,
        address: THRIVE_BASE_SEPOLIA,
        functionName: "getUserInActiveSaveLockIds",
        args: [address],
      },
    ],
  });

  return (
    <Tabs defaultValue="ongoing" className="w-full">
      <TabsList className="w-full justify-between">
        <TabsTrigger className="flex-1 w-1/2" value="ongoing">
          Ongoing Safe
        </TabsTrigger>
        <TabsTrigger className="flex-1 w-1/2" value="successfull">
          Successfull Save
        </TabsTrigger>
      </TabsList>
      <TabsContent value="ongoing">
        <div className="w-full min-h-40 flex items-center justify-center">
          {!address && <ThriveEvmConnectButton />}
        </div>
      </TabsContent>
      <TabsContent value="successfull">
        <div className="w-full min-h-40 flex items-center justify-center">
          {!address && <ThriveEvmConnectButton />}
        </div>
      </TabsContent>
    </Tabs>
  );
}
