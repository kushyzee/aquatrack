import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PondCardProps } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Layers } from "lucide-react";

export default function PondCard({ pondData }: { pondData: PondCardProps }) {
  const { name, status, type, species } = pondData;
  const isActive = status === "active";

  return (
    <Card className="min-h-[130px] gap-1.5">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div
              className={cn(
                "rounded-md p-2",
                isActive ? "bg-primary/10" : "bg-destructive/10",
              )}
            >
              <Layers
                className={cn(
                  "h-6 w-6",
                  isActive ? "text-primary" : "text-destructive",
                )}
              />
            </div>
            <CardTitle className="text-lg font-semibold">{name}</CardTitle>
          </div>
          <Badge className={cn(isActive ? "bg-primary" : "bg-destructive")}>
            {status.slice(0, 1).toUpperCase() + status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p>Type: {type}</p>
        {isActive && (
          <p className="text-muted-foreground text-xs"> {species}</p>
        )}
      </CardContent>
    </Card>
  );
}
