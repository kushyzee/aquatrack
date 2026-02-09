import { Button } from "@/components/ui/button";
import PondLoadingSkeleton from "@/features/ponds/components/PondLoadingSkeleton";
import PondsList from "@/features/ponds/components/PondsList";
import { Plus } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

export default function PondsPage() {
  return (
    <div>
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold">Ponds</h1>
          <p className="text-muted-foreground mt-1 max-w-36">
            Manage your fish ponds
          </p>
        </div>
        <Link href="/ponds/new">
          <Button size="lg">
            <Plus /> Create Pond
          </Button>
        </Link>
      </div>
      <Suspense fallback={<PondLoadingSkeleton />}>
        <PondsList />
      </Suspense>
    </div>
  );
}
