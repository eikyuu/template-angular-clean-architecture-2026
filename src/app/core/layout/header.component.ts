import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive],
  host: {
    class: 'sticky top-0 z-10 border-b border-gray-200 bg-white',
  },
  template: `
    <div class="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
      <a
        routerLink="/"
        class="text-lg font-semibold text-gray-900 hover:text-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
      >
        Angular App
      </a>
      <nav aria-label="Main navigation">
        <ul class="flex items-center gap-4">
          <li>
            <a
              routerLink="/users"
              routerLinkActive="text-blue-700 font-semibold"
              [routerLinkActiveOptions]="{ exact: false }"
              ariaCurrentWhenActive="page"
              class="text-sm text-gray-700 hover:text-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              Users
            </a>
          </li>
        </ul>
      </nav>
    </div>
  `,
})
export class HeaderComponent {}
