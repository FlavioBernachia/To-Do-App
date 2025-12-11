"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/../supabaseClient";
import { Task } from "@/types/task";
import { motion, AnimatePresence } from "framer-motion";
import WeekBarChart from "@/components/dashboard/week/weekBarChart";

// =====================================
// Helpers
// =====================================

function getLocalDateString(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function getNext7Days() {
  const today = new Date();
  const arr: { iso: string; label: string; number: number }[] = [];

  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(today.getDate() + i);

    arr.push({
      iso: getLocalDateString(d),
      label: d.toLocaleDateString("en-US", { weekday: "short" }),
      number: d.getDate(),
    });
  }

  return arr;
}

function formatHour(t: string | null | undefined) {
  if (!t) return "";
  return t.slice(0, 5);
}

// =====================================
// PAGE
// =====================================

export default function WeekPage() {
  const [tasksByDay, setTasksByDay] = useState<Record<string, Task[]>>({});
  const [expanded, setExpanded] = useState<string | null>(null);

  const days = getNext7Days();

  const todayIso = getLocalDateString(new Date());
  const todayIndex = days.findIndex((d) => d.iso === todayIso);

  useEffect(() => {
    const load = async () => {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) return;

      const start = days[0].iso;
      const end = days[6].iso;

      const { data } = await supabase
        .from("tasks")
        .select("*")
        .eq("user_id", auth.user.id)
        .gte("task_date", start)
        .lte("task_date", end)
        .order("task_date", { ascending: true })
        .order("start_time", { ascending: true });

      if (!data) return;

      const grouped: Record<string, Task[]> = {};

      data.forEach((t) => {
        if (!grouped[t.task_date]) grouped[t.task_date] = [];
        grouped[t.task_date].push(t as Task);
      });

      setTasksByDay(grouped);
    };

    load();
  }, [days]);

  const barCounts = days.map((d) => tasksByDay[d.iso]?.length || 0);
  const barLabels = days.map((d) => d.label);

  return (
    <div className="min-h-screen w-full px-6 pt-14 pb-28 flex flex-col gap-6">
      <h1 className="text-3xl font-semibold text-white mb-2">7 Days</h1>

      {/* 👉 Gráfico funcional */}
      <div className="relative z-50 pointer-events-none">
  <WeekBarChart
    counts={barCounts}
    labels={barLabels}
    currentIndex={todayIndex}
  />
</div>

      {/* 👉 Días expandibles */}
      <div className="space-y-4">
        {days.map((d) => {
          const isOpen = expanded === d.iso;
          const list = tasksByDay[d.iso] || [];

          return (
            <motion.div
              key={d.iso}
              className="bg-[#111] border border-[#222] rounded-2xl p-4"
            >
              <button
                className="flex items-center justify-between w-full"
                onClick={() => setExpanded(isOpen ? null : d.iso)}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      isOpen
                        ? "bg-purple-600 text-white"
                        : "bg-[#222] text-gray-300"
                    }`}
                  >
                    {d.label} {d.number}
                  </div>

                  <span className="text-gray-400 text-xs">
                    {list.length} task{list.length !== 1 ? "s" : ""}
                  </span>
                </div>

                <motion.span
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-gray-300"
                >
                  ▼
                </motion.span>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-4 space-y-3">
                      {list.map((t) => (
                        <div
                          key={t.id}
                          className="flex items-center justify-between bg-[#0d0d0d] border border-[#222] rounded-xl p-3"
                        >
                          <div className="flex flex-col">
                            <span className="text-white font-medium">
                              {t.text}
                            </span>

                            {t.tags[0] && (
                              <span className="mt-1 text-xs px-2 py-1 bg-purple-700 text-white rounded-md w-fit">
                                {t.tags[0]}
                              </span>
                            )}
                          </div>

                          <span className="text-gray-300 text-sm">
                            {formatHour(t.start_time)}
                          </span>
                        </div>
                      ))}

                      {list.length === 0 && (
                        <p className="text-gray-500 text-sm py-3 text-center">
                          No tasks for this day 🙂
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
