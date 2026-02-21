import BackButton from "@/components/BackButton";
import CardWrapper from "@/components/CardWrapper";
import NewLogForm from "@/features/daily-log/components/NewLogForm";
import { fetchPonds } from "@/features/ponds/data";

interface DerivedPondData {
  id: string;
  name: string;
  value: string;
}

export default async function DailyLogsPage({
  params,
}: {
  params: { slugId: string };
}) {
  const { slugId } = await params;

  const data = await fetchPonds();

  const ponds: DerivedPondData[] = data.map((pond) => ({
    id: pond.id,
    name: pond.name,
    value: pond.name.trim().replace(" ", "-"),
  }));

  const pondOptions = ponds.map((pond) => ({
    value: pond.value,
    label: pond.name,
    id: pond.id,
  }));

  const currentPond = ponds.find((pond) => pond.id === slugId);

  return (
    <div>
      {currentPond ? (
        <BackButton
          href={`/ponds/${slugId}`}
          text={`Back to ${currentPond?.name}`}
        />
      ) : (
        <BackButton href="/ponds" text="Back to Ponds" />
      )}
      <CardWrapper
        title="New Daily Log"
        description="Record daily pond observations and activities"
      >
        <div>
          <NewLogForm
            selectValue={currentPond?.value}
            pondId={slugId}
            pondOptions={pondOptions}
          />
        </div>
      </CardWrapper>
    </div>
  );
}
