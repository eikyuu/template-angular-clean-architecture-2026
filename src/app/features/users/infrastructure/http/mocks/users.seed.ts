import { UserDto } from '../user.dto';

export const usersSeed: readonly UserDto[] = [
  {
    id: '1',
    email: 'alice.martin@example.com',
    name: 'Alice Martin',
    created_at: '2025-01-15T09:30:00.000Z',
  },
  {
    id: '2',
    email: 'bob.durand@example.com',
    name: 'Bob Durand',
    created_at: '2025-02-03T14:12:00.000Z',
  },
  {
    id: '3',
    email: 'claire.dubois@example.com',
    name: 'Claire Dubois',
    created_at: '2025-03-21T08:45:00.000Z',
  },
  {
    id: '4',
    email: 'david.lefevre@example.com',
    name: 'David Lefèvre',
    created_at: '2025-04-10T16:20:00.000Z',
  },
  {
    id: '5',
    email: 'emma.rousseau@example.com',
    name: 'Emma Rousseau',
    created_at: '2025-05-02T11:05:00.000Z',
  },
  {
    id: '6',
    email: 'florian.bernard@example.com',
    name: 'Florian Bernard',
    created_at: '2025-05-18T13:50:00.000Z',
  },
];
