"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { navMenu } from "@/lib/constants";
import { ChevronDown, User } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Header() {
  let pageTitle = usePathname();

  navMenu.map((item) => {
    if (pageTitle === item.href) {
      pageTitle = item.name;
    }
  });

  return (
    <div className="mb-4 flex items-center justify-between rounded-md bg-white px-4 py-3 shadow-md">
      <div className="flex items-center gap-3">
        <SidebarTrigger />
        <h1 className="font-bold">{pageTitle}</h1>
      </div>
      <div className="flex items-center gap-1">
        <User className="size-4" />
        <ChevronDown className="size-4" />
      </div>
    </div>
  );
}
