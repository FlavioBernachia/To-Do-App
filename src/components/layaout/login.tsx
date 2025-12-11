"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import TypewriterLogin from "@/components/typerwritter";
import { supabase } from "@/../supabaseClient";


import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";

export default function LoginPage() {
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();

      if (data.session) {
        window.location.href = "/dashboard/today";
      }
    };

    checkSession();
  }, []);
  return (
    <div className="relative min-h-screen w-full overflow-hidden">

      {/* TYPEWRITER A PANTALLA COMPLETA */}
      <div className="absolute inset-0 z-0">
        <TypewriterLogin />
      </div>

      <div className="absolute -top-4 left-0 w-full h-6 z-0 rounded-t-3xl">
        <Image
          src="/background-to-do.png"
          alt="borde geometrico"
          fill
          className="object-cover"
        />
      </div>

      {/* CONTENEDOR animado */}
      <div
        className={`
          absolute left-0 w-full z-20 transition-transform duration-500 ease-out
          ${(showLoginForm || showRegisterForm) ? "translate-y-[-10%]" : "translate-y-0"}
        `}
        style={{ bottom: 0 }}
      >

        <div className="absolute -top-2 left-0 w-full h-6 z-0 rounded-t-3xl overflow-hidden">
          <Image
            src="/background-to-do.png"
            alt="borde geometrico"
            fill
            className="object-cover"
          />
        </div>

        {/* PANEL NEGRO */}
        <div className="relative bg-black rounded-t-3xl px-6 pt-10 pb-16">

          {/* BOTONES PRINCIPALES */}
          {!showLoginForm && !showRegisterForm && (
            <>
              <button
                onClick={async () => {
                  await supabase.auth.signInWithOAuth({
                    provider: "google",
                    options: {
                      redirectTo: "http://localhost:3000/auth/callback",
                    },
                  });
                }}
                className="w-full bg-white text-black font-medium py-3 rounded-full flex items-center justify-center gap-2 mb-4"
              >
                <Image alt="imagen de google" src="https://www.svgrepo.com/show/475656/google-color.svg" width={20} height={20} />
                Continuar con Google
              </button>

              <button
                className="w-full bg-gray-300 text-black font-medium py-3 rounded-full mb-4"
                onClick={() => setShowRegisterForm(true)}
              >
                Registrarse
              </button>


              <button
                onClick={() => setShowLoginForm(true)}
                className="w-full border border-gray-400 text-white font-medium py-3 rounded-full"
              >
                Iniciar sesión
              </button>
            </>
          )}

          {/* LOGIN */}
          {showLoginForm && !showRegisterForm && (
            <LoginForm onBack={() => setShowLoginForm(false)} />
          )}

          {/* REGISTER */}
          {showRegisterForm && !showLoginForm && (
            <RegisterForm onBack={() => setShowRegisterForm(false)} />
          )}

        </div>
      </div>
    </div>
  );
}
