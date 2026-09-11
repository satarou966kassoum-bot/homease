# HomeEase 🏠

Plateforme immobilière et marketplace de biens, pensée pour le marché béninois
(Cotonou, Abomey-Calavi, Porto-Novo, et au-delà).

Ce dépôt contient **Phase 1** du projet :

- Architecture complète (monorepo `frontend/` + `backend/`)
- Backend : Node.js + Express + TypeScript + MongoDB (Mongoose) + JWT
- Frontend : React + Vite + TypeScript + Tailwind CSS + React Router
- Authentification complète (inscription / connexion / "moi") avec rôles
  `client`, `owner`, `admin`
- Script de seed qui crée **ton compte administrateur** et des annonces de démo
- Homepage avec hero, moteur de recherche, catégories, zones populaires
- Design system (couleurs, typographie, composants de base)
- Configuration prête pour Vercel (frontend) et Render (backend)

Les phases suivantes (annonces complètes/recherche avancée, réservation,
messagerie, dashboards, paiements) s'ajouteront par-dessus cette base — dis-moi
quand tu veux que je continue avec la Phase 2.

## Arborescence

```
homease/
  backend/
    src/
      config/        # connexion MongoDB
      models/        # User, Listing, Favorite, Reservation, Conversation, Message, Notification, Report
      controllers/    # logique métier
      routes/         # routes Express
      middlewares/    # auth JWT, rôles, erreurs
      services/       # logique réutilisable
      utils/          # helpers (tokens, etc.)
      types/          # types partagés
      seed/           # script de seed (admin + démo)
      index.ts        # point d'entrée
    package.json
    tsconfig.json
    .env.example
  frontend/
    src/
      components/     # layout, ui, listings
      pages/           # Home, Login, Register, NotFound...
      layouts/         # MainLayout
      hooks/
      services/        # client API (axios)
      contexts/        # AuthContext
      types/
      utils/
    package.json
    tsconfig.json
    tailwind.config.ts
    vite.config.ts
    vercel.json
  README.md
  .gitignore
```

## 1. Prérequis (dans Termux)

```bash
pkg update && pkg upgrade -y
pkg install nodejs-lts git -y
node -v && npm -v
```

## 2. Créer ta base MongoDB Atlas (gratuit)

1. Va sur https://www.mongodb.com/cloud/atlas et crée un compte gratuit.
2. Crée un cluster **M0 (Free)**.
3. Crée un utilisateur de base de données (login + mot de passe).
4. Dans "Network Access", autorise `0.0.0.0/0` (accès depuis n'importe où —
   nécessaire car Render n'a pas d'IP fixe sur le plan gratuit).
5. Récupère l'URI de connexion, du type :
   `mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/homease`

## 3. Backend — installation locale

```bash
cd homease/backend
npm install
cp .env.example .env
# édite .env et renseigne MONGODB_URI, JWT_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD
```

Contenu de `.env` à adapter :

```
PORT=5000
MONGODB_URI=mongodb+srv://user:password@cluster0.xxxxx.mongodb.net/homease
JWT_SECRET=change-moi-en-une-longue-chaine-aleatoire
CLIENT_URL=http://localhost:5173
CORS_ORIGIN=http://localhost:5173
ADMIN_NAME=Kassoum
ADMIN_EMAIL=admin@homease.bj
ADMIN_PASSWORD=change-moi-mot-de-passe-fort
```

Lancer le seed (crée TON compte admin + annonces de démo) :

```bash
npm run seed
```

Lancer le backend en dev :

```bash
npm run dev
```

L'API tourne sur `http://localhost:5000/api`.

## 4. Frontend — installation locale

Dans un autre terminal Termux (ou une autre session) :

```bash
cd homease/frontend
npm install
cp .env.example .env
# vérifie que VITE_API_URL=http://localhost:5000/api
npm run dev
```

Le site tourne sur `http://localhost:5173`.

Connecte-toi avec l'email/mot de passe admin définis dans `.env` du backend
pour accéder au compte administrateur.

## 5. Pousser sur GitHub (Termux)

```bash
cd homease
git init
git add .
git commit -m "HomeEase - Phase 1 : architecture, auth, homepage, design system"
git branch -M main
git remote add origin https://github.com/<ton-user>/homease.git
git push -u origin main
```

⚠️ Le fichier `.gitignore` exclut déjà `.env`, `node_modules` — ne commite
jamais tes vrais secrets.

## 6. Déploiement Render (backend)

1. Sur https://render.com → New → Web Service → connecte le repo GitHub.
2. Root Directory : `backend`
3. Build Command : `npm install && npm run build`
4. Start Command : `npm start`
5. Ajoute les variables d'environnement (mêmes clés que `.env.example`),
   avec `CORS_ORIGIN` = l'URL Vercel de ton frontend une fois déployé.
6. Déploie, puis lance une fois le seed depuis le Shell Render :
   `npm run seed`

## 7. Déploiement Vercel (frontend)

1. Sur https://vercel.com → New Project → connecte le repo GitHub.
2. Root Directory : `frontend`
3. Build Command : `npm run build`
4. Output Directory : `dist`
5. Variable d'environnement : `VITE_API_URL` = l'URL Render du backend + `/api`
   (ex : `https://homease-api.onrender.com/api`)

## 8. Ton compte administrateur

Le script `npm run seed` (backend) crée un compte avec le rôle `admin` à
partir des variables `ADMIN_EMAIL` / `ADMIN_PASSWORD` / `ADMIN_NAME` de ton
`.env`. C'est avec cet email/mot de passe que tu te connectes sur le site pour
avoir un accès administrateur complet. Change le mot de passe après la
première connexion si tu veux.

---

**Prochaines étapes proposées (Phase 2) :** pages de recherche/filtres
avancés, page détail d'annonce complète, formulaire de publication d'annonce,
favoris, puis Phase 3 (réservations, messagerie, notifications) et Phase 4
(dashboards propriétaire/client/admin détaillés).
