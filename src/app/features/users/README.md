# Feature : users

Feature **de référence** du template. Implémente tous les patterns Clean Architecture en bout-en-bout.

À utiliser comme modèle pour toute nouvelle feature. Voir aussi [`docs/FEATURE-RECIPE.md`](../../../../docs/FEATURE-RECIPE.md).

## Arborescence

```
users/
├── domain/
│   ├── entities/user.entity.ts            ← User
│   ├── value-objects/{user-id,email}.vo.ts ← VO immuables, validés au create()
│   ├── errors/*.error.ts                  ← DomainError sous-classes
│   └── repositories/user.repository.ts    ← interface + InjectionToken
│
├── application/
│   ├── use-cases/
│   │   ├── list-users.use-case.ts
│   │   ├── get-user-by-id.use-case.ts
│   │   └── create-user.use-case.ts
│   └── store/users.store.ts               ← @ngrx/signals
│
├── infrastructure/
│   ├── http/
│   │   ├── user.dto.ts                    ← shape API (snake_case côté serveur)
│   │   ├── user.mapper.ts                 ← DTO → entité
│   │   └── user.http.repository.ts        ← impl du port
│   ├── fakes/user.in-memory.repository.ts ← pour dev + tests
│   └── users.providers.ts                 ← binding interface ↔ impl
│
└── presentation/
    ├── pages/
    │   ├── users-list.page.ts
    │   ├── user-detail.page.ts
    │   └── user-create.page.ts
    ├── components/user-card.component.ts
    └── users.routes.ts
```

## Points clés

- **Le composant ne connaît que le store + les use-cases.** Il n'importe ni `HttpClient` ni les DTO.
- **Les routes injectent les providers** : `usersProviders` est scopé à la feature, pas global.
- **Le HTTP repo encapsule les erreurs HTTP** dans `InfrastructureError` — le reste du code voit du domaine pur.
- **Le fake in-memory** permet de tester sans réseau et de bootstraper l'app en dev sans backend.

## Pour basculer en mode dev sans backend

Dans `users.providers.ts`, remplacer temporairement :

```ts
{ provide: USER_REPOSITORY, useClass: HttpUserRepository }
// par
{ provide: USER_REPOSITORY, useValue: new InMemoryUserRepository(seed) }
```
