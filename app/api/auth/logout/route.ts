import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { getSessionOptions, type SessionData } from "@/lib/session";

/**
 * POST /api/auth/logout
 *
 * Détruit la session courante. Retourne toujours { ok: true }.
 */
export async function POST() {
  const session = await getIronSession<SessionData>(
    cookies(),
    getSessionOptions()
  );
  session.destroy();
  return NextResponse.json({ ok: true });
}
