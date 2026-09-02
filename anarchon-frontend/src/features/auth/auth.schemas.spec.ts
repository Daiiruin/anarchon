import { describe, it, expect } from 'vitest';
import { registerSchema, loginSchema } from './auth.schemas';

function buildInput(
  overrides: Partial<
    Record<'email' | 'password' | 'name' | 'gender', unknown>
  > = {},
) {
  return {
    email: 'test@example.com',
    password: 'Secure@1',
    name: 'Ada',
    gender: 'FEMME',
    ...overrides,
  };
}

describe('registerSchema', () => {
  it('accepts a valid payload', () => {
    expect(registerSchema.safeParse(buildInput()).success).toBe(true);
  });

  it('rejects a password shorter than 8 characters', () => {
    expect(
      registerSchema.safeParse(buildInput({ password: 'Ab1@' })).success,
    ).toBe(false);
  });

  it('rejects a password without an uppercase letter', () => {
    expect(
      registerSchema.safeParse(buildInput({ password: 'secure@1' })).success,
    ).toBe(false);
  });

  it('rejects a password without a lowercase letter', () => {
    expect(
      registerSchema.safeParse(buildInput({ password: 'SECURE@1' })).success,
    ).toBe(false);
  });

  it('rejects a password without a digit', () => {
    expect(
      registerSchema.safeParse(buildInput({ password: 'Secure@a' })).success,
    ).toBe(false);
  });

  it('rejects a password without a special character', () => {
    expect(
      registerSchema.safeParse(buildInput({ password: 'Secure12' })).success,
    ).toBe(false);
  });

  it('rejects a name shorter than 2 characters', () => {
    expect(registerSchema.safeParse(buildInput({ name: 'A' })).success).toBe(
      false,
    );
  });

  it('rejects an invalid gender value', () => {
    expect(
      registerSchema.safeParse(buildInput({ gender: 'AUTRE' })).success,
    ).toBe(false);
  });

  it('accepts HOMME and FEMME', () => {
    expect(
      registerSchema.safeParse(buildInput({ gender: 'HOMME' })).success,
    ).toBe(true);
    expect(
      registerSchema.safeParse(buildInput({ gender: 'FEMME' })).success,
    ).toBe(true);
  });

  it('rejects an invalid email', () => {
    expect(
      registerSchema.safeParse(buildInput({ email: 'not-an-email' })).success,
    ).toBe(false);
  });
});

describe('loginSchema', () => {
  it('accepts email + non-empty password', () => {
    expect(
      loginSchema.safeParse({ email: 'a@a.com', password: 'anything' }).success,
    ).toBe(true);
  });

  it('rejects an empty password', () => {
    expect(
      loginSchema.safeParse({ email: 'a@a.com', password: '' }).success,
    ).toBe(false);
  });

  it('rejects an invalid email', () => {
    expect(
      loginSchema.safeParse({ email: 'not-an-email', password: 'anything' })
        .success,
    ).toBe(false);
  });
});
