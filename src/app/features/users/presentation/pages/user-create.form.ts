import { email, minLength, required, schema } from '@angular/forms/signals';

export interface UserCreateModel {
  name: string;
  email: string;
}

export function createUserCreateModel(): UserCreateModel {
  return { name: '', email: '' };
}

export const userCreateSchema = schema<UserCreateModel>((path) => {
  required(path.name, { message: 'Name is required' });
  minLength(path.name, 2, { message: 'Name must be at least 2 characters' });
  required(path.email, { message: 'Email is required' });
  email(path.email, { message: 'Email format is invalid' });
});
