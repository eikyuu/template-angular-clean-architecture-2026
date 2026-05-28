import { computed, inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { User } from '../../domain/entities/user.entity';
import { UserId } from '../../domain/value-objects/user-id.vo';
import { CreateUserUseCase, CreateUserInput } from '../use-cases/create-user.use-case';
import { GetUserByIdUseCase } from '../use-cases/get-user-by-id.use-case';
import { ListUsersUseCase } from '../use-cases/list-users.use-case';

type Status = 'idle' | 'loading' | 'success' | 'error';

interface UsersState {
  readonly users: readonly User[];
  readonly selectedId: UserId | null;
  readonly status: Status;
  readonly error: string | null;
}

const initialState: UsersState = {
  users: [],
  selectedId: null,
  status: 'idle',
  error: null,
};

const toMessage = (e: unknown): string =>
  e instanceof Error ? e.message : 'Unknown error';

export const UsersStore = signalStore(
  withState<UsersState>(initialState),
  withComputed((state) => ({
    selected: computed(() => {
      const id = state.selectedId();
      return id === null ? null : state.users().find((u) => u.id.equals(id)) ?? null;
    }),
    isLoading: computed(() => state.status() === 'loading'),
    isEmpty: computed(() => state.status() === 'success' && state.users().length === 0),
  })),
  withMethods(
    (
      store,
      listUsers = inject(ListUsersUseCase),
      getById = inject(GetUserByIdUseCase),
      createUser = inject(CreateUserUseCase),
    ) => ({
      async load(): Promise<void> {
        patchState(store, { status: 'loading', error: null });
        try {
          const users = await listUsers.execute();
          patchState(store, { users, status: 'success' });
        } catch (e) {
          patchState(store, { status: 'error', error: toMessage(e) });
        }
      },
      async select(id: UserId): Promise<void> {
        patchState(store, { selectedId: id });
        const exists = store.users().some((u) => u.id.equals(id));
        if (exists) return;
        try {
          const user = await getById.execute(id);
          patchState(store, { users: [...store.users(), user] });
        } catch (e) {
          patchState(store, { error: toMessage(e) });
        }
      },
      async add(input: CreateUserInput): Promise<void> {
        try {
          const user = await createUser.execute(input);
          patchState(store, { users: [...store.users(), user] });
        } catch (e) {
          patchState(store, { error: toMessage(e) });
        }
      },
      clearSelection(): void {
        patchState(store, { selectedId: null });
      },
    }),
  ),
);
