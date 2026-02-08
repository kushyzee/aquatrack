import CardWrapper from "@/components/CardWrapper";

export default function FeedUsage() {
  return (
    <CardWrapper
      title="Feed Usage (Last 7 days)"
      description="Total feed quantity in kg"
    >
      <p className="text-muted-foreground text-center text-base">
        Chart will be displayed here.
      </p>
    </CardWrapper>
  );
}
