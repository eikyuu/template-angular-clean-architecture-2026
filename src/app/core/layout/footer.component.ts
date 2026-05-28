import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

@Component({
  selector: 'app-footer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'border-t border-gray-200 bg-white',
  },
  template: `
    <div class="mx-auto max-w-5xl px-6 py-4 text-center text-sm text-gray-500">
      © {{ year() }} Angular App
    </div>
  `,
})
export class FooterComponent {
  protected readonly year = signal(new Date().getFullYear());
}
