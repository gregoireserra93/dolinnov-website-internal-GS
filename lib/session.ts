import type { SessionOptions } from "iron-session";

/**
 * Session iron-session pour l'auth simple par mot de passe.
 *
 * Variables d'environnement requises :
 * - SESSION_SECRET : ≥ 32 caractères. Générer avec `openssl rand -base64 32`.
 * - APP_PASSWORD   : utilisé par /api/auth/login.
 *
 * Ce module n'importe rien de `next/headers` pour rester compatible avec
 * le runtime Edge du middleware Next.js.
 */

export interface SessionData {
  isAuthenticated?: boolean;
}

export const SESSION_COOKIE_NAME = "dolinnov-session";

export function getSessionOptions(): SessionOptions {
  const password = process.env.SESSION_SECRET;
  if (!password || password.length < 32) {
    throw new Error(
      "SESSION_SECRET manquant ou trop court (32 caractères minimum). " +
        "Génère-en un avec : openssl rand -base64 32"
    );
  }

  return {
    cookieName: SESSION_COOKIE_NAME,
    password,
    cookieOptions: {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 30, // 30 jours
      path: "/",
    },
  };
}
