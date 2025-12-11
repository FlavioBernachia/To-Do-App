"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/../supabaseClient";
import { motion } from "framer-motion";
import { FiSearch, FiMoreVertical, FiEdit2, FiTrash2, FiPlay } from "react-icons/fi";

interface Task {
  id: string;
  text: string;
  start_time: string | null;
  end_time: string | null;
  tags: string[];
  note: string;
  priority: "alta" | "medio" | "baja" | string;
  completed: boolean;
  task_date: string;
}

type TabId = "todo" | "in_progress" | "done";

const TABS = [
  { id: "todo", label: "To Do" },
  { id: "in_progress", label: "In Progress" },
  { id: "done", label: "Done" },
] as const;

export default function TasksPage() {
  const [tasksByDay, setTasksByDay] = useState<Record<string, Task[]>>({});
  const [activeTab, setActiveTab] = useState<TabId>("todo");
  const [search, setSearch] = useState("");
  const [menuTask, setMenuTask] = useState<Task | null>(null);


  // load task

  useEffect(() => {
    const load = async () => {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) return;

      const { data } = await supabase
        .from("tasks")
        .select("*")
        .eq("user_id", auth.user.id)
        .order("task_date", { ascending: true })
        .order("start_time", { ascending: true });

      if (!data) return;

      const groups: Record<string, Task[]> = {};

      data.forEach((task) => {
        const label = new Date(task.task_date + "T00:00:00").toLocaleDateString(
          "es-AR",
          { weekday: "long", day: "numeric", month: "short" }
        );

        if (!groups[label]) groups[label] = [];
        groups[label].push(task);
      });

      setTasksByDay(groups);
    };

    load();
  }, []);


  // FILTERS

  const filterByTab = (task: Task) => {
    if (activeTab === "todo") return !task.completed;
    if (activeTab === "done") return task.completed;
    if (activeTab === "in_progress") return !task.completed && !!task.start_time;
    return true;
  };

  const filterBySearch = (task: Task) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      task.text.toLowerCase().includes(q) ||
      (task.note?.toLowerCase().includes(q)) ||
      task.tags.some((t) => t.toLowerCase().includes(q))
    );
  };

  const sortTasks = (tasks: Task[]) => {
    const priorityWeight = { alta: 0, medio: 1, baja: 2 } as Record<string, number>;
    return [...tasks].sort((a, b) => {
      const aTime = a.start_time || "";
      const bTime = b.start_time || "";
      if (aTime !== bTime) return aTime.localeCompare(bTime);

      const aPr = priorityWeight[a.priority] ?? 3;
      const bPr = priorityWeight[b.priority] ?? 3;
      if (aPr !== bPr) return aPr - bPr;

      return a.text.localeCompare(b.text);
    });
  };


  // ACTIONS

  const toggleComplete = async (task: Task) => {
    const completed = !task.completed;

    setTasksByDay((prev) => {
      const copy: any = {};
      for (const [label, list] of Object.entries(prev)) {
        copy[label] = list.map((t) => (t.id === task.id ? { ...t, completed } : t));
      }
      return copy;
    });

    await supabase.from("tasks").update({ completed }).eq("id", task.id);
  };

  const moveToInProgress = async (task: Task) => {
    const now = new Date().toISOString().slice(11, 16);

    setTasksByDay((prev) => {
      const copy: any = {};
      for (const [label, list] of Object.entries(prev)) {
        copy[label] = list.map((t) =>
          t.id === task.id ? { ...t, start_time: now } : t
        );
      }
      return copy;
    });

    await supabase.from("tasks").update({ start_time: now }).eq("id", task.id);
  };

  const deleteTask = async (task: Task) => {
    await supabase.from("tasks").delete().eq("id", task.id);

    setTasksByDay((prev) => {
      const copy: any = {};
      for (const [label, list] of Object.entries(prev)) {
        copy[label] = list.filter((t) => t.id !== task.id);
      }
      return copy;
    });
  };


  // RENDER

  const dayEntries = Object.entries(tasksByDay);

  return (
    <div className="min-h-screen w-full px-5 pt-14 pb-28 bg-black">

      {/* HEADER */}
      <header className="mb-6">
        <h1 className="text-[32px] font-semibold text-white">Tasks</h1>

        {/* Search */}
        <div className="mt-4 flex items-center gap-2 bg-[#141414] border border-[#262626] rounded-2xl px-3 py-2">
          <FiSearch size={16} className="text-gray-500" />
          <input
            className="flex-1 bg-transparent outline-none text-sm text-gray-100"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Tabs */}
        <div className="mt-4 flex gap-6 border-b border-[#242424] text-xs">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-2 ${
                activeTab === tab.id
                  ? "text-white border-b-2 border-blue-500"
                  : "text-gray-500"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      {/* TASK LIST */}
      <main className="space-y-8">
        {dayEntries.map(([dayLabel, list]) => {
          const tasks = sortTasks(
            list.filter((t) => filterByTab(t) && filterBySearch(t))
          );

          if (tasks.length === 0) return null;

          return (
            <section key={dayLabel} className="space-y-3">
              <h2 className="text-gray-400 text-[13px] capitalize">{dayLabel}</h2>

              <div className="space-y-3">
                {tasks.map((task) => (
                  <motion.div
                    key={task.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start gap-3 p-2 rounded-xl"
                  >
                    {/* CÍRCULO */}
                    <button
                      onClick={() => toggleComplete(task)}
                      className={`
                        w-6 h-6 mt-1 rounded-full border flex items-center justify-center
                        ${
                          task.completed
                            ? "bg-blue-500 border-blue-500 text-white"
                            : "border-gray-600 text-transparent"
                        }
                      `}
                    >
                      ✓
                    </button>

                    {/* CONTENIDO */}
                    <div className="flex-1">
                      <p
                        className={`text-[15px] ${
                          task.completed
                            ? "line-through text-gray-500"
                            : "text-gray-100"
                        }`}
                      >
                        {task.text}
                      </p>

                      <div className="mt-1 flex flex-wrap gap-2 text-[11px] text-gray-500">
                        {task.start_time && <span>{task.start_time}</span>}
                        {task.tags.slice(0, 2).map((tag, i) => (
                          <span
                            key={i}
                            className="px-2 py-[2px] bg-[#1c1c1c] rounded-full text-gray-300"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {task.note && (
                        <p className="mt-1 text-[12px] text-gray-500">{task.note}</p>
                      )}
                    </div>

                    {/* BOTÓN ⋯ */}
                    <button
                      onClick={() => setMenuTask(task)}
                      className="w-8 h-8 flex items-center justify-center text-gray-400"
                    >
                      <FiMoreVertical size={18} />
                    </button>
                  </motion.div>
                ))}
              </div>
            </section>
          );
        })}
      </main>

      {/* SUBMENÚ */}
      {menuTask && (
        <div className="fixed inset-0 bg-black/70 flex items-end backdrop-blur-sm">
          <motion.div
            initial={{ y: 200 }}
            animate={{ y: -100 }}
            className="bg-[#111] w-full p-6 rounded-t-3xl space-y-4"
          >
            <h3 className="text-center text-white font-medium">{menuTask.text}</h3>

            <button
              onClick={() => {
                alert("Implementá el modal de edición acá");
                setMenuTask(null);
              }}
              className="w-full flex items-center gap-2 text-blue-400 py-3 border-b border-[#222]"
            >
              <FiEdit2 /> Edit Task
            </button>

            <button
              onClick={() => {
                moveToInProgress(menuTask);
                setMenuTask(null);
              }}
              className="w-full flex items-center gap-2 text-yellow-300 py-3 border-b border-[#222]"
            >
              <FiPlay /> Move to In Progress
            </button>

            <button
              onClick={() => {
                deleteTask(menuTask);
                setMenuTask(null);
              }}
              className="w-full flex items-center gap-2 text-red-400 py-3"
            >
              <FiTrash2 /> Delete Task
            </button>

            <button
              onClick={() => setMenuTask(null)}
              className="w-full text-gray-400 text-sm py-2"
            >
              Cancel
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}
