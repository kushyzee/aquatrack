import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";
import Header from "@/features/layout/components/Header";
import { navMenu } from "@/lib/constants";
import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarContent>
          <SidebarMenu className="p-4">
            {navMenu.map((item) => (
              <SidebarMenuItem key={item.name}>
                <Link href={item.href}>{item.name}</Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <div className="w-full p-5">
        <Header />
        {children}
      </div>
    </SidebarProvider>
  );
}
