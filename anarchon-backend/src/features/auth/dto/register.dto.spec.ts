import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { RegisterDto } from './register.dto';
import { Gender } from '../../users/enums/gender.enum';

function buildDto(
  overrides: Partial<
    Record<'email' | 'password' | 'name' | 'gender', unknown>
  > = {},
): RegisterDto {
  return plainToInstance(RegisterDto, {
    email: 'test@example.com',
    password: 'Secure@1',
    name: 'Ada',
    gender: Gender.FEMME,
    ...overrides,
  });
}

async function getPasswordErrors(password: string): Promise<string[]> {
  const errors = await validate(buildDto({ password }));
  const pwError = errors.find((e) => e.property === 'password');
  return Object.values(pwError?.constraints ?? {});
}

describe('RegisterDto password validation', () => {
  it('accepts a valid strong password', async () => {
    const errors = await validate(buildDto());
    expect(errors).toHaveLength(0);
  });

  it('rejects a password shorter than 8 characters', async () => {
    const messages = await getPasswordErrors('Ab1@');
    expect(messages.length).toBeGreaterThan(0);
  });

  it('rejects a password without uppercase letter', async () => {
    const messages = await getPasswordErrors('secure@1');
    expect(messages.length).toBeGreaterThan(0);
  });

  it('rejects a password without lowercase letter', async () => {
    const messages = await getPasswordErrors('SECURE@1');
    expect(messages.length).toBeGreaterThan(0);
  });

  it('rejects a password without a digit', async () => {
    const messages = await getPasswordErrors('Secure@a');
    expect(messages.length).toBeGreaterThan(0);
  });

  it('rejects a password without a special character', async () => {
    const messages = await getPasswordErrors('Secure12');
    expect(messages.length).toBeGreaterThan(0);
  });

  it('rejects a password where the only special character is a space', async () => {
    const messages = await getPasswordErrors('Secure 1');
    expect(messages.length).toBeGreaterThan(0);
  });

  it('rejects a password where the only special character is an emoji', async () => {
    const messages = await getPasswordErrors('Secure1😀');
    expect(messages.length).toBeGreaterThan(0);
  });

  it('rejects a password where the only special character is a unicode letter', async () => {
    const messages = await getPasswordErrors('Secureé1');
    expect(messages.length).toBeGreaterThan(0);
  });
});

describe('RegisterDto name/gender validation', () => {
  it('rejects a missing name', async () => {
    const errors = await validate(buildDto({ name: undefined }));
    expect(errors.some((e) => e.property === 'name')).toBe(true);
  });

  it('rejects a name shorter than 2 characters', async () => {
    const errors = await validate(buildDto({ name: 'A' }));
    expect(errors.some((e) => e.property === 'name')).toBe(true);
  });

  it('rejects an invalid gender value', async () => {
    const errors = await validate(buildDto({ gender: 'AUTRE' }));
    expect(errors.some((e) => e.property === 'gender')).toBe(true);
  });

  it('accepts HOMME and FEMME', async () => {
    await expect(
      validate(buildDto({ gender: Gender.HOMME })),
    ).resolves.toHaveLength(0);
    await expect(
      validate(buildDto({ gender: Gender.FEMME })),
    ).resolves.toHaveLength(0);
  });
});
