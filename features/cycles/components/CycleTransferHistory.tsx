import { formatDate } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { CycleTransfer } from "@/features/cycles/data";

export default function CycleTransferHistory({
  transfers,
}: {
  transfers: CycleTransfer[];
}) {
  return (
    <div>
      <h2 className="text-muted-foreground mb-2 text-sm font-semibold">
        Transfer History
      </h2>
      {transfers.length === 0 ? (
        <p className="text-muted-foreground text-sm">
          No transfers recorded yet.
        </p>
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Movement</TableHead>
                <TableHead className="text-right">Count</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transfers.map((transfer) => (
                <TableRow key={transfer.id}>
                  <TableCell>{formatDate(transfer.transfer_date)}</TableCell>
                  <TableCell>
                    {transfer.from_pond_name} → {transfer.to_pond_name}
                  </TableCell>
                  <TableCell className="text-right">
                    {transfer.count.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {transfer.notes ?? "—"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
