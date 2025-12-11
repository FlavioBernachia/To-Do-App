
"use client";
import BottomNav from "@/components/dashboard/bottomNav";
import UserMenu from "@/components/dashboard/userMenu";
import { useEffect } from "react";
import { supabase } from "@/../supabaseClient";
import { useRouter, usePathname } from "next/navigation";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkUser = async () => {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) {
        router.push("/login");
        return;
      }

      // No volver a redirigir si ya está en onboarding
      if (pathname.startsWith("/onboarding")) return;

      // Buscar si tiene un plan
      const { data: plans } = await supabase
        .from("plans")
        .select("id")
        .eq("user_id", auth.user.id)
        .limit(1);

      // Si NO tiene plan → es usuario nuevo
      if (!plans || plans.length === 0) {
        router.push("/onboarding/type");
        return;
      }
    };

    checkUser();
  }, [pathname]);

  return (
    <div className="min-h-screen w-full relative">
      {/* HEADER */}
      <div className="w-full px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-white"></h1>
        <UserMenu />
      </div>

      {children}

      <BottomNav />
    </div>
  );
}
