import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const pathname = req.nextUrl.pathname;

  // Cookies que usa Supabase Auth
  const token = req.cookies.get("sb-access-token")?.value;

  // Rutas protegidas
  const isProtected = pathname.startsWith("/dashboard");

  // Si intenta entrar a /dashboard y NO hay sesión → redirigir
  if (isProtected && !token) {
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// Definir qué rutas escucha
export const config = {
  matcher: [
    "/dashboard/:path*", // TODAS las páginas dentro de /dashboard
  ],
};
