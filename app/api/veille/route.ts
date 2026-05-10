import { NextResponse } from "next/server";

/**
 * GET /api/veille
 *
 * Placeholder. À implémenter selon la stratégie retenue :
 * - Fetch RSS / scraping (rss-parser, cheerio)
 * - Synthèse via API Anthropic
 * - Stockage Airtable (table "Veille") ou JSON local
 */
export async function GET() {
  return NextResponse.json({
    items: [],
    note: "Module veille à implémenter — voir CLAUDE.md pour les pistes.",
  });
}
