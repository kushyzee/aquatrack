import { AlertTriangle } from "lucide-react";
import AttentionCard from "./AttentionCard";
import CardWrapper from "@/components/CardWrapper";
import { getDashboardMetrics } from "../data";

export default async function AttentionRequired() {
  const { pondsWithHighMortality } = await getDashboardMetrics();

  return (
    <CardWrapper
      title="Attention Required"
      description="Ponds with high mortality (last 7 days)"
      icon={AlertTriangle}
    >
      {pondsWithHighMortality.length === 0 ? (
        <p className="text-muted-foreground text-center text-base">
          No ponds requiring attention.
        </p>
      ) : (
        <div className="space-y-2.5">
          {pondsWithHighMortality.map(({ pond_name, mortality_last_7d }) => (
            <AttentionCard
              key={pond_name}
              pondName={pond_name}
              deathCount={mortality_last_7d}
            />
          ))}
        </div>
      )}
    </CardWrapper>
  );
}
