"use client";

import { useState } from "react";
import PlannerSlot from "@/components/onboarding/plannerSlot";

// misma estructura que PlannerSlot
interface Task {
  text: string;
  start: string;
  end: string;
  tags: string[];
  note: string;
}

export default function OnboardingPlannerPage() {
  const [morning, setMorning] = useState<Task[]>([]);
  const [afternoon, setAfternoon] = useState<Task[]>([]);
  const [night, setNight] = useState<Task[]>([]);
  const [replicate, setReplicate] = useState(false);

  const handleNext = () => {
    // 🔥 Acá eventualmente guardamos en supabase la planificación
    console.log("Mañana:", morning);
    console.log("Tarde:", afternoon);
    console.log("Noche:", night);
    console.log("Repetir próximos días:", replicate);

    window.location.href = "/dashboard/today"; // próxima pantalla
  };

  return (
    <div className="min-h-screen w-full flex flex-col px-6 pt-16">

      {/* TITULO */}
      <h1 className="text-3xl text-white font-semibold text-center">
        Planificá tu día
      </h1>

      <p className="text-center text-gray-300 mt-2">
        Organizá tus tareas por momentos del día.
      </p>

      {/* SLOTS: MAÑANA / TARDE / NOCHE */}
      <PlannerSlot
        label="Mañana"
        value={morning}
        onChange={setMorning}
      />

      <PlannerSlot
        label="Tarde"
        value={afternoon}
        onChange={setAfternoon}
      />

      <PlannerSlot
        label="Noche"
        value={night}
        onChange={setNight}
      />

      {/* SWITCH REPLICAR */}
      <div className="mt-10 flex justify-between items-center px-2">
        <span className="text-gray-300 text-lg">
          ¿Repetir estas tareas para los próximos días?
        </span>

        <button
          onClick={() => setReplicate(!replicate)}
          className={`w-16 h-8 rounded-full transition-all flex items-center 
             ${replicate ? "bg-pink-500" : "bg-gray-700"}`}
        >
          <div
            className={`
              w-7 h-7 rounded-full bg-white transition-all
              ${replicate ? "translate-x-8" : "translate-x-1"}
            `}
          ></div>
        </button>
      </div>

      {/* BOTÓN FINALIZAR */}
      <button
        onClick={handleNext}
        className="mt-auto mb-10 py-3 rounded-full text-lg font-semibold bg-pink-500 text-white"
      >
        Finalizar
      </button>

    </div>
  );
}
