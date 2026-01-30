import Analytics from "@/features/dashboard/components/Analytics";
import AttentionRequired from "@/features/dashboard/components/AttentionRequired";

export default function Page() {
  return (
    <div>
      <Analytics />
      <div className="mt-7 space-y-7">
        <AttentionRequired />
      </div>
    </div>
  );
}
