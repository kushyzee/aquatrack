import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface PondCardStatProps {
  title: string;
  value: string | number;
}

export default function PondCardStat({ title, value }: PondCardStatProps) {
  return (
    <Card className="bg-muted ring-0">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{value}</CardTitle>
        <CardDescription className="text-muted-foreground font-normal">
          {title}
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
