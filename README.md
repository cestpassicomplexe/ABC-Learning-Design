# 🚀 ABC Learning Design

Ce projet vise à maintenir et faire évoluer la page HTML développée par DRANE Grand Est.

## Avant-propos
Ce projet est mené sans prétention de ma part car réalisé sur du temps libre et grandement assisté par IA pour le codage et les améliorations proposées.
Je l'avoue, le but est un peu d'apprendre à utiliser GitHub tout en assurant un projet sympa.  En espérant que cela puisse servir à certains. 

## 🎯 Fondement Pédagogique : Modèle ABC LD
L'ABC Learning Design souhaite garantir une approche centrée sur l'activité et l'alignement des objectifs d'apprentissage.
Le design de ce projet repose sur la taxonomie des 6 types d'apprentissage de l'ABC Learning Design (Diana Laurillard) :

| Type d'Apprentissage | Rôle de l'Apprenant | Exemples d'Activités Clés |
| :--- | :--- | :--- |
| **Acquisition** (Fondations) | Lecture, écoute, observation | Vidéos de cours, lectures, manuels, podcasts. |
| **Enquête** (Exploration) | Recherche, exploration, synthèse | Webquests, analyse de cas, exploration de bases de données. |
| **Discussion** (Échange) | Partage, débat, clarification | Forums, sessions Q/R, réunions de classe virtuelle. |
| **Collaboration** (Construction) | Travail en équipe, co-création | Projets de groupe, wikis, codage pair-à-pair. |
| **Entraînement** (Application) | Mise en pratique, réception de feedback | Quiz formatifs, exercices auto-corrigés, simulations. |
| **Production** (Création) | Articulation, démonstration de savoir | Rapports, essais, présentations, développement de code final. |

---
## 💻 Description de l'Outil Initial (DRANE Grand Est)

L'outil d'origine est une interface interactive de type **glisser-déposer (Drag and Drop)** conçue pour faciliter la scénarisation pédagogique dans le contexte de **Moodle**.

Il réalise l'opération clé de l'ABC LD : **associer le type d'activité d'apprentissage à l'outil technologique correspondant**.

**Fonctionnalités Clés de la Version Initiale :**

* **Alignement Activité-Outil** : Pour chacun des 6 types d'apprentissage, l'outil propose une liste d'activités Moodle (ressources, activités), H5P et d'outils numériques externes.
* **Modes Novice/Expert** : Un sélecteur permet de filtrer l'affichage des outils en fonction de la complexité technique souhaitée.
* **Storyboard Visuel** : L'utilisateur crée une séquence de cours en déposant les activités choisies dans la zone **"Mon Scénario"**.
* **Sortie** : Le storyboard permet d'ajouter des informations (durée, individuel/groupe, matériel) et offre une fonction d'exportation.

**Lien vers la ressource HTML initiale :**
[https://dane.ac-reims.fr/dokiel/moodle/draganddrop_ABC.html](https://dane.ac-reims.fr/dokiel/moodle/draganddrop_ABC.html)

---

## 🏗️ Structure du Projet

* **`index.html`** page d'accueil du projet ;
* **`styles.css`** page de style CSS ;
* **`/images/`** : Contient les ressources multimédias dans ce projet;
* **`/scripts/`** : JavaScript liés au projet;
* **`README.md`** : Ce document.

## ✅ Feuille de Route et Améliorations (Check-list)

Cette section sert de **liste de contrôle (to-do list)** 

### ⚙️ Développement Fonctionnel

- [x] **Restructuration du code**
- [ ] **Intégration d'API** : Permettre la connexion à des API d'IA
- [ ] **Génération Automatisée de Séquence** : Génération de séquences de cours basées sur des objectifs d'apprentissages (acquis d'apprentissages) et données du public-cible.
- [ ] **Fonction Export/Import** : Génération d'un fichier pouvant être importé pour reprendre un travail inachevé ou partagé avec d'autres utilisateurs.

### 📝 Révision du Contenu Pédagogique

- [ ] **Révision du contenu des cartes** : Affiner les descriptions et les exemples d'activités pour les rendre moins spécifiques (éviter les plug-in payants par exemple) et actuelles (Moodle/H5P/Autres)
- [ ] **Définition de l'Évaluation** : Ajouter un champ pour l'intégration de l'évaluation (formative et sommative) aux points clés du storyboard.
- [ ] **Révision des en-têtes** : Amélioration des en-têtes afin de s'approcher d'une scénarisation plus précise
- [ ] **Révision des modalités** : Amélioration des listes déroulantes pour aller plus loin que la dichotomie Présentiel/Distanciel - Individuel/Groupe


## Projet intial
- Page initiale de la ressource HTML : https://dane.ac-reims.fr/dokiel/moodle/draganddrop_ABC.html
- Basé sur ABC LD - [abc-ld.org](https://abc-ld.org/)

## Licence
Licensed under CC BY-NC-SA 4.0
