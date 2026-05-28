import { Routes } from '@angular/router';
import { usersProviders } from '../infrastructure/users.providers';

export const usersRoutes: Routes = [
  {
    path: '',
    providers: usersProviders,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/users-list.page').then((m) => m.UsersListPage),
      },
      {
        path: 'new',
        loadComponent: () =>
          import('./pages/user-create.page').then((m) => m.UserCreatePage),
      },
      {
        path: ':id',
        loadComponent: () =>
          import('./pages/user-detail.page').then((m) => m.UserDetailPage),
      },
    ],
  },
];
