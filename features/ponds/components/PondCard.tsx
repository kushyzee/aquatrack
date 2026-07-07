import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PondCardProps, PondStatus } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Layers } from "lucide-react";

const STATUS_STYLES: Record<
  PondStatus,
  { iconBg: string; icon: string; badge: string; border: string }
> = {
  active: {
    iconBg: "bg-primary/10",
    icon: "text-primary",
    badge: "bg-primary",
    border: "border-primary",
  },
  inactive: {
    iconBg: "bg-accent/10",
    icon: "text-accent-foreground",
    badge: "bg-accent",
    border: "border-accent",
  },
  archived: {
    iconBg: "bg-muted",
    icon: "text-muted-foreground",
    badge: "bg-muted-foreground",
    border: "border-muted-foreground",
  },
};

export default function PondCard({
  name,
  species,
  status,
  type,
  isPondDetailsPage,
  children,
}: PondCardProps) {
  const styles = STATUS_STYLES[status];

  return (
    <Card
      className={cn(
        "min-h-[130px] gap-1.5",
        isPondDetailsPage && cn("border-b-4", styles.border),
      )}
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={cn("rounded-md p-2", styles.iconBg)}>
              <Layers className={cn("h-6 w-6", styles.icon)} />
            </div>
            <CardTitle className="text-lg font-semibold">{name}</CardTitle>
          </div>
          <Badge className={styles.badge}>
            {status.slice(0, 1).toUpperCase() + status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p>Type: {type}</p>
        {species && <p className="text-muted-foreground text-xs">{species}</p>}
        {isPondDetailsPage && <div className="mt-4">{children}</div>}
      </CardContent>
    </Card>
  );
}
