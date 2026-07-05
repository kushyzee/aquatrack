import { getCycles } from "@/features/cycles/data";
import CycleCard from "./CycleCard";
import NoCycles from "./NoCycles";

export default async function CyclesList() {
  const cycles = await getCycles();

  if (cycles.length === 0) {
    return <NoCycles />;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cycles.map((cycle) => (
        <CycleCard key={cycle.cycle_id} cycle={cycle} />
      ))}
    </div>
  );
}
