import { ChangeDetectionStrategy, Component, computed, inject, input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UsersStore } from '../../application/store/users.store';
import { UserId } from '../../domain/value-objects/user-id.vo';

@Component({
  selector: 'app-user-detail',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <section class="mx-auto max-w-2xl p-6">
      <a routerLink=".." class="text-sm text-blue-600 hover:underline">← Back to users</a>

      @if (user(); as u) {
        <h1 class="mt-4 text-2xl font-bold">{{ u.name }}</h1>
        <dl class="mt-4 space-y-2">
          <div class="flex gap-2">
            <dt class="font-medium">Email:</dt>
            <dd>{{ u.email.value }}</dd>
          </div>
          <div class="flex gap-2">
            <dt class="font-medium">Created:</dt>
            <dd>{{ u.createdAt.toLocaleDateString() }}</dd>
          </div>
        </dl>
      } @else {
        <p role="status">Loading user…</p>
      }
    </section>
  `,
})
export class UserDetailPage implements OnInit {
  readonly id = input.required<string>();
  private readonly store = inject(UsersStore);

  protected readonly user = computed(() => this.store.selected());

  ngOnInit(): void {
    void this.store.select(UserId.create(this.id()));
  }
}
