import { formatDate } from "@/lib/utils";
import { AlertTriangle, Box, Calendar } from "lucide-react";

interface LogData {
  daily_log_id: string;
  pond_id: string;
  log_date: string;
  feed_kg_total: number | null;
  mortality_total: number | null;
  notes: string | null;
}

interface DailyLogListProps {
  dailyLogs: LogData[];
}

export default function DailyLogList({ dailyLogs }: DailyLogListProps) {
  if (dailyLogs.length < 1) {
    return (
      <p className="text-muted-foreground mt-10 text-center">
        No logs recorded yet
      </p>
    );
  }

  return (
    <>
      {dailyLogs.map((log) => (
        <div
          key={log.daily_log_id}
          className="bg-muted flex items-center justify-between rounded-lg px-5 py-3 text-sm"
        >
          <div className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            <p>{formatDate(log.log_date)}</p>
          </div>
          <div className="flex items-center gap-4">
            {log.feed_kg_total && log.feed_kg_total > 0 ? (
              <div className="flex items-center gap-1.5">
                <Box className="text-primary h-4 w-4" />
                <p>{log.feed_kg_total} kg</p>
              </div>
            ) : null}

            {log.mortality_total && log.mortality_total > 0 ? (
              <div className="flex items-center gap-1.5">
                <AlertTriangle className="text-destructive h-4 w-4" />
                <p>{log.mortality_total}</p>
              </div>
            ) : null}
          </div>
        </div>
      ))}
    </>
  );
}
