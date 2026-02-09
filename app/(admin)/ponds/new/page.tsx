import CardWrapper from "@/components/CardWrapper";
import { Button } from "@/components/ui/button";
import NewPondForm from "@/features/ponds/components/NewPondForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewPondPage() {
  return (
    <div>
      <Link href="/ponds">
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground mb-4"
        >
          <ArrowLeft />
          Back
        </Button>
      </Link>
      <CardWrapper
        title="Create New Pond"
        description="Add a new pond to your farm"
      >
        <div>
          <NewPondForm />
        </div>
      </CardWrapper>
    </div>
  );
}
