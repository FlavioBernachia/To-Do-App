"use client";

import { useEffect, useState } from "react";

interface Task {
  id: string;
  text: string;
  start: string;
  end: string;
  tags: string[];
  note: string;
  completed: boolean; // ← AGREGADO
}

export default function DaySummary({
  morning,
  afternoon,
  night,
}: {
  morning: Task[];
  afternoon: Task[];
  night: Task[];
}) {
  const allTasks = [...morning, ...afternoon, ...night];

  // ⭐ AHORA SÍ contamos tareas completas
  const completed = allTasks.filter((t) => t.completed === true).length;
  const total = allTasks.length;

  const percentage =
    total > 0 ? Math.round((completed / total) * 100) : 0;

  const getMessage = () => {
    if (percentage === 0) return "Empecemos el día ✨";
    if (percentage < 30) return "Buen arranque 💪";
    if (percentage < 70) return "¡Vas muy bien! 🔥";
    if (percentage < 100) return "¡Ya casi! 🚀";
    return "¡Día completado! 🎉";
  };

  // ⭐ Para evitar hydration mismatch → la fecha se calcula en client-side
  const [today, setToday] = useState("");

  useEffect(() => {
    const d = new Date().toLocaleDateString("es-AR", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });

    // primera letra mayúscula
    setToday(d.charAt(0).toUpperCase() + d.slice(1));
  }, []);

  return (
    <div
      className="
        bg-[#111]/70 backdrop-blur-md 
        border border-gray-700 
        rounded-2xl p-5 mb-6 shadow-lg
      "
    >
      <h2 className="text-xl text-white font-semibold capitalize">
        Hoy • {today}
      </h2>

      {/* PROGRESO */}
      <p className="text-gray-300 text-sm mt-2">
        Progreso: {completed} / {total}
      </p>

      {/* BARRA */}
      <div className="w-full bg-gray-700 h-2 rounded-full mt-2">
        <div
          className="h-full bg-pink-500 rounded-full transition-all duration-300"
          style={{
            width: `${percentage}%`,
          }}
        ></div>
      </div>

      {/* MENSAJE */}
      <p className="text-gray-200 text-sm mt-3 italic">
        {getMessage()}
      </p>
    </div>
  );
}
