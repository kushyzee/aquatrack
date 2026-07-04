"use client";

import { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download, SlidersHorizontal } from "lucide-react";
import {
  harvestColumns,
  harvestColumnLabels,
} from "@/features/harvests/components/Columns";
import HarvestFilter from "@/features/harvests/components/HarvestFilter";
import HarvestTable from "@/features/harvests/components/HarvestTable";
import { HarvestRecord } from "@/features/harvests/data";

interface HarvestDataDetailsProps {
  harvests: HarvestRecord[];
}

function escapeCsvValue(value: string | number | null) {
  const str = value == null ? "" : String(value);
  return `"${str.replace(/"/g, '""')}"`;
}

function downloadCsv(rows: HarvestRecord[]) {
  const headers = [
    "Date",
    "Pond",
    "Buyer",
    "Quantity (kg)",
    "Fish Count",
    "Revenue (NGN)",
    "Notes",
  ];

  const csvRows = rows.map((h) =>
    [
      h.harvest_date,
      h.pond_name,
      h.buyer,
      h.quantity_kg,
      h.fish_count,
      h.revenue,
      h.notes,
    ]
      .map(escapeCsvValue)
      .join(","),
  );

  const csv = [headers.join(","), ...csvRows].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `harvests-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

export default function HarvestDataDetails({
  harvests,
}: HarvestDataDetailsProps) {
  "use no memo";

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    notes: false,
  });
  const [globalFilter, setGlobalFilter] = useState("");

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: harvests,
    columns: harvestColumns,
    state: { sorting, columnVisibility, globalFilter },
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: (row, _columnId, filterValue) => {
      const buyer = row.original.buyer ?? "";
      return buyer.toLowerCase().includes(String(filterValue).toLowerCase());
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col items-end gap-3">
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="outline"
                    size="icon"
                    aria-label="Toggle columns"
                  >
                    <SlidersHorizontal />
                  </Button>
                }
              ></DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table.getAllColumns().map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {harvestColumnLabels[column.id] ?? column.id}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              variant="outline"
              onClick={() =>
                downloadCsv(table.getRowModel().rows.map((r) => r.original))
              }
            >
              <Download /> Download CSV
            </Button>
          </div>
          <HarvestFilter value={globalFilter} onChange={setGlobalFilter} />
        </div>
      </CardHeader>
      <CardContent>
        <HarvestTable table={table} />
      </CardContent>
    </Card>
  );
}
