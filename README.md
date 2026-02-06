# Taboulou ERP

Une solution ERP moderne et performante pour la gestion d'entreprise, migrée vers une architecture **Vite + React**.

## 🚀 Technologies

- **Frontend** : React 19, Vite 6
- **Styling** : Tailwind CSS 4 (Glassmorphism, Animations Odoo-style)
- **Base de données** : Supabase (PostgreSQL)
- **Routage** : React Router 7

## 🛠️ Installation et Dépendances

1. Installez les dépendances :
   ```bash
   npm install
   ```

2. Configurez votre fichier `.env` avec vos clés Supabase :
   ```env
   VITE_SUPABASE_URL=votre_url_supabase
   VITE_SUPABASE_ANON_KEY=votre_cle_anon
   ```

## 📖 Commandes Disponibles

- `npm run dev` : Lance le serveur de développement local.
- `npm run build` : Génère le build de production optimisé dans le dossier `dist/`.
- `npm run preview` : Prévisualise le build de production localement.
- `npm run lint` : Vérifie la qualité du code avec ESLint.

## 🌐 Déploiement

Le projet est configuré pour un déploiement continu sur **Vercel**. 
> [!IMPORTANT]
> Assurez-vous que le **Framework Preset** sur Vercel est réglé sur **Vite** et que vos variables d'environnement commencent par `VITE_`.

---
*Développé avec ❤️ pour Taboulou ERP.*
