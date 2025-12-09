"use client";

interface Props {
  onBack: () => void;
}

export default function LoginForm({ onBack }: Props) {
  return (
    <div className="animate-fadeIn">
      <h2 className="text-white text-2xl font-semibold mb-6 text-center">
        Iniciar sesión
      </h2>

      <input
        type="email"
        placeholder="Correo electrónico"
        className="w-full mb-4 px-4 py-3 rounded-xl bg-[#1a1a1a] text-white border border-gray-500 focus:border-pink-400 outline-none"
      />

      <input
        type="password"
        placeholder="Contraseña"
        className="w-full mb-6 px-4 py-3 rounded-xl bg-[#1a1a1a] text-white border border-gray-500 focus:border-pink-400 outline-none"
      />

      <button className="w-full bg-pink-500 text-white font-semibold py-3 rounded-full">
        Entrar
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
