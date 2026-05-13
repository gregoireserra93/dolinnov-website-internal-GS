# Dolinnov — Outil interne

Application web personnelle pour Grégoire Serra (CEO Dolinnov) :
contacts investisseurs, veille concurrentielle, données scientifiques.

> **Mono-utilisateur.** Pas de SaaS, pas de multi-tenant. Pensé pour tourner
> en local ou sur ton Vercel privé.

---

## 🚀 Mise en route (5 minutes)

### 1. Pré-requis

- **Node.js 20+** ([télécharger ici](https://nodejs.org/))
- Un éditeur (recommandé : **Cursor** ou **VS Code** avec Claude Code)
- Un compte **Airtable** avec une base contenant tes contacts
- Un compte **Resend** (gratuit jusqu'à 3000 emails/mois) pour l'envoi

### 2. Installation

```bash
# Dans le dossier du projet :
npm install
```

### 3. Configuration

Copie le fichier d'exemple :

```bash
cp .env.example .env.local
```

Puis ouvre `.env.local` et remplis :

#### a) Airtable
1. Va sur https://airtable.com/create/tokens
2. Crée un Personal Access Token avec les scopes :
   - `data.records:read`
   - `data.records:write`
3. Donne-lui accès à ta base contacts
4. Copie le token dans `AIRTABLE_API_KEY`
5. Récupère l'ID de ta base (l'URL contient `/app...../`) → `AIRTABLE_BASE_ID`
6. Le nom de la table contacts → `AIRTABLE_CONTACTS_TABLE` (par défaut : `Contacts`)

**Schéma Airtable attendu** (renomme ou adapte `lib/airtable.ts` si besoin) :

| Champ | Type |
|---|---|
| Nom | Single line text |
| Prénom | Single line text |
| Email | Email |
| Organisation | Single line text |
| Fonction | Single line text |
| Catégorie | Single select (Investisseur / KOL / Partenaire / …) |
| Dernière interaction | Date |
| Notes | Long text |
| Tags | Multiple select |

#### b) Email (Resend)

Resend est conçu pour fonctionner depuis des environnements serverless type
Vercel (contrairement à Gmail SMTP, instable dans ce contexte).

1. Crée un compte gratuit sur https://resend.com/signup (3000 emails/mois inclus)
2. Génère une **API key** dans le dashboard et colle-la dans `RESEND_API_KEY`
3. **Recommandé** : vérifie le domaine `dolinnov.com` (Dashboard → Domains) pour
   pouvoir expédier depuis `gregoire@dolinnov.com`. Tant que le domaine n'est
   pas vérifié, garde `RESEND_FROM=onboarding@resend.dev` (sandbox Resend).

### 4. Lancement

```bash
npm run dev
```

Ouvre http://localhost:3000 — c'est tout.

---

## 🧑‍💻 Travailler avec Claude Code

Ce repo contient un fichier **`CLAUDE.md`** qui donne tout le contexte à Claude Code
(stack, identité visuelle, roadmap, conventions).

Pour démarrer une session Claude Code dans ce projet :

```bash
# Installe Claude Code si nécessaire
npm install -g @anthropic-ai/claude-code

# Lance-le dans le dossier
cd dolinnov-app
claude
```

### Premiers prompts utiles à donner à Claude Code

```
Lis CLAUDE.md, puis ajoute un module "Templates d'emails" dans la page Contacts.
Les templates doivent être stockés dans une table Airtable "Templates"
avec champs Nom, Objet, Corps, Variables.
```

```
Implémente le module Veille : table Airtable "Sources" (Nom, URL, Type, Dernière vérif),
fetch RSS toutes les 24h via une route /api/cron/veille,
synthèse via l'API Anthropic, stockage des résultats dans une table "Alertes".
```

```
Ajoute une auth simple par mot de passe (APP_PASSWORD déjà dans .env)
avec cookie signé, middleware Next pour protéger toutes les routes sauf /login.
```

---

## 📁 Structure

```
dolinnov-app/
├── CLAUDE.md              # Contexte projet pour Claude Code
├── README.md              # Ce fichier
├── .env.example           # Template variables d'environnement
├── package.json
├── tsconfig.json
├── tailwind.config.ts     # Identité Dolinnov (vert #7BF28F, noir #242424)
├── app/
│   ├── layout.tsx         # Layout + sidebar + Poppins
│   ├── page.tsx           # Tableau de bord
│   ├── contacts/          # Liste + composer un message
│   ├── veille/            # Veille (à étoffer)
│   ├── data/              # Données scientifiques (à étoffer)
│   ├── parametres/        # Statut connexions, infos légales
│   └── api/
│       ├── airtable/contacts/  # GET contacts
│       ├── messages/send/      # POST envoi email
│       └── veille/             # GET (placeholder)
├── components/
│   └── Sidebar.tsx
└── lib/
    ├── airtable.ts        # Client Airtable + helpers
    ├── mailer.ts          # Client Resend
    └── session.ts         # Sessions iron-session (auth)
```

---

## 🚀 Déploiement (optionnel)

### Vercel (recommandé, gratuit pour usage perso)

```bash
npm install -g vercel
vercel
```

Puis configure les variables d'environnement dans le dashboard Vercel.

⚠️ **Avant tout déploiement public**, ajoute une protection par mot de passe
(voir roadmap dans `CLAUDE.md`). En local, ce n'est pas nécessaire.

---

## 🐛 Problèmes courants

**"AIRTABLE_API_KEY et AIRTABLE_BASE_ID doivent être définis"**
→ Vérifie `.env.local` (pas `.env`) et redémarre `npm run dev`.

**Resend renvoie 401 / "API key invalid"**
→ La clé `RESEND_API_KEY` est manquante ou incorrecte. Régénère-la depuis
https://resend.com/api-keys et redémarre `npm run dev`.

**Resend renvoie "domain not verified"**
→ Tu essaies d'expédier depuis `gregoire@dolinnov.com` mais le domaine n'est
pas vérifié. Soit tu vérifies le domaine dans Resend (Dashboard → Domains),
soit tu repasses temporairement `RESEND_FROM=onboarding@resend.dev`.

**Les contacts ne se chargent pas**
→ Va sur `/parametres` pour voir l'état des connexions.
→ Vérifie le nom de la table (sensible à la casse) et les noms de colonnes.

---

## 📜 Licence

Code privé. Usage interne Dolinnov uniquement.
