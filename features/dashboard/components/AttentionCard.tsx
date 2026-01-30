import { Badge } from "@/components/ui/badge";

interface AttentionCardProps {
  pondName: string;
  deathCount: number;
}

export default function AttentionCard({
  pondName,
  deathCount,
}: AttentionCardProps) {
  return (
    <div className="flex items-center justify-between rounded-md bg-red-100 px-4 py-3">
      <p>{pondName}</p>
      <Badge variant="destructive">{deathCount} deaths</Badge>
    </div>
  );
}
