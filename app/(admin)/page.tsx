import Analytics from "@/features/dashboard/components/Analytics";
import AttentionRequired from "@/features/dashboard/components/AttentionRequired";
import FeedUsage from "@/features/dashboard/components/FeedUsage";

export default function Page() {
  return (
    <div>
      <Analytics />
      <div className="mt-7 space-y-7">
        <AttentionRequired />
        <FeedUsage />
      </div>
    </div>
  );
}
