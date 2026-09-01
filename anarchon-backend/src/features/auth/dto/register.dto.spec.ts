import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { RegisterDto } from './register.dto';

function buildDto(password: string): RegisterDto {
  return plainToInstance(RegisterDto, { email: 'test@example.com', password });
}

async function getPasswordErrors(password: string): Promise<string[]> {
  const errors = await validate(buildDto(password));
  const pwError = errors.find((e) => e.property === 'password');
  return Object.values(pwError?.constraints ?? {});
}

describe('RegisterDto password validation', () => {
  it('accepts a valid strong password', async () => {
    const errors = await validate(buildDto('Secure@1'));
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
