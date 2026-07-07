import PondCard from "./PondCard";
import { getPondsWithCycleStatus } from "../data";
import Link from "next/link";

export default async function PondsList() {
  const pondsData = await getPondsWithCycleStatus({ activeOnly: false });

  return (
    <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
      {pondsData.map((pond) => (
        <Link key={pond.id} href={`/ponds/${pond.id}`}>
          <PondCard
            name={pond.name}
            species={pond.species}
            status={pond.status}
            type={pond.type}
          />
        </Link>
      ))}
    </div>
  );
}
