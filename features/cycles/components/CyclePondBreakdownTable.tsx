import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { PondCycleBreakdown } from "@/features/cycles/data";

export default function CyclePondBreakdownTable({
  ponds,
}: {
  ponds: PondCycleBreakdown[];
}) {
  if (ponds.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">
        No ponds have been stocked in this cycle yet.
      </p>
    );
  }

  return (
    <div>
      <h2 className="text-muted-foreground mb-2 text-sm font-semibold">
        Pond Breakdown
      </h2>
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Pond</TableHead>
              <TableHead className="text-right">Stocked In</TableHead>
              <TableHead className="text-right">Transferred In</TableHead>
              <TableHead className="text-right">Transferred Out</TableHead>
              <TableHead className="text-right">Mortality</TableHead>
              <TableHead className="text-right">Harvested</TableHead>
              <TableHead className="text-right">Current</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ponds.map((pond) => {
              const sortedOut = pond.current_fish_count === 0;
              return (
                <TableRow
                  key={pond.pond_id}
                  className={sortedOut ? "text-muted-foreground" : undefined}
                >
                  <TableCell className="font-medium">
                    {pond.pond_name}
                  </TableCell>
                  <TableCell className="text-right">
                    {pond.stocked_in.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    {pond.transferred_in.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    {pond.transferred_out.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    {pond.total_mortality.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    {pond.total_harvested.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    {sortedOut ? (
                      <Badge variant="secondary">Sorted out</Badge>
                    ) : (
                      <span className="font-semibold">
                        {pond.current_fish_count.toLocaleString()}
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
