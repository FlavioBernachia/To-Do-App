"use client";

import { useEffect } from "react";
import { supabase } from "@/../supabaseClient";

export default function CallbackPage() {
  useEffect(() => {
    const handleSession = async () => {
      const { data } = await supabase.auth.getSession();

      const session = data.session;
      if (!session) return;

      const user = session.user;

      await supabase.from("users").upsert({
        id: user.id,
        email: user.email,
        name: user.user_metadata.full_name?.split(" ")[0] || "",
        lastname: user.user_metadata.full_name?.split(" ")[1] || "",
      });

      window.location.href = "/dashboard/today";
    };

    handleSession();
  }, []);

  return <div className="text-white p-6">Iniciando sesión...</div>;
}
