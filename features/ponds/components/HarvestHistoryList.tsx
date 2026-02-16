import { Calendar, Container } from "lucide-react";
import { getHarvestHistory } from "../data";
import { formatDate, formatNumber } from "@/lib/utils";

export default async function HarvestHistoryList({
  pondId,
}: {
  pondId: string;
}) {
  const harvestData = await getHarvestHistory(pondId);
  console.log(harvestData);

  if (harvestData.length < 1) {
    return (
      <p className="text-muted-foreground mt-10 text-center">
        No harvests recorded yet
      </p>
    );
  }

  return (
    <>
      {harvestData.map((log) => (
        <div
          key={log.id}
          className="bg-primary/10 flex items-center justify-between rounded-lg px-5 py-3 text-sm"
        >
          <div className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            <p>{formatDate(log.harvest_date)}</p>
          </div>
          <div className="flex items-center gap-4">
            {log.quantity_kg && log.quantity_kg > 0 && (
              <div className="flex items-center gap-1.5">
                <Container className="text-primary h-4 w-4" />
                <p>{formatNumber(log.quantity_kg)} kg</p>
              </div>
            )}
          </div>
        </div>
      ))}
    </>
  );
}
