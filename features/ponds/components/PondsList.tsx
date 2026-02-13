import PondCard from "./PondCard";
import { fetchPonds } from "../data";
import Link from "next/link";

export default async function PondsList() {
  const pondsData = await fetchPonds();

  return (
    <div className="mt-6 grid grid-cols-1 gap-5">
      {pondsData.map((pond) => (
        <Link key={pond.id} href={`/ponds/${pond.id}`}>
          <PondCard
            id={pond.id}
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
