import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import AttentionCard from "./AttentionCard";

export default function AttentionRequired() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <AlertTriangle className="text-destructive h-6 w-6" />
          <CardTitle className="text-xl font-bold">
            Attention Required
          </CardTitle>
        </div>
        <CardDescription>
          Ponds with high mortality (last 7 days)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2.5">
          <AttentionCard pondName="Pond 1" deathCount={200} />
          <AttentionCard pondName="Pond 2" deathCount={40} />
        </div>
      </CardContent>
    </Card>
  );
}
