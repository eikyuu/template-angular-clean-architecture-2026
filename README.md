# Angular Enterprise Template

Template Angular **v21+** prêt pour production, conçu pour des projets d'entreprise long terme. Applique une **Clean Architecture stricte à 4 couches**, des conventions claires, et un outillage qui empêche la dérive sur la durée.

> Tout est documenté dans [`docs/`](./docs) — ces fichiers sont aussi consommés par les IA assistantes (Claude Code, Copilot…) via [`.claude/CLAUDE.md`](./.claude/CLAUDE.md).

---

## Quick start

```bash
npm install
npm start          # http://localhost:4200
npm test           # vitest
npm run lint       # eslint + boundaries
npm run build
```

---

## Stack

- **Angular 21+** standalone, signals natifs, SSR optionnel
- **`@ngrx/signals`** pour le state partagé
- **TailwindCSS 4** pour le styling
- **Vitest** pour les tests unitaires
- **ESLint + `eslint-plugin-boundaries`** pour forcer l'architecture
- **Husky + lint-staged + commitlint** pour la qualité au commit

---

## Architecture

```
src/app/
├── core/          # cross-cutting (config, http, errors, guards)
├── shared/        # briques UI/utils réutilisables, sans métier
└── features/
    └── users/                ← exemple de référence
        ├── domain/           # entités, value objects, ports
        ├── application/      # use-cases + signal store
        ├── infrastructure/   # adapters HTTP, mappers, fakes
        └── presentation/     # pages, composants, routes
```

**Règle de dépendance** :

```
presentation  ──►  application  ──►  domain  ◄──  infrastructure
```

Détaillé dans [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md). Forcée par ESLint via `eslint.config.mjs`.

---

## Documentation

| Document | Contenu |
|---|---|
| [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) | Les 4 couches, la règle de dépendance, les imports interdits |
| [`docs/CONVENTIONS.md`](./docs/CONVENTIONS.md) | Règles TS, Angular, signals, templates, a11y, commits |
| [`docs/NAMING.md`](./docs/NAMING.md) | Suffixes de fichiers, conventions de nommage |
| [`docs/STATE-MANAGEMENT.md`](./docs/STATE-MANAGEMENT.md) | `signal()` vs Signal Store, patterns |
| [`docs/TESTING.md`](./docs/TESTING.md) | Stratégie de test par couche |
| [`docs/FEATURE-RECIPE.md`](./docs/FEATURE-RECIPE.md) | Recette pas-à-pas pour ajouter une feature |
| [`src/app/features/users/README.md`](./src/app/features/users/README.md) | Tour guidé de la feature de référence |

---

## Pour les contributeurs (humains et IA)

- `.claude/CLAUDE.md` charge automatiquement les conventions dans le contexte de Claude Code.
- Avant d'ajouter une feature, lire [`docs/FEATURE-RECIPE.md`](./docs/FEATURE-RECIPE.md).
- Avant un commit, `npm run lint` doit passer (forcé par Husky).
- Messages de commit en **Conventional Commits** (`feat:`, `fix:`, `refactor:`…).

---

## SSR

Le template est configuré pour le rendu serveur (`@angular/ssr`). Pour servir une build SSR :

```bash
npm run build
npm run serve:ssr:angular-app
```

---

## Licence

À définir selon le contexte du projet.

---

## Explication clean architecture

Voici l'explication, en partant du POURQUOI et en m'appuyant sur le code concret du repo.

### Le problème que Clean Architecture résout

Dans un projet d'entreprise qui vit 5+ ans, les choses qui changent le plus souvent sont :

- Le framework UI (Angular 15 → 16 → 17 → 20 → 21…)
- L'API backend (REST → GraphQL, URLs, shapes…)
- Les libs de state (NgRx classique → Signals → Signal Store…)
- L'ORM, la base de données, le cache, l'auth provider…

Les choses qui changent le moins souvent sont les règles métier : un email reste un email, une commande a toujours un total, un utilisateur ne peut pas avoir un nom vide.

**Clean Architecture** = mettre au centre ce qui change le moins, à la périphérie ce qui change le plus, et faire pointer les dépendances de l'extérieur vers l'intérieur — jamais l'inverse.

C'est ça la "règle de dépendance". Tout le reste en découle.

### Les 4 couches dans ton template

```
presentation  ──►  application  ──►  domain  ◄──  infrastructure
   (Angular)        (use-cases)      (métier)       (HTTP, storage)
```

#### `domain/` — le cœur, immuable

C'est du TypeScript pur. Zéro Angular, zéro RxJS, zéro HTTP. Si demain tu changeais Angular pour React, ce dossier ne bougerait pas d'une ligne.

Concrètement dans le repo :

- **`Email`** — un value object. Son constructeur est privé, on passe par `Email.create()` qui garantit la validité au moment de l'instanciation. Si tu as un `Email` dans les mains, tu sais qu'il est valide. Pas besoin de revalider 50 fois.
- **`User`** — une entité, `readonly` partout. Pour la modifier, on construit une nouvelle instance (`rename()` retourne un nouveau `User`). C'est immuable → pas de bugs de mutation partagée.
- **`UserRepository`** — une interface (un "port"). Le domaine déclare ce qu'il a besoin de pouvoir faire, sans dire comment. Le `InjectionToken` à côté permettra de brancher une implémentation depuis l'extérieur.

**La règle clé** : le domaine n'importe rien. Si tu te retrouves à `import { HttpClient }` dans `domain/`, l'architecture est cassée.

#### `application/` — les cas d'usage

C'est l'orchestration. Chaque action métier est une classe avec une seule méthode `execute()`.

- **`ListUsersUseCase`** — fait un truc, et un seul : lister les users via le repository.
- **`GetUserByIdUseCase`** — récupère, et lève `UserNotFoundError` si absent.

Pourquoi des classes plutôt que des fonctions libres ? Pour l'injection de dépendances Angular et la testabilité : on peut injecter un fake repository dans les tests sans toucher au use-case.

Le `UsersStore` vit aussi ici : c'est l'état applicatif (Signal Store), mais il n'appelle jamais `HttpClient` directement — il passe par les use-cases. C'est non-négociable.

#### `infrastructure/` — les adapters concrets

C'est là qu'on implémente les ports déclarés dans le domaine.

- **`HttpUserRepository`** — implémente `UserRepository` avec `HttpClient`. Il encapsule les erreurs HTTP dans `InfrastructureError` pour que le reste du code ne voie que du domaine pur.
- **`UserDto`** — la shape exacte de l'API (`created_at` en snake_case, etc.). Ce DTO ne sort jamais d'`infrastructure/`.
- **`UserMapper`** — fonction pure `DTO → entité`. C'est la frontière.
- **`InMemoryUserRepository`** — implémente le même port en RAM. Te permet de tester sans réseau, et même de bootstraper l'app en dev sans backend.
- **`users.providers.ts`** — l'unique endroit où on dit "ce port = cette implémentation".

Le truc important : le domaine définit l'interface, l'infrastructure dépend du domaine. La flèche pointe vers l'intérieur. C'est l'inversion de dépendance (le **D** de SOLID).

#### `presentation/` — l'UI Angular

Les composants, pages, routes. Ne consomment QUE `application/` (use-cases + store), `shared/` et `core/`.

- **`UsersListPage`** — injecte le store, appelle `store.load()`. Ne sait pas que ça va taper HTTP. Demain tu remplaces le HTTP repo par un GraphQL repo : ce composant ne bouge pas.
- **`users.routes.ts`** — c'est l'unique exception : la route est autorisée à importer `usersProviders` de `infrastructure/` pour câbler la DI au niveau de la feature lazy. C'est explicitement exempté dans `eslint.config.mjs`.

### Pourquoi ça tient sur le long terme

**Tu peux changer une couche sans toucher les autres**

- Remplacer `HttpClient` par `fetch` natif ? Tu touches juste `infrastructure/http/`.
- Migrer de `@ngrx/signals` vers un autre store ? Tu touches `application/store/`. Les composants voient les mêmes signaux exposés.
- Passer de Angular 21 à Angular 22 ? Le `domain` ne bouge pas.

**Tu peux tester ce qui compte sans monter un navigateur**

- 100% de couverture sur le `domain` → tests purs, 50 ms.
- Use-cases testés avec `InMemoryUserRepository` → pas de mock manuel, pas de réseau.
- Composants testés au DOM minimal.

C'est exactement ce que tu vois dans les 19 tests verts du repo.

**L'ESLint t'empêche de tricher**

`eslint.config.mjs` avec `eslint-plugin-boundaries` bloque les imports interdits. Si quelqu'un (humain ou IA) essaie d'`import { HttpClient }` dans le `domain/`, le lint échoue, et le hook pre-commit empêche le commit. L'architecture n'est plus une convention orale, c'est une règle exécutable.

**Les conventions de nommage rendent la lecture instantanée**

Quand tu vois un fichier `.use-case.ts` tu sais dans quelle couche tu es, quel pattern il suit, et où sont ses dépendances. Pareil pour `.vo.ts`, `.repository.ts`, `.mapper.ts`… C'est pour ça que `docs/NAMING.md` existe.

### Le piège classique à éviter

L'erreur la plus fréquente sur ce style d'archi : **sur-ingénierie**. Mettre une couche Application avec des use-cases pour chaque CRUD trivial peut sembler lourd au début.

Mon conseil : garde la structure même pour le petit CRUD. Le coût d'écrire un `ListXUseCase` à 3 lignes est négligeable, et le jour où la "simple liste" devient "liste avec filtres + pagination + tri + cache + retry", tu as déjà l'emplacement où ajouter cette complexité sans tout réécrire.