import { Calendar, Container } from "lucide-react";
import { getHarvestHistory } from "../data";
import { formatDate, formatNumber } from "@/lib/utils";
import { getCyclesByIds } from "@/features/cycles/data";
import CycleGroupHeader from "@/features/cycles/components/CycleGroupHeader";

export default async function HarvestHistoryList({
  pondId,
}: {
  pondId: string;
}) {
  const harvestData = await getHarvestHistory(pondId);

  if (harvestData.length < 1) {
    return (
      <p className="text-muted-foreground mt-10 text-center">
        No harvests recorded yet
      </p>
    );
  }

  const cycleIds = [...new Set(harvestData.map((h) => h.cycle_id))];
  const cycles = await getCyclesByIds(cycleIds);
  const cycleMap = new Map(cycles.map((c) => [c.id, c]));

  const grouped = new Map<string, typeof harvestData>();
  for (const harvest of harvestData) {
    const existing = grouped.get(harvest.cycle_id) ?? [];
    existing.push(harvest);
    grouped.set(harvest.cycle_id, existing);
  }

  return (
    <>
      {[...grouped.entries()].map(([cycleId, harvests]) => (
        <div key={cycleId} className="mb-6 last:mb-0">
          <CycleGroupHeader cycle={cycleMap.get(cycleId)} />
          <div className="space-y-2">
            {harvests.map((h) => (
              <div
                key={h.id}
                className="bg-primary/10 flex items-center justify-between rounded-lg px-5 py-3 text-sm"
              >
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  <p>{formatDate(h.harvest_date)}</p>
                </div>
                <div className="flex items-center gap-4">
                  {h.quantity_kg && h.quantity_kg > 0 && (
                    <div className="flex items-center gap-1.5">
                      <Container className="text-primary h-4 w-4" />
                      <p>{formatNumber(h.quantity_kg)} kg</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}
