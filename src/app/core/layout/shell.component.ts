import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './footer.component';
import { HeaderComponent } from './header.component';

@Component({
  selector: 'app-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HeaderComponent, FooterComponent, RouterOutlet],
  host: {
    class: 'flex min-h-screen flex-col bg-gray-50 text-gray-900',
  },
  template: `
    <a
      href="#main"
      class="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-20 focus:rounded focus:bg-blue-700 focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-blue-300"
    >
      Skip to main content
    </a>
    <app-header />
    <main id="main" tabindex="-1" class="flex-1 focus:outline-none">
      <router-outlet />
    </main>
    <app-footer />
  `,
})
export class ShellComponent {}
