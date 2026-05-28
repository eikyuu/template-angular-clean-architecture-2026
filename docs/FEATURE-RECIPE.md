# Recette : ajouter une feature

> Suivre ces étapes **dans l'ordre**. Cela force à raisonner de l'intérieur (domaine) vers l'extérieur (UI).

Exemple : ajouter une feature `orders`.

---

## 1. Créer l'arborescence

```
src/app/features/orders/
├── domain/
│   ├── entities/
│   ├── value-objects/
│   ├── errors/
│   └── repositories/
├── application/
│   ├── use-cases/
│   └── store/
├── infrastructure/
│   ├── http/
│   └── fakes/
└── presentation/
    ├── pages/
    ├── components/
    └── orders.routes.ts
```

---

## 2. Domaine d'abord — quoi représente-t-on ?

### 2.1 Entité

```ts
// domain/entities/order.entity.ts
import { OrderId } from '../value-objects/order-id.vo';
import { Money } from '../value-objects/money.vo';

export class Order {
  constructor(
    readonly id: OrderId,
    readonly total: Money,
    readonly createdAt: Date,
  ) {}
}
```

### 2.2 Value Objects

Tout ce qui a une règle de validité (email, identifiant, montant) → un VO.

### 2.3 Erreurs métier

```ts
// domain/errors/order-not-found.error.ts
import { DomainError } from '@core/errors/domain.error';
export class OrderNotFoundError extends DomainError {
  constructor(id: string) { super(`Order ${id} not found`); }
}
```

### 2.4 Port (repository interface)

```ts
// domain/repositories/order.repository.ts
import { InjectionToken } from '@angular/core';
import { Order } from '../entities/order.entity';
import { OrderId } from '../value-objects/order-id.vo';

export interface OrderRepository {
  findAll(): Promise<readonly Order[]>;
  findById(id: OrderId): Promise<Order | null>;
}

export const ORDER_REPOSITORY = new InjectionToken<OrderRepository>('ORDER_REPOSITORY');
```

---

## 3. Application — quelles actions métier ?

Un use-case = une action. Une seule méthode publique `execute`.

```ts
// application/use-cases/list-orders.use-case.ts
import { Injectable, inject } from '@angular/core';
import { ORDER_REPOSITORY } from '../../domain/repositories/order.repository';

@Injectable()
export class ListOrdersUseCase {
  private readonly repo = inject(ORDER_REPOSITORY);
  execute() { return this.repo.findAll(); }
}
```

### Store (si nécessaire)

Voir [`STATE-MANAGEMENT.md`](./STATE-MANAGEMENT.md).

---

## 4. Infrastructure — comment on lit/écrit ?

### 4.1 DTO et mapper

```ts
// infrastructure/http/order.dto.ts
export interface OrderDto {
  id: string;
  total_cents: number;
  currency: string;
  created_at: string;
}

// infrastructure/http/order.mapper.ts
export function toOrder(dto: OrderDto): Order { /* ... */ }
```

### 4.2 Adapter HTTP

```ts
// infrastructure/http/order.http.repository.ts
@Injectable()
export class HttpOrderRepository implements OrderRepository {
  private readonly http = inject(HttpClient);
  async findAll() {
    const dtos = await firstValueFrom(this.http.get<OrderDto[]>('/api/orders'));
    return dtos.map(toOrder);
  }
}
```

### 4.3 Fake in-memory (utile pour dev + tests)

```ts
// infrastructure/fakes/order.in-memory.repository.ts
export class InMemoryOrderRepository implements OrderRepository {
  constructor(private orders: Order[] = []) {}
  async findAll() { return [...this.orders]; }
}
```

### 4.4 Binding DI

```ts
// infrastructure/orders.providers.ts
import { Provider } from '@angular/core';
import { ORDER_REPOSITORY } from '../domain/repositories/order.repository';
import { HttpOrderRepository } from './http/order.http.repository';

export const ordersProviders: Provider[] = [
  { provide: ORDER_REPOSITORY, useClass: HttpOrderRepository },
  ListOrdersUseCase,
  // ...autres use-cases et OrdersStore
];
```

---

## 5. Présentation — comment l'utilisateur interagit ?

### 5.1 Page

```ts
// presentation/pages/orders-list.page.ts
@Component({
  selector: 'app-orders-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @for (order of store.orders(); track order.id) {
      <app-order-card [order]="order" />
    }
  `,
})
export class OrdersListPage {
  protected readonly store = inject(OrdersStore);
  constructor() { this.store.load(); }
}
```

### 5.2 Formulaire (création / édition)

Pour toute page qui édite un modèle, utiliser **Signal Forms** (`@angular/forms/signals`). Schéma extrait :

```ts
// presentation/pages/order-create.form.ts
import { required, schema } from '@angular/forms/signals';

export interface OrderCreateModel {
  reference: string;
}

export function createOrderCreateModel(): OrderCreateModel {
  return { reference: '' };
}

export const orderCreateSchema = schema<OrderCreateModel>((path) => {
  required(path.reference, { message: 'Reference is required' });
});
```

```ts
// presentation/pages/order-create.page.ts
import { form, FormField } from '@angular/forms/signals';
import { createOrderCreateModel, orderCreateSchema } from './order-create.form';

@Component({
  selector: 'app-order-create',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormField],
  template: `
    <form (ngSubmit)="submit()">
      <input [formField]="orderForm.reference" />
      <button type="submit" [disabled]="!orderForm().valid()">Create</button>
    </form>
  `,
})
export class OrderCreatePage {
  readonly #model = signal(createOrderCreateModel());
  protected readonly orderForm = form(this.#model, orderCreateSchema);
  // ...submit() lit this.#model() et appelle un use-case via le store
}
```

Pattern de référence : [`features/users/presentation/pages/user-create.*`](../src/app/features/users/presentation/pages/).

### 5.3 Routes locales

```ts
// presentation/orders.routes.ts
import { Routes } from '@angular/router';
import { ordersProviders } from '../infrastructure/orders.providers';

export const ordersRoutes: Routes = [
  {
    path: '',
    providers: ordersProviders,
    loadComponent: () => import('./pages/orders-list.page').then(m => m.OrdersListPage),
  },
];
```

---

## 6. Câbler dans `app.routes.ts`

```ts
{
  path: 'orders',
  loadChildren: () => import('./features/orders/presentation/orders.routes').then(m => m.ordersRoutes),
},
```

---

## 7. Tester

- Domain : tests purs (VO, erreurs).
- Application : use-case avec `InMemoryOrderRepository`.
- Infrastructure : mapper test pur, repo HTTP avec `HttpTestingController`.
- Presentation : test du DOM minimal.

Voir [`TESTING.md`](./TESTING.md).

---

## Checklist avant PR

- [ ] Aucun import croisé entre features
- [ ] `domain/` n'importe rien d'Angular
- [ ] Tous les composants en `OnPush`
- [ ] Pas de `ngClass`/`ngStyle`/`*ngIf`/`*ngFor`
- [ ] `inject()` partout, pas de constructeur
- [ ] Tests verts (`npm test`)
- [ ] Lint vert (`npm run lint`)
- [ ] Build vert (`npm run build`)
