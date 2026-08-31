# Xaam-Xaam+ — Frontend

Frontend React prêt à être branché au backend. **Aucune donnée mockée n'est utilisée.**

## Installation

```bash
npm install
cp .env.example .env
npm run dev
```

Modifier `VITE_API_URL` dans `.env` selon l'adresse du backend.

## Endpoints actuellement attendus

- `POST /auth/login`
- `POST /auth/register`
- `GET /parent/dashboard`
- `GET /admin/dashboard`
- `PATCH /admin/inscriptions/:id`
- `POST /eleve/conversations`

Les noms d'endpoints sont centralisés dans les pages/services afin de pouvoir les adapter facilement au backend réel.

## Principe

Le frontend ne fabrique aucune statistique, aucun utilisateur, exercice ou conversation. En absence de réponse backend, il affiche un état vide, un chargement ou une erreur.
