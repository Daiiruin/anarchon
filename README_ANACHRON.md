# ANACHRON

> Jeu d'enquête narratif full-stack où chaque affaire possède sa propre époque, sa propre ambiance et sa propre identité visuelle.

Anachron est un projet personnel full-stack construit autour de **React**, **NestJS** et **PostgreSQL**.

L'objectif est de créer un véritable moteur d'enquêtes réutilisable, et non un simple CRUD habillé en jeu.  
La première affaire se déroulera dans un hôtel dans une ambiance années 1960. D'autres affaires pourront ensuite prendre place dans une maison hantée, dans le futur, ou dans n'importe quel autre univers.

Le projet doit rester suffisamment raisonnable pour être terminé, tout en proposant une vraie complexité technique côté frontend, backend, base de données, logique métier et expérience utilisateur.

---

> ## ⚠️ Mise à jour d'architecture (backend)
>
> Ce README garde toute sa valeur pour la **vision produit et gameplay** : univers, parcours joueur, catalogue, lieux, personnages, interrogatoires, déductions, tableau d'enquête, accusation, thèmes, audio.
>
> En revanche, la V1 a été recentrée sur un backend beaucoup plus léger — voir `docs/README_BACKEND_SIMPLIFICATION.md`, qui fait désormais référence. Sont **abandonnés** :
> - le `GameEngine` générique et les `unlock_rules` / `unlock_rule_requirements` ;
> - le modèle de données par entité (`case_elements`, `locations`, `characters`, `evidences`, `documents`, `interrogation_questions`, `testimonies`, `deductions`, `deduction_requirements`, `board_relations`, `player_element_states`) ;
> - les modules NestJS `investigation`, `interrogations`, `deductions`, `game-engine` ;
> - la règle stricte « le frontend ne reçoit jamais un élément non débloqué » (section « Anti-spoil et sécurité ») — assouplie, voir plus bas.
>
> À la place : contenu narratif en fichiers JSON (interface `GameElement`), une seule table `player_discoveries`, états `hidden` / `available` / `discovered` calculés côté React, table `accusations` simplifiée.
>
> Sections de ce document désormais **obsolètes et remplacées**, marquées `(obsolète)` dans le sommaire ci-dessous : « Architecture backend NestJS », « Modèle de données PostgreSQL / TypeORM », « Game Engine », le point 1 de « Règles d'architecture importantes », les phases 3 à 8 de la « Roadmap d'implémentation », « Mini guide backend » et tout ce qui suit (entités, services, seed technique, premiers commits).
>
> Ce qui reste vrai et implémenté tel quel : `docs/01-backend-fondation.md` (auth, médias, catalogue/détail) et `docs/04-frontend-fondation.md` (login, catalogue, détail).

---

# Sommaire

1. [Vision générale](#vision-générale)
2. [Concept du jeu](#concept-du-jeu)
3. [Univers et identité d'Anachron](#univers-et-identité-danachron)
4. [Stack technique](#stack-technique)
5. [Parcours utilisateur](#parcours-utilisateur)
6. [Catalogue des affaires](#catalogue-des-affaires)
7. [Page détail d'une affaire](#page-détail-dune-affaire)
8. [Progression d'une affaire](#progression-dune-affaire)
9. [Structure d'une affaire](#structure-dune-affaire)
10. [Navigation dans une affaire](#navigation-dans-une-affaire)
11. [Lieux et scènes](#lieux-et-scènes)
12. [Personnages](#personnages)
13. [Interrogatoires](#interrogatoires)
14. [Déclarations et confrontations](#déclarations-et-confrontations)
15. [Déductions et conclusions](#déductions-et-conclusions)
16. [Indices et documents](#indices-et-documents)
17. [Tableau d'enquête](#tableau-denquête)
18. [Accusation finale](#accusation-finale)
19. [Thèmes et immersion](#thèmes-et-immersion)
20. [Audio](#audio)
21. [Assets et stockage](#assets-et-stockage)
22. [Anti-spoil et sécurité](#anti-spoil-et-sécurité)
23. [Responsive](#responsive)
24. [Architecture frontend](#architecture-frontend)
25. [Architecture backend NestJS](#architecture-backend-nestjs) — *(obsolète, voir README_BACKEND_SIMPLIFICATION.md)*
26. [Modèle de données PostgreSQL / TypeORM](#modèle-de-données-postgresql--typeorm) — *(obsolète, voir README_BACKEND_SIMPLIFICATION.md)*
27. [Game Engine](#game-engine) — *(obsolète, voir README_BACKEND_SIMPLIFICATION.md)*
28. [Règles d'architecture importantes](#règles-darchitecture-importantes) — *(point 1 obsolète)*
29. [MVP](#mvp)
30. [Ce qui n'est PAS dans la V1](#ce-qui-nest-pas-dans-la-v1)
31. [Roadmap d'implémentation](#roadmap-dimplémentation) — *(phases 3 à 8 obsolètes)*
32. [Mini guide backend](#mini-guide-backend) — *(obsolète, voir README_BACKEND_SIMPLIFICATION.md)*
33. [Premiers commits conseillés](#premiers-commits-conseillés) — *(obsolète)*

---

# Vision générale

Anachron est un jeu d'enquête narratif dans lequel le joueur rejoint une sorte de **QG / organisation temporelle** regroupant des affaires provenant de différentes époques.

Chaque affaire est indépendante :

- époque différente ;
- ambiance différente ;
- direction artistique différente ;
- musique et environnement sonore différents ;
- personnages différents ;
- lieux différents ;
- style d'interface propre à l'affaire ;
- même moteur de jeu derrière.

Exemples d'affaires envisagées :

- **Le meurtre de l'Hôtel Beaumont** — ambiance années 1960 ;
- **Maison hantée** — ambiance gothique / ancienne ;
- **Affaire futuriste** — univers science-fiction / interface holographique.

L'objectif architectural est que le backend et le moteur de progression restent génériques.

On ne veut jamais écrire :

```ts
if (evidence.key === 'lucas-badge') {
  unlockQuestion('lucas-badge-question');
}
```

Le contenu de chaque affaire doit être piloté par les données.

---

# Concept du jeu

Le joueur doit :

1. commencer une affaire ;
2. explorer les lieux disponibles ;
3. examiner des indices ;
4. consulter des documents ;
5. interroger les personnages ;
6. obtenir des déclarations ;
7. remarquer les contradictions ;
8. confronter les témoignages avec les éléments découverts ;
9. tirer certaines conclusions ;
10. débloquer progressivement de nouvelles pistes ;
11. consulter son tableau d'enquête ;
12. décider quand il pense avoir résolu l'affaire ;
13. présenter une accusation finale.

Le jeu ne doit pas trop guider le joueur.

Il ne doit jamais lui dire :

- combien de preuves il reste ;
- combien de questions restent à débloquer ;
- combien de lieux restent inconnus ;
- s'il est proche de la fin ;
- quel type de preuve utiliser dans une confrontation.

Le joueur ne sait que ce qu'il a réellement découvert.

---

# Univers et identité d'Anachron

Il existe deux grandes couches visuelles.

## 1. Le QG Anachron

Tout ce qui se trouve **hors d'une affaire** utilise une identité visuelle commune :

- login ;
- register ;
- catalogue des affaires ;
- détail d'une affaire ;
- navigation globale.

Direction artistique souhaitée :

- sombre ;
- sobre ;
- légèrement futuriste ;
- ambiance de QG / archives temporelles ;
- interfaces fines ;
- surfaces légèrement translucides ;
- grandes images ;
- dates et époques mises en avant ;
- animations discrètes ;
- sensation d'organisation secrète capable d'accéder à des affaires de différentes époques.

Le style ne doit pas tomber dans le "vaisseau spatial flashy".

Il doit rester élégant et crédible.

## 2. L'affaire elle-même

Dès que le joueur commence une affaire, l'identité visuelle du QG disparaît.

Le joueur doit être immergé dans l'univers de l'affaire.

Exemple pour Hôtel Beaumont :

- années 1960 ;
- papier jauni ;
- bois sombre ;
- photographies noir et blanc ;
- rapports de police ;
- typographie machine à écrire ;
- dossiers ;
- tampons ;
- vieux journaux ;
- bruit de pluie ;
- ambiance de hall ;
- musique discrète adaptée.

---

# Stack technique

## Frontend

- React
- TypeScript
- Vite
- React Router
- TanStack Query
- Zustand
- React Hook Form
- Zod
- Tailwind CSS
- CSS custom
- CSS variables
- shadcn/ui uniquement pour certains composants génériques
- React Flow pour le tableau d'enquête
- Vitest
- Testing Library
- Playwright

## Backend

- NestJS
- TypeScript
- TypeORM
- PostgreSQL
- JWT
- refresh token
- Swagger / OpenAPI
- Supertest
- migrations TypeORM

## Infra

- Docker Compose pour PostgreSQL en local
- stockage objet externe pour les médias
- CDN / object storage pour les images et sons

Possibilités futures :

- Cloudflare R2
- AWS S3
- Supabase Storage
- Backblaze B2

---

# Parcours utilisateur

Le parcours principal est :

```text
Login / Register
        ↓
Catalogue des affaires
        ↓
Détail d'une affaire
        ↓
Commencer / Reprendre
        ↓
Introduction éventuelle
        ↓
Carte des lieux
        ↓
Lieu
        ↓
Personnages / Indices / Documents
        ↓
Interrogatoires / Exploration
        ↓
Découvertes
        ↓
Tableau d'enquête
        ↓
Accusation finale
        ↓
Résultat
```

---

# Catalogue des affaires

Une fois connecté, le joueur arrive sur le catalogue.

Chaque affaire affiche :

- image / cover ;
- titre ;
- époque ;
- début du synopsis ;
- difficulté ;
- statut.

Le synopsis sur la carte est tronqué avec ellipsis.

Exemple :

```text
┌─────────────────────────────────────────┐
│                                         │
│           [ IMAGE HÔTEL ]               │
│                                         │
├─────────────────────────────────────────┤
│ LE MEURTRE DE L'HÔTEL BEAUMONT         │
│ Paris — 1962                            │
│                                         │
│ Un homme est retrouvé mort dans sa      │
│ chambre au quatrième étage de...        │
│                                         │
│ Difficulté : ●●●○○                     │
│                                         │
│ EN COURS                                │
└─────────────────────────────────────────┘
```

Statuts :

```text
Jamais commencé
En cours
Affaire résolue
```

On ne montre **aucun pourcentage de progression**.

Une fois l'affaire terminée, on peut afficher le score final :

```text
AFFAIRE RÉSOLUE — 75/100
```

---

# Page détail d'une affaire

Le joueur clique sur une affaire.

Le background / cover prend toute la page.

On affiche :

- bouton retour ;
- titre ;
- époque ;
- difficulté ;
- synopsis complet ;
- bouton d'action.

Exemple :

```text
← RETOUR AUX AFFAIRES

LE MEURTRE DE
L'HÔTEL BEAUMONT

PARIS — 1962

Difficulté
● ● ● ○ ○

Charles Beaumont est retrouvé mort
dans la chambre 417 de l'hôtel familial...

[ COMMENCER L'AFFAIRE ]
```

Boutons :

```text
Première fois :
COMMENCER L'AFFAIRE

Affaire déjà commencée :
REPRENDRE L'AFFAIRE

Affaire terminée :
CONSULTER L'AFFAIRE
```

Le replay n'est pas obligatoire en V1.

---

# Progression d'une affaire

Il n'y a jamais de sauvegarde manuelle.

La progression est automatiquement persistée en base.

Exemples d'informations sauvegardées :

- lieux débloqués ;
- personnages connus ;
- indices découverts ;
- documents découverts ;
- questions disponibles ;
- questions déjà posées ;
- déclarations obtenues ;
- déductions réussies ;
- relations du tableau connues ;
- dernier lieu visité ;
- accusation finale.

Le joueur peut donc :

```text
découvrir un indice
↓
fermer le navigateur
↓
revenir plus tard
↓
reprendre exactement son enquête
```

Les statuts sont dérivés de la progression :

```text
aucune CaseProgress
→ NOT_STARTED

CaseProgress + completedAt = null
→ IN_PROGRESS

completedAt != null
→ COMPLETED
```

On évite de stocker une colonne `status` inutile.

---

# Structure d'une affaire

Pour la V1, les catégories visibles côté joueur sont :

```text
Suspects / Personnages
Lieux
Indices
Témoignages
Documents
```

Côté moteur, on aura également :

```text
Questions
Déductions
Relations du tableau
```

Chaque affaire pourra utiliser ces briques différemment.

Le moteur doit permettre :

```text
Explorer
Interroger
Examiner
Découvrir
Débloquer
Confronter
Déduire
Accuser
```

Le contenu pilote le gameplay.

---

# Navigation dans une affaire

La navigation entre les lieux se fait via une **carte propre à chaque affaire**.

Exemple Hôtel Beaumont :

- plan papier de l'hôtel ;
- style années 1960 ;
- lieux accessibles cliquables.

Maison hantée :

- vieux plan dessiné ;
- parchemin / blueprint ancien.

Futur :

- carte holographique ;
- plan numérique.

Le fonctionnement technique reste identique.

Un bouton permet d'ouvrir la carte à tout moment.

Les lieux non découverts ne sont **pas affichés**.

Pas de :

```text
🔒 Sous-sol
🔒 Pièce inconnue
🔒 ???
```

Si le joueur ne connaît pas le lieu, il ne sait même pas qu'il existe.

---

# Lieux et scènes

Chaque lieu possède son propre background.

Exemple Hôtel Beaumont :

```text
Hall
Bar
Réception
Chambre 417
Bureau du directeur
Sous-sol
...
```

Une scène prend quasiment tout l'écran.

En bas se trouve une interface avec plusieurs catégories.

Exemple :

```text
[ PERSONNAGES ] [ INDICES ] [ DOCUMENTS ]
```

Selon le lieu, certaines catégories peuvent être vides.

Le contenu du lieu peut évoluer au fur et à mesure de l'enquête.

Exemple :

```text
BAR

Au début :

Personnages
- Emma Laurent

Indices
- Verre

Documents
- Registre des consommations
```

Plus tard, après une découverte :

```text
Indices
- Verre
- Tiroir sous le comptoir
```

Certains éléments sont disponibles immédiatement.

D'autres apparaissent uniquement après :

- découverte d'une piste ;
- réponse d'un personnage ;
- confrontation ;
- déduction ;
- autre événement de gameplay.

On utilise un mélange de :

- exploration libre limitée ;
- exploration guidée par les informations découvertes.

La quantité de liberté peut varier selon l'histoire.

---

# Personnages

Lorsqu'un personnage se trouve dans un lieu :

```text
[ PERSONNAGES ]

Lucas Martin
Marie Dubois
```

Le joueur clique sur un personnage.

Une fiche s'ouvre avec :

- portrait ;
- nom complet ;
- rôle ;
- éventuellement âge ;
- informations connues.

Navigation interne :

```text
[ DOSSIER ]
[ INTERROGER ]
[ DÉCLARATIONS ]
```

## Dossier

Le dossier ne montre que les informations réellement connues.

On ne montre pas :

```text
Relation avec victime : ???
Secret : 🔒
Question inconnue : 🔒
```

Une information inconnue n'existe pas encore visuellement pour le joueur.

---

# Interrogatoires

Les interrogatoires utilisent des **questions à choix**.

On ne crée pas un système RPG avec :

- agressivité ;
- empathie ;
- intimidation ;
- humeur ;
- karma ;
- réputation.

Le joueur choisit simplement les questions qu'il souhaite poser.

Exemple :

```text
QUE VOULEZ-VOUS LUI DEMANDER ?

→ Quelle relation aviez-vous avec Charles ?

→ Où étiez-vous vers 22 h 30 ?

→ Qui avait accès au quatrième étage ?
```

Certaines questions sont disponibles immédiatement.

D'autres se débloquent grâce à une information.

D'autres encore nécessitent d'abord une confrontation réussie.

On distingue trois grands types de questions :

## Questions de base

Disponibles dès la découverte du personnage.

## Questions débloquées par une information

Exemple :

```text
Découverte d'une lettre
↓
Nouvelle question :
"Pourquoi Charles vous écrivait-il ?"
```

## Questions débloquées après confrontation

Exemple :

```text
Lucas affirme :
"Je n'ai pas quitté la réception."

+

preuve d'utilisation de son badge

↓

Confrontation réussie

↓

Nouvelle question :
"Votre badge a ouvert la chambre 417 à 22 h 32.
Comment l'expliquez-vous ?"
```

Aucune icône `!` ne doit prévenir le joueur qu'une nouvelle question est disponible.

Il doit penser lui-même à retourner voir le personnage.

---

# Déclarations et confrontations

Certaines réponses importantes deviennent des **déclarations / témoignages** exploitables.

Exemple :

```text
Lucas affirme être resté
à la réception entre 22 h et 23 h.
```

Cette information apparaît ensuite dans :

```text
Lucas Martin
→ Déclarations
```

Le joueur peut cliquer sur :

```text
[ CONFRONTER ]
```

Le jeu demande alors :

```text
Quel élément remet cette déclaration en cause ?
```

Le joueur peut choisir parmi **TOUS les éléments qu'il a découverts**.

On ne filtre pas les options "pertinentes".

Exemple :

```text
- Photo de Mme Martin
- Badge de Lucas
- Verre brisé
- Lettre de Charles
- Registre des appels
- Témoignage d'Emma
- Plan de l'hôtel
- Ticket du bar
- Clé de la chambre 417
```

S'il choisit une mauvaise preuve :

```text
Cet élément ne permet pas de remettre cette déclaration en cause.
```

Et il peut réessayer.

Pas de :

- vie perdue ;
- score négatif ;
- cooldown ;
- limite d'essais ;
- indice caché dans le message d'erreur.

Le joueur est libre de brute force s'il veut se gâcher l'expérience.

---

# Déductions et conclusions

Le terme `deduction` est principalement un terme backend.

Dans l'interface, on utilise plutôt :

```text
Confronter
Examiner
Tirer une conclusion
```

Deux grandes formes de raisonnement :

## 1. Confrontation

Une déclaration est confrontée à une ou plusieurs informations.

Exemple :

```text
Lucas :
"Je suis resté à la réception."

+

Registre des badges :
Badge Lucas → chambre 417 → 22 h 32

↓

Contradiction établie
```

Cela peut débloquer :

- nouvelle question ;
- nouvelle déclaration ;
- nouvelle piste ;
- nouvelle relation ;
- nouvel indice.

## 2. Conclusion logique

Toutes les déductions ne concernent pas un mensonge.

Exemple :

```text
Aucun signe d'effraction
+
porte qui se verrouille automatiquement
+
clé de service existante
↓
question de raisonnement
```

Le joueur doit tirer une conclusion à partir des informations connues.

Les tentatives sont illimitées pendant l'enquête.

Seule l'accusation finale est définitive.

---

# Indices et documents

## Indices

Le terme UI recommandé est `Indices`.

Il peut représenter :

- objet ;
- trace ;
- anomalie ;
- élément physique ;
- preuve matérielle.

Exemples :

```text
Badge
Verre brisé
Empreinte
Trace de sang
Tache sur le tapis
```

Le joueur peut examiner un indice.

Certaines inspections peuvent révéler de nouvelles informations.

## Documents

Les documents sont séparés visuellement des indices.

Exemples :

- registre ;
- lettre ;
- rapport ;
- journal ;
- archive ;
- historique d'accès ;
- note de service.

Leur rendu dépend fortement du thème.

Hôtel Beaumont :

- papier ;
- registre années 60 ;
- rapport de police.

Maison hantée :

- journal manuscrit ;
- parchemin ;
- lettre ancienne.

Futur :

- terminal ;
- data fragment ;
- fichier holographique.

---

# Tableau d'enquête

La V1 comporte un **tableau d'enquête uniquement**.

Pas de timeline.

Le tableau :

- est purement visuel ;
- se remplit automatiquement ;
- n'est pas construit manuellement par le joueur ;
- ne sert pas à déplacer des éléments pour résoudre des puzzles ;
- montre les éléments découverts ;
- montre les relations connues ;
- sert de résumé mental de l'enquête.

React Flow est envisagé pour l'implémentation.

Exemple :

```text
        [Lucas]
        /     \
   [Badge]   [Victime]
      |
[Chambre 417]
```

Une relation peut apparaître seulement après sa découverte.

Exemple :

```text
Lucas
  ↓
possède
  ↓
Badge #14
```

Le tableau n'est plus l'écran principal du jeu.

La majorité du gameplay se déroule dans les lieux.

Le tableau reste accessible à tout moment.

---

# Accusation finale

À tout moment, lorsque le joueur pense avoir compris l'affaire, il peut lancer l'accusation finale.

Il doit répondre à quatre éléments :

```text
Coupable
Mobile
Arme
Heure
```

Une seule tentative est autorisée.

Avant validation :

```text
Êtes-vous certain de vouloir conclure l'affaire ?

Votre accusation sera définitive.
Vous ne disposerez d'aucune seconde tentative.

[ Retourner à l'enquête ]

[ Présenter mon accusation ]
```

Puis :

```text
[ RENDRE MON VERDICT ]
```

Le backend vérifie tout.

La solution correcte n'est jamais envoyée au frontend avant validation.

Score V1 proposé :

```text
Coupable correct   +25
Mobile correct     +25
Arme correcte      +25
Heure correcte     +25

TOTAL /100
```

Une fois l'affaire terminée :

- `completedAt` est renseigné ;
- le score peut apparaître dans le catalogue ;
- le verdict devient définitif.

---

# Thèmes et immersion

Chaque affaire possède son propre système de thème.

On distingue trois niveaux.

## 1. Composants universels

Mécaniques identiques :

```text
Case
Evidence
Character
Location
Interrogation
Deduction
Accusation
```

## 2. Composants thémables

Même composant, apparence différente.

Exemple :

```tsx
<EvidenceCard />
```

Hôtel Beaumont :

- fiche jaunie ;
- trombone ;
- photo noir et blanc.

Maison hantée :

- feuille déchirée ;
- écriture manuscrite.

Futur :

- carte holographique ;
- terminal numérique.

## 3. Composants réellement spécifiques

Certaines affaires peuvent avoir leurs propres renderers.

Exemples :

```tsx
<HotelPoliceReport />
<HauntedJournalPage />
<FutureDataFragment />
```

On évite un énorme composant avec :

```ts
if (theme === 'hotel') ...
if (theme === 'haunted') ...
if (theme === 'future') ...
```

---

# CSS / design system

Choix :

```text
Tailwind CSS
+
CSS variables
+
CSS custom
+
shadcn/ui pour les briques génériques
```

Ant Design n'est pas retenu pour le cœur visuel du jeu car il imposerait trop son identité.

Les variables de thème peuvent ressembler à :

```css
[data-theme="hotel-1960"] {
  --background: #e6dcc7;
  --surface: #d0c09f;
  --text: #28231c;
  --muted: #746957;

  --font-title: "Cormorant Garamond";
  --font-body: "Special Elite";
}
```

Chaque affaire peut également disposer de :

- textures ;
- fonts ;
- backgrounds ;
- effets ;
- bordures ;
- animations ;
- assets UI.

---

# Audio

Chaque affaire possède sa propre ambiance sonore.

L'audio peut également varier selon les lieux.

Exemple Hôtel Beaumont :

```text
Hall
→ ambiance de réception
→ pluie extérieure
→ jazz très discret

Bar
→ brouhaha léger
→ verres
→ musique différente

Chambre 417
→ ambiance plus silencieuse / lourde
```

Options minimales :

```text
Volume ambiance
Volume effets
Son ON/OFF
```

Le navigateur peut imposer une interaction utilisateur avant lecture audio automatique.

On gérera cela côté implémentation.

---

# Assets et stockage

Les images et sons ne sont pas stockés directement dans PostgreSQL.

Architecture :

```text
React
   ↓
NestJS
   ↓
PostgreSQL
   │
   └── références / chemins des assets

Object Storage
   ├── images
   └── audio
```

Organisation proposée :

```text
cases/
│
├── hotel-beaumont/
│   ├── cover/
│   │   └── cover.webp
│   ├── locations/
│   │   ├── hall/
│   │   │   └── background.webp
│   │   ├── bar/
│   │   │   └── background.webp
│   │   └── room-417/
│   │       └── background.webp
│   ├── characters/
│   │   ├── lucas-martin.webp
│   │   └── ...
│   ├── evidences/
│   │   ├── badge.webp
│   │   └── ...
│   ├── documents/
│   │   └── ...
│   ├── textures/
│   │   └── ...
│   └── audio/
│       ├── ambience.mp3
│       └── ...
│
├── blackwood-house/
│   └── ...
│
└── project-2187/
    └── ...
```

Formats conseillés :

```text
Backgrounds : WebP / AVIF
Portraits : WebP
UI : SVG si possible
Audio : MP3 en V1
```

Les gros backgrounds doivent être optimisés.

Préchargement intelligent :

- charger le lieu actuel ;
- charger les portraits visibles ;
- éventuellement précharger les lieux déjà accessibles ;
- ne jamais télécharger toute l'affaire d'un coup.

---

# Anti-spoil et sécurité

> **Obsolète (assoupli) :** Anachron étant une expérience solo non compétitive, `README_BACKEND_SIMPLIFICATION.md` assume que le frontend calcule lui-même les états `hidden`/`available`/`discovered` à partir du contenu JSON complet de l'affaire. Seule `solution.json` reste strictement backend. La règle ci-dessous décrit l'intention originelle (ne jamais spoiler le joueur) mais plus son application stricte côté transport réseau.

Règle fondamentale :

> Le frontend ne doit jamais recevoir une information narrative qu'il n'a pas encore débloquée.

Mauvais :

```json
{
  "id": "secret-evidence",
  "title": "Lettre du meurtrier",
  "isUnlocked": false
}
```

Même si `isUnlocked` vaut `false`, le joueur voit déjà le titre dans DevTools.

Bon comportement :

```json
[
  {
    "id": "known-evidence",
    "title": "Badge de Lucas"
  }
]
```

Les éléments inconnus ne sont pas présents du tout.

Cela concerne :

- lieux ;
- personnages ;
- indices ;
- documents ;
- témoignages ;
- questions ;
- déductions ;
- relations du tableau ;
- solution finale.

Même logique pour les assets secrets :

- ne pas placer les images narratives secrètes directement dans le bundle React ;
- utiliser le stockage externe ;
- Nest ne donne l'URL que lorsque l'élément est accessible.

Les assets purement décoratifs du thème peuvent rester publics.

---

# Responsive

V1 :

```text
Desktop uniquement
```

Pas de responsive mobile/tablette prioritaire.

Le tableau, les scènes et la carte étant visuellement importants, la V1 cible l'expérience desktop.

---

# Architecture frontend

Structure envisagée :

```text
src/
├── app/
├── features/
│   ├── auth/
│   ├── cases/
│   ├── investigation/
│   ├── interrogations/
│   ├── deductions/
│   └── accusation/
├── game/
│   ├── scene/
│   ├── board/
│   ├── map/
│   └── evidence-viewer/
├── themes/
│   ├── hotel-1960/
│   │   ├── theme.css
│   │   ├── theme.ts
│   │   └── assets/
│   ├── haunted-house/
│   └── future/
└── shared/
```

Gestion des données :

```text
TanStack Query
→ server state

Zustand
→ état UI local uniquement
```

Ne pas recopier les données du backend dans Zustand.

Exemples d'état Zustand :

```ts
{
  selectedCharacterId,
  activeBottomCategory,
  isBoardOpen,
  isMapOpen,
  currentModal
}
```

---

# Architecture backend NestJS

> **Obsolète :** remplacé par l'organisation décrite dans `docs/README_BACKEND_SIMPLIFICATION.md` (section « Nouvelle structure des modules NestJS »). Les modules `investigation`, `interrogations`, `deductions`, `game-engine` disparaissent ; `progression` devient un simple module `discoveries`.

Architecture complète retenue (obsolète) :

```text
src/
├── auth/
├── users/
├── cases/
├── investigation/
├── interrogations/
├── deductions/
├── progression/
├── game-engine/
├── accusations/
├── media/
├── database/
├── config/
├── app.module.ts
└── main.ts
```

## AuthModule

Responsabilités :

- register ;
- login ;
- JWT ;
- refresh token ;
- logout ;
- guards.

## UsersModule

Responsabilités :

- données utilisateur ;
- profil ;
- accès utilisateur.

## CasesModule

Responsabilités :

- catalogue ;
- métadonnées des affaires ;
- `CaseEntity` ;
- `CaseElementEntity` ;
- publication ;
- difficulté ;
- thème ;
- synopsis.

## InvestigationModule

Responsabilités :

- lieux ;
- personnages ;
- indices ;
- documents ;
- témoignages ;
- tableau d'enquête ;
- données visibles selon la progression.

## InterrogationsModule

Responsabilités :

- questions ;
- réponses ;
- validation des questions accessibles ;
- interrogation d'un personnage.

## DeductionsModule

Responsabilités :

- confrontations ;
- conclusions ;
- vérification des éléments sélectionnés ;
- tentative réussie ou échouée.

## ProgressionModule

Responsabilités :

- `CaseProgress` ;
- `PlayerElementState` ;
- démarrage d'une affaire ;
- lecture de progression ;
- écriture de progression.

Services envisagés :

```text
ProgressionService
ProgressionQueryService
```

## GameEngineModule

Cœur logique du jeu.

Responsabilités :

- règles de déblocage ;
- conséquences d'une action ;
- propagation des changements ;
- vérification des requirements.

Le frontend n'appelle jamais directement le GameEngine.

## AccusationsModule

Responsabilités :

- options finales ;
- solution ;
- tentative unique ;
- score ;
- clôture de l'affaire.

## MediaModule

Responsabilités :

- résolution des assets ;
- object storage ;
- URLs ;
- éventuellement signed URLs.

## Database

Responsabilités :

- TypeORM ;
- migrations ;
- seeds ;
- data source.

## Config

Responsabilités :

- configuration ;
- validation env ;
- paramètres DB ;
- paramètres JWT ;
- stockage média.

---

# Modèle de données PostgreSQL / TypeORM

> **Obsolète :** ce modèle par entité (une table par type de contenu narratif + moteur de règles) est abandonné. Le nouveau modèle est décrit dans `docs/README_BACKEND_SIMPLIFICATION.md` (section « Modèle de données PostgreSQL simplifié ») : `users` et `refresh_sessions` sont conservées telles quelles ci-dessous ; `cases` et `media_assets` restent valides (voir `docs/01-backend-fondation.md`, déjà implémenté) ; tout ce qui suit à partir de `case_elements` (locations, characters, evidences, documents, interrogation_questions, testimonies, deductions, deduction_requirements, board_relations, player_element_states, unlock_rules, unlock_rule_requirements) est remplacé par du contenu JSON + une table unique `player_discoveries`. `accusation_options` / `case_solutions` / `final_attempts` sont remplacées par une table `accusations` plus simple.

## users

```text
users
────────────────────────
id                  UUID PK
email               VARCHAR UNIQUE
password_hash       VARCHAR
created_at          TIMESTAMP
updated_at          TIMESTAMP
```

## refresh_sessions

```text
refresh_sessions
────────────────────────
id                  UUID PK
user_id             UUID FK
token_hash          VARCHAR
expires_at          TIMESTAMP
revoked_at          TIMESTAMP NULL
created_at          TIMESTAMP
```

---

## cases

```text
cases
─────────────────────────────────
id                      UUID PK
slug                    VARCHAR UNIQUE
title                   VARCHAR
era_label               VARCHAR
synopsis                TEXT
difficulty              SMALLINT
theme_key               VARCHAR
publication_status      ENUM
cover_asset_id          UUID FK NULL
detail_background_id    UUID FK NULL
map_asset_id            UUID FK NULL
sort_order              INTEGER
created_at              TIMESTAMP
updated_at              TIMESTAMP
```

Contrainte :

```sql
CHECK (difficulty BETWEEN 1 AND 5)
```

Publication :

```ts
enum CasePublicationStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
}
```

---

## media_assets

```text
media_assets
────────────────────────────────
id                  UUID PK
case_id             UUID FK NULL
key                 VARCHAR
type                ENUM
storage_path        VARCHAR
mime_type           VARCHAR
width               INTEGER NULL
height              INTEGER NULL
duration_ms         INTEGER NULL
is_private          BOOLEAN
created_at          TIMESTAMP
```

---

## case_elements

Table centrale.

Tous les éléments pouvant être débloqués ou utilisés dans la progression possèdent un `CaseElement`.

```text
case_elements
────────────────────────────────
id                      UUID PK
case_id                 UUID FK
key                     VARCHAR
type                    ENUM
is_initially_unlocked   BOOLEAN
sort_order              INTEGER
```

Contrainte :

```text
UNIQUE(case_id, key)
```

Types :

```ts
enum CaseElementType {
  LOCATION = 'LOCATION',
  CHARACTER = 'CHARACTER',
  EVIDENCE = 'EVIDENCE',
  DOCUMENT = 'DOCUMENT',
  TESTIMONY = 'TESTIMONY',
  QUESTION = 'QUESTION',
  DEDUCTION = 'DEDUCTION',
  BOARD_RELATION = 'BOARD_RELATION',
}
```

Exemples de keys :

```text
hotel.location.hall
hotel.location.room-417
hotel.character.lucas
hotel.evidence.broken-glass
hotel.document.badge-register
hotel.question.lucas.alibi
hotel.testimony.lucas.alibi
hotel.deduction.lucas-false-alibi
```

Les UUID servent dans le jeu.

Les `key` servent principalement à :

- seeds ;
- migrations de contenu ;
- lisibilité ;
- debugging.

---

## locations

```text
locations
────────────────────────────────
element_id              UUID PK/FK
name                    VARCHAR
description             TEXT
background_asset_id     UUID FK
ambient_audio_asset_id  UUID FK NULL
map_x                   DECIMAL
map_y                   DECIMAL
```

`element_id` pointe vers `case_elements`.

---

## characters

```text
characters
────────────────────────────────
element_id              UUID PK/FK
full_name               VARCHAR
role                    VARCHAR
age                     INTEGER NULL
description             TEXT
portrait_asset_id       UUID FK
location_element_id     UUID FK
```

V1 :

> un personnage appartient à un lieu principal.

Un système de déplacement dynamique pourra être ajouté plus tard si une affaire le nécessite.

---

## evidences

```text
evidences
────────────────────────────────
element_id             UUID PK/FK
title                  VARCHAR
description            TEXT
examination_text       TEXT NULL
media_asset_id         UUID FK NULL
location_element_id    UUID FK NULL
```

---

## documents

```text
documents
────────────────────────────────
element_id             UUID PK/FK
title                  VARCHAR
summary                TEXT NULL
content                TEXT NULL
media_asset_id         UUID FK NULL
location_element_id    UUID FK NULL
```

---

## interrogation_questions

```text
interrogation_questions
────────────────────────────────
element_id              UUID PK/FK
character_element_id    UUID FK
prompt                  TEXT
answer                  TEXT
sort_order              INTEGER
```

---

## testimonies

```text
testimonies
────────────────────────────────
element_id                  UUID PK/FK
character_element_id        UUID FK
source_question_element_id  UUID FK NULL
statement                   TEXT
is_confrontable             BOOLEAN
```

---

## deductions

```text
deductions
────────────────────────────────
element_id                  UUID PK/FK
type                        ENUM
source_testimony_id         UUID FK NULL
context_element_id          UUID FK NULL
prompt                      TEXT
success_text                TEXT
selection_mode              ENUM
```

Types :

```ts
enum DeductionType {
  CONFRONTATION = 'CONFRONTATION',
  CONCLUSION = 'CONCLUSION',
}
```

Mode de sélection :

```ts
enum DeductionSelectionMode {
  SINGLE = 'SINGLE',
  MULTIPLE = 'MULTIPLE',
}
```

---

## deduction_requirements

```text
deduction_requirements
────────────────────────────────
id                     UUID PK
deduction_element_id   UUID FK
clue_element_id        UUID FK
```

Le joueur voit toutes les informations qu'il possède.

Le backend connaît les requirements corrects.

---

## board_relations

```text
board_relations
────────────────────────────────
element_id          UUID PK/FK
from_element_id     UUID FK
to_element_id       UUID FK
label               VARCHAR NULL
```

Une relation est elle-même un `CaseElement`.

Elle peut donc être débloquée progressivement.

---

## case_progress

```text
case_progress
────────────────────────────────
id                         UUID PK
user_id                    UUID FK
case_id                    UUID FK
started_at                 TIMESTAMP
completed_at               TIMESTAMP NULL
last_location_element_id   UUID FK NULL
```

Contrainte :

```text
UNIQUE(user_id, case_id)
```

---

## player_element_states

Table centrale de progression joueur.

```text
player_element_states
────────────────────────────────
id                  UUID PK
case_progress_id    UUID FK
element_id          UUID FK
unlocked_at         TIMESTAMP
completed_at        TIMESTAMP NULL
```

Contrainte :

```text
UNIQUE(case_progress_id, element_id)
```

Interprétation possible :

| Element | Unlocked | Completed |
|---|---|---|
| Location | lieu connu | lieu visité |
| Character | personnage connu | généralement inutilisé |
| Evidence | indice découvert | examiné |
| Document | document découvert | consulté |
| Question | question disponible | question posée |
| Testimony | déclaration obtenue | généralement inutilisé |
| Deduction | raisonnement disponible | réussi |
| BoardRelation | relation connue | généralement inutilisé |

---

## unlock_rules

```text
unlock_rules
────────────────────────────────
id                  UUID PK
case_id             UUID FK
target_element_id   UUID FK
mode                ENUM
```

Modes :

```ts
enum UnlockRuleMode {
  ALL = 'ALL',
  ANY = 'ANY',
}
```

---

## unlock_rule_requirements

```text
unlock_rule_requirements
────────────────────────────────
id                  UUID PK
rule_id             UUID FK
source_element_id   UUID FK
required_state      ENUM
```

États :

```ts
enum RequiredElementState {
  UNLOCKED = 'UNLOCKED',
  COMPLETED = 'COMPLETED',
}
```

Exemple :

```text
RÈGLE

Si :
deduction.lucas-false-alibi = COMPLETED

Alors :
question.lucas.badge = UNLOCKED
```

---

## accusation_options

```text
accusation_options
────────────────────────────────
id                  UUID PK
case_id             UUID FK
type                ENUM
label               VARCHAR
related_element_id  UUID FK NULL
sort_order          INTEGER
```

Types :

```ts
enum AccusationOptionType {
  CULPRIT = 'CULPRIT',
  MOTIVE = 'MOTIVE',
  WEAPON = 'WEAPON',
  TIME = 'TIME',
}
```

---

## case_solutions

La solution est séparée des options.

Ne jamais utiliser :

```text
is_correct = true
```

dans les options publiques.

```text
case_solutions
────────────────────────────────
case_id             UUID PK/FK
culprit_option_id   UUID FK
motive_option_id    UUID FK
weapon_option_id    UUID FK
time_option_id      UUID FK
```

Cette table ne doit jamais être exposée dans une route destinée au joueur.

---

## final_attempts

```text
final_attempts
────────────────────────────────
id                         UUID PK
case_progress_id           UUID FK UNIQUE
culprit_option_id          UUID FK
motive_option_id           UUID FK
weapon_option_id           UUID FK
time_option_id             UUID FK
score                      SMALLINT
submitted_at               TIMESTAMP
```

Le `UNIQUE(case_progress_id)` garantit qu'une seule tentative finale est possible, même si quelqu'un tente plusieurs requêtes manuelles.

---

# Game Engine

> **Obsolète :** aucun `GameEngine` générique n'est construit. Le déblocage se réduit à une liste `requiredDiscoveries` par élément JSON, calculée côté React — voir `docs/README_BACKEND_SIMPLIFICATION.md` (section « Déblocage des éléments »).

Le Game Engine est la partie centrale du backend (obsolète, voir note ci-dessus).

Principe :

```text
ACTION DU JOUEUR
      ↓
Module métier
      ↓
GameEngine
      ↓
Progression
      ↓
UnlockRules
      ↓
Nouveaux éléments disponibles
```

Exemple :

```text
Question Lucas posée
        ↓
Question COMPLETED
        ↓
GameEngine
        ↓
Témoignage Lucas débloqué
        ↓
BoardRelation débloquée
```

Autre exemple :

```text
Déduction "Lucas ment" réussie
        ↓
Deduction COMPLETED
        ↓
GameEngine
        ↓
Question "Votre badge..." débloquée
```

Le moteur doit pouvoir évaluer :

```text
ALL requirements
ANY requirement
```

Le backend ne doit pas connaître le scénario sous forme de conditions codées en dur.

---

# Règles d'architecture importantes

## 1. La progression ne doit pas être modifiée n'importe où

> **Obsolète :** cette règle supposait un `GameEngine` central. Sans lui, `DiscoveriesService` (ou équivalent) fait directement les quelques vérifications nécessaires (existence, doublon, éventuellement `requiredDiscoveries`) — voir `docs/README_BACKEND_SIMPLIFICATION.md`, section « Sécurité et limites assumées ».

Règle (obsolète) :

> Les modules métier ne débloquent pas arbitrairement des éléments directement.

On évite :

```ts
await progressionService.unlockElement(questionId);
```

dans un service métier sans passer par la logique prévue.

Flux souhaité :

```text
Interrogation
Investigation
Deduction
      ↓
GameEngine
      ↓
Progression
      ↓
PostgreSQL
```

---

## 2. Le frontend ne connaît jamais les éléments cachés

Même les IDs, titres ou nombres d'éléments ne doivent pas être envoyés inutilement.

---

## 3. Les affaires doivent être data-driven

L'Hôtel Beaumont ne doit pas avoir de logique métier spécifique dans NestJS.

---

## 4. Migrations TypeORM

Utiliser les migrations.

Éviter `synchronize: true` dès que le projet commence à avoir des données importantes.

En production :

```text
synchronize: false
```

---

## 5. Transactions

Transactions indispensables pour :

- démarrage d'une affaire ;
- déblocages importants ;
- accusation finale ;
- opérations nécessitant plusieurs écritures cohérentes.

---

# MVP

La V1 contient :

- login ;
- register ;
- catalogue des affaires ;
- une seule affaire jouable ;
- détail d'affaire ;
- statut jamais commencé / en cours / terminée ;
- carte des lieux ;
- backgrounds plein écran ;
- personnages ;
- indices ;
- documents ;
- interrogatoires ;
- questions débloquées ;
- témoignages ;
- confrontations ;
- conclusions ;
- tableau d'enquête automatique ;
- progression persistante ;
- accusation finale ;
- score ;
- ambiance sonore ;
- thème Hôtel Beaumont ;
- desktop.

Première affaire :

```text
Le meurtre de l'Hôtel Beaumont
Paris — années 1960
```

Le nombre exact de :

- suspects ;
- lieux ;
- preuves ;
- documents ;
- interrogatoires ;
- déductions ;

sera défini après l'écriture détaillée de l'affaire.

---

# Ce qui n'est PAS dans la V1

Pas de :

- timeline ;
- timeline interactive ;
- drag & drop ;
- construction manuelle du tableau ;
- mobile ;
- tablette prioritaire ;
- multiplayer ;
- WebSocket ;
- Redis ;
- BullMQ ;
- système RPG de dialogue ;
- karma ;
- réputation ;
- jauge de confiance ;
- admin UI ;
- éditeur d'affaires ;
- création d'affaires par IA ;
- pourcentage de progression ;
- compteur de preuves ;
- compteur de questions ;
- vies ;
- pénalité sur erreur de déduction ;
- hints automatiques ;
- points perdus pendant les confrontations.

---

# Roadmap d'implémentation

## Phase 1 — Fondation

```text
Auth
Users
PostgreSQL
TypeORM
Config
Migrations
Docker
```

Objectif :

```text
Register
Login
JWT
Refresh
Database opérationnelle
```

---

## Phase 2 — Affaires

```text
CasesModule
CaseEntity
CaseElementEntity
MediaAsset
```

Objectif :

```text
Catalogue
Détail d'une affaire
Affaire publiée
```

Frontend déjà possible :

```text
Login
↓
Catalogue Anachron
↓
Hôtel Beaumont
```

---

## Phase 3 — Progression (obsolète)

> **Obsolète à partir d'ici jusqu'à la phase 8 incluse :** voir `docs/README_BACKEND_SIMPLIFICATION.md` pour le plan de migration retenu (contenu JSON, `player_discoveries`, états calculés côté React, pas de `GameEngine`). La phase 9 (contenu réel Hôtel Beaumont) reste pertinente, seulement écrite en JSON plutôt qu'en lignes de base de données.

```text
CaseProgress
PlayerElementState
ProgressionService
ProgressionQueryService
```

Objectif :

```text
Commencer
Reprendre
Connaître les éléments débloqués
```

---

## Phase 4 — Game Engine

```text
UnlockRule
UnlockRuleRequirement
GameEngineService
UnlockEngineService
```

Objectif :

```text
completeElement()
↓
evaluateRules()
↓
unlockElement()
```

---

## Phase 5 — Investigation

```text
Locations
Characters
Evidences
Documents
BoardRelations
```

Objectif :

```text
Carte
↓
Lieu
↓
Personnages / Indices / Documents
↓
Tableau automatique
```

---

## Phase 6 — Interrogatoires

```text
Questions
Réponses
Testimonies
```

Objectif :

```text
Interroger
↓
Réponse
↓
Question complétée
↓
Nouvelles informations
```

---

## Phase 7 — Déductions

```text
Confrontations
Conclusions
DeductionRequirements
```

Objectif :

```text
Choisir une déclaration
↓
Choisir parmi toutes les infos découvertes
↓
Tentative
↓
Succès / échec
```

---

## Phase 8 — Accusation finale

```text
Coupable
Mobile
Arme
Heure
Score
Tentative unique
```

---

## Phase 9 — Contenu réel Hôtel Beaumont

Une fois le moteur stable :

- écrire l'histoire complète ;
- créer les personnages ;
- créer les lieux ;
- créer les indices ;
- créer les documents ;
- créer les questions ;
- créer les témoignages ;
- créer les confrontations ;
- créer les conclusions ;
- créer les assets ;
- créer les sons ;
- construire les seeds complets.

---

# Mini guide backend

> **Obsolète — jusqu'à la fin du document.** Cette section et toutes celles qui suivent (« Premières entités à créer », « Premiers services », « Seed technique Hôtel Beaumont », « Premiers commits conseillés ») décrivent l'ancien modèle par entités et le `GameEngine`. Elles sont remplacées par `docs/README_BACKEND_SIMPLIFICATION.md`, notamment sa section « Plan de migration ». Les sections finales « Principe directeur », « État actuel des décisions » et « Résumé court » restent valables pour la partie vision produit, mais leurs schémas backend (« Action joueur → GameEngine → UnlockRules ») sont obsolètes.

Cette section sert de point de départ concret lorsque le backend est initialisé (obsolète, voir note ci-dessus).

## Arborescence cible

```text
src/
├── app.module.ts
├── main.ts
│
├── auth/
│   ├── auth.module.ts
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── dto/
│   ├── guards/
│   └── strategies/
│
├── users/
│   ├── users.module.ts
│   ├── users.controller.ts
│   ├── users.service.ts
│   ├── entities/
│   │   └── user.entity.ts
│   └── dto/
│
├── cases/
│   ├── cases.module.ts
│   ├── cases.controller.ts
│   ├── cases.service.ts
│   ├── entities/
│   │   ├── case.entity.ts
│   │   └── case-element.entity.ts
│   ├── enums/
│   │   ├── case-element-type.enum.ts
│   │   └── case-publication-status.enum.ts
│   └── dto/
│
├── investigation/
│   ├── investigation.module.ts
│   ├── investigation.controller.ts
│   ├── investigation.service.ts
│   ├── entities/
│   │   ├── location.entity.ts
│   │   ├── character.entity.ts
│   │   ├── evidence.entity.ts
│   │   ├── document.entity.ts
│   │   ├── testimony.entity.ts
│   │   └── board-relation.entity.ts
│   └── dto/
│
├── interrogations/
│   ├── interrogations.module.ts
│   ├── interrogations.controller.ts
│   ├── interrogations.service.ts
│   ├── entities/
│   │   └── interrogation-question.entity.ts
│   └── dto/
│
├── deductions/
│   ├── deductions.module.ts
│   ├── deductions.controller.ts
│   ├── deductions.service.ts
│   ├── entities/
│   │   ├── deduction.entity.ts
│   │   └── deduction-requirement.entity.ts
│   └── dto/
│
├── progression/
│   ├── progression.module.ts
│   ├── progression.service.ts
│   ├── progression-query.service.ts
│   ├── entities/
│   │   ├── case-progress.entity.ts
│   │   └── player-element-state.entity.ts
│   └── dto/
│
├── game-engine/
│   ├── game-engine.module.ts
│   ├── game-engine.service.ts
│   ├── unlock-engine.service.ts
│   ├── entities/
│   │   ├── unlock-rule.entity.ts
│   │   └── unlock-rule-requirement.entity.ts
│   └── enums/
│       ├── unlock-rule-mode.enum.ts
│       └── required-element-state.enum.ts
│
├── accusations/
│   ├── accusations.module.ts
│   ├── accusations.controller.ts
│   ├── accusations.service.ts
│   ├── entities/
│   │   ├── accusation-option.entity.ts
│   │   ├── case-solution.entity.ts
│   │   └── final-attempt.entity.ts
│   └── dto/
│
├── media/
│   ├── media.module.ts
│   ├── media.service.ts
│   └── entities/
│       └── media-asset.entity.ts
│
├── database/
│   ├── data-source.ts
│   ├── migrations/
│   └── seeds/
│
└── config/
    ├── database.config.ts
    └── env.validation.ts
```

Ne pas créer tous les fichiers immédiatement.

Commencer par :

```text
cases/
progression/
game-engine/
```

en plus de :

```text
auth/
users/
database/
config/
```

---

# Premières entités à créer

Ordre conseillé :

```text
1. CaseEntity
2. CaseElementEntity
3. CaseProgressEntity
4. PlayerElementStateEntity
5. UnlockRuleEntity
6. UnlockRuleRequirementEntity
```

---

## CaseEntity

```ts
@Entity('cases')
@Check(`"difficulty" BETWEEN 1 AND 5`)
export class CaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  slug: string;

  @Column()
  title: string;

  @Column({ name: 'era_label' })
  eraLabel: string;

  @Column({ type: 'text' })
  synopsis: string;

  @Column({ type: 'smallint' })
  difficulty: number;

  @Column({ name: 'theme_key' })
  themeKey: string;

  @Column({
    name: 'publication_status',
    type: 'enum',
    enum: CasePublicationStatus,
    default: CasePublicationStatus.DRAFT,
  })
  publicationStatus: CasePublicationStatus;

  @Column({ name: 'sort_order', default: 0 })
  sortOrder: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
```

---

## CaseElementEntity

```ts
@Entity('case_elements')
@Unique(['caseId', 'key'])
export class CaseElementEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'case_id', type: 'uuid' })
  caseId: string;

  @ManyToOne(() => CaseEntity, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'case_id' })
  case: CaseEntity;

  @Column()
  key: string;

  @Column({
    type: 'enum',
    enum: CaseElementType,
  })
  type: CaseElementType;

  @Column({
    name: 'is_initially_unlocked',
    default: false,
  })
  isInitiallyUnlocked: boolean;

  @Column({
    name: 'sort_order',
    default: 0,
  })
  sortOrder: number;
}
```

---

## CaseProgressEntity

```ts
@Entity('case_progress')
@Unique(['userId', 'caseId'])
export class CaseProgressEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @ManyToOne(() => UserEntity, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({ name: 'case_id', type: 'uuid' })
  caseId: string;

  @ManyToOne(() => CaseEntity, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'case_id' })
  case: CaseEntity;

  @Column({
    name: 'last_location_element_id',
    type: 'uuid',
    nullable: true,
  })
  lastLocationElementId: string | null;

  @Column({
    name: 'started_at',
    type: 'timestamptz',
  })
  startedAt: Date;

  @Column({
    name: 'completed_at',
    type: 'timestamptz',
    nullable: true,
  })
  completedAt: Date | null;
}
```

---

## PlayerElementStateEntity

```ts
@Entity('player_element_states')
@Unique(['caseProgressId', 'elementId'])
export class PlayerElementStateEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'case_progress_id',
    type: 'uuid',
  })
  caseProgressId: string;

  @ManyToOne(() => CaseProgressEntity, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'case_progress_id' })
  caseProgress: CaseProgressEntity;

  @Column({
    name: 'element_id',
    type: 'uuid',
  })
  elementId: string;

  @ManyToOne(() => CaseElementEntity, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'element_id' })
  element: CaseElementEntity;

  @Column({
    name: 'unlocked_at',
    type: 'timestamptz',
  })
  unlockedAt: Date;

  @Column({
    name: 'completed_at',
    type: 'timestamptz',
    nullable: true,
  })
  completedAt: Date | null;
}
```

---

## UnlockRuleEntity

```ts
@Entity('unlock_rules')
export class UnlockRuleEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'case_id',
    type: 'uuid',
  })
  caseId: string;

  @ManyToOne(() => CaseEntity, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'case_id' })
  case: CaseEntity;

  @Column({
    name: 'target_element_id',
    type: 'uuid',
  })
  targetElementId: string;

  @ManyToOne(() => CaseElementEntity, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'target_element_id' })
  targetElement: CaseElementEntity;

  @Column({
    type: 'enum',
    enum: UnlockRuleMode,
    default: UnlockRuleMode.ALL,
  })
  mode: UnlockRuleMode;
}
```

---

## UnlockRuleRequirementEntity

```ts
@Entity('unlock_rule_requirements')
export class UnlockRuleRequirementEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'rule_id',
    type: 'uuid',
  })
  ruleId: string;

  @ManyToOne(() => UnlockRuleEntity, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'rule_id' })
  rule: UnlockRuleEntity;

  @Column({
    name: 'source_element_id',
    type: 'uuid',
  })
  sourceElementId: string;

  @ManyToOne(() => CaseElementEntity, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'source_element_id' })
  sourceElement: CaseElementEntity;

  @Column({
    name: 'required_state',
    type: 'enum',
    enum: RequiredElementState,
  })
  requiredState: RequiredElementState;
}
```

---

# Premiers services

## ProgressionService

Premières responsabilités :

```ts
startCase()
unlockElement()
completeElement()
completeCase()
```

Le démarrage d'une affaire doit être transactionnel.

Pseudo-flow :

```text
BEGIN

Créer CaseProgress

Récupérer tous les CaseElement
avec isInitiallyUnlocked = true

Créer PlayerElementState pour chacun

COMMIT
```

---

## ProgressionQueryService

Méthodes de base :

```ts
isUnlocked(caseProgressId, elementId)
isCompleted(caseProgressId, elementId)
getUnlockedElementIds(caseProgressId)
getProgress(userId, caseId)
```

Les autres modules utilisent ce service pour leurs vérifications.

---

## GameEngineService

Version initiale minimale :

```ts
@Injectable()
export class GameEngineService {
  constructor(
    private readonly progressionService: ProgressionService,
    private readonly unlockEngine: UnlockEngineService,
  ) {}

  async completeElement(
    caseProgressId: string,
    elementId: string,
  ) {
    await this.progressionService.completeElement(
      caseProgressId,
      elementId,
    );

    await this.unlockEngine.evaluate(
      caseProgressId,
      elementId,
    );
  }
}
```

---

## UnlockEngineService

Première responsabilité :

```text
1. recevoir l'élément venant de changer ;
2. chercher les UnlockRules concernées ;
3. vérifier leurs requirements ;
4. débloquer les targets satisfaites ;
5. continuer si nécessaire.
```

---

# Seed technique Hôtel Beaumont

Avant d'écrire l'histoire complète, créer un mini seed technique.

Exemple :

```text
Case
└── Hôtel Beaumont

Elements
├── Hall
├── Chambre 417
├── Lucas
├── Badge
├── Question Lucas #1
└── Question Lucas #2
```

Exemple de configuration :

```text
Hall
initial = true

Lucas
initial = true

Question :
"Où étiez-vous ?"
initial = true

Badge
initial = false

Question :
"Pourquoi votre badge..."
initial = false
```

Règle de test :

```text
Badge COMPLETED
+
Question alibi COMPLETED

↓

Question badge UNLOCKED
```

Objectif :

```text
startCase()
↓
éléments initiaux
↓
completeElement()
↓
UnlockEngine
↓
nouvel élément
```

Avant de développer les scènes complètes, ce circuit doit fonctionner.

---

# Premiers commits conseillés

```text
1. chore/database
   PostgreSQL + TypeORM + migrations

2. feat/cases
   CaseEntity
   CaseElementEntity

3. feat/progression
   CaseProgressEntity
   PlayerElementStateEntity
   ProgressionService
   ProgressionQueryService

4. feat/game-engine
   UnlockRuleEntity
   UnlockRuleRequirementEntity
   UnlockEngineService

5. feat/case-start
   POST /cases/:id/start

6. chore/hotel-beaumont-seed
   mini affaire technique
```

Ensuite seulement :

```text
Location
Character
Evidence
Document
Interrogation
Deduction
Board
Accusation
```

---

# Principe directeur

Anachron doit rester :

> **Un moteur générique qui exécute les règles d'une affaire, et non un backend contenant l'histoire en dur.**

L'Hôtel Beaumont est la première affaire.

Ce n'est pas l'architecture.

L'architecture doit être capable d'accueillir :

```text
1962
1898
2187
...
```

sans réécrire le moteur.

---

# État actuel des décisions

## Validé

- Nom : **Anachron**
- React + TypeScript + Vite
- NestJS
- TypeORM
- PostgreSQL
- compte obligatoire
- plusieurs affaires à terme
- une seule affaire au lancement
- statut jamais commencé / en cours / terminée
- aucun pourcentage de progression
- carte pour naviguer entre les lieux
- backgrounds plein écran
- personnages / indices / documents dans chaque lieu
- interrogatoires par questions
- questions débloquées progressivement
- déclarations importantes sauvegardées
- confrontations avec toutes les informations découvertes
- essais illimités pendant l'enquête
- aucune pénalité en cas d'erreur
- tableau d'enquête automatique
- aucune timeline en V1
- accusation finale : coupable + mobile + arme + heure
- une seule tentative finale
- score final
- thèmes très personnalisés
- composants spécifiques possibles par affaire
- audio par affaire / lieu
- assets externes
- anti-spoil côté backend
- desktop uniquement
- aucune interface admin en V1
- aucune génération automatique complète des histoires
- architecture NestJS modulaire complète
- moteur de règles data-driven

## À définir plus tard

- histoire complète de l'Hôtel Beaumont ;
- nombre exact de personnages ;
- nombre exact de lieux ;
- nombre exact d'indices ;
- nombre exact de documents ;
- nombre exact de confrontations ;
- nombre exact de conclusions ;
- assets finaux ;
- nom exact du QG / organisation dans le lore ;
- règles éventuelles de replay après une affaire terminée ;
- stockage média final ;
- hébergement final ;
- détails UI finaux ;
- contenu des futures affaires.

---

# Résumé court

```text
ANACHRON

QG temporel
↓
Catalogue d'affaires
↓
Choix d'une époque
↓
Immersion totale dans l'affaire
↓
Carte
↓
Lieux
↓
Personnages / Indices / Documents
↓
Interrogatoires
↓
Déclarations
↓
Confrontations / Conclusions
↓
Nouvelles pistes
↓
Tableau d'enquête
↓
Accusation finale
↓
Score
```

Backend :

```text
Action joueur
↓
Module métier
↓
GameEngine
↓
Progression
↓
UnlockRules
↓
PostgreSQL
```

Principe fondamental :

```text
L'histoire est dans les données.
Le moteur reste générique.
```
