import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { form, FormField } from '@angular/forms/signals';
import { Router, RouterLink } from '@angular/router';
import { UsersStore } from '../../application/store/users.store';
import { createUserCreateModel, userCreateSchema } from './user-create.form';

@Component({
  selector: 'app-user-create',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormField, RouterLink],
  template: `
    <section class="mx-auto max-w-md p-6">
      <a routerLink=".." class="text-sm text-blue-600 hover:underline">← Cancel</a>
      <h1 class="mt-4 text-2xl font-bold">New user</h1>

      <form (ngSubmit)="submit()" class="mt-6 space-y-4">
        <label class="block">
          <span class="text-sm font-medium">Name</span>
          <input
            type="text"
            [formField]="userForm.name"
            class="mt-1 w-full rounded border border-gray-300 px-3 py-2"
            autocomplete="name"
          />
        </label>

        <label class="block">
          <span class="text-sm font-medium">Email</span>
          <input
            type="email"
            [formField]="userForm.email"
            class="mt-1 w-full rounded border border-gray-300 px-3 py-2"
            autocomplete="email"
          />
        </label>

        @if (errorMessage(); as msg) {
          <p role="alert" class="text-sm text-red-700">{{ msg }}</p>
        }

        <button
          type="submit"
          [disabled]="!userForm().valid() || submitting()"
          class="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          Create
        </button>
      </form>
    </section>
  `,
})
export class UserCreatePage {
  readonly #store = inject(UsersStore);
  readonly #router = inject(Router);
  readonly #model = signal(createUserCreateModel());

  protected readonly userForm = form(this.#model, userCreateSchema);
  protected readonly submitting = signal(false);
  protected readonly errorMessage = signal<string | null>(null);

  protected async submit(): Promise<void> {
    if (!this.userForm().valid()) return;
    this.submitting.set(true);
    this.errorMessage.set(null);
    try {
      await this.#store.add(this.#model());
      await this.#router.navigate(['users']);
    } catch (e) {
      this.errorMessage.set(e instanceof Error ? e.message : 'Unknown error');
    } finally {
      this.submitting.set(false);
    }
  }
}
