import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { User } from '../../domain/entities/user.entity';

@Component({
  selector: 'app-user-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article class="rounded-lg border border-gray-200 p-4 shadow-sm">
      <h3 class="text-lg font-semibold">{{ user().name }}</h3>
      <p class="text-sm text-gray-600">{{ user().email.value }}</p>
      <button
        type="button"
        class="mt-3 rounded bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500"
        (click)="select.emit(user())"
      >
        View details
      </button>
    </article>
  `,
})
export class UserCardComponent {
  readonly user = input.required<User>();
  readonly select = output<User>();
}
