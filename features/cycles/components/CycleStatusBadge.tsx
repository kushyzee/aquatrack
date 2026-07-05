import { Badge } from "@/components/ui/badge";

export default function CycleStatusBadge({
  status,
}: {
  status: "active" | "completed";
}) {
  return (
    <Badge variant={status === "active" ? "default" : "secondary"}>
      {status === "active" ? "Active" : "Completed"}
    </Badge>
  );
}
