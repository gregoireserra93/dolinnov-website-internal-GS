import { NextResponse, type NextRequest } from "next/server";
import { getIronSession } from "iron-session";
import { getSessionOptions, type SessionData } from "@/lib/session";

/**
 * Middleware d'authentification.
 *
 * - Si non authentifié + route protégée → redirect /login
 * - Si authentifié + visite /login        → redirect /
 *
 * Les exclusions (assets, /login, routes auth) sont déclarées dans `matcher`.
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next();

  const session = await getIronSession<SessionData>(
    request,
    response,
    getSessionOptions()
  );
  const isAuthenticated = session.isAuthenticated === true;

  if (pathname === "/login") {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return response;
  }

  if (!isAuthenticated) {
    const url = new URL("/login", request.url);
    return NextResponse.redirect(url);
  }

  return response;
}

/**
 * Routes exclues :
 *   - /api/auth/*      (login / logout)
 *   - /_next/*         (assets Next.js)
 *   - /favicon.ico, /icon.svg
 *   - tout fichier statique avec une extension (images, polices, etc.)
 *
 * /login est intercepté par le middleware (pour rediriger si déjà auth)
 * mais autorisé dans la logique ci-dessus.
 */
export const config = {
  matcher: [
    "/((?!api/auth|_next/static|_next/image|favicon.ico|icon.svg|.*\\.[\\w]+$).*)",
  ],
};
