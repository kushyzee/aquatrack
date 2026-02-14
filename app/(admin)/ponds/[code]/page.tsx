import BackButton from "@/components/BackButton";
import { Button } from "@/components/ui/button";
import PondCard from "@/features/ponds/components/PondCard";
import PondDetailTab from "@/features/ponds/components/PondDetailTab";
import { getPondStockSummary } from "@/features/ponds/data";
import PondCardStat from "@/features/ponds/PondCardStat";
import { Container, Plus } from "lucide-react";
import Link from "next/link";

export default async function PondDetailPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;

  const data = await getPondStockSummary(code);

  console.log(data);

  return (
    <div>
      <BackButton href="/ponds" />
      <PondCard
        id={data?.id || "1"}
        name={data?.pond_name || "Unknown Pond"}
        status={data?.status || "inactive"}
        type={data?.type}
        species={data?.species}
        isPondDetailsPage={true}
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <PondCardStat
            title="Current Stock"
            value={data?.current_fish_count || 0}
          />
          <PondCardStat
            title="Initial Stock"
            value={data?.initial_fish_count || 0}
          />
          <PondCardStat title="Mortality" value={data?.total_mortality || 0} />
          <PondCardStat title="Harvested" value={data?.total_harvested || 0} />
        </div>
      </PondCard>

      <div className="mt-6 mb-7 flex flex-col gap-4">
        <Link href="/daily-logs">
          <Button className="w-full">
            <Plus data-icon="inline-start" /> Add Today&apos;s Log
          </Button>
        </Link>
        <Link href="/harvests">
          <Button className="w-full" variant="outline" data-icon="inline-start">
            <Container /> Add Harvest
          </Button>
        </Link>
      </div>
      <PondDetailTab pondId={code} />
    </div>
  );
}
