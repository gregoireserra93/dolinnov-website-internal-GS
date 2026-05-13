import Link from "next/link";
import {
  Users,
  Radar,
  FlaskConical,
  ArrowUpRight,
  Mail,
  Building2,
} from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <header className="mb-12">
        <p className="text-sm text-dolinnov-gray-mid mb-2">
          {new Date().toLocaleDateString("fr-FR", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
        <h1 className="text-4xl font-semibold tracking-tight">
          Bonjour Grégoire 👋
        </h1>
        <p className="text-dolinnov-gray-mid mt-2">
          Aperçu de ton activité Dolinnov.
        </p>
      </header>

      {/* KPI rapides — placeholders, à brancher */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
        <KpiCard label="Contacts actifs" value="—" hint="À synchroniser Airtable" />
        <KpiCard label="Veille — alertes du jour" value="—" hint="À configurer" />
        <KpiCard label="Datasets scientifiques" value="—" hint="À configurer" />
      </section>

      {/* Modules principaux */}
      <section>
        <h2 className="text-sm font-medium uppercase tracking-wider text-dolinnov-gray-mid mb-4">
          Modules
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <ModuleCard
            href="/contacts"
            icon={<Users size={20} />}
            title="Contacts &amp; messages"
            description="Investisseurs, partenaires, KOLs. Synchro Airtable, envoi d'emails individuels ou ciblés."
            tag="Airtable + SMTP"
          />
          <ModuleCard
            href="/veille"
            icon={<Radar size={20} />}
            title="Veille concurrentielle"
            description="Suivi des programmes ASO/RNA, deals biotech rare disease, actualités KOLs FXYD2 / Nav1.7."
            tag="API + LLM"
          />
          <ModuleCard
            href="/data"
            icon={<FlaskConical size={20} />}
            title="Données scientifiques"
            description="Résultats Axolabs, données VENTEO/GRECO, suivi des batches L-ASO, bibliographie."
            tag="Stockage local"
          />
          <ModuleCard
            href="/parametres"
            icon={<Building2 size={20} />}
            title="Paramètres"
            description="Connexions API, modèles d'email, identité Dolinnov, exports."
            tag="Admin"
          />
        </div>
      </section>

      {/* Actions rapides */}
      <section className="mt-12">
        <h2 className="text-sm font-medium uppercase tracking-wider text-dolinnov-gray-mid mb-4">
          Actions rapides
        </h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/contacts?action=new-message" className="btn-primary">
            <Mail size={16} /> Nouveau message
          </Link>
          <Link href="/veille?action=new-source" className="btn-ghost">
            <Radar size={16} /> Ajouter une source de veille
          </Link>
        </div>
      </section>
    </div>
  );
}

function KpiCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="card">
      <p className="label-field">{label}</p>
      <p className="text-3xl font-semibold tracking-tight">{value}</p>
      <p className="text-xs text-dolinnov-gray-mid mt-2">{hint}</p>
    </div>
  );
}

function ModuleCard({
  href,
  icon,
  title,
  description,
  tag,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  tag: string;
}) {
  return (
    <Link href={href} className="card group block">
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-xl bg-dolinnov-green flex items-center justify-center text-dolinnov-black">
          {icon}
        </div>
        <ArrowUpRight
          size={18}
          className="text-dolinnov-gray-mid group-hover:text-dolinnov-black transition-colors"
        />
      </div>
      <h3 className="font-semibold text-lg mb-1.5" dangerouslySetInnerHTML={{ __html: title }} />
      <p className="text-sm text-dolinnov-gray-mid leading-relaxed">
        {description}
      </p>
      <p className="text-[10px] uppercase tracking-wider text-dolinnov-gray-mid mt-4 font-medium">
        {tag}
      </p>
    </Link>
  );
}
