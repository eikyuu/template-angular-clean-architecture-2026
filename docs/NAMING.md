# Conventions de nommage

> Le nom d'un fichier doit révéler **quoi** et **où** dans l'architecture en un coup d'œil.

---

## Fichiers

| Élément                              | Suffixe                  | Exemple                              |
|--------------------------------------|--------------------------|--------------------------------------|
| Entité de domaine                    | `.entity.ts`             | `user.entity.ts`                     |
| Value Object                         | `.vo.ts`                 | `email.vo.ts`                        |
| Erreur de domaine                    | `.error.ts`              | `invalid-email.error.ts`             |
| Interface de repository (port)       | `.repository.ts`         | `user.repository.ts`                 |
| Use-case (application)               | `.use-case.ts`           | `list-users.use-case.ts`             |
| Port applicatif                      | `.port.ts`               | `clock.port.ts`                      |
| Signal Store                         | `.store.ts`              | `users.store.ts`                     |
| DTO (infrastructure)                 | `.dto.ts`                | `user.dto.ts`                        |
| Mapper DTO ↔ entité                  | `.mapper.ts`             | `user.mapper.ts`                     |
| Adapter HTTP                         | `.http.repository.ts`    | `user.http.repository.ts`            |
| Adapter in-memory (tests / dev)      | `.in-memory.repository.ts` | `user.in-memory.repository.ts`     |
| Providers DI d'une feature           | `.providers.ts`          | `users.providers.ts`                 |
| Page (smart component routé)         | `.page.ts`               | `users-list.page.ts`                 |
| Schéma Signal Forms (modèle + validation) | `.form.ts`            | `user-create.form.ts`                |
| Composant Angular (dumb / local)     | `.component.ts`          | `user-card.component.ts`             |
| Directive                            | `.directive.ts`          | `autofocus.directive.ts`             |
| Pipe                                 | `.pipe.ts`               | `relative-time.pipe.ts`              |
| Guard                                | `.guard.ts`              | `auth.guard.ts`                      |
| Interceptor                          | `.interceptor.ts`        | `auth.interceptor.ts`                |
| Routes de feature                    | `.routes.ts`             | `users.routes.ts`                    |
| InjectionToken                       | `.token.ts`              | `app-config.token.ts`                |
| Tests                                | `.spec.ts`               | `email.vo.spec.ts`                   |

## Casse

- **Fichiers / dossiers** : `kebab-case`.
- **Classes / types / interfaces** : `PascalCase`. Pas de préfixe `I` sur les interfaces.
- **Variables / fonctions** : `camelCase`.
- **Constantes module-level** : `UPPER_SNAKE_CASE` uniquement pour les `InjectionToken` et les vraies constantes (`MAX_RETRIES = 3`).
- **Sélecteurs de composants** : préfixe `app-` (configurable dans `angular.json`).

## Noms de classes (suffixes)

| Type                      | Suffixe          | Exemple                       |
|---------------------------|------------------|-------------------------------|
| Use-case                  | `UseCase`        | `ListUsersUseCase`            |
| Repository (interface)    | `Repository`     | `UserRepository`              |
| Repository (impl HTTP)    | `HttpRepository` | `HttpUserRepository`          |
| Mapper                    | `Mapper`         | `UserMapper`                  |
| Erreur                    | `Error`          | `InvalidEmailError`           |
| Composant                 | `Component`      | `UserCardComponent`           |
| Page                      | `Page`           | `UsersListPage`               |
| Store                     | `Store`          | `UsersStore`                  |
| Guard                     | `Guard`          | `AuthGuard`                   |

## Booléens

- Préfixes `is`, `has`, `can`, `should` : `isLoading`, `hasAccess`, `canEdit`.

## Méthodes asynchrones

- Verbe à l'infinitif. Pas de suffixe `Async`. Le type de retour (`Promise<T>` ou `Observable<T>`) suffit.

## Dossiers de feature

- Nom au pluriel : `features/users/`, `features/orders/`.
- Sous-dossiers fixes : `domain/`, `application/`, `infrastructure/`, `presentation/`. Pas de variation.
