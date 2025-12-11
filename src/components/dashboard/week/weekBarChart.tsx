"use client";

import { motion } from "framer-motion";

type Props = {
  counts: number[];
  labels: string[];
  currentIndex: number;
};

const MAX_BAR_HEIGHT = 100; // px

export default function WeekBarChart({ counts, labels, currentIndex }: Props) {
  const max = Math.max(...counts, 1); // evitar división por 0
  const hasAny = counts.some((c) => c > 0);

  return (
    <div className="w-full mt-4 mb-6 bg-[#111] border border-[#222] rounded-2xl p-5">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-white font-medium text-sm">Tasks by day</h3>

        {!hasAny && (
          <span className="text-[11px] text-gray-400">
            No tasks this week
          </span>
        )}
      </div>

      {/* Contenedor de las barras */}
      <div
        className="relative flex items-end justify-between gap-3 px-2"
        style={{ height: `${MAX_BAR_HEIGHT + 20}px`, overflow: "visible" }}
      >
        {counts.map((c, i) => {
          const ratio = max === 0 ? 0 : c / max; // 0..1
          const barHeight = ratio * MAX_BAR_HEIGHT;
          const isToday = i === currentIndex;

          return (
            <div
              key={i}
              className="flex flex-col items-center justify-end w-full gap-2"
            >
              {/* número encima */}
              <span className="text-[10px] text-gray-300 mb-1">{c}</span>

              {/* barra */}
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: barHeight }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                style={{ height: barHeight }}
                className={`w-5 md:w-6 rounded-xl ${
                  isToday
                    ? "bg-pink-500 shadow-[0_0_12px_rgba(255,0,150,0.7)]"
                    : "bg-cyan-400 shadow-[0_0_8px_rgba(0,255,255,0.4)]"
                }`}
              />

              {/* label del día */}
              <span
                className={`text-[10px] uppercase tracking-wide ${
                  isToday ? "text-pink-400 font-semibold" : "text-gray-400"
                }`}
              >
                {labels[i]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

