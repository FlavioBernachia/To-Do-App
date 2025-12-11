"use client";

import { useState } from "react";
import { supabase } from "@/../supabaseClient";
import PlannerSlot from "@/components/onboarding/plannerSlot";

interface Task {
  text: string;
  start: string;
  end: string;
  tags: string[];
  note: string;
  priority: "alta" | "medio" | "baja";
}

/* ------------------------------------------
   HELPERS PARA FECHAS
------------------------------------------ */

// Mon → índice
const engDayToIndex: Record<string, number> = {
  mon: 0, tue: 1, wed: 2, thu: 3, fri: 4, sat: 5, sun: 6,
};

// Fechas del mes actual
function getDatesForMonth() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  const dates: string[] = [];
  const lastDay = new Date(year, month + 1, 0).getDate();

  for (let day = 1; day <= lastDay; day++) {
    const date = new Date(year, month, day);
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(day).padStart(2, "0");
    dates.push(`${y}-${m}-${d}`);
  }

  return dates;
}

// Generar todas las tareas del mes
function generateMonthlyTasks(
  selectedDays: string[],
  morning: Task[],
  afternoon: Task[],
  night: Task[],
  userId: string
) {
  const monthDates = getDatesForMonth();
  const targetDayIndexes = selectedDays.map((d) => engDayToIndex[d]);

  const final: any[] = [];

  monthDates.forEach((dateStr) => {
    const date = new Date(dateStr);
    let jsDay = date.getDay(); // 0 = domingo
    jsDay = jsDay === 0 ? 6 : jsDay - 1; // 0 = lunes

    if (!targetDayIndexes.includes(jsDay)) return;

    const pushBlock = (block: Task[], defaultStart: string) => {
      block.forEach((t) =>
        final.push({
          user_id: userId,
          text: t.text,
          start_time: t.start || defaultStart,
          end_time: t.end || null,
          tags: t.tags,
          note: t.note,
          priority: t.priority,
          completed: false,
          task_date: dateStr,
        })
      );
    };

    pushBlock(morning, "08:00");
    pushBlock(afternoon, "14:00");
    pushBlock(night, "20:00");
  });

  return final;
}

/* ------------------------------------------
   COMPONENTE PRINCIPAL
------------------------------------------ */

export default function OnboardingPlannerPage() {
  const [morning, setMorning] = useState<Task[]>([]);
  const [afternoon, setAfternoon] = useState<Task[]>([]);
  const [night, setNight] = useState<Task[]>([]);

  const handleNext = async () => {
    const typeData = JSON.parse(
      localStorage.getItem("planner-onboarding-type") || "{}"
    );

    const daysData = JSON.parse(
      localStorage.getItem("planner-onboarding-days") || "{}"
    );

    const selectedType = typeData.type || "";
    const selectedDays: string[] = daysData.days || [];
    const repeatMonth = daysData.repeatMonth || false;

    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) {
      alert("Debes iniciar sesión.");
      return;
    }

    const userId = auth.user.id;

    // 1) Guardar plan
    const { error: planError } = await supabase.from("plans").insert({
      user_id: userId,
      type: selectedType,
      days: selectedDays,
      repeat_month: repeatMonth,
      morning,
      afternoon,
      night,
    });

    if (planError) {
      console.log(planError);
      alert("Error al guardar tu planificación");
      return;
    }

    // 2) Generar tareas para el mes
    const tasks = generateMonthlyTasks(
      selectedDays,
      morning,
      afternoon,
      night,
      userId
    );

    if (tasks.length > 0) {
      const { error: insertError } = await supabase.from("tasks").insert(tasks);
      if (insertError) console.log(insertError);
    }

    // limpiar localstorage
    localStorage.removeItem("planner-onboarding-type");
    localStorage.removeItem("planner-onboarding-days");

    window.location.href = "/dashboard/today";
  };

  return (
    <div className="min-h-screen w-full flex flex-col px-6 pt-16">
      <h1 className="text-3xl text-white font-semibold text-center">
        Planificá tu día
      </h1>

      <p className="text-center text-gray-300 mt-2 mb-6">
        Organizá tus tareas por momentos del día.
      </p>

      <PlannerSlot
        morning={morning}
        afternoon={afternoon}
        night={night}
        onMorningChange={setMorning}
        onAfternoonChange={setAfternoon}
        onNightChange={setNight}
      />

      <button
        onClick={handleNext}
        className="
          mt-auto mb-10 py-3 rounded-full text-lg font-semibold
          bg-pink-500 text-white hover:bg-pink-600 transition
        "
      >
        Finalizar Plan
      </button>
    </div>
  );
}
