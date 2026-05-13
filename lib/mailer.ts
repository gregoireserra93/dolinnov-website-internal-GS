import { Resend } from "resend";

/**
 * Client email pour l'outil interne (Resend).
 *
 * Variables d'environnement :
 * - RESEND_API_KEY  (obligatoire) — clé API Resend, voir https://resend.com
 * - RESEND_FROM     (optionnel)  — adresse expéditeur. Fallback "onboarding@resend.dev"
 *                                  (utile tant que le domaine dolinnov.com n'est pas
 *                                  vérifié dans le dashboard Resend).
 */

let cachedClient: Resend | null = null;

function getClient(): Resend {
  if (cachedClient) return cachedClient;

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error(
      "Configuration Resend incomplète : la variable RESEND_API_KEY est requise."
    );
  }

  cachedClient = new Resend(apiKey);
  return cachedClient;
}

export interface SendEmailParams {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
  cc?: string | string[];
  bcc?: string | string[];
  replyTo?: string;
}

export interface SendEmailResult {
  messageId: string;
  accepted: string[];
  rejected: string[];
}

function toArray(value: string | string[] | undefined): string[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

export async function sendEmail(
  params: SendEmailParams
): Promise<SendEmailResult> {
  const client = getClient();
  const from = process.env.RESEND_FROM || "onboarding@resend.dev";

  if (!params.text && !params.html) {
    throw new Error("Email vide : fournir au moins un champ `text` ou `html`.");
  }

  const recipients = toArray(params.to);

  const { data, error } = await client.emails.send({
    from,
    to: params.to,
    cc: params.cc,
    bcc: params.bcc,
    replyTo: params.replyTo,
    subject: params.subject,
    text: params.text,
    html: params.html,
  } as Parameters<typeof client.emails.send>[0]);

  if (error || !data) {
    const message = error?.message || "Erreur Resend inconnue";
    throw new Error(`Échec d'envoi via Resend : ${message}`);
  }

  return {
    messageId: data.id,
    accepted: recipients,
    rejected: [],
  };
}
