import { SidebarProvider } from "@/components/ui/sidebar";
import Header from "@/features/layout/components/Header";
import AppSidebar from "@/features/layout/components/AppSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="w-full p-5">
        <Header />
        <main className="mt-7">{children}</main>
      </div>
    </SidebarProvider>
  );
}
