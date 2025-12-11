"use client";

import { useEffect, useState } from "react";
import TaskCard from "@/components/dashboard/taskCard";
import { Task } from "@/types/task";


// FECHA LOCAL CORRECTA PARA EVITAR DESFASES
function getLocalDate() {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  return now.toISOString().split("T")[0];
}

export default function CalendarPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedDay, setSelectedDay] = useState<string>("");

  const todayStr = getLocalDate();
  const today = new Date(todayStr);

  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  // CARGAR TAREAS DESDE LOCALSTORAGE
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("planner-data") || "{}");

    const morning = data.morning || [];
    const afternoon = data.afternoon || [];
    const night = data.night || [];
    const quick = data.quick || [];

    const assigned: Task[] = [...morning, ...afternoon, ...night, ...quick].map(
      (t: any, i: number) => ({
        id: t.id ?? `local-${i}`,    
        text: t.text,
        start: t.start || "",
        end: t.end || "",
        tags: t.tags || [],
        note: t.note || "",
        priority: t.priority || "medio",
        completed: t.completed ?? false,
        task_date: todayStr,
      })
    );

    setTasks(assigned);
  }, []);

  // DIAS DEL MES
  const getDaysInMonth = (year: number, month: number) =>
    new Date(year, month + 1, 0).getDate();

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);

  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
  const firstDay = firstDayIndex === 0 ? 6 : firstDayIndex - 1;

  // TAREAS DEL DÍA SELECCIONADO
  const tasksForSelectedDay = selectedDay
    ? tasks.filter((t) => t.task_date === selectedDay)
    : [];

  // FECHA FORMATEADA
  const formatDay = (d: number) => {
    const monthStr = (currentMonth + 1).toString().padStart(2, "0");
    const dayStr = d.toString().padStart(2, "0");
    return `${currentYear}-${monthStr}-${dayStr}`;
  };

  const goPrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const goNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  return (
    <div className="min-h-screen w-full px-6 pt-14 pb-28 text-white">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <button onClick={goPrevMonth} className="text-gray-300 text-2xl">
          &lt;
        </button>

        <h1 className="text-2xl font-semibold capitalize">
          {new Date(currentYear, currentMonth).toLocaleDateString("es-AR", {
            month: "long",
            year: "numeric",
          })}
        </h1>

        <button onClick={goNextMonth} className="text-gray-300 text-2xl">
          &gt;
        </button>
      </div>

      {/* DÍAS DE LA SEMANA */}
      <div className="grid grid-cols-7 text-center text-gray-400 mb-2">
        <div>L</div>
        <div>M</div>
        <div>M</div>
        <div>J</div>
        <div>V</div>
        <div>S</div>
        <div>D</div>
      </div>

      {/* GRID DEL MES */}
      <div className="grid grid-cols-7 gap-2 text-center">
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={i}></div>
        ))}

        {Array.from({ length: daysInMonth }).map((_, i) => {
          const dayNum = i + 1;
          const key = formatDay(dayNum);

          const tasksThisDay = tasks.filter((t) => t.task_date === key);
          const isToday = key === todayStr;

          return (
            <button
              key={key}
              onClick={() => setSelectedDay(key)}
              className={`
                relative py-3 rounded-xl border
                ${
                  isToday
                    ? "border-yellow-500 bg-[#1a1a1a]"
                    : "border-gray-700 bg-[#111]"
                }
                ${selectedDay === key ? "outline outline-pink-500" : ""}
              `}
            >
              {dayNum}

              {tasksThisDay.length > 0 && (
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-pink-500 rounded-full"></span>
              )}
            </button>
          );
        })}
      </div>

      {/* LISTA DE TAREAS */}
      {selectedDay && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">
            Tareas del {selectedDay}
          </h2>

          {tasksForSelectedDay.length === 0 && (
            <p className="text-gray-400">No hay tareas.</p>
          )}

          {tasksForSelectedDay.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onToggleComplete={() => {}}
              onDelete={() => {}}
              onEdit={() => {}}
            />
          ))}
        </div>
      )}
    </div>
  );
}
