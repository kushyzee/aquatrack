"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatDate } from "@/lib/utils";

interface InsightsChartProps {
  title: string;
  data: { logDate: string; value: number }[];
  color: string;
  unit: string;
}

export default function InsightsChart({
  title,
  data,
  color,
  unit,
}: InsightsChartProps) {
  if (data.length === 0) {
    return (
      <div>
        <h3 className="mb-2 text-sm font-medium">{title}</h3>
        <div className="flex h-60 items-center justify-center">
          <p className="text-muted-foreground text-sm">
            No data yet for this cycle
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h3 className="mb-2 text-sm font-medium">{title}</h3>
      <ResponsiveContainer width="100%" height={240}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
          <XAxis
            dataKey="logDate"
            tickFormatter={(d) => formatDate(d)}
            className="text-xs"
          />
          <YAxis className="text-xs" />
          <Tooltip
            labelFormatter={(d) => formatDate(d as string)}
            formatter={(value: number) => [`${value}${unit}`, title]}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            dot={{ r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
