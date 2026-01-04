# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Configuration de l'environnement

Ajoutez un fichier `.env` à la racine du projet (vous pouvez partir de `.env.example`) et renseignez les variables suivantes pour activer Supabase :

```
VITE_SUPABASE_URL=VotreURLSupabase
VITE_SUPABASE_PUBLISHABLE_KEY=VotreClefPublishableSupabase
```

## Déploiement sur GitHub Pages

1. Poussez sur `main` : le workflow GitHub Actions **Déployer sur GitHub Pages** build automatiquement le bundle (`npm run build`, qui génère aussi `dist/404.html`) puis publie le dossier `dist/` via l'environnement Pages.
2. Dans les paramètres du dépôt, configurez GitHub Pages sur "Deploy from GitHub Actions" pour utiliser le flux ci-dessus.
3. Une fois le déploiement terminé, ouvrez l'URL Pages : les assets doivent être servis depuis le préfixe `/reco/` (configuré via `base` dans `vite.config.ts` et `basename` dans le router) et la SPA reste fonctionnelle grâce à la copie d'`index.html` en `404.html`.
4. Pour un contrôle local, exécutez `npm run build` puis inspectez `dist/index.html` afin de vérifier que les chemins générés pointent bien vers `/reco/`.
