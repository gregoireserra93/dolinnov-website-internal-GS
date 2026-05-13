import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { getSessionOptions, type SessionData } from "@/lib/session";

/**
 * POST /api/auth/login
 *
 * Body JSON : { password: string }
 *
 * Réponses :
 *   200 { ok: true }
 *   400 { ok: false, error: "Mot de passe manquant." }
 *   401 { ok: false, error: "Mot de passe incorrect." }
 *   500 { ok: false, error: "APP_PASSWORD n'est pas configuré côté serveur." }
 */
export async function POST(request: Request) {
  const expected = process.env.APP_PASSWORD;
  if (!expected) {
    return NextResponse.json(
      { ok: false, error: "APP_PASSWORD n'est pas configuré côté serveur." },
      { status: 500 }
    );
  }

  let payload: { password?: unknown };
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Requête invalide." },
      { status: 400 }
    );
  }

  const submitted = payload?.password;
  if (typeof submitted !== "string" || submitted.length === 0) {
    return NextResponse.json(
      { ok: false, error: "Mot de passe manquant." },
      { status: 400 }
    );
  }

  if (submitted !== expected) {
    return NextResponse.json(
      { ok: false, error: "Mot de passe incorrect." },
      { status: 401 }
    );
  }

  const session = await getIronSession<SessionData>(
    cookies(),
    getSessionOptions()
  );
  session.isAuthenticated = true;
  await session.save();

  return NextResponse.json({ ok: true });
}
