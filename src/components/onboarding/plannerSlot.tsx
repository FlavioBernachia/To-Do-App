"use client";

import { useState } from "react";

interface Task {
  text: string;
  start: string;
  end: string;
  tags: string[];
  note: string; // 🆕 NUEVO
}

interface Props {
  label: string;
  value: Task[];
  onChange: (list: Task[]) => void;
}

export default function PlannerSlot({ label, value, onChange }: Props) {
  const [task, setTask] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [tags, setTags] = useState("");
  const [note, setNote] = useState(""); // 🆕 NUEVO

  const addTask = () => {
    if (!task.trim()) return;

    const newTask: Task = {
      text: task,
      start: start || "",
      end: end || "",
      tags: tags
        .split(" ")
        .filter((t) => t.startsWith("#"))
        .map((t) => t.trim()),
      note: note.trim(), // 🆕
    };

    onChange([...value, newTask]);

    // limpiar inputs
    setTask("");
    setStart("");
    setEnd("");
    setTags("");
    setNote(""); // 🆕
  };

  return (
    <div className="bg-[#111] border border-gray-700 rounded-2xl p-4 mt-6">
      <h3 className="text-xl text-white font-semibold mb-4">{label}</h3>

      {/* NOMBRE */}
      <input
        type="text"
        placeholder="Nombre de la tarea"
        value={task}
        onChange={(e) => setTask(e.target.value)}
        className="w-full mb-3 px-3 py-2 rounded-xl bg-[#1a1a1a] text-white border border-gray-600 outline-none"
      />

      {/* HORARIOS */}
      <div className="flex gap-3 mb-3">
        <div className="flex flex-col flex-1">
          <label className="text-sm text-gray-300 mb-1">Inicio</label>
          <input
            type="time"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[#1a1a1a] text-white border border-gray-600 outline-none"
          />
        </div>

        <div className="flex flex-col flex-1">
          <label className="text-sm text-gray-300 mb-1">Fin</label>
          <input
            type="time"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[#1a1a1a] text-white border border-gray-600 outline-none"
          />
        </div>
      </div>

      {/* TAGS */}
      <input
        type="text"
        placeholder="Hashtags (ej: #gym #trabajo)"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        className="w-full mb-3 px-3 py-2 rounded-xl bg-[#1a1a1a] text-white border border-gray-600 outline-none"
      />

      {/* NOTA / COMENTARIO */}
      <textarea
        placeholder="Agregar nota o comentario..."
        value={note}
        onChange={(e) => setNote(e.target.value)}
        className="w-full mb-4 px-3 py-2 rounded-xl bg-[#1a1a1a] text-white border border-gray-600 outline-none h-20 resize-none"
      />

      {/* BOTÓN AGREGAR */}
      <button
        onClick={addTask}
        className="w-full py-2 rounded-xl bg-pink-500 text-white font-medium"
      >
        Agregar tarea
      </button>

      {/* LISTA DE TAREAS */}
      <ul className="space-y-3 mt-5">
        {value.map((t, i) => (
          <li
            key={i}
            className="bg-[#1a1a1a] border border-gray-600 rounded-xl p-3 text-white"
          >
            <div className="flex justify-between text-sm mb-1">
              <span className="font-semibold">{t.text}</span>

              {(t.start || t.end) && (
                <span className="text-gray-300">
                  {t.start} - {t.end}
                </span>
              )}
            </div>

            {/* NOTA */}
            {t.note && (
              <p className="text-gray-300 text-sm mt-2 italic">
                {t.note}
              </p>
            )}

            {/* TAGS */}
            {t.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {t.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-pink-600 text-xs rounded-lg"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
