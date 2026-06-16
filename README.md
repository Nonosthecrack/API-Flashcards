# API Flashcards

API RESTful de gestion de flashcards avec système de révision espacée.

Construite avec **Node.js**, **Express 5** et **SQLite** via **Drizzle ORM**.

---

## Prérequis

- [Node.js](https://nodejs.org/) v22+
- npm v10+
- [Docker](https://www.docker.com/) *(optionnel, pour le lancement conteneurisé)*

---

## Installation

```bash
git clone https://github.com/Asriel6/API-Flashcards.git
cd API-Flashcards
npm install
```

---

## Configuration

Copier le fichier d'exemple et renseigner les variables :

```bash
cp .env.example .env
```

| Variable    | Description                              | Exemple                        |
|-------------|------------------------------------------|--------------------------------|
| `DB_FILE`   | Chemin vers le fichier SQLite            | `file:./flashcards.db`         |
| `JWT_SECRET`| Clé secrète pour signer les tokens JWT   | `change_me_in_production`      |
| `PORT`      | Port d'écoute du serveur                 | `3000`                         |

---

## Lancement

### Développement

```bash
# Initialiser la base de données
npm run db:push

# Insérer les données de démonstration (optionnel)
npm run db:seed

# Démarrer avec rechargement automatique
npm run dev
```

### Production

```bash
npm run db:push
npm start
```

L'API est accessible sur `http://localhost:3000`.

---

## Scripts disponibles

| Commande           | Description                                      |
|--------------------|--------------------------------------------------|
| `npm run dev`      | Démarre avec nodemon (rechargement automatique)  |
| `npm start`        | Démarre en mode production                       |
| `npm test`         | Lance les tests (41 tests Vitest + Supertest)    |
| `npm run db:push`  | Applique le schéma Drizzle à la base de données  |
| `npm run db:seed`  | Insère les données de démonstration              |
| `npm run db:studio`| Ouvre Drizzle Studio (interface visuelle DB)     |

---

## Lancement avec Docker

```bash
# Créer le fichier .env avec au minimum JWT_SECRET
echo "JWT_SECRET=mon_secret_fort" > .env

# Construire et démarrer
docker compose up -d --build

# Vérifier que l'API répond
curl http://localhost:3000/health

# Voir les logs
docker compose logs -f

# Arrêter
docker compose down
```

> La base de données est persistée dans un volume Docker `db_data` et survit aux redémarrages.

---

## Routes disponibles

### Authentification
| Méthode | Route              | Description              | Auth |
|---------|--------------------|--------------------------|------|
| POST    | `/auth/register`   | Créer un compte          | Non  |
| POST    | `/auth/login`      | Se connecter             | Non  |

### Utilisateurs
| Méthode | Route         | Description                   | Auth |
|---------|---------------|-------------------------------|------|
| GET     | `/users`      | Liste des utilisateurs        | Oui  |
| GET     | `/users/:id`  | Détail d'un utilisateur       | Oui  |
| PUT     | `/users/:id`  | Modifier un utilisateur       | Oui  |
| DELETE  | `/users/:id`  | Supprimer un utilisateur      | Oui  |

### Collections
| Méthode | Route               | Description               | Auth |
|---------|---------------------|---------------------------|------|
| GET     | `/collections`      | Liste des collections     | Oui  |
| POST    | `/collections`      | Créer une collection      | Oui  |
| GET     | `/collections/:id`  | Détail d'une collection   | Oui  |
| PUT     | `/collections/:id`  | Modifier une collection   | Oui  |
| DELETE  | `/collections/:id`  | Supprimer une collection  | Oui  |

### Flashcards
| Méthode | Route              | Description             | Auth |
|---------|--------------------|-------------------------|------|
| GET     | `/flashcards`      | Liste des flashcards    | Oui  |
| POST    | `/flashcards`      | Créer une flashcard     | Oui  |
| GET     | `/flashcards/:id`  | Détail d'une flashcard  | Oui  |
| PUT     | `/flashcards/:id`  | Modifier une flashcard  | Oui  |
| DELETE  | `/flashcards/:id`  | Supprimer une flashcard | Oui  |

### Révision espacée
| Méthode | Route             | Description                              | Auth |
|---------|-------------------|------------------------------------------|------|
| GET     | `/revision`       | Flashcards à réviser aujourd'hui         | Oui  |
| POST    | `/revision/:id`   | Ajouter une flashcard à sa liste         | Oui  |
| PATCH   | `/study/:id`      | Soumettre une réponse et progresser      | Oui  |

### Administration
| Méthode | Route               | Description                    | Auth  |
|---------|---------------------|--------------------------------|-------|
| GET     | `/admin/users`      | Liste tous les utilisateurs    | Admin |
| GET     | `/admin/users/:id`  | Détail d'un utilisateur        | Admin |
| DELETE  | `/admin/users/:id`  | Supprimer un utilisateur       | Admin |

### Santé
| Méthode | Route      | Description                     |
|---------|------------|---------------------------------|
| GET     | `/health`  | Vérification de l'état de l'API |

---

## Tests

```bash
npm test
```

41 tests d'intégration couvrant l'authentification, les collections, les flashcards et la révision espacée. Chaque test tourne sur une base de données isolée (`test.db`) créée et supprimée automatiquement.

---

## CI/CD

Deux workflows GitHub Actions sont configurés :

- **CI** — lancé à chaque push sur toutes les branches : installe les dépendances et exécute les tests.
- **CD** — déclenché uniquement si le CI passe sur `main` : déploie automatiquement l'application sur la VM de production via un runner self-hosted.

---

## Stack technique

| Outil             | Rôle                                        |
|-------------------|---------------------------------------------|
| Node.js + Express | Serveur HTTP et routage                     |
| Drizzle ORM       | ORM typé pour SQLite                        |
| bcrypt            | Hashage des mots de passe                   |
| jsonwebtoken      | Authentification par token JWT              |
| Zod               | Validation des données entrantes            |
| Vitest            | Framework de tests                          |
| Supertest         | Tests des routes HTTP                       |
| Docker            | Conteneurisation                            |
| GitHub Actions    | Pipeline CI/CD                              |
