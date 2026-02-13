import BackButton from "@/components/BackButton";
import PondCard from "@/features/ponds/components/PondCard";
import { getPondStockSummary } from "@/features/ponds/data";
import PondCardStat from "@/features/ponds/PondCardStat";

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
        type="Earthen Pond"
        species="Catfish"
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
          <PondCardStat
            title="Initial Stock"
            value={data?.initial_fish_count || 0}
          />
          <PondCardStat
            title="Initial Stock"
            value={data?.initial_fish_count || 0}
          />
        </div>
      </PondCard>
    </div>
  );
}
