"use client";
import { useSwipeable } from "react-swipeable";
import { useState } from "react";

interface Task {
  text: string;
  start: string;
  end: string;
  tags: string[];
  note: string;
  priority: string;
}

export default function TaskCard({

  task,
  onComplete,
  onDelete
}: {
  task: Task;
  onComplete: () => void;
  onDelete: any;
}) {
  const [done, setDone] = useState(false);

  const handleComplete = () => {
    setDone(!done);
    onComplete();
  };
  const handlers = useSwipeable({
    onSwipedLeft: () => onDelete(),
    onSwipedRight: () => onComplete(),
  });
  return (
    <div {...handlers}
      className={`
        relative bg-[#111] border border-gray-700 rounded-2xl p-4 mb-3 
        transition-all
        ${done ? "opacity-50 scale-[0.97]" : "opacity-100"}
      `}
    >
      {/* CHECK + TITULO */}
      <div className="flex items-start gap-3">
        <button
          onClick={handleComplete}
          className={`
            w-6 h-6 rounded-full border 
            flex items-center justify-center
            ${done ? "bg-pink-500 border-pink-500" : "border-gray-500"}
          `}
        >
          {done ? "✔" : ""}
        </button>

        <div className="flex-1">
          <h3
            className={`
              text-lg font-semibold 
              ${done ? "line-through text-gray-400" : "text-white"}
            `}
          >
            {task.text}
          </h3>

          {/* HORARIO */}
          {(task.start || task.end) && (
            <p className="text-gray-400 text-sm mt-1">
              {task.start} - {task.end}
            </p>
          )}

          {/* NOTA */}
          {task.note && (
            <p className="text-gray-300 text-sm mt-2 italic">{task.note}</p>
          )}

{task.priority && (
  <span
    className={`
      px-2 py-1 rounded-lg text-xs text-black font-semibold
      ${task.priority === "alta" ? "bg-red-500" : ""}
      ${task.priority === "medio" ? "bg-yellow-500" : ""}
      ${task.priority === "baja" ? "bg-green-500" : ""}
    `}
  >
    {task.priority}
  </span>
)}
          {/* TAGS */}
          {task.tags.length > 0 && (
            <div className="flex gap-2 mt-2 flex-wrap">
              {task.tags.map((tag, i) => (
                <span
                  key={i}
                  className="px-2 py-1 bg-pink-600 rounded-lg text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* OPCIONES */}
      {!done && (
        <button className="text-pink-400 text-sm mt-3">
          Mover a mañana
        </button>
      )}
    </div>
  );
}
