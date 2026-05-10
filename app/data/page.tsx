import { FlaskConical, FileText, Beaker, BookOpen } from "lucide-react";

export default function DataPage() {
  return (
    <div className="max-w-6xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">
          Données scientifiques
        </h1>
        <p className="text-dolinnov-gray-mid mt-1">
          Suivi des programmes Dolonersen (DOL001), batches L-ASO, résultats
          Axolabs et bibliographie.
        </p>
      </header>

      {/* Bandeau d'orientation */}
      <div className="card mb-8 bg-dolinnov-black text-white border-0">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-dolinnov-green flex items-center justify-center text-dolinnov-black flex-shrink-0">
            <FlaskConical size={20} />
          </div>
          <div>
            <h3 className="font-semibold mb-1">Architecture suggérée</h3>
            <p className="text-sm text-white/70 leading-relaxed">
              Pour des données scientifiques (souvent confidentielles), trois
              options selon l'usage :
            </p>
            <ul className="text-sm text-white/70 mt-2 space-y-1 list-disc list-inside">
              <li>
                <strong>Airtable</strong> : suivi de batches, milestones,
                interactions partenaires (VENTEO, GRECO, Axolabs)
              </li>
              <li>
                <strong>Google Drive + index</strong> : pour les datasets bruts
                (qPCR, séquençage), avec liens et tags
              </li>
              <li>
                <strong>SQLite local</strong> : si tu veux des graphes / requêtes
                avancées sans cloud
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Sections */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SectionCard
          icon={<Beaker size={20} />}
          title="Batches L-ASO"
          desc="Synthèses, QC, lot numbers, suivi Philippe Barthélémy."
        />
        <SectionCard
          icon={<FileText size={20} />}
          title="Études précliniques"
          desc="Données VENTEO/Inserm U1298, GRECO/Inserm U1163, Axolabs AN414."
        />
        <SectionCard
          icon={<BookOpen size={20} />}
          title="Bibliographie"
          desc="FXYD2, Nav1.7, érythromélalgie, ASO conjugués (lipides, GalNAc)."
        />
      </div>
    </div>
  );
}

function SectionCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="card">
      <div className="w-10 h-10 rounded-xl bg-dolinnov-green flex items-center justify-center text-dolinnov-black mb-4">
        {icon}
      </div>
      <h3 className="font-semibold mb-1">{title}</h3>
      <p className="text-sm text-dolinnov-gray-mid leading-relaxed">{desc}</p>
      <p className="text-xs text-dolinnov-gray-mid mt-4 italic">À configurer</p>
    </div>
  );
}
