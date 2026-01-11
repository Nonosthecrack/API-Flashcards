## End points Documentation

GET /admin/users :
- Renvoie la liste des utilisateurs
- Accessible par un administrateur
- Aucun paramètre nécéssaire

GET /admin/users/:id :
- Renvoie les informations d'un utilisateur
- Accessible par un administrateur
- Entrer l'id de l'utilisateur dans la route

DELETE /admin/users/:id :
- Supprime un utilisateur
- Accessible par un administrateur
- Entrer l'id de l'utilisateur dans la route
---
POST /auth/register :
- Crée un utilisateur
- Accessible par tout le monde
- Utiliser name, surname, email et password dans le body

POST /auth/login :
- Permet de se connecter
- Accessible par tout le monde
- Utiliser email et password dans le body

GET /auth/me :
- Renvoie l'utilisateur actuellement connecté
- Accessible par authentification
- Aucun paramètre nécéssaire
---
GET /collection
- Renvoie toutes les collections
- Accessible par Authentification
- Aucun paramètre nécéssaire

GET /collection/:id
- Renvoie la collection avec l'id correspondant
- Accessible par un administrateur
- Utiliser l'id de la collection dans la route

GET /collection/me/list
- Renvoie les collections de l'utlisateur connecté
- Accessible par authentification
- Aucun paramètre nécéssaire

POST /collection
- Crée une collection
- Accessible par authentification
- Dans le body, mettre le titre, la descritption et la visibilité

PUT /collection
- Modifie une collection
- Accessible par authentification
- Dans le body, mettre le titre, la descritption et la visibilité

DELETE /collection/:id
- Supprime une collection
- Accessible par authentification
- Dans la route, mettre l'id de la collection
---
GET /flashcards
- Renvoie une liste de toutes les cartes
- Accessible par authentification
- Aucun paramètre nécéssaire

GET /flashcards/:id
- Renvoie une carte par son identifiant
- Accessible par authentification
- Dans la route, mettre l'id de la carte

GET /flashcards/collection/:collectionId
- Renvoie la liste des cartes d'une collection avec son identifiant
- Accessible par authentification
- Dans la route, mettre l'id de la collection


POST /flashcard
- Crée une carte
- Accessible par authentification
- Dans le body, mettre le texte recto et verso, une url recto et verso, ainsi que l'id de la collection a laquelle cette carte appartient

PUT /flashcard/:id
- Modifie une carte
- Accessible par authentification
- Dans le body, mettre le texte recto et verso, une url recto et verso, rajouter l'id de la carte a modifier dans la route

DELETE /flashcard/:id
- Supprime une carte par son identifiant
- Accessible par authentification
- Dans la route, indiquer l'id de la carte a supprimer
---
GET /revision/to-review
- Renvoie les cartes a réviser
- Accessible par authentification
- Aucun paramètre requis

POST /revision/review/:flashCardId
- Révise la carte indiquée
- Accessible par authentification
- Indiquer la carte a réviser par son id dans la route






