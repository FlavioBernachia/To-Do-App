"use client";

import { useEffect, useState } from "react";
import { FiChevronDown, FiLogOut } from "react-icons/fi";
import { supabase } from "@/../supabaseClient";

export default function UserMenu() {
  const [user, setUser] = useState<any>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setUser({
          name: data.user.user_metadata.name || "",
          lastname: data.user.user_metadata.lastname || "",
          email: data.user.email,
        });
      }
    };

    loadUser();
  }, []);

  if (!user) return null;

  return (
    <div className="relative">
      {/* BOTÓN DEL MENU */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] rounded-full border border-gray-700"
      >
        <span className="text-white font-medium">
          {user.name} {user.lastname}
        </span>
        <FiChevronDown className="text-white" />
      </button>

      {/* DROPDOWN */}
      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-[#111] border border-gray-700 rounded-xl shadow-lg z-50 p-2">
          
          <button
            onClick={async () => {
              await supabase.auth.signOut(); // logout real
              window.location.href = "/"; // volver al login
            }}
            className="flex items-center gap-2 w-full text-left px-3 py-2 rounded-lg hover:bg-red-600 hover:text-white text-gray-300 transition"
          >
            <FiLogOut />
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
}
