import { getPondInsights } from "../data";
import InsightsChart from "./InsightsChart";

export default async function InsightsTab({ pondId }: { pondId: string }) {
  const { cycleId, points } = await getPondInsights(pondId);

  if (!cycleId) {
    return (
      <p className="text-muted-foreground mt-10 text-center">
        No cycle data available yet for this pond
      </p>
    );
  }

  const feedData = points.map((p) => ({ logDate: p.logDate, value: p.feedKg }));
  const mortalityData = points.map((p) => ({
    logDate: p.logDate,
    value: p.mortality,
  }));

  return (
    <div className="space-y-8">
      <InsightsChart
        title="Feed Usage"
        data={feedData}
        color="var(--color-chart-1)"
        unit=" kg"
      />
      <InsightsChart
        title="Mortality"
        data={mortalityData}
        color="var(--color-destructive)"
        unit=" fish"
      />
    </div>
  );
}
