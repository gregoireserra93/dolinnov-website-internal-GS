import { CheckCircle2, XCircle, Settings } from "lucide-react";

export default function ParametresPage() {
  // Vérification basique des variables d'environnement (côté serveur)
  const checks = [
    {
      label: "Airtable API Key",
      ok: !!process.env.AIRTABLE_API_KEY,
    },
    {
      label: "Airtable Base ID",
      ok: !!process.env.AIRTABLE_BASE_ID,
    },
    {
      label: "SMTP Host",
      ok: !!process.env.SMTP_HOST,
    },
    {
      label: "SMTP User",
      ok: !!process.env.SMTP_USER,
    },
    {
      label: "SMTP Password",
      ok: !!process.env.SMTP_PASSWORD,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">Paramètres</h1>
        <p className="text-dolinnov-gray-mid mt-1">
          État des connexions et identité Dolinnov.
        </p>
      </header>

      {/* État des connexions */}
      <section className="mb-8">
        <h2 className="text-sm font-medium uppercase tracking-wider text-dolinnov-gray-mid mb-4">
          Connexions
        </h2>
        <div className="card">
          <ul className="divide-y divide-black/5">
            {checks.map((c) => (
              <li
                key={c.label}
                className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
              >
                <span className="font-medium text-sm">{c.label}</span>
                {c.ok ? (
                  <span className="flex items-center gap-1.5 text-sm text-green-700">
                    <CheckCircle2 size={16} /> Configuré
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-sm text-red-600">
                    <XCircle size={16} /> Manquant
                  </span>
                )}
              </li>
            ))}
          </ul>
          <p className="text-xs text-dolinnov-gray-mid mt-4">
            Modifier <code>.env.local</code> puis redémarrer le serveur (
            <code>npm run dev</code>).
          </p>
        </div>
      </section>

      {/* Identité Dolinnov */}
      <section>
        <h2 className="text-sm font-medium uppercase tracking-wider text-dolinnov-gray-mid mb-4">
          Identité légale Dolinnov
        </h2>
        <div className="card">
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <Field label="Raison sociale" value="Dolinnov SAS" />
            <Field label="Date de création" value="17/10/2024" />
            <Field label="SIREN" value="934 473 190" />
            <Field label="SIRET (siège)" value="934 473 190 00015" />
            <Field label="TVA" value="FR78 934 473 190" />
            <Field label="NAF" value="71.12B" />
            <Field
              label="Siège social"
              value="418 rue du Mas de Verchant, 34000 Montpellier"
              full
            />
            <Field
              label="Comptabilité"
              value="comptabilite@dolinnov.com"
              full
            />
          </dl>
        </div>
      </section>
    </div>
  );
}

function Field({
  label,
  value,
  full,
}: {
  label: string;
  value: string;
  full?: boolean;
}) {
  return (
    <div className={full ? "md:col-span-2" : ""}>
      <dt className="text-xs uppercase tracking-wider text-dolinnov-gray-mid font-medium">
        {label}
      </dt>
      <dd className="font-medium mt-0.5">{value}</dd>
    </div>
  );
}
