import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { HarvestTotals } from "@/features/harvests/data";

interface HarvestStatsProps {
  totals: HarvestTotals;
}

export default function HarvestStats({ totals }: HarvestStatsProps) {
  const harvestStats = [
    {
      title: "Total Weight",
      value: `${totals.total_weight_kg} kg`,
    },
    {
      title: "Total Quantity",
      value: String(totals.total_quantity),
    },
    {
      title: "Total Revenue",
      value: formatCurrency(totals.total_revenue),
    },
  ];

  return (
    <div className="space-y-4">
      {harvestStats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader>
            <CardTitle className="text-xl">{stat.value}</CardTitle>
            <CardDescription>{stat.title}</CardDescription>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}
