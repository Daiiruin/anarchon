import { z } from 'zod';

export const GENDERS = ['HOMME', 'FEMME'] as const;
export type Gender = (typeof GENDERS)[number];

// Miroir exact de RegisterDto (anarchon-backend/src/features/auth/dto/register.dto.ts) :
// même 4 contraintes de mot de passe, mêmes champs name/gender.
export const registerSchema = z.object({
  email: z.string().email('Adresse e-mail invalide'),
  password: z
    .string()
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
    .regex(/[A-Z]/, 'Doit contenir au moins une majuscule')
    .regex(/[a-z]/, 'Doit contenir au moins une minuscule')
    .regex(/\d/, 'Doit contenir au moins un chiffre')
    .regex(
      /[!"#$%&'()*+,\-./:;<=>?@[\\\]^_{|}`~]/,
      'Doit contenir au moins un caractère spécial',
    ),
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  gender: z.enum(GENDERS, { message: 'Sélectionnez un genre' }),
});

export type RegisterInput = z.infer<typeof registerSchema>;

// Miroir de LoginDto : email + password, sans les règles de complexité
// (le backend ne les revalide pas non plus au login).
export const loginSchema = z.object({
  email: z.string().email('Adresse e-mail invalide'),
  password: z.string().min(1, 'Mot de passe requis'),
});

export type LoginInput = z.infer<typeof loginSchema>;
