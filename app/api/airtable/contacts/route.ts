import { NextResponse } from "next/server";
import { listContacts } from "@/lib/airtable";

/**
 * GET /api/airtable/contacts
 *
 * Query params optionnels :
 * - filter   : filterByFormula Airtable (ex: "{Catégorie}='Investisseur'")
 * - max      : nombre max de résultats (défaut 100)
 * - view     : nom d'une vue Airtable
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const filter = searchParams.get("filter") || undefined;
    const view = searchParams.get("view") || undefined;
    const max = searchParams.get("max")
      ? Number(searchParams.get("max"))
      : undefined;

    const contacts = await listContacts({
      filterByFormula: filter,
      view,
      maxRecords: max,
    });

    return NextResponse.json({ contacts, count: contacts.length });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erreur inconnue";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
