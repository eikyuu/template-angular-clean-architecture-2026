You are an expert in TypeScript, Angular, and scalable enterprise web applications. You write functional, maintainable, performant, accessible code following Clean Architecture, Angular and TypeScript best practices.

## ⚠ Architecture — lecture obligatoire avant tout code

Ce repo est un **template d'entreprise** appliquant une **Clean Architecture stricte à 4 couches par feature**.

**Avant d'écrire ou de modifier du code**, consulte impérativement :

- [`docs/ARCHITECTURE.md`](../docs/ARCHITECTURE.md) — les 4 couches, la règle de dépendance, les imports interdits
- [`docs/CONVENTIONS.md`](../docs/CONVENTIONS.md) — règles transverses (TS, Angular, signals, templates, a11y)
- [`docs/NAMING.md`](../docs/NAMING.md) — suffixes de fichiers et conventions de nommage
- [`docs/STATE-MANAGEMENT.md`](../docs/STATE-MANAGEMENT.md) — quand utiliser `signal()` vs Signal Store
- [`docs/TESTING.md`](../docs/TESTING.md) — stratégie de test par couche
- [`docs/FEATURE-RECIPE.md`](../docs/FEATURE-RECIPE.md) — recette pas-à-pas pour ajouter une feature

**La feature [`src/app/features/users/`](../src/app/features/users/) est la référence vivante** — tous les patterns du template y sont implémentés. Toute nouvelle feature doit la suivre.

## Règle de dépendance (non négociable)

```
presentation  ──►  application  ──►  domain  ◄──  infrastructure
```

- **`domain/`** : zéro dépendance Angular/RxJS/HTTP. TypeScript pur.
- **`application/`** : ne dépend que de `domain/` et de `core/`.
- **`infrastructure/`** : implémente les ports de `domain/`. Ne sort jamais de DTO de la couche.
- **`presentation/`** : ne consomme que `application/` + `shared/` + `core/`. **Jamais** d'import direct depuis `infrastructure/` (seul `<feature>.providers.ts` le fait).

Ces règles sont forcées par [`eslint.config.mjs`](../eslint.config.mjs) (plugin `boundaries`).

## TypeScript

- `strict: true`. Pas de `any`, utiliser `unknown`.
- Préférer l'inférence quand le type est évident ; typer explicitement les signatures publiques.
- `readonly` partout sur les objets de données ; `readonly T[]` pour les tableaux exposés.
- Path aliases : `@core/*`, `@shared/*`, `@features/*`. **Jamais** de `../../../`.

## Angular

- **Standalone** uniquement. Ne JAMAIS écrire `standalone: true` (défaut depuis v20+).
- `ChangeDetectionStrategy.OnPush` sur tous les composants.
- `inject()`, pas de constructor injection.
- `input()` / `output()`, pas les décorateurs `@Input` / `@Output`.
- Host bindings dans la propriété `host` du décorateur. **Pas de `@HostBinding`/`@HostListener`**.
- `NgOptimizedImage` pour toutes les images statiques.
- Lazy loading par feature via `loadChildren` → `<feature>.routes.ts`.

## Composants

- Une responsabilité par composant. Distinction smart (pages) / dumb (présentation).
- Pas de logique métier ni d'appel HTTP dans un composant.
- Pas de getter pour de la dérivation — utiliser `computed()`.
- **Signal Forms** uniquement (`@angular/forms/signals`, developer preview Angular 21). Schéma de validation extrait dans un fichier `.form.ts` colocalisé avec la page. Pas de Reactive Forms ni de template-driven.
- Templates inline pour les petits composants (< 20 lignes), externes sinon.

## State

- État local → `signal()` + `computed()`.
- État partagé d'une feature → **Signal Store `@ngrx/signals`** dans `application/store/`.
- Le store **ne fait JAMAIS d'appel HTTP** — il appelle un use-case.
- Pas de `mutate()`. `set()` / `update()` / `patchState()` uniquement.

## Templates

- Control flow natif : `@if`, `@for` (avec `track` obligatoire), `@switch`.
- **Pas** de `*ngIf`, `*ngFor`, `*ngSwitch`.
- **Pas** de `ngClass` (utiliser `[class.foo]`) ni `ngStyle` (utiliser `[style.x]`).
- Async pipe ou `toSignal()` pour les observables.
- Ne pas supposer de globals (`new Date()`) accessibles.

## Services

- `@Injectable({ providedIn: 'root' })` pour les singletons.
- `inject()` partout.
- Une responsabilité par service.

## Accessibilité (WCAG AA — non négociable)

- Doit passer **axe-core** sans violation.
- Focus visible, ordre de tabulation cohérent, `aria-*` correct, contraste ≥ 4.5:1.
- Pas de `div`/`span` cliquables — utiliser `button`/`a`.

## Erreurs

- Sous-classer `DomainError` (métier) ou `InfrastructureError` (technique).
- Jamais de `throw 'string'` ni de `throw new Error('msg')` brut.

## Tests

- Vitest. Conventions dans [`docs/TESTING.md`](../docs/TESTING.md).
- Couverture cible **100 %** sur `domain/`. Use-cases testés avec `InMemoryRepository` (déjà fourni pour la feature `users`).
- Pas de snapshot sur les composants.

## Commits

- Conventional Commits forcés via commitlint : `feat:`, `fix:`, `refactor:`, `test:`, `docs:`, `chore:`, `perf:`, `build:`, `ci:`, `style:`, `revert:`.

## Avant de proposer du code

1. Identifier la **couche** où le code doit vivre.
2. Vérifier les **imports autorisés** depuis cette couche.
3. Suivre les **suffixes de nommage** (`.entity.ts`, `.vo.ts`, `.use-case.ts`, `.repository.ts`, `.mapper.ts`, `.dto.ts`, `.page.ts`, `.component.ts`, `.store.ts`, `.form.ts`).
4. S'inspirer de la feature `users/` pour le pattern.
5. Si la règle d'architecture est cassée, **ne pas écrire le code** — proposer un refactor préalable.
