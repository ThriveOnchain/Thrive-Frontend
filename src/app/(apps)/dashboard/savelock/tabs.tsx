import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function SafeLockAnalyticsTabs() {
  return (
    <Tabs defaultValue="ongoing" className="w-full">
      <TabsList className="w-full justify-between">
        <TabsTrigger value="ongoing">Ongoing Safe</TabsTrigger>
        <TabsTrigger value="successfull">Successfull Save</TabsTrigger>
        <TabsTrigger value="unsuccesfull">Unsuccesfull</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        Make changes to your account here.
      </TabsContent>
      <TabsContent value="password">Change your password here.</TabsContent>
      <TabsContent value="password">Change your password here.</TabsContent>
    </Tabs>
  );
}
