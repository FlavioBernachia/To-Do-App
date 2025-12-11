"use client";

import { useState } from "react";
import { supabase } from "@/../supabaseClient";

export default function QuickAddModal({ onClose }: { onClose: () => void }) {
  const [text, setText] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [tags, setTags] = useState("");
  const [note, setNote] = useState("");
  const [priority, setPriority] = useState("medio");

  const save = async () => {
    if (!text.trim()) return;

    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) {
      alert("Debes iniciar sesión.");
      return;
    }

    const parsedTags = tags
      .split(" ")
      .filter((t) => t.startsWith("#"))
      .map((t) => t.trim());

      const today = new Date().toISOString().split("T")[0]; // yyyy-mm-dd

      const { error } = await supabase.from("tasks").insert({
        user_id: auth.user.id,
        text,
        start_time: start || null,
        end_time: end || null,
        tags: parsedTags,
        note,
        priority,
        completed: false,
        task_date: today
      });
      

    if (error) {
      console.log(error);
      alert("Error al guardar la tarea");
      return;
    }

    onClose();
    window.location.reload();
  };

  return (
    <div className="
      fixed inset-0 bg-black/70 backdrop-blur-sm 
      flex items-center justify-center
      z-50
    ">
      <div className="bg-[#111] border border-gray-700 rounded-2xl p-6 w-[90%] max-w-sm">
        <h2 className="text-white text-xl font-semibold mb-4">
          Nueva tarea
        </h2>

        {/* Nombre */}
        <input
          type="text"
          placeholder="Nombre"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full mb-3 px-3 py-2 rounded-xl bg-[#1a1a1a] border border-gray-600 text-white outline-none"
        />

        {/* Hora */}
        <div className="flex gap-3 mb-3">
          <input
            type="time"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            className="flex-1 px-3 py-2 rounded-xl bg-[#1a1a1a] border border-gray-600 text-white outline-none"
          />
          <input
            type="time"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
            className="flex-1 px-3 py-2 rounded-xl bg-[#1a1a1a] border border-gray-600 text-white outline-none"
          />
        </div>

        {/* Prioridad */}
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="w-full mb-3 px-3 py-2 rounded-xl bg-[#1a1a1a] border border-gray-600 text-white outline-none"
        >
          <option value="alta">Alta</option>
          <option value="medio">Media</option>
          <option value="baja">Baja</option>
        </select>

        {/* Tags */}
        <input
          type="text"
          placeholder="#hashtags"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="w-full mb-3 px-3 py-2 rounded-xl bg-[#1a1a1a] border border-gray-600 text-white outline-none"
        />

        {/* Nota */}
        <textarea
          placeholder="Nota..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="w-full mb-4 px-3 py-2 rounded-xl bg-[#1a1a1a] border border-gray-600 text-white outline-none resize-none h-20"
        />

        {/* Guardar */}
        <button
          onClick={save}
          className="w-full bg-pink-500 text-white py-3 rounded-xl font-semibold"
        >
          Guardar
        </button>

        <button
          onClick={onClose}
          className="w-full text-gray-400 text-sm mt-3"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
