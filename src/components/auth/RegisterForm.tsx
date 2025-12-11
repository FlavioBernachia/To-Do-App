"use client";

import { useState } from "react";
import { supabase } from "@/../supabaseClient";

interface Props {
  onBack: () => void;
}

export default function RegisterForm({ onBack }: Props) {
  const [name, setName] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const handleRegister = async () => {
    if (password !== confirm) {
      alert("Las contraseñas no coinciden");
      return;
    }

    // 1) Registrar en Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          lastname,
        },
      },
    });

    if (error) {
      alert(error.message);
      return;
    }

    const user = data.user;
    if (!user) return;

    // 2) Insertar / Actualizar en tabla "users"
    await supabase.from("users").upsert({
      id: user.id,
      email: user.email,
      name,
      lastname,
    });

    // 3) Redirigir
    window.location.href = "/dashboard/today";
  };

  return (
    <div className="animate-fadeIn">
      <h2 className="text-white text-2xl font-semibold mb-6 text-center">
        Registrarse
      </h2>

      <input
        type="text"
        placeholder="Nombre"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full mb-4 px-4 py-3 rounded-xl bg-[#1a1a1a] text-white border border-gray-500"
      />

      <input
        type="text"
        placeholder="Apellido"
        value={lastname}
        onChange={(e) => setLastname(e.target.value)}
        className="w-full mb-4 px-4 py-3 rounded-xl bg-[#1a1a1a] text-white border border-gray-500"
      />

      <input
        type="email"
        placeholder="Correo electrónico"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full mb-4 px-4 py-3 rounded-xl bg-[#1a1a1a] text-white border border-gray-500"
      />

      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full mb-4 px-4 py-3 rounded-xl bg-[#1a1a1a] text-white border border-gray-500"
      />

      <input
        type="password"
        placeholder="Confirmar contraseña"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        className="w-full mb-6 px-4 py-3 rounded-xl bg-[#1a1a1a] text-white border border-gray-500"
      />

      <button
        onClick={handleRegister}
        className="w-full bg-pink-500 text-white font-semibold py-3 rounded-full"
      >
        Crear cuenta
      </button>

      <button
        onClick={onBack}
        className="w-full text-gray-400 text-sm mt-4"
      >
        Volver
      </button>
    </div>
  );
}
