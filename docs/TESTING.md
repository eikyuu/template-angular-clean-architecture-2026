# Stratégie de test

Runner : **Vitest** (déjà configuré). Conventions : `*.spec.ts`, colocalisé avec le fichier testé.

---

## Pyramide

```
        ┌──────────────┐
        │   e2e (peu)  │  ← Playwright (à brancher si besoin)
        ├──────────────┤
        │  composants  │  ← TestBed minimal, focus sur le DOM
        ├──────────────┤
        │  use-cases   │  ← unitaires, repository fake
        ├──────────────┤
        │  domain      │  ← purs, sans Angular (les + nombreux)
        └──────────────┘
```

---

## Couche `domain/` — tests purs

Aucun TestBed, aucune dépendance Angular. C'est du TypeScript pur.

```ts
// domain/value-objects/email.vo.spec.ts
import { describe, it, expect } from 'vitest';
import { Email } from './email.vo';
import { InvalidEmailError } from '../errors/invalid-email.error';

describe('Email', () => {
  it('accepte un email valide et le normalise en minuscules', () => {
    expect(Email.create('Foo@Bar.com').value).toBe('foo@bar.com');
  });

  it('rejette un email invalide', () => {
    expect(() => Email.create('not-an-email')).toThrow(InvalidEmailError);
  });
});
```

**Couverture cible : 100%** sur le domain. C'est rapide et c'est là que les bugs métier sont catastrophiques.

---

## Couche `application/` — use-cases avec repository fake

Utiliser l'implémentation **in-memory** du repository pour tester le use-case. Pas de mock manuel.

```ts
// application/use-cases/list-users.use-case.spec.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { ListUsersUseCase } from './list-users.use-case';
import { USER_REPOSITORY } from '../../domain/repositories/user.repository';
import { InMemoryUserRepository } from '../../infrastructure/fakes/user.in-memory.repository';

describe('ListUsersUseCase', () => {
  let useCase: ListUsersUseCase;
  let repo: InMemoryUserRepository;

  beforeEach(() => {
    repo = new InMemoryUserRepository([/* seed */]);
    TestBed.configureTestingModule({
      providers: [{ provide: USER_REPOSITORY, useValue: repo }],
    });
    useCase = TestBed.inject(ListUsersUseCase);
  });

  it('retourne la liste depuis le repository', async () => {
    expect(await useCase.execute()).toHaveLength(0);
  });
});
```

---

## Couche `infrastructure/` — mappers et HTTP

- **Mappers** : testés en pur (input DTO → output entité, et inverse).
- **HTTP repositories** : testés avec `HttpTestingController` pour vérifier l'URL, le verbe, et le mapping.

```ts
// infrastructure/http/user.mapper.spec.ts
import { describe, it, expect } from 'vitest';
import { toUser, toUserDto } from './user.mapper';

describe('UserMapper', () => {
  it('mappe un DTO vers une entité', () => {
    const user = toUser({ id: '1', email: 'a@b.com', name: 'Alice' });
    expect(user.id).toBe('1');
    expect(user.email.value).toBe('a@b.com');
  });
});
```

---

## Couche `presentation/` — composants

Test minimal du DOM produit. **Pas de logique métier** à tester ici (elle est dans les use-cases).

```ts
// presentation/components/user-card.component.spec.ts
import { describe, it, expect } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { UserCardComponent } from './user-card.component';

describe('UserCardComponent', () => {
  it('affiche le nom de l\'utilisateur', () => {
    const fixture = TestBed.createComponent(UserCardComponent);
    fixture.componentRef.setInput('name', 'Alice');
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Alice');
  });
});
```

Pour les stores : tester l'enchaînement `méthode → état` en injectant un use-case fake.

---

## Règles

- **Un test = un comportement**. Pas de tests fourre-tout.
- **Nom** : phrase qui décrit le comportement attendu (`it('rejette un email invalide')`).
- **Arrange / Act / Assert** visible — sauter des lignes pour aérer.
- Pas de `any` dans les tests. Pas de `// @ts-ignore`.
- Pas de snapshot test sur les composants (trop fragile, masque les régressions).
- Si un test est difficile à écrire, c'est presque toujours un signal de mauvais découpage du code.
