import { AlertTriangle, Box, Container, GripHorizontal } from "lucide-react";
import AnalyticCard from "./AnalyticCard";
import {
  getHarvestData,
  getRecentFeedQuantity,
  getRecentMortality,
  getTotalFishInFarm,
} from "../data";

export default async function Analytics() {
  const totalFishResult = await getTotalFishInFarm();
  const totalFishInFarm = totalFishResult?.toLocaleString();

  const recentFeedResult = await getRecentFeedQuantity();
  const totalFeedUsed =
    (recentFeedResult
      ?.reduce((total, entry) => total + (entry.quantity_kg || 0), 0)
      .toFixed(1) || "0.0") + " kg";

  const recentMortalityResult = await getRecentMortality();
  const totalMortality =
    recentMortalityResult
      ?.reduce((total, entry) => total + (entry.count || 0), 0)
      .toLocaleString() || "0";

  const harvestData = await getHarvestData();
  const totalHarvest =
    (harvestData
      ?.reduce((total, entry) => total + (entry.quantity_kg || 0), 0)
      .toFixed(1) || "0.0") + " kg";

  console.log(totalHarvest);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <AnalyticCard
        Icon={GripHorizontal}
        colour="sky"
        description="Total Fish in Farm"
        figure={totalFishInFarm || "0"}
      />
      <AnalyticCard
        Icon={Box}
        colour="neutral"
        description="Total Feed Used"
        figure={totalFeedUsed}
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
