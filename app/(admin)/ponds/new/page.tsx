import BackButton from "@/components/BackButton";
import CardWrapper from "@/components/CardWrapper";
import NewPondForm from "@/features/ponds/components/NewPondForm";

export default function NewPondPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <BackButton href="/admin/ponds" />
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
