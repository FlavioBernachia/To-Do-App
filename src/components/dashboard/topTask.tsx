"use client";
import { motion } from "framer-motion";
import { Task } from "@/types/task";

export default function Top3Card({ task }: { task: Task }) {
  const priorityColor = {
    alta: "text-red-400",
    medio: "text-yellow-400",
    baja: "text-green-400",
  };
  const formatHour = (h?: string | null) => h ? h.slice(0, 5) : "";


  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="
        w-full rounded-xl bg-[#161616] 
        border border-[#292929]
        px-4 py-3
        flex justify-between items-center
        shadow-[0_0_8px_rgba(0,0,0,0.3)]
      "
    >
      {/* IZQUIERDA */}
      <div className="flex flex-col">
        <span className="text-white font-semibold text-[15px] leading-tight">
          {task.text.length > 25 ? task.text.slice(0, 25) + "..." : task.text}
        </span>

        <span
          className={`
            flex items-center gap-1 text-xs mt-1
            ${priorityColor[task.priority]}
          `}
        >
          <span className="inline-block w-[6px] h-[6px] rounded-full bg-current"></span>
          {task.priority === "alta" && "High Priority"}
          {task.priority === "medio" && "Medium"}
          {task.priority === "baja" && "Low"}
        </span>
      </div>

      {/* HORA */}
      {(task.start || task.end) && (
        <p className="text-gray-400 text-sm">
  {formatHour(task.start)} - {formatHour(task.end)}
</p>

      )}
    </motion.div>
  );
}
