import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { User } from '../../domain/entities/user.entity';
import { UsersStore } from '../../application/store/users.store';
import { UserCardComponent } from '../components/user-card.component';

@Component({
  selector: 'app-users-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, UserCardComponent],
  template: `
    <section class="mx-auto max-w-3xl p-6">
      <header class="mb-6 flex items-center justify-between">
        <h1 class="text-2xl font-bold">Users</h1>
        <a
          routerLink="new"
          class="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus-visible:outline focus-visible:outline-2"
        >
          New user
        </a>
      </header>

      @if (store.isLoading()) {
        <p role="status" aria-live="polite">Loading…</p>
      } @else if (store.error(); as error) {
        <p role="alert" class="text-red-700">{{ error }}</p>
      } @else if (store.isEmpty()) {
        <p>No users yet.</p>
      } @else {
        <ul class="grid grid-cols-1 gap-4 md:grid-cols-2">
          @for (user of store.users(); track user.id.value) {
            <li>
              <app-user-card [user]="user" (select)="onSelect($event)" />
            </li>
          }
        </ul>
      }
    </section>
  `,
})
export class UsersListPage implements OnInit {
  protected readonly store = inject(UsersStore);
  private readonly router = inject(Router);

  ngOnInit(): void {
    void this.store.load();
  }

  protected onSelect(user: User): void {
    void this.router.navigate(['users', user.id.value]);
  }
}
