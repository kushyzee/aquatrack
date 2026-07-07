import BackButton from "@/components/BackButton";
import CardWrapper from "@/components/CardWrapper";
import NewLogForm from "@/features/daily-log/components/NewLogForm";
import { getPondsWithCycleStatus } from "@/features/ponds/data";

export default async function DailyLogsPage({
  params,
}: {
  params: Promise<{ pondId: string }>;
}) {
  const { pondId } = await params;

  const pondOptions = await getPondsWithCycleStatus();
  const currentPond = pondOptions.find((pond) => pond.id === pondId);
  const backHref = currentPond ? `/ponds/${currentPond.id}` : "/ponds";

  return (
    <div className="mx-auto max-w-2xl">
      <BackButton
        href={backHref}
        text={currentPond ? `Back to ${currentPond.name}` : "Back to Ponds"}
      />

      <CardWrapper
        title="New Daily Log"
        description="Record daily pond observations and activities"
      >
        <NewLogForm
          preselectedPondId={currentPond?.id}
          backHref={backHref}
          pondOptions={pondOptions}
        />
      </CardWrapper>
    </div>
  );
}
