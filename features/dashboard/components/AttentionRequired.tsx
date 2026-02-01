import { AlertTriangle } from "lucide-react";
import AttentionCard from "./AttentionCard";
import CardWrapper from "@/components/CardWrapper";

export default function AttentionRequired() {
  return (
    <CardWrapper
      title="Attention Required"
      description="Ponds with high mortality (last 7 days)"
      icon={AlertTriangle}
    >
      <div className="space-y-2.5">
        <AttentionCard pondName="Pond 1" deathCount={200} />
        <AttentionCard pondName="Pond 2" deathCount={40} />
      </div>
    </CardWrapper>
  );
}
