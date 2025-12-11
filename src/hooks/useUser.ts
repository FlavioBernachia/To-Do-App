"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/../supabaseClient";

export default function useUser() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const loadUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };

    loadUser();
  }, []);

  return user;
}
