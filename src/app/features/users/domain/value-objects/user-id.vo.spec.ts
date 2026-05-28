import { describe, expect, it } from 'vitest';
import { InvalidUserIdError } from '../errors/invalid-user-id.error';
import { UserId } from './user-id.vo';

describe('UserId', () => {
  it('accepts a non-empty trimmed string', () => {
    expect(UserId.create('  42  ').value).toBe('42');
  });

  it('rejects an empty string', () => {
    expect(() => UserId.create('   ')).toThrow(InvalidUserIdError);
  });

  it('uses value equality', () => {
    expect(UserId.create('a').equals(UserId.create('a'))).toBe(true);
    expect(UserId.create('a').equals(UserId.create('b'))).toBe(false);
  });
});
