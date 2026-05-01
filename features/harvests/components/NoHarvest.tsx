import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Container, Plus } from "lucide-react";
import Link from "next/link";

export default function NoHarvest() {
  return (
    <Card>
      <CardContent>
        <Empty>
          <EmptyHeader>
            <EmptyMedia>
              <Container
                strokeWidth={1}
                className="text-muted-foreground h-16 w-16"
              />
            </EmptyMedia>
            <EmptyTitle>No harvests yet</EmptyTitle>
            <EmptyDescription className="-mt-2">
              Record your first harvest
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Link href="/harvest/new">
              <Button size="lg">
                <Plus /> Add Harvest
              </Button>
            </Link>
          </EmptyContent>
        </Empty>
      </CardContent>
    </Card>
  );
}
