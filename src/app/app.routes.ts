import { Routes } from '@angular/router';
import { ShellComponent } from '@core/layout/shell.component';

export const routes: Routes = [
  {
    path: '',
    component: ShellComponent,
    children: [
      { path: '', redirectTo: 'users', pathMatch: 'full' },
      {
        path: 'users',
        loadChildren: () =>
          import('@features/users/presentation/users.routes').then((m) => m.usersRoutes),
      },
      { path: '**', redirectTo: 'users' },
    ],
  },
];
