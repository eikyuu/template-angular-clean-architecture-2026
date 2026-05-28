import { describe, expect, it } from 'vitest';
import { InvalidEmailError } from '../errors/invalid-email.error';
import { Email } from './email.vo';

describe('Email', () => {
  it('accepts a valid email and normalizes to lowercase', () => {
    expect(Email.create('Foo@Bar.COM').value).toBe('foo@bar.com');
  });

  it('trims surrounding whitespace', () => {
    expect(Email.create('  a@b.io  ').value).toBe('a@b.io');
  });

  it('rejects a malformed email', () => {
    expect(() => Email.create('not-an-email')).toThrow(InvalidEmailError);
  });

  it('rejects an empty string', () => {
    expect(() => Email.create('')).toThrow(InvalidEmailError);
  });

  it('treats two normalized emails as equal', () => {
    expect(Email.create('A@b.com').equals(Email.create('a@B.com'))).toBe(true);
  });
});
