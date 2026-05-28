export interface UserDto {
  readonly id: string;
  readonly email: string;
  readonly name: string;
  readonly created_at: string;
}

export interface CreateUserDto {
  readonly email: string;
  readonly name: string;
}
