import PageWrapper from "@/components/PageWrapper";
import PondLoadingSkeleton from "@/features/ponds/components/PondLoadingSkeleton";
import PondsList from "@/features/ponds/components/PondsList";
import { Suspense } from "react";

export default function PondsPage() {
  return (
    <PageWrapper
      title="Ponds"
      description="Manage your fish ponds"
      link="/ponds/new"
      buttonText="Create Pond"
    >
      <Suspense fallback={<PondLoadingSkeleton />}>
        <PondsList />
      </Suspense>
    </PageWrapper>
  );
}
