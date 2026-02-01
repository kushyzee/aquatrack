"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Spinner } from "@/components/ui/spinner";
import { signOutAction } from "@/features/auth/actions";
import { navMenu } from "@/lib/constants";
import { ChevronDown, LogOut, User } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";

interface HeaderProps {
  userData: {
    email: string;
    name: string;
  };
}
export default function Header({ userData }: HeaderProps) {
  const [loading, setLoading] = useState(false);

  let pageTitle = usePathname();

  navMenu.map((item) => {
    if (pageTitle === item.href) {
      pageTitle = item.name;
    }
  });

  const handleLogout = async () => {
    setLoading(true);
    await signOutAction();
    setLoading(false);
  };

  return (
    <header className="mb-4 flex items-center justify-between rounded-md bg-white px-4 py-3 shadow-md">
      <div className="flex items-center gap-3">
        <SidebarTrigger />
        <h1 className="font-bold">{pageTitle}</h1>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <div className="flex items-center gap-1">
            <User className="size-4" />
            <ChevronDown className="size-4" />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          sideOffset={18}
          side="bottom"
          alignOffset={-15}
          className="w-auto"
        >
          <DropdownMenuGroup>
            <DropdownMenuLabel>{userData?.name || "User"}</DropdownMenuLabel>
            <DropdownMenuItem>
              {userData?.email || "user@example.com"}
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="focus:bg-red-400 focus:text-white"
            onClick={handleLogout}
            disabled={loading}
            closeOnClick={false}
            nativeButton={true}
            render={
              <Button
                size="sm"
                className="w-full bg-red-500 text-xs font-normal text-red-50"
              >
                {loading ? (
                  <>
                    <Spinner /> Logging out...
                  </>
                ) : (
                  <>
                    Logout <LogOut />
                  </>
                )}
              </Button>
            }
          ></DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
