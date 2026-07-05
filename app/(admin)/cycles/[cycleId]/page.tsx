import { notFound } from "next/navigation";
import BackButton from "@/components/BackButton";
import {
  getCycleById,
  getPondBreakdownForCycle,
  getTransfersForCycle,
} from "@/features/cycles/data";
import CycleDetailHeader from "@/features/cycles/components/CycleDetailHeader";
import CyclePondBreakdownTable from "@/features/cycles/components/CyclePondBreakdownTable";
import CycleTransferHistory from "@/features/cycles/components/CycleTransferHistory";

interface CycleDetailPageProps {
  params: Promise<{ cycleId: string }>;
}

export default async function CycleDetailPage({
  params,
}: CycleDetailPageProps) {
  const { cycleId } = await params;

  const [cycle, breakdown, transfers] = await Promise.all([
    getCycleById(cycleId),
    getPondBreakdownForCycle(cycleId),
    getTransfersForCycle(cycleId),
  ]);

  if (!cycle) notFound();

  return (
    <div>
      <BackButton href="/cycles" text="Back to Cycles" />
      <CycleDetailHeader cycle={cycle} />
      <div className="mt-8 space-y-8">
        <CyclePondBreakdownTable ponds={breakdown} />
        <CycleTransferHistory transfers={transfers} />
      </div>
    </div>
  );
}
