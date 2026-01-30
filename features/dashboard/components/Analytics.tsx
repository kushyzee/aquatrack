import { AlertTriangle, Box, Container, GripHorizontal } from "lucide-react";
import AnalyticCard from "./AnalyticCard";

export default function Analytics() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <AnalyticCard
        Icon={GripHorizontal}
        colour="sky"
        description="Total Fish in Farm"
        figure="4,760"
      />
      <AnalyticCard
        Icon={Box}
        colour="neutral"
        description="Total Feed Used"
        figure="1.0 kg"
        duration="Last 7 days"
      />
      <AnalyticCard
        Icon={AlertTriangle}
        colour="red"
        description="Total Mortality"
        figure="260"
        duration="Last 7 days"
      />
      <AnalyticCard
        Icon={Container}
        colour="emerald"
        description="Harvest"
        figure="0.0 kg"
        duration="This month"
      />
    </div>
  );
}
