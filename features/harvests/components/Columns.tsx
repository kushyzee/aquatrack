"use client";

import { ColumnDef, Column } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HarvestRecord } from "@/features/harvests/data";

export const harvestColumnLabels: Record<string, string> = {
  harvest_date: "Date",
  pond_name: "Pond",
  buyer: "Buyer",
  quantity_kg: "Quantity (kg)",
  fish_count: "Fish Count",
  revenue: "Revenue",
  notes: "Notes",
};

function formatNGN(value: number | null) {
  if (value == null) return "—";
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(value);
}

interface SortableHeaderProps {
  column: Column<HarvestRecord, unknown>;
  label: string;
}

function SortableHeader({ column, label }: SortableHeaderProps) {
  return (
    <Button
      variant="ghost"
      className="px-0"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      {label}
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  );
}

export const harvestColumns: ColumnDef<HarvestRecord>[] = [
  {
    accessorKey: "harvest_date",
    header: ({ column }) => <SortableHeader column={column} label="Date" />,
    cell: ({ row }) =>
      new Date(row.original.harvest_date).toLocaleDateString("en-NG", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
  },
  {
    accessorKey: "pond_name",
    header: ({ column }) => <SortableHeader column={column} label="Pond" />,
    cell: ({ row }) => row.original.pond_name ?? "—",
  },
  {
    accessorKey: "buyer",
    header: ({ column }) => <SortableHeader column={column} label="Buyer" />,
    cell: ({ row }) => row.original.buyer ?? "—",
  },
  {
    accessorKey: "quantity_kg",
    header: ({ column }) => <SortableHeader column={column} label="Quantity (kg)" />,
  },
  {
    accessorKey: "fish_count",
    header: ({ column }) => <SortableHeader column={column} label="Fish Count" />,
  },
  {
    accessorKey: "revenue",
    header: ({ column }) => <SortableHeader column={column} label="Revenue" />,
    cell: ({ row }) => formatNGN(row.original.revenue),
  },
  {
    accessorKey: "notes",
    header: "Notes",
    cell: ({ row }) => row.original.notes ?? "—",
  },
];
