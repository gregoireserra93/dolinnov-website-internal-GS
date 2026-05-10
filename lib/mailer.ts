import nodemailer from "nodemailer";

/**
 * Client SMTP pour envoyer des emails depuis l'outil interne.
 *
 * Variables d'environnement requises :
 * - SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, SMTP_FROM
 *
 * Recommandation : pour Gmail, utiliser un App Password
 * (https://myaccount.google.com/apppasswords) plutôt que le mot de passe principal.
 */

let cachedTransporter: nodemailer.Transporter | null = null;

export function getMailer(): nodemailer.Transporter {
  if (cachedTransporter) return cachedTransporter;

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD } = process.env;

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASSWORD) {
    throw new Error(
      "Configuration SMTP incomplète : vérifier SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD"
    );
  }

  cachedTransporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465, // true pour 465, false pour 587
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASSWORD,
    },
  });

  return cachedTransporter;
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

export async function sendEmail(params: SendEmailParams) {
  const mailer = getMailer();
  const from = process.env.SMTP_FROM || process.env.SMTP_USER;

  const info = await mailer.sendMail({
    from,
    to: params.to,
    cc: params.cc,
    bcc: params.bcc,
    replyTo: params.replyTo,
    subject: params.subject,
    text: params.text,
    html: params.html,
  });

  return {
    messageId: info.messageId,
    accepted: info.accepted,
    rejected: info.rejected,
  };
}
