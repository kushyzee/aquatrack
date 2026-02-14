import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TimelineTab from "./TimelineTab";
import InsightsTab from "./InsightsTab";

export default function PondDetailTab({ pondId }: { pondId: string }) {
  return (
    <Tabs>
      <TabsList className="mb-1">
        <TabsTrigger value="timeline">Timeline</TabsTrigger>
        <TabsTrigger value="insights">Insights</TabsTrigger>
      </TabsList>
      <TabsContent value="timeline">
        <TimelineTab pondId={pondId} />
      </TabsContent>
      <TabsContent value="insights">
        <InsightsTab />
      </TabsContent>
    </Tabs>
  );
}
