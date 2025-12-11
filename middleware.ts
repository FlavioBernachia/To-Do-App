// middleware.ts
import { NextRequest, NextResponse } from "next/server";

export function middleware(_req: NextRequest) {
  // No hacemos absolutamente nada, solo dejamos pasar la request
  return NextResponse.next();
}

// Si quieres, incluso puedes comentar el config:
// export const config = { matcher: ["/dashboard/:path*"] };
