import Analytics from "@/features/dashboard/components/Analytics";
import AttentionRequired from "@/features/dashboard/components/AttentionRequired";

export default function Page() {
  return (
    <div>
      <Analytics />
      <div>
        <AttentionRequired />
      </div>
    </div>
  );
}
