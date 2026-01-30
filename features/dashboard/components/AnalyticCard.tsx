import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { GripHorizontal, Icon } from "lucide-react";

interface AnalyticCardProps {
  figure: string;
  description: string;
  duration?: string;
  Icon: React.ElementType;
  colour: string;
}

export default function AnalyticCard({
  figure,
  description,
  duration,
  Icon,
  colour,
}: AnalyticCardProps) {
  return (
    <div className="h-[130px]">
      <Card
        className={cn(
          "h-full gap-0.5 border-b-4",
          { "border-b-sky-200": colour === "sky" },
          { "border-b-neutral-200": colour === "neutral" },
          { "border-b-red-200": colour === "red" },
          { "border-b-emerald-200": colour === "emerald" },
        )}
      >
        <CardHeader>
          <div className="flex items-center gap-3.5">
            <div
              className={cn(
                "rounded-sm p-1.5",
                { "bg-sky-100": colour === "sky" },
                { "bg-neutral-100": colour === "neutral" },
                { "bg-red-100": colour === "red" },
                { "bg-emerald-100": colour === "emerald" },
              )}
            >
              <Icon
                className={cn(
                  "h-6 w-6",
                  { "text-sky-600": colour === "sky" },
                  { "text-neutral-600": colour === "neutral" },
                  { "text-red-600": colour === "red" },
                  { "text-emerald-600": colour === "emerald" },
                )}
              />
            </div>
            <CardTitle className="text-xl font-semibold">{figure}</CardTitle>
          </div>
          <CardDescription className="text-foreground mt-1.5">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-xs">{duration}</p>
        </CardContent>
      </Card>
    </div>
  );
}
