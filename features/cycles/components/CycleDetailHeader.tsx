import { formatDate } from "@/lib/utils";
import CycleStatusBadge from "./CycleStatusBadge";
import type { AvailablePond, CycleSummary } from "@/features/cycles/data";
import CycleActionsMenu from "./CycleActionsMenu";

interface CycleDetailHeaderProps {
  cycle: CycleSummary;
  availablePonds: AvailablePond[];
}

export default function CycleDetailHeader({
  cycle,
  availablePonds,
}: CycleDetailHeaderProps) {
  const isActive = cycle.status === "active";

  return (
    <div className="mb-6">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-muted-foreground text-sm">Production Cycle</p>
          <h1 className="text-xl font-bold">{cycle.species}</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Started {formatDate(cycle.start_date)}
            {cycle.end_date
              ? ` · Ended ${formatDate(cycle.end_date)}`
              : " · Ongoing"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <CycleStatusBadge status={cycle.status} />
          {isActive && (
            <CycleActionsMenu
              cycleId={cycle.cycle_id}
              totalRemaining={cycle.total_remaining}
              ponds={availablePonds}
            />
          )}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Stocked" value={cycle.total_stocked} />
        <Stat label="Mortality" value={cycle.total_mortality} />
        <Stat label="Harvested" value={cycle.total_harvested} />
        <Stat label="Remaining" value={cycle.total_remaining} />
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border p-3">
      <p className="text-lg font-semibold">{value.toLocaleString()}</p>
      <p className="text-muted-foreground text-xs">{label}</p>
    </div>
  );
}
