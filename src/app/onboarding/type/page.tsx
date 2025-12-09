"use client";

import { useState } from "react";
import TypeSelector from "@/components/onboarding/typeSelector";

export default function OnboardingTypePage() {
  const [selectedType, setSelectedType] = useState("");

  const handleNext = () => {
    if (selectedType) {
      // Redirigimos al STEP 2
      window.location.href = "/onboarding/days";
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col px-6 pt-20">

      {/* TÍTULO */}
      <h1 className="text-3xl text-white font-semibold text-center">
        ¿Cómo querés usar tu lista?
      </h1>

      {/* SUBTEXTO */}
      <p className="text-center text-gray-300 mt-2 mb-6">
        Elegí el propósito principal de tus tareas.
      </p>

      {/* SELECTOR */}
      <TypeSelector onSelect={(val) => setSelectedType(val)} />

      {/* BOTÓN CONTINUAR */}
      <button
        onClick={handleNext}
        disabled={!selectedType}
        className={`
          mt-auto mb-10 py-3 rounded-full text-lg font-semibold transition-all
          ${selectedType 
            ? "bg-pink-500 text-white" 
            : "bg-gray-700 text-gray-400 opacity-50"
          }
        `}
      >
        Continuar
      </button>
    </div>
  );
}
