# Architecture

Ce template applique une **Clean Architecture stricte à 4 couches** par feature, avec une zone partagée et un noyau transversal.

> **Règle d'or** : les dépendances pointent toujours vers l'intérieur. Le domaine ne sait rien d'Angular, de HTTP ou du DOM.

---

## Vue d'ensemble

```
src/app/
├── core/                       # Cross-cutting (DI, HTTP infra, error handler, guards globaux)
│   ├── config/                 # Tokens d'environnement, configuration de l'app
│   ├── di/                     # InjectionTokens partagés
│   ├── errors/                 # ErrorHandler global, classes d'erreurs techniques
│   ├── http/                   # Interceptors, http base
│   └── guards/                 # Guards transverses (auth, role)
│
├── shared/                     # Briques UI réutilisables, sans logique métier
│   ├── ui/                     # Composants génériques (Button, Card, Input…)
│   ├── pipes/
│   ├── directives/
│   └── utils/                  # Helpers purs (date, string, result type…)
│
└── features/
    └── <feature>/
        ├── domain/             # Cœur métier (PUR TypeScript, zéro dépendance Angular)
        │   ├── entities/       # Entités métier (User, Order…)
        │   ├── value-objects/  # Value objects (Email, Money, UserId…)
        │   ├── errors/         # Erreurs métier (DomainError)
        │   └── repositories/   # Interfaces (ports) + tokens DI
        │
        ├── application/        # Orchestration des cas d'usage
        │   ├── use-cases/      # Une classe = un cas d'usage
        │   ├── ports/          # Interfaces additionnelles (ex: Clock, IdGenerator)
        │   └── store/          # Signal Store (état applicatif)
        │
        ├── infrastructure/     # Adapters concrets (HTTP, storage, fakes)
        │   ├── http/           # HttpRepository, DTO, Mapper
        │   ├── fakes/          # Implémentations in-memory pour les tests / dev
        │   └── <feature>.providers.ts   # Bindings DI (interface → implémentation)
        │
        └── presentation/       # Composants Angular, pages, routing
            ├── pages/          # Smart components (routés)
            ├── components/     # Dumb components locaux à la feature
            └── <feature>.routes.ts
```

---

## Les 4 couches

### 1. `domain/` — Cœur métier

- **Contenu** : entités, value objects, erreurs métier, *interfaces* de repositories.
- **Dépendances autorisées** : aucune (sauf primitives TypeScript et autres fichiers du même domaine).
- **Interdit** : importer `@angular/*`, `rxjs`, `HttpClient`, ou quoi que ce soit hors du dossier `domain/`.
- **Forme** : classes ou objets immuables. Les invariants métier sont validés au constructeur (ou via factory).

```ts
// domain/value-objects/email.vo.ts
export class Email {
  private constructor(readonly value: string) {}

  static create(input: string): Email {
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(input)) {
      throw new InvalidEmailError(input);
    }
    return new Email(input.toLowerCase());
  }
}
```

### 2. `application/` — Cas d'usage et état

- **Contenu** : use-cases (1 action métier = 1 classe), signal stores, ports additionnels.
- **Dépendances autorisées** : `domain/` de la même feature, autres ports `application/`, `@angular/core` (uniquement pour `inject()` / `@Injectable`).
- **Interdit** : importer `infrastructure/`, `presentation/`, ou des libs HTTP.
- **Pattern** : un use-case expose une seule méthode publique (`execute`) et reçoit ses dépendances via `inject()`.

```ts
// application/use-cases/list-users.use-case.ts
@Injectable()
export class ListUsersUseCase {
  private readonly repo = inject(USER_REPOSITORY);
  execute(): Promise<readonly User[]> {
    return this.repo.findAll();
  }
}
```

> Pas de `providedIn: 'root'` : un use-case dépend du port (`USER_REPOSITORY`) qui n'est lié qu'au scope de la feature lazy. Il doit être déclaré dans `<feature>.providers.ts` à côté de la liaison du port — mêmes règles pour le `signalStore` de la feature.

### 3. `infrastructure/` — Adapters

- **Contenu** : implémentations concrètes des ports (HTTP, localStorage, IndexedDB, fakes), DTO, mappers.
- **Dépendances autorisées** : `domain/`, `application/ports`, `@angular/common/http`, libs tierces.
- **Interdit** : importer `presentation/`. Ne jamais exposer un DTO en dehors d'`infrastructure/` — tout doit passer par un mapper.

### 4. `presentation/` — UI Angular

- **Contenu** : composants standalone, pages routées, routing de la feature.
- **Dépendances autorisées** : `application/` (use-cases + stores), `shared/`, `@angular/*`.
- **Interdit** : importer `infrastructure/` directement, ou appeler `HttpClient` depuis un composant.

---

## Règle de dépendance

```
presentation  ──►  application  ──►  domain  ◄──  infrastructure
                       │                                ▲
                       └──────── ports / interfaces ────┘
```

- Le **domaine** est au centre, sans dépendance sortante.
- L'**infrastructure** dépend du domaine (elle implémente ses interfaces).
- L'**application** dépend uniquement du domaine.
- La **présentation** dépend de l'application (pas de l'infrastructure).

Ces règles sont **forcées par ESLint** (`eslint-plugin-boundaries`). Voir [`eslint.config.mjs`](../eslint.config.mjs).

---

## Cross-feature : interdit par défaut

Une feature **ne doit jamais** importer une autre feature. Si deux features ont besoin de partager :

- du code métier pur → remonter dans un **bounded context partagé** (`features/shared-context/domain/`)
- un composant UI → remonter dans `shared/ui/`
- un service technique → remonter dans `core/`

---

## Injection de dépendances

Chaque port a son `InjectionToken`. La liaison interface → implémentation se fait dans `<feature>.providers.ts` :

```ts
// features/users/infrastructure/users.providers.ts
export const usersProviders: Provider[] = [
  { provide: USER_REPOSITORY, useClass: HttpUserRepository },
  ListUsersUseCase,
  GetUserByIdUseCase,
  CreateUserUseCase,
  UsersStore,
];
```

`usersProviders` est branché au niveau de la route lazy via `providers:` dans `<feature>.routes.ts`. **Pas dans `app.config.ts`** : la feature reste auto-contenue et son injecteur n'existe que sous `/users`.

---

## Voir aussi

- [`CONVENTIONS.md`](./CONVENTIONS.md) — règles de code et patterns
- [`NAMING.md`](./NAMING.md) — conventions de nommage
- [`FEATURE-RECIPE.md`](./FEATURE-RECIPE.md) — comment ajouter une feature
- [`STATE-MANAGEMENT.md`](./STATE-MANAGEMENT.md) — signals et Signal Store
- [`TESTING.md`](./TESTING.md) — stratégie de test
