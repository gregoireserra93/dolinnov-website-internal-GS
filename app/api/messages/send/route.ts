import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/mailer";
import { logInteraction } from "@/lib/airtable";

/**
 * POST /api/messages/send
 *
 * Body JSON :
 * {
 *   contactId?: string,        // ID Airtable, pour logger l'interaction
 *   to: string | string[],     // destinataire(s)
 *   subject: string,
 *   body: string,              // texte ou HTML simple
 *   isHtml?: boolean,
 *   cc?: string | string[],
 *   bcc?: string | string[]
 * }
 */
export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const { contactId, to, subject, body, isHtml, cc, bcc } = payload;

    if (!to || !subject || !body) {
      return NextResponse.json(
        { error: "Champs requis : to, subject, body" },
        { status: 400 }
      );
    }

    const result = await sendEmail({
      to,
      cc,
      bcc,
      subject,
      ...(isHtml ? { html: body } : { text: body }),
    });

    // Logging Airtable optionnel
    if (contactId) {
      try {
        await logInteraction(contactId, {
          type: "email",
          sujet: subject,
          date: new Date().toISOString(),
        });
      } catch (e) {
        // On ne fait pas échouer l'envoi si le log Airtable échoue
        console.error("Échec log interaction Airtable :", e);
      }
    }

    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erreur inconnue";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
