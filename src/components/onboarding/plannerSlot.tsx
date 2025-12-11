"use client";

import { useState } from "react";

interface Task {
  text: string;
  start: string;
  end: string;
  tags: string[];
  note: string;
  priority: "alta" | "medio" | "baja";
}

interface Props {
  morning: Task[];
  afternoon: Task[];
  night: Task[];
  onMorningChange: (list: Task[]) => void;
  onAfternoonChange: (list: Task[]) => void;
  onNightChange: (list: Task[]) => void;
}

export default function PlannerSlot({
  morning,
  afternoon,
  night,
  onMorningChange,
  onAfternoonChange,
  onNightChange,
}: Props) {
  const [section, setSection] = useState<"morning" | "afternoon" | "night">("morning");

  const [task, setTask] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [tags, setTags] = useState("");
  const [note, setNote] = useState("");
  const [priority, setPriority] = useState<Task["priority"]>("medio");

  const currentList =
    section === "morning" ? morning : section === "afternoon" ? afternoon : night;

  const currentSetter =
    section === "morning"
      ? onMorningChange
      : section === "afternoon"
      ? onAfternoonChange
      : onNightChange;

  const addTask = () => {
    if (!task.trim()) return;

    const newTask: Task = {
      text: task.trim(),
      start: start || "",
      end: end || "",
      tags: tags
        .split(" ")
        .filter((t) => t.startsWith("#"))
        .map((t) => t.trim()),
      note: note.trim(),
      priority,
    };

    currentSetter([...currentList, newTask]);

    setTask("");
    setStart("");
    setEnd("");
    setTags("");
    setNote("");
    setPriority("medio");
  };

  const deleteTask = (index: number) => {
    const updated = [...currentList];
    updated.splice(index, 1);
    currentSetter(updated);
  };

  const editTask = (index: number) => {
    const t = currentList[index];

    setTask(t.text);
    setStart(t.start);
    setEnd(t.end);
    setTags(t.tags.join(" "));
    setNote(t.note);
    setPriority(t.priority);

    const updated = [...currentList];
    updated.splice(index, 1);
    currentSetter(updated);
  };

  return (
    <div className="bg-[#111] border border-gray-700 rounded-2xl p-6 mt-6 shadow-xl">

      {/* Selector Mañana / Tarde / Noche */}
      <div className="flex justify-center gap-4 mb-6">
        {[
          { id: "morning", label: "Mañana" },
          { id: "afternoon", label: "Tarde" },
          { id: "night", label: "Noche" },
        ].map((opt) => (
          <button
            key={opt.id}
            onClick={() => setSection(opt.id as any)}
            className={`
              px-4 py-2 rounded-full text-sm font-semibold transition-all
              flex items-center gap-2
              ${
                section === opt.id
                  ? "bg-pink-500 text-white scale-110 shadow-lg"
                  : "bg-[#1a1a1a] text-gray-300 border border-gray-600 hover:bg-[#222]"
              }
            `}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Formulario */}
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Nombre de la tarea"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          className="w-full px-4 py-3 rounded-xl bg-[#1a1a1a] text-white border border-gray-600 focus:border-pink-500 transition"
        />

        {/* Horarios */}
        <div className="flex gap-4">
          <input
            type="time"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            className="flex-1 px-3 py-3 rounded-xl bg-[#1a1a1a] text-white border border-gray-600 focus:border-pink-500"
          />
          <input
            type="time"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
            className="flex-1 px-3 py-3 rounded-xl bg-[#1a1a1a] text-white border border-gray-600 focus:border-pink-500"
          />
        </div>

        {/* Tags */}
        <input
          type="text"
          placeholder="Hashtags (ej: #gym #trabajo)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="w-full px-4 py-3 rounded-xl bg-[#1a1a1a] text-white border border-gray-600 focus:border-pink-500"
        />

        {/* Nota */}
        <textarea
          placeholder="Nota o comentario..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="w-full h-24 px-4 py-3 rounded-xl bg-[#1a1a1a] text-white border border-gray-600 resize-none focus:border-pink-500"
        />

        {/* Selector de Prioridad FULL UX */}
        <div className="flex flex-col gap-2">
          <label className="text-gray-300 text-sm">Prioridad</label>

          <div className="flex gap-3">

            {/* Alta */}
            <button
              onClick={() => setPriority("alta")}
              className={`
                flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-semibold
                transition-all border
                ${
                  priority === "alta"
                    ? "bg-red-500 text-black border-transparent scale-105 shadow-md"
                    : "bg-[#1a1a1a] text-gray-300 border-gray-600 hover:bg-red-900/20"
                }
              `}
            >
              <span className="w-3 h-3 rounded-full bg-red-500"></span>
              Alta
            </button>

            {/* Media */}
            <button
              onClick={() => setPriority("medio")}
              className={`
                flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-semibold
                transition-all border
                ${
                  priority === "medio"
                    ? "bg-yellow-400 text-black border-transparent scale-105 shadow-md"
                    : "bg-[#1a1a1a] text-gray-300 border-gray-600 hover:bg-yellow-900/20"
                }
              `}
            >
              <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
              Media
            </button>

            {/* Baja */}
            <button
              onClick={() => setPriority("baja")}
              className={`
                flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-semibold
                transition-all border
                ${
                  priority === "baja"
                    ? "bg-green-500 text-black border-transparent scale-105 shadow-md"
                    : "bg-[#1a1a1a] text-gray-300 border-gray-600 hover:bg-green-900/20"
                }
              `}
            >
              <span className="w-3 h-3 rounded-full bg-green-500"></span>
              Baja
            </button>

          </div>
        </div>

        {/* Botón agregar */}
        <button
          onClick={addTask}
          className="w-full py-3 rounded-xl bg-pink-500 text-white font-semibold text-lg hover:bg-pink-600 transition"
        >
          Agregar tarea
        </button>
      </div>

      {/* Lista de tareas */}
      <ul className="space-y-4 mt-6">
        {currentList.map((t, i) => (
          <li
            key={i}
            className="bg-[#1a1a1a] border border-gray-700 rounded-xl p-4 text-white shadow-sm"
          >
            <div className="flex justify-between items-center">
              <span className="font-semibold text-lg">{t.text}</span>

              <span
                className={`px-3 py-1 rounded-lg text-xs font-bold text-black
                  ${t.priority === "alta" ? "bg-red-500" : ""}
                  ${t.priority === "medio" ? "bg-yellow-400" : ""}
                  ${t.priority === "baja" ? "bg-green-500" : ""}
                `}
              >
                {t.priority}
              </span>

              <div className="flex gap-3 ml-3">
                <button
                  onClick={() => editTask(i)}
                  className="text-yellow-400 text-sm hover:underline"
                >
                  Editar
                </button>
                <button
                  onClick={() => deleteTask(i)}
                  className="text-red-500 text-sm hover:underline"
                >
                  Eliminar
                </button>
              </div>
            </div>

            {(t.start || t.end) && (
              <p className="text-gray-400 text-sm mt-1">
                {t.start} - {t.end}
              </p>
            )}

            {t.note && (
              <p className="text-gray-400 text-sm italic mt-2">{t.note}</p>
            )}

            {t.tags.length > 0 && (
              <div className="flex gap-2 flex-wrap mt-2">
                {t.tags.map((tag, key) => (
                  <span
                    key={key}
                    className="px-2 py-1 bg-pink-600 rounded-lg text-xs"
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
