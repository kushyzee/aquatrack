export default function HarvestHistoryList() {
  return (
    <p className="text-muted-foreground mt-10 text-center">
      No harvests recorded yet
    </p>
  );

  // return (
  //   <>
  //     {dailyLogs.map((log) => (
  //       <div
  //         key={log.daily_log_id}
  //         className="bg-muted flex items-center justify-between rounded-lg px-5 py-3 text-sm"
  //       >
  //         <div className="flex items-center gap-1.5">
  //           <Calendar className="h-4 w-4" />
  //           <p>{formatDate(log.log_date)}</p>
  //         </div>
  //         <div className="flex items-center gap-4">
  //           {log.feed_kg_total && log.feed_kg_total > 0 && (
  //             <div className="flex items-center gap-1.5">
  //               <Box className="text-primary h-4 w-4" />
  //               <p>{log.feed_kg_total} kg</p>
  //             </div>
  //           )}

  //           {log.mortality_total && log.mortality_total > 0 && (
  //             <div className="flex items-center gap-1.5">
  //               <Box className="text-destructive h-4 w-4" />
  //               <p>{log.mortality_total}</p>
  //             </div>
  //           )}
  //         </div>
  //       </div>
  //     ))}
  //   </>
  // );
}
