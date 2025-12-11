"use client";
import { motion } from "framer-motion";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { Task } from "@/types/task";

export default function TaskCard({
  task,
  onDelete,
  onToggleComplete,
  onEdit,
}: {
  task: Task;
  onDelete: () => void;
  onToggleComplete: () => void;
  onEdit: () => void;
}) {
  const priorityColor = {
    alta: "text-red-400 bg-red-400/10",
    medio: "text-yellow-400 bg-yellow-400/10",
    baja: "text-green-400 bg-green-400/10",
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="
        relative w-full 
        bg-[#151515] rounded-2xl 
        p-4 shadow-[0_0_12px_rgba(0,0,0,0.35)]
        border border-[#2c2c2c]
      "
    >
      <div className="flex items-start gap-3">

        {/* CHECK (iOS style) */}
        <button
          onClick={onToggleComplete}
          className={`
            min-w-[26px] min-h-[26px] rounded-full flex items-center justify-center
            border transition
            ${task.completed 
              ? "bg-pink-500 border-pink-500 text-white" 
              : "border-gray-500 bg-transparent"
            }
          `}
        >
          {task.completed ? "✔" : ""}
        </button>

        {/* CONTENT */}
        <div className="flex-1">
          {/* TÍTULO */}
          <h3
            className={`
              font-semibold text-[17px] leading-tight
              ${task.completed ? "line-through text-gray-500" : "text-white"}
            `}
          >
            {task.text}
          </h3>

          {/* Prioridad */}
          <span
            className={`
              inline-flex items-center gap-1 px-2 py-1 mt-2 rounded-lg text-xs font-medium
              ${priorityColor[task.priority]}
            `}
          >
            <span className="inline-block w-[7px] h-[7px] rounded-full bg-current"></span>
            {task.priority === "alta" && "High Priority"}
            {task.priority === "medio" && "Medium"}
            {task.priority === "baja" && "Low"}
          </span>

          {/* HORARIO */}
          {(task.start || task.end) && (
            <p className="text-gray-400 text-sm mt-2">
              {task.start} — {task.end}
            </p>
          )}

          {/* NOTA */}
          {task.note && (
            <p className="text-gray-400 text-sm mt-2 leading-snug">
              {task.note}
            </p>
          )}

          {/* TAGS */}
          {task.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {task.tags.map((tag, i) => (
                <span
                  key={i}
                  className="px-2 py-1 rounded-lg bg-pink-600/20 text-pink-400 text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* BOTONES */}
        <div className="flex flex-col gap-2 ml-2">

          <button
            onClick={onEdit}
            className="
              w-9 h-9 flex items-center justify-center rounded-full
              bg-[#222] border border-gray-600 text-gray-300
              hover:bg-pink-600 hover:text-white hover:border-pink-600
              transition
            "
          >
            <FiEdit2 size={16} />
          </button>

          <button
            onClick={onDelete}
            className="
              w-9 h-9 flex items-center justify-center rounded-full
              bg-[#222] border border-gray-600 text-gray-300
              hover:bg-red-600 hover:text-white hover:border-red-600
              transition
            "
          >
            <FiTrash2 size={16} />
          </button>
        </div>

      </div>
    </motion.div>
  );
}
