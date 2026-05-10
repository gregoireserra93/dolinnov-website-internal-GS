import Airtable from "airtable";

/**
 * Client Airtable centralisé.
 *
 * Variables d'environnement requises :
 * - AIRTABLE_API_KEY      Personal Access Token Airtable
 * - AIRTABLE_BASE_ID      ID de la base (commence par "app...")
 * - AIRTABLE_CONTACTS_TABLE  Nom de la table contacts (par défaut : "Contacts")
 *
 * NB : pour l'instant on expose surtout la table Contacts.
 *      Ajouter d'autres tables au fur et à mesure.
 */

let cachedBase: Airtable.Base | null = null;

export function getAirtableBase(): Airtable.Base {
  if (cachedBase) return cachedBase;

  const apiKey = process.env.AIRTABLE_API_KEY;
  const baseId = process.env.AIRTABLE_BASE_ID;

  if (!apiKey || !baseId) {
    throw new Error(
      "AIRTABLE_API_KEY et AIRTABLE_BASE_ID doivent être définis dans .env.local"
    );
  }

  Airtable.configure({ apiKey });
  cachedBase = Airtable.base(baseId);
  return cachedBase;
}

export function getContactsTable() {
  const tableName = process.env.AIRTABLE_CONTACTS_TABLE || "Contacts";
  return getAirtableBase()(tableName);
}

/**
 * Représentation d'un contact côté app.
 * Adapter les champs au schéma réel de la base Airtable.
 */
export interface Contact {
  id: string;
  nom?: string;
  prenom?: string;
  email?: string;
  organisation?: string;
  fonction?: string;
  categorie?: string; // ex: "Investisseur", "KOL", "Partenaire"
  derniereInteraction?: string;
  notes?: string;
  tags?: string[];
}

export async function listContacts(options?: {
  filterByFormula?: string;
  maxRecords?: number;
  view?: string;
}): Promise<Contact[]> {
  const table = getContactsTable();
  const records = await table
    .select({
      maxRecords: options?.maxRecords ?? 100,
      ...(options?.filterByFormula && {
        filterByFormula: options.filterByFormula,
      }),
      ...(options?.view && { view: options.view }),
    })
    .all();

  return records.map((r) => ({
    id: r.id,
    nom: r.get("Nom") as string | undefined,
    prenom: r.get("Prénom") as string | undefined,
    email: r.get("Email") as string | undefined,
    organisation: r.get("Organisation") as string | undefined,
    fonction: r.get("Fonction") as string | undefined,
    categorie: r.get("Catégorie") as string | undefined,
    derniereInteraction: r.get("Dernière interaction") as string | undefined,
    notes: r.get("Notes") as string | undefined,
    tags: (r.get("Tags") as string[]) || [],
  }));
}

export async function updateContact(
  id: string,
  fields: Record<string, unknown>
): Promise<void> {
  const table = getContactsTable();
  await table.update(id, fields);
}

export async function logInteraction(
  contactId: string,
  payload: { type: string; sujet?: string; date?: string }
): Promise<void> {
  // Mise à jour minimale : on date la dernière interaction.
  // Étendre selon ton schéma (table Interactions liée, etc.).
  await updateContact(contactId, {
    "Dernière interaction": payload.date || new Date().toISOString(),
  });
}
