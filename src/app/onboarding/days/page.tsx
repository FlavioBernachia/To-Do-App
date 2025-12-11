"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import DaySelector from "@/components/onboarding/daySelector";

export default function OnboardingDaysPage() {
  const router = useRouter();

  const [days, setDays] = useState<string[]>([]);
  const [repeatMonth, setRepeatMonth] = useState(false);

  const handleNext = () => {
    if (days.length === 0) return;

    localStorage.setItem(
      "planner-onboarding-days",
      JSON.stringify({ days, repeatMonth })
    );

    router.push("/onboarding/planner");
  };

  return (
    <div className="min-h-screen w-full flex flex-col px-6 pt-20">
      <h1 className="text-3xl text-white font-semibold text-center">
        ¿Qué días querés usar esta lista?
      </h1>

      <p className="text-center text-gray-300 mt-2 mb-6">
        Seleccioná los días en los que querés aplicar tu plan.
      </p>

      <DaySelector onChange={(v) => setDays(v)} />

      <div className="mt-12 flex justify-between items-center px-3">
        <span className="text-gray-300 text-lg">¿Repetir para todo el mes?</span>

        <button
          onClick={() => setRepeatMonth(!repeatMonth)}
          className={`w-16 h-8 rounded-full transition-all flex items-center ${
            repeatMonth ? "bg-pink-500" : "bg-gray-700"
          }`}
        >
          <div
            className={`w-7 h-7 rounded-full bg-white transition-all ${
              repeatMonth ? "translate-x-8" : "translate-x-1"
            }`}
          />
        </button>
      </div>

      <button
        onClick={handleNext}
        disabled={days.length === 0}
        className={`mt-auto mb-10 py-3 rounded-full text-lg font-semibold transition-all ${
          days.length > 0
            ? "bg-pink-500 text-white"
            : "bg-gray-700 text-gray-400 opacity-40"
        }`}
      >
        Continuar
      </button>
    </div>
  );
}
