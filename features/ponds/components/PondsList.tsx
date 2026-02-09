import PondCard from "./PondCard";
import { fetchPonds } from "../data";

export default async function PondsList() {
  const pondsData = await fetchPonds();

  return (
    <div className="mt-6 grid grid-cols-1 gap-5">
      {pondsData.map((pond) => (
        <PondCard key={pond.id} pondData={pond} />
      ))}
    </div>
  );
}
