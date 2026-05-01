import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

const harvestStats = [
  {
    title: "Total Weight",
    value: "100 kg",
  },
  {
    title: "Total Quantity",
    value: "70",
  },
  {
    title: "Total Revenue",
    value: formatCurrency(340000),
  },
];

export default function HarvestStats() {
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
