import { PondCardProps } from "@/lib/types";
import PondCard from "./PondCard";

const pondsData: PondCardProps[] = [
  {
    id: "pond-1",
    name: "Pond 1",
    status: "active",
    type: "Earthen Pond",
    species: "Catfish",
  },
  {
    id: "pond-2",
    name: "Pond 2",
    status: "inactive",
    type: "Concrete Tank",
    species: null,
  },
  {
    id: "pond-3",
    name: "Pond 3",
    status: "active",
    type: "Plastic Tank",
    species: "Tilapia",
  },
  {
    id: "pond-4",
    name: "Pond 4",
    status: "inactive",
    type: "Concrete Tank",
    species: null,
  },
];

export default function PondsList() {
  return (
    <div className="mt-6 grid grid-cols-1 gap-5">
      {pondsData.map((pond) => (
        <PondCard key={pond.id} pondData={pond} />
      ))}
    </div>
  );
}
