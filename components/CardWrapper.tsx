import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { LucideIcon } from "lucide-react";

interface CardWrapperProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  children: React.ReactNode;
}
export default function CardWrapper({
  title,
  description,
  icon: Icon,
  children,
}: CardWrapperProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          {Icon && <Icon className="text-destructive h-6 w-6" />}
          <CardTitle className="text-xl font-bold">{title}</CardTitle>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
