"use client";

import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { navMenu } from "@/lib/constants";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AppSidebar() {
  const { setOpenMobile } = useSidebar();
  const currentPage = usePathname();

  return (
    <Sidebar>
      <SidebarHeader className="mt-6 mb-10 px-4">
        <Logo />
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu className="w-full gap-3 px-4">
          {navMenu.map((item) => {
            const isActive = currentPage === item.href;
            const Icon = item.icon;

            return (
              <SidebarMenuItem key={item.name}>
                <Link href={item.href} onClick={() => setOpenMobile(false)}>
                  <Button
                    size="lg"
                    className={cn(
                      "text-muted-foreground hover:text-primary-foreground w-full justify-start bg-transparent",
                      {
                        "bg-primary text-primary-foreground": isActive,
                      },
                    )}
                  >
                    <Icon />
                    {item.name}
                  </Button>
                </Link>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
