import { NextResponse, type NextRequest } from "next/server";
import { consumeLoginToken, startSession } from "@/lib/auth/session";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  const user = token ? await consumeLoginToken(token) : null;
  if (!user) return NextResponse.redirect(new URL("/entrar?erro=link", req.url));
  if (user.suspendedAt) return NextResponse.redirect(new URL("/conta-suspensa", req.url));

  await startSession(user.id);
  const next = user.ageConfirmedAt && user.termsAcceptedAt ? "/inicio" : "/confirmar-idade";
  return NextResponse.redirect(new URL(next, req.url));
}
