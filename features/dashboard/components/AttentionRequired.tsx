import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

export default function AttentionRequired() {
  return (
    <Card>
      <CardHeader>
        <div>
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
        <div></div>
      </CardContent>
    </Card>
  );
}
