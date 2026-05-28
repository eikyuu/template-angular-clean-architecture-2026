# Gestion d'état

Trois niveaux d'état, du plus local au plus partagé. **Toujours choisir le plus local possible.**

---

## 1. État local d'un composant — `signal()`

Pour tout état qui vit et meurt avec le composant.

```ts
@Component({
  selector: 'app-counter',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<button (click)="increment()">{{ count() }}</button>`,
})
export class CounterComponent {
  protected readonly count = signal(0);
  protected readonly doubled = computed(() => this.count() * 2);

  protected increment(): void {
    this.count.update((c) => c + 1);
  }
}
```

**Règles :**
- `protected readonly` pour exposer au template.
- `computed()` pour toute valeur dérivée — jamais de getter.
- `update()` pour transformer, `set()` pour remplacer. **Pas de `mutate()`**.
- `linkedSignal()` pour un état dont la valeur par défaut suit un input.

### Cas particulier : état de formulaire

L'état d'un formulaire est un `signal<TModel>()` privé, consommé par `form(model, schema)` de `@angular/forms/signals`. **Pas de store** pour ce cas — l'état vit et meurt avec la page. Voir [CONVENTIONS.md § Formulaires](./CONVENTIONS.md#formulaires) et le pattern [`users/presentation/pages/user-create.form.ts`](../src/app/features/users/presentation/pages/user-create.form.ts).

---

## 2. État applicatif d'une feature — Signal Store (`@ngrx/signals`)

Pour tout état partagé entre plusieurs composants d'une même feature : listes, sélection, filtres, chargement.

Vit dans `application/store/<feature>.store.ts`. Consomme les use-cases. Expose des **slots de lecture** et des **méthodes d'écriture**.

```ts
// application/store/users.store.ts
export const UsersStore = signalStore(
  withState<UsersState>({
    users: [],
    selectedId: null,
    status: 'idle',
    error: null,
  }),
  withComputed((state) => ({
    selected: computed(() =>
      state.users().find((u) => u.id === state.selectedId()) ?? null,
    ),
    isLoading: computed(() => state.status() === 'loading'),
  })),
  withMethods((store, listUsers = inject(ListUsersUseCase)) => ({
    async load(): Promise<void> {
      patchState(store, { status: 'loading', error: null });
      try {
        const users = await listUsers.execute();
        patchState(store, { users, status: 'success' });
      } catch (e) {
        patchState(store, { status: 'error', error: toErrorMessage(e) });
      }
    },
    select(id: UserId): void {
      patchState(store, { selectedId: id });
    },
  })),
);
```

**Règles :**
- Le store **ne fait JAMAIS d'appel HTTP directement**. Il appelle un use-case.
- `patchState` uniquement — pas de mutation directe.
- État typé via une interface dédiée (`UsersState`).
- **Scope = celui de la feature lazy.** Le store et ses use-cases sont déclarés dans `<feature>.providers.ts` et fournis au niveau de la route via `providers: <feature>Providers` — **pas** de `providedIn: 'root'`, car ils dépendent du port (`<FEATURE>_REPOSITORY`) qui n'est lié qu'à ce scope. Un store réellement global appartient à `core/`.

---

## 3. État réellement global — `core/` ou store dédié

Cas rares : utilisateur authentifié courant, thème, langue, feature flags. Vivent dans `core/` (ex: `core/auth/auth.store.ts`).

---

## Quand utiliser quoi ?

| Scope                            | Outil               |
|----------------------------------|---------------------|
| Un seul composant                | `signal()`          |
| Plusieurs composants d'1 feature | `signalStore`       |
| Multi-features                   | Store dans `core/`  |
| Cache HTTP avec invalidation     | `signalStore` + use-case (pas un cache générique) |

---

## Anti-patterns

- ❌ Souscrire à un `Observable` dans un composant avec `subscribe()`. Utiliser `toSignal()` ou `async` pipe.
- ❌ Lire/écrire le store depuis l'infrastructure ou le domaine.
- ❌ Mettre une promesse non résolue dans un signal — utiliser `resource()` (Angular 20+) ou un status enum.
- ❌ Effets en cascade (`effect()` qui écrit dans un autre signal qui re-déclenche). Modéliser via `computed()`.
