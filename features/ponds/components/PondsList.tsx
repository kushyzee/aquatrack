import PondCard from "./PondCard";
import { fetchPonds } from "../data";
import Link from "next/link";

export default async function PondsList() {
  const pondsData = await fetchPonds();
  console.log(pondsData);

  return (
    <div className="mt-6 grid grid-cols-1 gap-5">
      {pondsData.map((pond) => (
        <Link key={pond.id} href={`/ponds/${pond.code}`}>
          <PondCard pondData={pond} />
        </Link>
      ))}
    </div>
  );
}
