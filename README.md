# Gestion locative — Colocation Armand-Carrel (Lille)

Petite plateforme de gestion locative + vitrine pour la colocation de 6 chambres.

- **Vitrine publique** (`/`) : présentation du bien, chambres, prix, contact.
- **Espace gestion** (`/admin`, protégé par mot de passe) : locataires, chambres,
  et suivi des loyers/paiements mois par mois.

## Stack

Next.js 16 (App Router) · React 19 · Tailwind CSS v4 · Prisma · PostgreSQL · déployé sur Vercel.

## Développement local

```bash
npm install
cp .env.example .env   # puis renseigner les variables (voir ci-dessous)
npm run db:push        # crée les tables dans la base
npm run db:seed        # insère les 6 chambres + locataires
npm run dev            # http://localhost:3000
```

## Variables d'environnement

| Variable         | Rôle                                                        |
| ---------------- | ----------------------------------------------------------- |
| `DATABASE_URL`   | Chaîne de connexion PostgreSQL (Neon, Vercel Postgres…).    |
| `ADMIN_PASSWORD` | Mot de passe de l'espace gestion.                           |
| `SESSION_SECRET` | Clé secrète pour signer les cookies (`openssl rand -hex 32`). |

## Déploiement (Vercel + Neon, gratuit)

1. Pousser le repo sur GitHub.
2. Sur [vercel.com](https://vercel.com) → **Add New → Project** → importer le repo.
3. Onglet **Storage** du projet → **Create Database → Neon (Postgres)** → `Connect`
   (cela ajoute automatiquement `DATABASE_URL`).
4. Onglet **Settings → Environment Variables** → ajouter `ADMIN_PASSWORD` et `SESSION_SECRET`.
5. **Deploy**. Le build (voir `vercel.json`) crée les tables et insère les données automatiquement.

## Personnaliser

- **Textes / contact de la vitrine** : `src/lib/config.ts`.
- **Photos** : déposer les images dans `public/photos/`, puis renseigner leur chemin
  dans l'espace gestion (Chambres → Éditer → Photo), ex. `/photos/chambre-1.jpg`.
- **Loyers / locataires / paiements** : tout se gère depuis `/admin`.

> Les loyers sont saisis **hors charges (HC)**. Renseigner la « provision charges »
> de chaque chambre pour que le loyer dû et l'affichage « charges comprises » soient exacts.
