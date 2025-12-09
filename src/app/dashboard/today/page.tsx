"use client";

import { useEffect, useState, useMemo } from "react";
import TaskCard from "@/components/dashboard/taskCard";
import DaySummary from "@/components/dashboard/daysummary";
import QuickAddButton from "@/components/dashboard/quickAddButton";
import QuickAddModal from "@/components/dashboard/quickAddModal";

interface Task {
  text: string;
  start: string;
  end: string;
  tags: string[];
  note: string;
  priority: string;
}

export default function TodayPage() {
  const [morning, setMorning] = useState<Task[]>([]);
  const [afternoon, setAfternoon] = useState<Task[]>([]);
  const [night, setNight] = useState<Task[]>([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeTag, setActiveTag] = useState("");
  const [showQuickAdd, setShowQuickAdd] = useState(false);

  // cargar datos del onboarding (temporal)
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("planner-data") || "{}");
    setMorning(data.morning || []);
    setAfternoon(data.afternoon || []);
    setNight(data.night || []);
  }, []);

  // 🔍 juntar hashtags de todas las tareas
  const allTags = useMemo(() => {
    const tags = new Set<string>();

    [...morning, ...afternoon, ...night].forEach((task) => {
      task.tags.forEach((t) => tags.add(t));
    });

    return Array.from(tags);
  }, [morning, afternoon, night]);

  // 🔍 filtro combinado: texto + hashtag
  const filterTasks = (tasks: Task[]) => {
    return tasks.filter((task) => {
      const matchesSearch =
        task.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.note.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.tags.some((t) =>
          t.toLowerCase().includes(searchQuery.toLowerCase())
        );

      const matchesTag = activeTag
        ? task.tags.includes(activeTag)
        : true;

      return matchesSearch && matchesTag;
    });
  };

  const filteredMorning = filterTasks(morning);
  const filteredAfternoon = filterTasks(afternoon);
  const filteredNight = filterTasks(night);

  return (
    <div className="min-h-screen w-full px-6 pt-14 pb-28">
      
      {/* TÍTULO */}
      <h1 className="text-3xl text-white font-semibold text-center mb-4">
        Hoy
      </h1>
      <DaySummary
  morning={morning}
  afternoon={afternoon}
  night={night}
/>
      {/* 🔍 BUSCADOR */}
      <input
        type="text"
        placeholder="Buscar tareas..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="
          w-full px-4 py-3 rounded-xl mb-4
          bg-[#1a1a1a] text-white
          border border-gray-600 
          focus:border-pink-500 outline-none
        "
      />

      {/* 🔥 TAG FILTERS */}
      {allTags.length > 0 && (
        <div className="flex gap-2 flex-wrap mb-6">
          {allTags.map((tag, i) => (
            <button
              key={i}
              onClick={() => setActiveTag(activeTag === tag ? "" : tag)}
              className={`
                px-3 py-1 text-sm rounded-full border transition-all
                ${
                  activeTag === tag
                    ? "bg-pink-600 border-pink-600 text-white"
                    : "bg-[#111] border-gray-600 text-gray-300"
                }
              `}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {/* SECCIONES */}
      {filteredMorning.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl text-white font-semibold mb-3">Mañana</h2>
          {filteredMorning.map((task, i) => (
            <TaskCard key={i} task={task} onComplete={() => { } } onDelete={undefined} />
          ))}
        </section>
      )}

      {filteredAfternoon.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl text-white font-semibold mb-3">Tarde</h2>
          {filteredAfternoon.map((task, i) => (
            <TaskCard key={i} task={task} onComplete={() => { } } onDelete={undefined} />
          ))}
        </section>
      )}

      {filteredNight.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl text-white font-semibold mb-3">Noche</h2>
          {filteredNight.map((task, i) => (
            <TaskCard key={i} task={task} onComplete={() => { } } onDelete={undefined} />
          ))}
        </section>
      )}
<QuickAddButton onClick={() => setShowQuickAdd(true)} />

{showQuickAdd && (
  <QuickAddModal
    onClose={() => setShowQuickAdd(false)}
    onSave={(task) => {
      // por ahora todo se agrega a mañana
      setMorning((prev) => [...prev, task]);
    }}
  />) }
      {/* SIN RESULTADOS */}
      {filteredMorning.length +
        filteredAfternoon.length +
        filteredNight.length ===
        0 && (
        <p className="text-gray-400 text-center mt-20">
          No se encontraron tareas.
        </p>
      )}
    </div>
  );
}
