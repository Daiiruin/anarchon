import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { registerSchema, type RegisterInput } from './auth.schemas';
import { register as registerRequest, fetchProfile } from './auth.api';
import { useAuthStore } from './auth.store';
import { AuthCard } from './AuthCard';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { RadioGroup, RadioGroupItem } from '@/shared/ui/radio-group';

const FIELD_LABEL_CLASSES =
  'w-36 shrink-0 font-mono text-sm tracking-wide text-foreground uppercase';

export function RegisterPage() {
  const navigate = useNavigate();
  const setSession = useAuthStore((state) => state.setSession);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register: registerField,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({ resolver: zodResolver(registerSchema) });

  async function onSubmit(data: RegisterInput) {
    setServerError(null);
    try {
      const { access_token: accessToken } = await registerRequest(data);
      useAuthStore.getState().setAccessToken(accessToken);
      const user = await fetchProfile();
      setSession({ accessToken, user });
      void navigate('/cases');
    } catch {
      setServerError('Cette adresse e-mail est déjà utilisée.');
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background p-6">
      <form
        onSubmit={(e) => void handleSubmit(onSubmit)(e)}
        className="flex w-full max-w-3xl flex-col gap-4"
        noValidate
      >
        <AuthCard title="Inscription agent">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-4">
              <Label htmlFor="name" className={FIELD_LABEL_CLASSES}>
                Nom
              </Label>
              <Input
                id="name"
                className="flex-1 rounded-none"
                {...registerField('name')}
              />
            </div>
            {errors.name && (
              <p className="ml-40 text-sm text-destructive">
                {errors.name.message}
              </p>
            )}

            <div className="flex items-center gap-4">
              <Label htmlFor="email" className={FIELD_LABEL_CLASSES}>
                E-mail
              </Label>
              <Input
                id="email"
                type="email"
                className="flex-1 rounded-none"
                {...registerField('email')}
              />
            </div>
            {errors.email && (
              <p className="ml-40 text-sm text-destructive">
                {errors.email.message}
              </p>
            )}

            <div className="flex items-center gap-4">
              <Label htmlFor="password" className={FIELD_LABEL_CLASSES}>
                Mot de passe
              </Label>
              <Input
                id="password"
                type="password"
                className="flex-1 rounded-none"
                {...registerField('password')}
              />
            </div>
            {errors.password && (
              <p className="ml-40 text-sm text-destructive">
                {errors.password.message}
              </p>
            )}

            <div className="flex items-center gap-4">
              <Label className={FIELD_LABEL_CLASSES}>Genre</Label>
              <Controller
                control={control}
                name="gender"
                render={({ field }) => (
                  <RadioGroup
                    value={field.value}
                    onValueChange={field.onChange}
                    name={field.name}
                    className="flex w-auto flex-row gap-4"
                  >
                    <Label className="flex items-center gap-2 font-normal">
                      <RadioGroupItem
                        value="HOMME"
                        className="rounded-none"
                      />{' '}
                      homme
                    </Label>
                    <Label className="flex items-center gap-2 font-normal">
                      <RadioGroupItem
                        value="FEMME"
                        className="rounded-none"
                      />{' '}
                      femme
                    </Label>
                  </RadioGroup>
                )}
              />
            </div>
            {errors.gender && (
              <p className="ml-40 text-sm text-destructive">
                {errors.gender.message}
              </p>
            )}

            {serverError && (
              <p className="text-sm text-destructive">{serverError}</p>
            )}
          </div>
        </AuthCard>

        <Button type="submit" disabled={isSubmitting} className="self-center">
          Créer mon compte
        </Button>
      </form>
      <p className="text-sm text-muted-foreground">
        Déjà un compte ?{' '}
        <Link to="/login" className="underline">
          Se connecter
        </Link>
      </p>
    </div>
  );
}
