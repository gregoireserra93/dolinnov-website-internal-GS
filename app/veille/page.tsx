import { Radar, Plus, ExternalLink } from "lucide-react";

export default function VeillePage() {
  // Placeholder de sources : à remplacer par un store réel (Airtable, fichier JSON, ou DB)
  const sources = [
    {
      nom: "Alnylam — pipeline",
      url: "https://www.alnylam.com/our-pipeline",
      categorie: "Concurrent",
    },
    {
      nom: "Ionis Pharmaceuticals",
      url: "https://www.ionispharma.com/medicines/",
      categorie: "Concurrent",
    },
    {
      nom: "ClinicalTrials.gov — Erythromelalgia",
      url: "https://clinicaltrials.gov/search?cond=Erythromelalgia",
      categorie: "Essais cliniques",
    },
    {
      nom: "PubMed — FXYD2",
      url: "https://pubmed.ncbi.nlm.nih.gov/?term=FXYD2",
      categorie: "Publications",
    },
    {
      nom: "EMA Orphan Designations",
      url: "https://www.ema.europa.eu/en/medicines/field_ema_web_categories%253Aname_field/Human/ema_group_types/ema_orphan",
      categorie: "Réglementaire",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <header className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            Veille concurrentielle
          </h1>
          <p className="text-dolinnov-gray-mid mt-1">
            Sources, alertes et synthèses sur les programmes ASO, douleur rare,
            FXYD2/Nav1.7.
          </p>
        </div>
        <button className="btn-primary" disabled>
          <Plus size={16} /> Ajouter une source
        </button>
      </header>

      {/* Bandeau "à construire" */}
      <div className="card mb-8 bg-dolinnov-black text-white border-0">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-dolinnov-green flex items-center justify-center text-dolinnov-black flex-shrink-0">
            <Radar size={20} />
          </div>
          <div>
            <h3 className="font-semibold mb-1">Module à construire</h3>
            <p className="text-sm text-white/70 leading-relaxed">
              Étapes suggérées (à demander à Claude Code) :
            </p>
            <ul className="text-sm text-white/70 mt-2 space-y-1 list-disc list-inside">
              <li>
                Stockage des sources (Airtable table <code>Sources</code> ou JSON local)
              </li>
              <li>Cron / Vercel Cron pour fetch quotidien (RSS, ClinicalTrials, PubMed)</li>
              <li>Synthèse automatique via API Anthropic (claude-sonnet-4-7)</li>
              <li>Tagging : concurrents, cibles BD, KOLs, réglementaire</li>
              <li>Email digest hebdomadaire vers gregoire@dolinnov.com</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Sources placeholder */}
      <h2 className="text-sm font-medium uppercase tracking-wider text-dolinnov-gray-mid mb-4">
        Sources suivies (exemples)
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {sources.map((s) => (
          <a
            key={s.url}
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            className="card flex items-start justify-between gap-4 group"
          >
            <div className="min-w-0">
              <p className="font-medium truncate">{s.nom}</p>
              <p className="text-xs text-dolinnov-gray-mid truncate mt-0.5">
                {s.url}
              </p>
              <span className="inline-block text-[10px] font-medium uppercase tracking-wider bg-dolinnov-gray text-dolinnov-black-soft px-2 py-1 rounded-full mt-2">
                {s.categorie}
              </span>
            </div>
            <ExternalLink
              size={16}
              className="text-dolinnov-gray-mid group-hover:text-dolinnov-black transition-colors flex-shrink-0 mt-1"
            />
          </a>
        ))}
      </div>
    </div>
  );
}
