"use client";

import { useState } from "react";

const DAYS = [
  { id: "mon", label: "L" },
  { id: "tue", label: "M" },
  { id: "wed", label: "M" },
  { id: "thu", label: "J" },
  { id: "fri", label: "V" },
  { id: "sat", label: "S" },
  { id: "sun", label: "D" },
];

export default function DaySelector({ onChange }: { onChange: (v: string[]) => void }) {
  const [selected, setSelected] = useState<string[]>([]);

  const toggleDay = (dayId: string) => {
    let updated = selected.includes(dayId)
      ? selected.filter(d => d !== dayId)
      : [...selected, dayId];

    setSelected(updated);
    onChange(updated);
  };

  return (
    <div className="flex justify-center gap-3 mt-10">
      {DAYS.map((day) => (
        <button
          key={day.id}
          onClick={() => toggleDay(day.id)}
          className={`
            w-12 h-12 flex items-center justify-center rounded-full text-lg font-bold transition-all
            ${selected.includes(day.id)
              ? "bg-pink-500 text-white scale-110 shadow"
              : "bg-[#1a1a1a] text-gray-300 border border-gray-600"
            }
          `}
        >
          {day.label}
        </button>
      ))}
    </div>
  );
}
