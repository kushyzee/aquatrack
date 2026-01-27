import Image from "next/image";
import logo from "@/app/icon.svg";

export default function Logo({ isAuth }: { isAuth?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      {isAuth ? (
        <>
          <Image loading="eager" src={logo} alt="logo" className="h-8 w-8" />
          <p className="text-xl font-semibold">AquaTrack</p>
        </>
      ) : (
        <>
          <Image loading="eager" src={logo} alt="logo" className="w-9" />
          <p className="text-primary text-lg font-bold">AquaTrack</p>
        </>
      )}
    </div>
  );
}
