import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import CycleStatusBadge from "./CycleStatusBadge";
import { formatDate } from "@/lib/utils";

type CycleSummary = {
  cycle_id: string;
  species: string;
  start_date: string;
  status: "active" | "completed";
  end_date: string | null;
  total_stocked: number;
  total_mortality: number;
  total_harvested: number;
  total_remaining: number;
};

export default function CycleCard({ cycle }: { cycle: CycleSummary }) {
  return (
    <Link href={`/cycles/${cycle.cycle_id}`} className="block h-full">
      <Card className="hover:border-primary/50 h-full cursor-pointer transition-colors">
        <CardHeader className="flex flex-row items-start justify-between gap-2 pb-2">
          <div>
            <p className="text-muted-foreground text-sm">Cycle</p>
            <h3 className="text-lg leading-tight font-semibold">
              {cycle.species}
            </h3>
          </div>
          <CycleStatusBadge status={cycle.status} />
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-muted-foreground text-sm">
            Started {formatDate(cycle.start_date)}
            {cycle.end_date
              ? ` · Ended ${formatDate(cycle.end_date)}`
              : " · Ongoing"}
          </p>
          <div className="grid grid-cols-3 gap-2 border-t pt-3">
            <Stat label="Stocked" value={cycle.total_stocked} />
            <Stat label="Harvested" value={cycle.total_harvested} />
            <Stat label="Remaining" value={cycle.total_remaining} />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="text-center">
      <p className="text-base font-semibold">{value.toLocaleString()}</p>
      <p className="text-muted-foreground text-xs">{label}</p>
    </div>
  );
}
