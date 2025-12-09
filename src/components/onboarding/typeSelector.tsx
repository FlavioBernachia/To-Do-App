"use client";

import { useState } from "react";

const OPTIONS = [
  { id: "personal", label: "Personal", color: "#A3E4D7" },
  { id: "work", label: "Trabajo", color: "#F9E79F" },
  { id: "event", label: "Evento", color: "#F5B7B1" },
];

export default function TypeSelector({ onSelect }: { onSelect: (value: string) => void }) {
  const [selected, setSelected] = useState("");

  return (
    <div className="grid grid-cols-1 gap-4 px-6 mt-10">
      {OPTIONS.map((opt) => (
        <button
          key={opt.id}
          onClick={() => {
            setSelected(opt.id);
            onSelect(opt.id);
          }}
          className={`
            w-full py-4 rounded-2xl text-lg font-medium transition-all 
            border-2
            ${selected === opt.id 
              ? "border-pink-400 scale-[1.02] shadow-md" 
              : "border-gray-500 opacity-70"
            }
          `}
          style={{
            backgroundColor: selected === opt.id ? opt.color : "#1a1a1a",
            color: selected === opt.id ? "#000" : "#FFF",
          }}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
