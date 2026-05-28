---
name: new-feature
description: Scaffolde une nouvelle feature dans ce template Angular en respectant strictement la Clean Architecture à 4 couches (domain/application/infrastructure/presentation). Utiliser quand l'utilisateur demande d'ajouter, créer, scaffolder, ou commencer une nouvelle feature ou un nouveau bounded context. Reproduit fidèlement le pattern de la feature de référence `users/`.
metadata:
  version: '1.0'
  scope: project
---

# Skill : new-feature

Tu vas générer une feature complète dans `src/app/features/<feature>/` en suivant **exactement** les patterns du template. La feature [`users/`](../../../src/app/features/users/) est ta **référence vivante** — relis-la avant d'écrire quoi que ce soit.

## Avant de commencer — lecture obligatoire

Lis dans cet ordre :

1. [`docs/ARCHITECTURE.md`](../../../docs/ARCHITECTURE.md) — règle de dépendance
2. [`docs/NAMING.md`](../../../docs/NAMING.md) — suffixes
3. [`docs/CONVENTIONS.md`](../../../docs/CONVENTIONS.md) — règles TS/Angular
4. [`docs/FEATURE-RECIPE.md`](../../../docs/FEATURE-RECIPE.md) — recette pas-à-pas
5. [`src/app/features/users/`](../../../src/app/features/users/) — l'exemple de référence

## Étape 1 — Cadrer avec l'utilisateur

Avant toute génération, poser **au minimum** ces questions via `AskUserQuestion` :

1. **Nom de la feature** (au pluriel, kebab-case) — ex: `orders`, `invoices`, `team-members`
2. **Entité principale** — quel concept métier ? (ex: `Order`, `Invoice`)
3. **Value objects requis** — quels champs ont une règle de validité ? (ex: `Money`, `OrderId`, `InvoiceNumber`)
4. **Actions métier (use-cases)** — quelles opérations ? (ex: list, get-by-id, create, cancel, refund…)
5. **Source de données** — HTTP ? Quelle URL de base et quel shape de DTO côté API (snake_case ? camelCase ?) ?
6. **Besoin d'un Signal Store** — l'état est-il partagé entre plusieurs composants ? (Oui par défaut.)

Reformuler la réponse de l'utilisateur sous forme de plan avant d'écrire le code.

## Étape 2 — Générer la couche `domain/` EN PREMIER

L'ordre est **non négociable** : domaine → application → infrastructure → présentation. Tu ne descends jamais sans avoir validé la couche du dessus.

Pour chaque entité demandée :

- `domain/entities/<entity>.entity.ts` — classe immuable, `readonly` partout
- `domain/value-objects/<vo>.vo.ts` — constructeur privé + `static create()` qui valide
- `domain/errors/<x>.error.ts` — sous-classe de `DomainError` (depuis `@core/errors/domain.error`)
- `domain/repositories/<feature>.repository.ts` — interface + `InjectionToken`

**Interdit dans `domain/`** : aucun import depuis `@angular/*`, `rxjs`, `HttpClient`. Le seul import externe autorisé est `@core/errors/domain.error` et `@angular/core` **uniquement** pour `InjectionToken` dans les fichiers de repository.

## Étape 3 — Générer la couche `application/`

Pour chaque use-case demandé :

- `application/use-cases/<verb>-<entity>.use-case.ts` — classe `@Injectable({ providedIn: 'root' })`, dépendances via `inject()`, **une seule méthode publique `execute()`**

Si un store est nécessaire :

- `application/store/<feature>.store.ts` — `signalStore({ providedIn: 'root' }, ...)` avec `withState`, `withComputed`, `withMethods`. Le store appelle les use-cases — **jamais** `HttpClient` directement.

## Étape 4 — Générer la couche `infrastructure/`

- `infrastructure/http/<entity>.dto.ts` — shape exact de l'API
- `infrastructure/http/<entity>.mapper.ts` — fonctions pures `toEntity(dto)` / `toDto(entity)`
- `infrastructure/http/<entity>.http.repository.ts` — `@Injectable()` (sans `providedIn`), implémente le port. Encapsule les erreurs HTTP dans `InfrastructureError`.
- `infrastructure/fakes/<entity>.in-memory.repository.ts` — implémentation in-memory pour tests + dev sans backend
- `infrastructure/<feature>.providers.ts` — `Provider[]` qui binde l'interface à l'implémentation HTTP

## Étape 5 — Générer la couche `presentation/`

- `presentation/pages/<entity>-list.page.ts` — smart component, injecte le store, OnPush
- `presentation/pages/<entity>-detail.page.ts` — si pertinent, utilise `input.required()` pour récupérer l'id depuis l'URL (avec `withComponentInputBinding()` déjà configuré)
- `presentation/pages/<entity>-create.page.ts` — Reactive Form si création
- `presentation/components/<entity>-card.component.ts` — dumb component, `input.required()` / `output()`
- `presentation/<feature>.routes.ts` — `Routes` avec `providers: <feature>Providers` au niveau du parent, et `loadComponent` pour chaque page

## Étape 6 — Câbler dans `app.routes.ts`

Ajouter une entrée :

```ts
{
  path: '<feature>',
  loadChildren: () =>
    import('@features/<feature>/presentation/<feature>.routes').then((m) => m.<feature>Routes),
},
```

## Étape 7 — Tests

Écrire au minimum :

- `domain/value-objects/<vo>.vo.spec.ts` — cas valides + invalides
- `application/use-cases/<x>.use-case.spec.ts` — utiliser le `InMemory<Entity>Repository` via TestBed
- `infrastructure/http/<entity>.mapper.spec.ts` — DTO → entité

## Étape 8 — README de feature

Créer `src/app/features/<feature>/README.md` qui décrit l'arborescence et les points clés (cf. `features/users/README.md`).

## Étape 9 — Vérification finale

Lancer dans l'ordre :

```bash
npm run lint    # vérifie les règles boundaries
npm test        # vérifie les tests
npm run build   # vérifie la compilation Angular
```

Tout doit être vert avant de considérer la feature comme livrée.

## Checklist d'autocontrôle

Avant de rendre la main à l'utilisateur :

- [ ] Aucun fichier de `domain/` n'importe `@angular/common/http`, `rxjs`, ni quoi que ce soit hors de `domain/` et `@core/errors`
- [ ] Aucun composant de `presentation/` n'importe depuis `infrastructure/`
- [ ] Tous les composants ont `ChangeDetectionStrategy.OnPush`
- [ ] Aucun `*ngIf`/`*ngFor`/`ngClass`/`ngStyle` dans les templates
- [ ] Aucun `@Input`/`@Output`/`@HostBinding`/`@HostListener`
- [ ] Path aliases utilisés (`@core`, `@shared`, `@features`) — pas de `../../`
- [ ] Chaque erreur métier sous-classe `DomainError`
- [ ] Chaque erreur d'adapter HTTP sous-classe `InfrastructureError`
- [ ] `npm run lint && npm test && npm run build` verts

## Anti-patterns à refuser explicitement

Si l'utilisateur te demande l'une de ces choses, **explique pourquoi tu refuses** et propose la voie conforme :

- Appeler `HttpClient` depuis un composant ou un store → utiliser un use-case
- Mettre la logique de validation dans un `Validators` Angular → la mettre dans un Value Object
- Importer une autre feature → remonter le code partagé dans `shared/` ou un bounded context partagé
- Exposer un DTO en dehors de `infrastructure/` → tout doit passer par un mapper
- Utiliser `any` → utiliser `unknown` et raffiner
