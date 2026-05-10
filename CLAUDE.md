# CLAUDE.md — Contexte pour Claude Code

> Ce fichier est lu automatiquement par Claude Code à chaque session.
> Il sert à donner à Claude le contexte du projet, ses conventions et sa feuille de route.

## 🎯 Objectif

Outil web **personnel** pour Grégoire Serra, CEO/Co-fondateur de **Dolinnov**, biotech early-stage à Montpellier (FXYD2 / Nav1.7 / DRG, érythromélalgie primaire).

L'app centralise :
1. **Contacts & messages** — investisseurs, partenaires, KOLs (synchro Airtable, envoi email).
2. **Veille concurrentielle** — programmes ASO, biotech rare disease, KOLs FXYD2.
3. **Données scientifiques** — suivi batches L-ASO, résultats Axolabs, biblio.

Usage **mono-utilisateur**, pas multi-tenant. Pas de SaaS.

## 🛠 Stack

- **Next.js 14** (App Router, TypeScript)
- **Tailwind CSS** avec thème Dolinnov custom
- **Airtable** comme source de vérité pour contacts (et plus tard veille)
- **Nodemailer** pour SMTP (Gmail App Password recommandé)
- **lucide-react** pour les icônes
- Déploiement cible : **Vercel** (gratuit pour usage perso) ou **localhost**

## 🎨 Identité de marque (à respecter strictement)

| Token | Valeur |
|---|---|
| Nom (toujours) | **Dolinnov** (jamais "DOlinnov" ni "DOLINNOV") |
| Vert | `#7BF28F` |
| Noir | `#242424` |
| Police | **Poppins** (300, 400, 500, 600, 700) |

Variables Tailwind disponibles : `bg-dolinnov-green`, `text-dolinnov-black`, etc. Voir `tailwind.config.ts`.

## 📁 Architecture

```
app/
  layout.tsx               # Layout racine + sidebar
  page.tsx                 # Tableau de bord
  contacts/page.tsx        # Liste contacts + composer message
  veille/page.tsx          # Veille (placeholder)
  data/page.tsx            # Données scientifiques (placeholder)
  parametres/page.tsx      # Statut des connexions, infos légales
  api/
    airtable/contacts/     # GET liste contacts
    messages/send/         # POST envoi email
    veille/                # GET (à implémenter)
components/
  Sidebar.tsx              # Nav latérale
  ui/                      # Petits composants partagés
lib/
  airtable.ts              # Client Airtable + helpers
  mailer.ts                # Client SMTP nodemailer
```

## 🔐 Variables d'environnement

Voir `.env.example`. À copier en `.env.local`.

## 📋 Conventions de code

- **Tout en français** côté UI (labels, boutons, messages d'erreur).
- **TypeScript strict** : pas de `any` non motivé.
- **Pas de tests unitaires** demandés (usage perso) — plutôt valider à la main.
- **Pas de CSS inline** : utiliser Tailwind ou `globals.css`.
- **Server Components** par défaut, `"use client"` uniquement si nécessaire (formulaires, état, hooks).
- **Erreurs API** : retour JSON `{ error: string }` avec status HTTP cohérent.

## 🚧 Roadmap — modules à construire

### Module Contacts (déjà partiellement implémenté)
- [x] Liste depuis Airtable
- [x] Filtres simples
- [x] Composer un message
- [ ] Templates d'emails (BioEquity follow-up, intro investisseur, etc.)
- [ ] Envoi groupé avec personnalisation (mail merge)
- [ ] Historique des interactions (table Airtable liée)
- [ ] Import CSV

### Module Veille (à construire)
- [ ] Stockage des sources (Airtable table `Sources` recommandée)
- [ ] Fetch RSS / API (PubMed, ClinicalTrials.gov, EMA, FDA)
- [ ] Synthèse automatique via API Anthropic (`claude-opus-4-7` pour qualité, `claude-sonnet-4-6` pour volume)
- [ ] Tagging : concurrents, BD, KOLs, réglementaire
- [ ] Cron Vercel : digest hebdomadaire le lundi 8h
- [ ] Recherche full-text dans les synthèses

### Module Données scientifiques (à construire)
- [ ] Choix du backend : Airtable (suivi métier) + Drive (datasets bruts)
- [ ] Page batches L-ASO
- [ ] Page partenaires (VENTEO, GRECO, Axolabs)
- [ ] Page biblio FXYD2 / Nav1.7
- [ ] Upload de fichiers vers Drive avec tagging

### Authentification (avant tout déploiement public)
- [ ] Auth simple par mot de passe (cookie signé) — `APP_PASSWORD` déjà prévu
- [ ] Middleware Next.js pour protéger toutes les routes
- [ ] Sinon : déployer en privé sur Vercel + restriction par IP, ou rester en local

## 📞 Contacts récurrents (pour générer des emails)

- **Investisseurs actifs** : Sound Bioventures (Ester Sklarsky), Pureos Bioventures, 3B Future Health, Jeito Capital, Ipsen (Matthew Beard), X Venture, Captech Santé, Sofilaro
- **Partenaires** : VENTEO/Inserm U1298, GRECO/Inserm U1163, Axolabs, Iktos, Inserm Transfert, FreeMind/Nikki
- **Équipe interne** : Jean-Philippe Annereau (CSO), Philippe Barthélémy (L-ASO), Thomas (2bridge), Selena Sahih (Junior PM)

## 💡 Style de communication (préférences Grégoire)

- Drafts **prêts à l'emploi**, pas de frameworks explicatifs.
- Emails courts, **un seul ask clair** par email.
- **Tutoiement** en français côté investisseurs.
- **Anglais** pour contacts internationaux.
- Pour les nouveaux modules, livrer **du code fonctionnel** plutôt que des plans.

---

**Quand tu travailles sur ce repo :**
- Commence par lire `package.json`, `app/layout.tsx`, `lib/airtable.ts` pour le contexte.
- Respecte l'identité visuelle Dolinnov.
- Ne casse pas les routes existantes sans prévenir.
- Si tu ajoutes un module, ajoute aussi son entrée dans `components/Sidebar.tsx` et dans le tableau de bord.
