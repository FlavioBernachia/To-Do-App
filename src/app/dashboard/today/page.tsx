"use client";

import { useEffect, useState } from "react";
import { Task } from "@/types/task";
import TaskCard from "@/components/dashboard/taskCard";
import DaySummary from "@/components/dashboard/daysummary";
import QuickAddButton from "@/components/dashboard/quickAddButton";
import QuickAddModal from "@/components/dashboard/quickAddModal";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { supabase } from "@/../supabaseClient";
import EditTaskModal from "@/components/dashboard/editTaskModal";
import Top3Card from "@/components/dashboard/topTask";


// helpers
function classifyTime(time?: string | null) {
  if (!time) return "morning";
  const hour = Number(time.split(":")[0]);

  if (hour >= 5 && hour < 12) return "morning";
  if (hour >= 12 && hour < 19) return "afternoon";
  return "night";
}

function normalizeDay(day: string) {
  return day
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

// fecha local REAL sin romper timezone
function getLocalToday() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

// letras tipo L M X J...
const letterToDay: Record<string, string> = {
  l: "lunes",
  m: "martes",
  x: "miércoles",
  j: "jueves",
  v: "viernes",
  s: "sábado",
  d: "domingo",
};

// inglés como el que tenés en Supabase
const engToEsDay: Record<string, string> = {
  mon: "lunes",
  tue: "martes",
  wed: "miércoles",
  thu: "jueves",
  fri: "viernes",
  sat: "sábado",
  sun: "domingo",
};

// fila tal como viene de supabase
type DbTaskRow = {
  id: string;
  user_id: string;
  text: string;
  start_time: string | null;
  end_time: string | null;
  tags: string[] | null;
  note: string | null;
  priority: string | null;
  completed: boolean | null;
  task_date: string;
};

// mapeo → tu tipo Task
function mapRowToTask(row: DbTaskRow): Task {
  return {
    id: row.id,
    user_id: row.user_id,
    text: row.text,
    start: row.start_time ?? "",
    end: row.end_time ?? "",
    start_time: row.start_time,
    end_time: row.end_time,
    tags: row.tags ?? [],
    note: row.note ?? "",
    priority: (row.priority as Task["priority"]) ?? "medio",
    completed: row.completed ?? false,
    task_date: row.task_date,
  };
}

// para ordenar por prioridad en el Top 3
const priorityScore: Record<Task["priority"], number> = {
  alta: 3,
  medio: 2,
  baja: 1,
};

export default function TodayPage() {
  const [morning, setMorning] = useState<Task[]>([]);
  const [afternoon, setAfternoon] = useState<Task[]>([]);
  const [night, setNight] = useState<Task[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [userName, setUserName] = useState<string>("");

  const today = getLocalToday();


  // LOAD TASKS + GENERAR DESDE PLAN

  useEffect(() => {
    const load = async () => {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) return;

      const userId = auth.user.id;

      // nombre para el saludo
      const metaName = (auth.user.user_metadata as any)?.name;
      const emailName = auth.user.email?.split("@")[0];
      setUserName(metaName || emailName || "Flavio");

      // 1️⃣ TAREAS DE HOY YA EXISTENTES
      const { data: todayRows } = await supabase
        .from("tasks")
        .select("*")
        .eq("user_id", userId)
        .eq("task_date", today);

      if (todayRows && todayRows.length > 0) {
        const mapped = (todayRows as DbTaskRow[]).map(mapRowToTask);
        classifyAndSet(mapped);
        return;
      }

      // 2️⃣ PLAN MÁS RECIENTE
      const { data: planList, error: planError } = await supabase
        .from("plans")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(1);

      if (planError || !planList || planList.length === 0) {
        console.log("No hay plan guardado todavía");
        return;
      }

      const plan = planList[0];

      // 3️⃣ LÓGICA DE DÍAS — FIX COMPLETO
      const todayDate = new Date();
      const todayName = normalizeDay(
        todayDate.toLocaleDateString("es-AR", { weekday: "long" })
      );

      // convertimos inglés, letras y español → español limpio
      let planDays = (plan.days || []).map((d: string) => {
        const lower = d.toLowerCase();

        if (engToEsDay[lower]) return normalizeDay(engToEsDay[lower]);
        if (letterToDay[lower]) return normalizeDay(letterToDay[lower]);
        return normalizeDay(lower);
      });

      const shouldGenerate = planDays.includes(todayName);

      if (!shouldGenerate) {
        classifyAndSet([]);
        return;
      }

      // 4️⃣ GENERAR TAREAS A PARTIR DEL PLAN
      type InsertTaskPayload = {
        user_id: string;
        text: string;
        start_time: string | null;
        end_time: string | null;
        tags: string[];
        note: string;
        priority: string;
        completed: boolean;
        task_date: string;
      };

      const generated: InsertTaskPayload[] = [];

      const pushBlock = (block: any[] | null, defaultStart: string) => {
        (block || []).forEach((t) => {
          const start = t.start || defaultStart;
          const end = t.end || null;

          generated.push({
            user_id: userId,
            text: t.text,
            start_time: start,
            end_time: end,
            tags: t.tags || [],
            note: t.note || "",
            priority: t.priority || "medio",
            completed: false,
            task_date: today,
          });
        });
      };

      pushBlock(plan.morning, "08:00");
      pushBlock(plan.afternoon, "14:00");
      pushBlock(plan.night, "20:00");

      if (generated.length === 0) {
        classifyAndSet([]);
        return;
      }

      // 5️⃣ INSERTAR EN SUPABASE
      const { data: inserted, error: insertError } = await supabase
        .from("tasks")
        .insert(generated)
        .select("*");

      if (insertError) {
        console.log("Error insertando tasks generadas:", insertError);
        return;
      }

      const mappedInserted = (inserted as DbTaskRow[]).map(mapRowToTask);
      classifyAndSet(mappedInserted);
    };

    load();
  }, [today]);

  // CLASIFICAR Y SETEAR ESTADO
  const classifyAndSet = (tasks: Task[]) => {
    const m: Task[] = [];
    const a: Task[] = [];
    const n: Task[] = [];

    tasks.forEach((t) => {
      const section = classifyTime(t.start_time);
      if (section === "morning") m.push(t);
      else if (section === "afternoon") a.push(t);
      else n.push(t);
    });

    setMorning(m);
    setAfternoon(a);
    setNight(n);
  };

  // BUSCADOR

  const matchesSearch = (task: Task) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      task.text.toLowerCase().includes(q) ||
      task.note.toLowerCase().includes(q) ||
      task.tags.some((tag) => tag.toLowerCase().includes(q))
    );
  };


  // TOP 3 (prioridad primero)

  const allTasks = [...morning, ...afternoon, ...night].filter(matchesSearch);

  const top3 = [...allTasks]
    .sort((a, b) => {
      const scoreA = priorityScore[a.priority];
      const scoreB = priorityScore[b.priority];

      if (scoreA !== scoreB) return scoreB - scoreA; // alta > medio > baja

      const timeA = a.start || "";
      const timeB = b.start || "";
      return timeA.localeCompare(timeB);
    })
    .slice(0, 3);


  // COMPLETAR

  const toggleComplete = async (task: Task) => {
    const updated = !task.completed;

    await supabase.from("tasks").update({ completed: updated }).eq("id", task.id);

    const updateList = (list: Task[], setter: any) =>
      setter(list.map((t) => (t.id === task.id ? { ...t, completed: updated } : t)));

    updateList(morning, setMorning);
    updateList(afternoon, setAfternoon);
    updateList(night, setNight);
  };


  // ELIMINAR

  const deleteTask = async (id: string) => {
    await supabase.from("tasks").delete().eq("id", id);

    setMorning(morning.filter((t) => t.id !== id));
    setAfternoon(afternoon.filter((t) => t.id !== id));
    setNight(night.filter((t) => t.id !== id));
  };


  // DRAG & DROP

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return;

    const getSection = (id: string) => {
      if (id === "morning") return { list: morning, setter: setMorning };
      if (id === "afternoon") return { list: afternoon, setter: setAfternoon };
      return { list: night, setter: setNight };
    };

    const { source, destination } = result;

    const src = getSection(source.droppableId);
    const dst = getSection(destination.droppableId);

    const newSource = [...src.list];
    const [moved] = newSource.splice(source.index, 1);

    if (source.droppableId === destination.droppableId) {
      newSource.splice(destination.index, 0, moved);
      src.setter(newSource);
      return;
    }

    const newDest = [...dst.list];
    newDest.splice(destination.index, 0, moved);

    src.setter(newSource);
    dst.setter(newDest);

    let newStart = "08:00";
    if (destination.droppableId === "afternoon") newStart = "14:00";
    if (destination.droppableId === "night") newStart = "20:00";

    await supabase.from("tasks").update({ start_time: newStart }).eq("id", moved.id);
  };


  // RENDER SECCIÓN (Mañana / Tarde / Noche)

  const renderSection = (title: string, id: string, list: Task[]) => (
    <section className="mb-8">
      <h2 className="text-lg text-gray-200 font-semibold mb-3">{title}</h2>

      <Droppable droppableId={id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`
              min-h-[80px] p-3 rounded-2xl border border-[#222]
              bg-[#0e0e0e]/80
              ${snapshot.isDraggingOver ? "ring-1 ring-pink-500/50" : ""}
            `}
          >
            {list.filter(matchesSearch).length === 0 && (
              <p className="text-gray-500 text-sm text-center py-3">
                No hay tareas en esta sección
              </p>
            )}

            {list.map((task, i) => {
              if (!matchesSearch(task)) return null;

              return (
                <Draggable key={task.id} draggableId={task.id} index={i}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`
                        mb-3
                        ${snapshot.isDragging ? "scale-[1.02]" : ""}
                      `}
                    >
                      <TaskCard
                        task={task}
                        onDelete={() => deleteTask(task.id)}
                        onToggleComplete={() => toggleComplete(task)}
                        onEdit={() => setEditingTask(task)}
                      />
                    </div>
                  )}
                </Draggable>
              );
            })}

            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </section>
  );


  // UI

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="min-h-screen w-full px-6 pt-14 pb-28 space-y-5">
        {/* Greeting */}
        <div className="mt-1">
          <p className="text-sm text-gray-400">Good morning</p>
          <h1 className="text-3xl font-semibold text-white">
            {userName || "Flavio"}
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Así se ve tu día hoy ✨
          </p>
        </div>

        {/* Resumen del día (tu componente actual) */}
        <DaySummary morning={morning} afternoon={afternoon} night={night} />

        {/* Top 3 */}
        <section className="bg-[#111]/90 border border-[#222] rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-white font-semibold text-lg">Top 3</h2>
            <span className="text-xs text-gray-400">Basado en prioridad</span>
          </div>

          {top3.length === 0 ? (
            <p className="text-gray-500 text-sm">
              No hay tareas destacadas para hoy.
            </p>
          ) : (
            <div className="space-y-3">
              {top3.map((task) => (
                <Top3Card key={task.id} task={task} />
              ))}
            </div>
          )}
        </section>

        {/* Buscador */}
        <input
          className="w-full px-4 py-3 rounded-2xl bg-[#101010] border border-[#333] text-white text-sm focus:outline-none focus:border-pink-500 transition"
          placeholder="Buscar tareas por nombre, nota o hashtag..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {/* Secciones */}
        {renderSection("Morning", "morning", morning)}
        {renderSection("Afternoon", "afternoon", afternoon)}
        {renderSection("Night", "night", night)}

        {/* Botón flotante + Quick Add */}
        <QuickAddButton onClick={() => setShowQuickAdd(true)} />
        {showQuickAdd && <QuickAddModal onClose={() => setShowQuickAdd(false)} />}

        {editingTask && (
          <EditTaskModal
            task={editingTask}
            onClose={() => setEditingTask(null)}
            onSave={() => window.location.reload()}
          />
        )}
      </div>
    </DragDropContext>
  );
}
