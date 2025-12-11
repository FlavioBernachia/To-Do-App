"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiHome, FiCalendar, FiList, FiClock } from "react-icons/fi";

export default function BottomNav() {
  const pathname = usePathname();

  const tabs = [
    { href: "/dashboard/today", label: "Hoy", icon: FiHome },
    { href: "/dashboard/week", label: "7 días", icon: FiClock },
    { href: "/dashboard/task", label: "Tareas", icon: FiList },
    { href: "/dashboard/calendar", label: "Calendario", icon: FiCalendar },
  ];

  return (
    <div
      className="
        fixed bottom-4 left-1/2 -translate-x-1/2
        w-[90%] max-w-md
        bg-[#111]/80 backdrop-blur-xl
        border border-gray-700
        rounded-3xl py-3 px-4
        flex items-center justify-between
        z-50 shadow-xl
      "
    >
      {tabs.map((tab, i) => {
        const active = pathname.startsWith(tab.href);
        const Icon = tab.icon;

        return (
          <Link
            key={i}
            href={tab.href}
            className="
              flex flex-col items-center justify-center
              flex-1 text-center
            "
          >
            <Icon
              size={22}
              className={active ? "text-pink-500" : "text-gray-400"}
            />
            <span
              className={`
                text-xs mt-1 transition
                ${active ? "text-pink-500 font-semibold" : "text-gray-400"}
              `}
            >
              {tab.label}
            </span>

            {/* Indicador */}
            {active && (
              <div className="mt-1 w-2 h-2 bg-pink-500 rounded-full"></div>
            )}
          </Link>
        );
      })}
    </div>
  );
}
