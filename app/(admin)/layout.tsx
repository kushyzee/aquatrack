import { SidebarProvider } from "@/components/ui/sidebar";
import Header from "@/features/layout/components/Header";
import AppSidebar from "@/features/layout/components/AppSidebar";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (!data) {
    return redirect("/login");
  }

  const user = {
    email: data?.claims.user_metadata?.email,
    name: data?.claims.user_metadata?.name,
  };

  console.log(user);

  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="w-full p-5">
        <Header userData={user} />
        <main className="mt-7">{children}</main>
      </div>
    </SidebarProvider>
  );
}
