import { formatDate } from "@/lib/utils";
import { CycleLabel } from "../data";

export default function CycleGroupHeader({
  cycle,
}: {
  cycle: CycleLabel | undefined;
}) {
  return (
    <div className="mb-2 flex items-center justify-between">
      <p className="text-sm font-medium">
        {cycle?.species ?? "Unknown cycle"}
        {cycle && (
          <span className="text-muted-foreground ml-2 text-xs font-normal">
            {formatDate(cycle.startDate)}
            {cycle.endDate ? ` – ${formatDate(cycle.endDate)}` : " – Present"}
          </span>
        )}
      </p>
      {cycle?.status === "active" && (
        <span className="bg-primary/10 text-primary rounded px-2 py-0.5 text-xs font-medium">
          Active
        </span>
      )}
    </div>
  );
}
