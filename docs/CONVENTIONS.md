# Conventions de code

Règles transverses applicables à tout le code du template. À lire avant toute contribution.

---

## TypeScript

- `strict: true` non négociable. Pas de `any`, utiliser `unknown` et raffiner.
- Préférer l'inférence quand le type est évident, **typer explicitement** les signatures publiques (paramètres, retours, exports).
- Objets de données → `readonly` partout. Tableaux exposés → `readonly T[]`.
- Pas de `enum` natif : utiliser des **union literal types** (`type Status = 'pending' | 'done'`) ou un objet `as const`.
- Erreurs : sous-classer une `BaseError` (voir [`core/errors`](../src/app/core/errors)). Pas de `throw 'string'`.

## Angular

- **Standalone** uniquement. Ne JAMAIS écrire `standalone: true` (c'est le défaut depuis Angular 20+).
- `ChangeDetectionStrategy.OnPush` sur **tous** les composants.
- `inject()` au lieu du constructor injection.
- `input()` / `output()` au lieu des décorateurs `@Input` / `@Output`.
- Host bindings dans la propriété `host` du décorateur, **jamais** `@HostBinding` ni `@HostListener`.
- Routing par feature : chaque feature expose ses routes via `<feature>.routes.ts` chargées en lazy depuis `app.routes.ts`.
- `NgOptimizedImage` pour toutes les images statiques.

## Signals & état

- État local du composant → `signal()` + `computed()`.
- État partagé entre composants d'une feature → **Signal Store** (`@ngrx/signals`) dans `application/store/`.
- Jamais de `mutate()` (déprécié), uniquement `set()` / `update()`.
- Préférer `linkedSignal()` à un `effect()` pour les valeurs dérivées d'inputs.
- Voir [`STATE-MANAGEMENT.md`](./STATE-MANAGEMENT.md).

## Templates

- Control flow natif uniquement : `@if`, `@for`, `@switch`. Pas de `*ngIf`, `*ngFor`, `*ngSwitch`.
- `@for` obligatoirement avec `track`.
- Bindings de classes : `[class.foo]="cond"` ou `[class]="expr"`. Pas de `ngClass`.
- Bindings de styles : `[style.color]="x"`. Pas de `ngStyle`.
- Pas de logique dans le template au-delà d'une comparaison simple. Tout calcul → `computed()`.
- Templates inline pour les petits composants (< 20 lignes), externes (`templateUrl`) sinon.
- Async pipe pour les observables. Préférer convertir en signal (`toSignal()`) dès le constructeur.

## Composants

- Une responsabilité par composant.
- Distinction **smart** (page, routée, parle aux use-cases) / **dumb** (présentation, `input()`/`output()` uniquement).
- Les pages vivent dans `presentation/pages/`, les dumb dans `presentation/components/` ou `shared/ui/`.
- Pas d'appel HTTP, pas de logique métier dans un composant.

## Services

- `@Injectable({ providedIn: 'root' })` **uniquement** pour les vrais singletons globaux (sous `core/` ou `shared/`).
- À l'intérieur d'une feature (use-cases, stores, adapters infra), `@Injectable()` sans `providedIn` — ils sont déclarés dans `<feature>.providers.ts` et fournis au scope de la route lazy. Sinon l'injecteur racine ne voit pas le port `<FEATURE>_REPOSITORY` et plante au runtime (`NG0201`).
- `inject()` plutôt que constructor injection.
- Une responsabilité par service.
- Pas de dépendance circulaire — si elle apparaît, c'est un signal d'un mauvais découpage.

## Accessibilité (WCAG AA, non négociable)

- Tous les composants doivent passer **axe-core** sans violation.
- Focus visible, ordre de tabulation cohérent, gestion des `aria-*`.
- Contrastes ≥ 4.5:1 pour le texte.
- Pas de `div`/`span` cliquables — utiliser `button`/`a` avec sémantique correcte.

## Imports

- Utiliser les **path aliases** (`@core`, `@shared`, `@features`) — pas de `../../../`.
- Ordre : libs tierces → aliases internes → fichiers relatifs (même feature).
- Pas d'import depuis `infrastructure/` ailleurs que dans `<feature>.providers.ts`.

## Formulaires

- **Signal Forms** uniquement (`@angular/forms/signals`). Pas de Reactive Forms, pas de template-driven.
  > ⚠ Signal Forms est en **developer preview** depuis Angular 21. À monitorer à chaque mise à jour majeure.
- Le modèle est un `signal<TModel>()` standard. Le formulaire est construit avec `form(model, schema)`.
- Le **schéma de validation** est extrait dans un fichier `<page>.form.ts` colocalisé avec la page → testable isolément, exporte le type `TModel`, une factory `create<T>Model()` et la constante `<page>Schema`.
- Le modèle de formulaire est mutable par construction (binding bidirectionnel via `[formField]`) — c'est une exception assumée à la règle "readonly partout" qui ne s'applique qu'au modèle de formulaire.
- Binding template via la directive publique `FormField` : `<input [formField]="userForm.email" />`. Pas de `[formGroup]`, pas de `formControlName`.
- Validation métier dans le domaine (value objects), pas dans les validateurs Signal Forms. Le schéma est un **garde-fou UX** (feedback immédiat), le VO reste l'autorité.
- Pattern de référence : [`features/users/presentation/pages/user-create.form.ts`](../src/app/features/users/presentation/pages/user-create.form.ts) + [`user-create.page.ts`](../src/app/features/users/presentation/pages/user-create.page.ts).

## Commentaires

- Par défaut : aucun. Le code doit s'auto-documenter via nommage.
- Un commentaire répond à *pourquoi*, jamais à *quoi*. Si un commentaire explique le quoi, renommer.
- TSDoc uniquement sur les API publiques exposées entre couches (use-cases, ports).

## Tests

- Voir [`TESTING.md`](./TESTING.md).

## Git

- Conventional Commits forcés via `commitlint`.
- `feat:`, `fix:`, `refactor:`, `test:`, `docs:`, `chore:`, `perf:`.
- Une PR = un objectif. Pas de PR fourre-tout.
