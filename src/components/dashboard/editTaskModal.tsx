"use client";

import { useState } from "react";
import { supabase } from "@/../supabaseClient";

export default function EditTaskModal({
  task,
  onClose,
  onSave,
}: {
  task: any;
  onClose: () => void;
  onSave: (updated: any) => void;
}) {
  const [text, setText] = useState(task.text);
  const [start, setStart] = useState(task.start);      
  const [end, setEnd] = useState(task.end);            
  const [note, setNote] = useState(task.note);
  const [priority, setPriority] = useState(task.priority);
  const [tags, setTags] = useState(task.tags.join(" "));

  const handleSave = async () => {
    const parsedTags = tags
      .split(" ")
      .filter((t: string) => t.startsWith("#"))
      .map((t: string) => t.trim());

    const { error } = await supabase
      .from("tasks")
      .update({
        text,
        start_time: start,      // DB -> start_time
        end_time: end,
        note,
        priority,
        tags: parsedTags,
      })
      .eq("id", task.id);

    if (error) {
      console.log(error);
      alert("Error al editar tarea");
      return;
    }

    // 🔥 Devolver el Task con las claves que el frontend usa
    onSave({
      ...task,
      text,
      start,                    // FRONT -> start
      end,
      note,
      priority,
      tags: parsedTags,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur flex items-center justify-center z-50">
      <div className="bg-[#111] border border-gray-700 p-6 rounded-2xl w-[90%] max-w-sm">
        <h2 className="text-white text-xl font-semibold mb-4">
          Editar tarea
        </h2>

        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Nombre"
          className="w-full px-3 py-2 rounded-xl bg-[#1a1a1a] border border-gray-600 text-white mb-3"
        />

        <div className="flex gap-3 mb-3">
          <input
            type="time"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            className="flex-1 px-3 py-2 rounded-xl bg-[#1a1a1a] border border-gray-600 text-white"
          />
          <input
            type="time"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
            className="flex-1 px-3 py-2 rounded-xl bg-[#1a1a1a] border border-gray-600 text-white"
          />
        </div>

        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="w-full mb-3 px-3 py-2 rounded-xl bg-[#1a1a1a] border border-gray-600 text-white"
        >
          <option value="alta">Alta</option>
          <option value="medio">Media</option>
          <option value="baja">Baja</option>
        </select>

        <input
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="#tags"
          className="w-full px-3 py-2 rounded-xl bg-[#1a1a1a] border border-gray-600 text-white mb-3"
        />

        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Nota..."
          className="w-full px-3 py-2 rounded-xl bg-[#1a1a1a] border border-gray-600 text-white h-20 mb-4"
        />

        <button
          onClick={handleSave}
          className="w-full bg-pink-500 text-white py-3 rounded-xl font-semibold"
        >
          Guardar cambios
        </button>

        <button
          onClick={onClose}
          className="mt-3 text-gray-400 w-full text-center"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
