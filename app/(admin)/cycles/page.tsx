import PageWrapper from "@/components/PageWrapper";
import CyclesList from "@/features/cycles/components/CyclesList";

export default function CyclesPage() {
  return (
    <PageWrapper
      title="Production Cycles"
      description="Track fish batches."
      buttonText="New Cycle"
      link="/cycles/new"
    >
      <CyclesList />
    </PageWrapper>
  );
}
