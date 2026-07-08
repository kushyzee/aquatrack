import CycleGroupHeader from "@/features/cycles/components/CycleGroupHeader";
import { getCyclesByIds } from "@/features/cycles/data";
import { formatDate, formatNumber } from "@/lib/utils";
import { AlertTriangle, Box, Calendar } from "lucide-react";

interface LogData {
  daily_log_id: string;
  pond_id: string;
  log_date: string;
  feed_kg_total: number | null;
  mortality_total: number | null;
  notes: string | null;
  cycle_id: string;
}

interface DailyLogListProps {
  dailyLogs: LogData[];
}

export default async function DailyLogList({ dailyLogs }: DailyLogListProps) {
  if (dailyLogs.length < 1) {
    return (
      <p className="text-muted-foreground mt-10 text-center">
        No logs recorded yet
      </p>
    );
  }

  const cycleIds = [...new Set(dailyLogs.map((log) => log.cycle_id))];
  const cycles = await getCyclesByIds(cycleIds);
  const cycleMap = new Map(cycles.map((c) => [c.id, c]));

  const grouped = new Map<string, LogData[]>();
  for (const log of dailyLogs) {
    const existing = grouped.get(log.cycle_id) ?? [];
    existing.push(log);
    grouped.set(log.cycle_id, existing);
  }

  return (
    <>
      {[...grouped.entries()].map(([cycleId, logs]) => (
        <div key={cycleId} className="mb-6 last:mb-0">
          <CycleGroupHeader cycle={cycleMap.get(cycleId)} />
          <div className="space-y-2">
            {logs.map((log) => (
              <div
                key={log.daily_log_id}
                className="bg-muted flex items-center justify-between rounded-lg px-5 py-3 text-sm"
              >
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  <p>{formatDate(log.log_date)}</p>
                </div>
                <div className="flex items-center gap-4">
                  {Number(log.feed_kg_total) > 0 && (
                    <div className="flex items-center gap-1.5">
                      <Box className="text-primary h-4 w-4" />
                      <p>{formatNumber(Number(log.feed_kg_total))} kg</p>
                    </div>
                  )}
                  {log.mortality_total && log.mortality_total > 0 ? (
                    <div className="flex items-center gap-1.5">
                      <AlertTriangle className="text-destructive h-4 w-4" />
                      <p>{log.mortality_total}</p>
                    </div>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}
