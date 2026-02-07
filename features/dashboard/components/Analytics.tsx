import { AlertTriangle, Box, Container, GripHorizontal } from "lucide-react";
import AnalyticCard from "./AnalyticCard";
import { getDashboardMetrics } from "../data";

export default async function Analytics() {
  const { feedUsed, harvestMtd, mortality, totalFishInFarm } =
    await getDashboardMetrics();

  const { feed7d } = feedUsed;
  const { kg: harvestKg } = harvestMtd;
  const { mortality7d } = mortality;

  const totalFish = totalFishInFarm?.toLocaleString("en-US") ?? "0";

  const totalFeedUsed7d =
    feed7d.toLocaleString("en-US", {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
      style: "unit",
      unit: "kilogram",
    }) ?? "0 kg";

  const totalMortality = mortality7d.toLocaleString("en-US") ?? "0";

  const totalHarvest =
    harvestKg.toLocaleString("en-US", {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
      style: "unit",
      unit: "kilogram",
    }) ?? "0 kg";

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <AnalyticCard
        Icon={GripHorizontal}
        colour="sky"
        description="Total Fish in Farm"
        figure={totalFish}
      />
      <AnalyticCard
        Icon={Box}
        colour="neutral"
        description="Total Feed Used"
        figure={totalFeedUsed7d}
        duration="Last 7 days"
      />
      <AnalyticCard
        Icon={AlertTriangle}
        colour="red"
        description="Total Mortality"
        figure={totalMortality}
        duration="Last 7 days"
      />
      <AnalyticCard
        Icon={Container}
        colour="emerald"
        description="Harvest"
        figure={totalHarvest}
        duration="This month"
      />
    </div>
  );
}
