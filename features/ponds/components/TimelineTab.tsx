import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getPondDailyLog } from "../data";
import DailyLogList from "./DailyLogList";
import HarvestHistoryList from "./HarvestHistoryList";

export default async function TimelineTab({ pondId }: { pondId: string }) {
  const dailyLogs = await getPondDailyLog(pondId);
  console.log(dailyLogs);

  return (
    <div>
      <Card className="gap-4">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Daily Logs</CardTitle>
        </CardHeader>
        <CardContent className="min-h-24 space-y-4">
          <DailyLogList dailyLogs={dailyLogs} />
        </CardContent>
      </Card>

      <Card className="mt-6 gap-4">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Harvest History
          </CardTitle>
        </CardHeader>
        <CardContent className="min-h-24 space-y-4">
          <HarvestHistoryList />
        </CardContent>
      </Card>
    </div>
  );
}
