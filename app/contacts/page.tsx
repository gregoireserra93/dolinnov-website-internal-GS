"use client";

import { useEffect, useState } from "react";
import {
  Search,
  Mail,
  Building2,
  Filter,
  RefreshCw,
  X,
  Send,
} from "lucide-react";
import type { Contact } from "@/lib/airtable";

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [categorieFilter, setCategorieFilter] = useState<string>("");
  const [composeFor, setComposeFor] = useState<Contact | null>(null);

  async function loadContacts() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/airtable/contacts");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur API");
      setContacts(data.contacts || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadContacts();
  }, []);

  const categories = Array.from(
    new Set(contacts.map((c) => c.categorie).filter(Boolean))
  ) as string[];

  const filtered = contacts.filter((c) => {
    const matchCat = !categorieFilter || c.categorie === categorieFilter;
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      [c.nom, c.prenom, c.email, c.organisation, c.fonction]
        .filter(Boolean)
        .some((v) => (v as string).toLowerCase().includes(q));
    return matchCat && matchSearch;
  });

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <header className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Contacts</h1>
          <p className="text-dolinnov-gray-mid mt-1">
            Investisseurs, partenaires et KOLs synchronisés depuis Airtable.
          </p>
        </div>
        <button onClick={loadContacts} className="btn-ghost">
          <RefreshCw size={16} /> Rafraîchir
        </button>
      </header>

      {/* Filtres */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dolinnov-gray-mid"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par nom, email, organisation…"
            className="input-field pl-10"
          />
        </div>
        <div className="relative">
          <Filter
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dolinnov-gray-mid pointer-events-none"
          />
          <select
            value={categorieFilter}
            onChange={(e) => setCategorieFilter(e.target.value)}
            className="input-field pl-10 pr-8 appearance-none min-w-[200px]"
          >
            <option value="">Toutes les catégories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Erreur */}
      {error && (
        <div className="card mb-6 border-red-200 bg-red-50">
          <p className="font-medium text-red-700">Connexion Airtable impossible</p>
          <p className="text-sm text-red-600 mt-1">{error}</p>
          <p className="text-xs text-red-600 mt-3">
            Vérifie <code>AIRTABLE_API_KEY</code>, <code>AIRTABLE_BASE_ID</code>{" "}
            et <code>AIRTABLE_CONTACTS_TABLE</code> dans <code>.env.local</code>.
          </p>
        </div>
      )}

      {/* Liste */}
      {loading ? (
        <div className="card text-center text-dolinnov-gray-mid py-12">
          Chargement…
        </div>
      ) : filtered.length === 0 ? (
        <div className="card text-center text-dolinnov-gray-mid py-12">
          Aucun contact trouvé.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filtered.map((c) => (
            <ContactCard
              key={c.id}
              contact={c}
              onMessage={() => setComposeFor(c)}
            />
          ))}
        </div>
      )}

      {/* Drawer composition */}
      {composeFor && (
        <ComposeDrawer
          contact={composeFor}
          onClose={() => setComposeFor(null)}
        />
      )}
    </div>
  );
}

function ContactCard({
  contact,
  onMessage,
}: {
  contact: Contact;
  onMessage: () => void;
}) {
  const fullName =
    [contact.prenom, contact.nom].filter(Boolean).join(" ") || "Sans nom";
  return (
    <div className="card flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="font-semibold truncate">{fullName}</p>
          {contact.fonction && (
            <p className="text-sm text-dolinnov-gray-mid truncate">
              {contact.fonction}
            </p>
          )}
        </div>
        {contact.categorie && (
          <span className="text-[10px] font-medium uppercase tracking-wider bg-dolinnov-green text-dolinnov-black px-2 py-1 rounded-full whitespace-nowrap">
            {contact.categorie}
          </span>
        )}
      </div>

      {contact.organisation && (
        <p className="text-sm text-dolinnov-black flex items-center gap-2">
          <Building2 size={14} className="text-dolinnov-gray-mid" />
          {contact.organisation}
        </p>
      )}
      {contact.email && (
        <p className="text-sm text-dolinnov-gray-mid flex items-center gap-2 truncate">
          <Mail size={14} />
          {contact.email}
        </p>
      )}

      <div className="flex gap-2 mt-1">
        <button
          onClick={onMessage}
          disabled={!contact.email}
          className="btn-secondary flex-1 justify-center disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Mail size={14} /> Message
        </button>
      </div>
    </div>
  );
}

function ComposeDrawer({
  contact,
  onClose,
}: {
  contact: Contact;
  onClose: () => void;
}) {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  async function handleSend() {
    if (!contact.email) return;
    setSending(true);
    setResult(null);
    try {
      const res = await fetch("/api/messages/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contactId: contact.id,
          to: contact.email,
          subject,
          body,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Échec d'envoi");
      setResult("✓ Envoyé");
      setTimeout(onClose, 1200);
    } catch (e) {
      setResult(
        "✗ " + (e instanceof Error ? e.message : "Erreur inconnue")
      );
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-40 flex justify-end" onClick={onClose}>
      <div
        className="w-full max-w-xl bg-white h-full shadow-2xl p-8 overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="text-xs uppercase tracking-wider text-dolinnov-gray-mid font-medium">
              Nouveau message
            </p>
            <h2 className="text-xl font-semibold mt-1">
              {[contact.prenom, contact.nom].filter(Boolean).join(" ")}
            </h2>
            <p className="text-sm text-dolinnov-gray-mid">{contact.email}</p>
          </div>
          <button onClick={onClose} className="btn-ghost p-2">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="label-field">Objet</label>
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="input-field"
              placeholder="Suivi BioEquity Europe…"
            />
          </div>
          <div>
            <label className="label-field">Message</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={12}
              className="input-field resize-none font-sans"
              placeholder={`Bonjour ${contact.prenom || ""},\n\n…`}
            />
          </div>

          {result && (
            <p
              className={`text-sm ${
                result.startsWith("✓") ? "text-green-700" : "text-red-700"
              }`}
            >
              {result}
            </p>
          )}

          <div className="flex gap-2 pt-2">
            <button
              onClick={handleSend}
              disabled={sending || !subject || !body}
              className="btn-primary disabled:opacity-40"
            >
              <Send size={14} /> {sending ? "Envoi…" : "Envoyer"}
            </button>
            <button onClick={onClose} className="btn-ghost">
              Annuler
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
