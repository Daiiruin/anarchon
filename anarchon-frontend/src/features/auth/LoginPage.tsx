import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { loginSchema, type LoginInput } from './auth.schemas';
import { login, fetchProfile } from './auth.api';
import { useAuthStore } from './auth.store';
import { AuthCard } from './AuthCard';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';

const FIELD_LABEL_CLASSES =
  'w-36 shrink-0 font-mono text-sm tracking-wide text-foreground uppercase';

export function LoginPage() {
  const navigate = useNavigate();
  const setSession = useAuthStore((state) => state.setSession);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(data: LoginInput) {
    setServerError(null);
    try {
      const { access_token: accessToken } = await login(data);
      useAuthStore.getState().setAccessToken(accessToken);
      const user = await fetchProfile();
      setSession({ accessToken, user });
      void navigate('/cases');
    } catch {
      setServerError('Identifiants invalides.');
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background p-6">
      <form
        onSubmit={(e) => void handleSubmit(onSubmit)(e)}
        className="flex w-full max-w-3xl flex-col gap-4"
        noValidate
      >
        <AuthCard title="Connexion agent">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-4">
              <Label htmlFor="email" className={FIELD_LABEL_CLASSES}>
                E-mail
              </Label>
              <Input
                id="email"
                type="email"
                className="flex-1 rounded-none"
                {...register('email')}
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
                {...register('password')}
              />
            </div>
            {errors.password && (
              <p className="ml-40 text-sm text-destructive">
                {errors.password.message}
              </p>
            )}

            {serverError && (
              <p className="text-sm text-destructive">{serverError}</p>
            )}
          </div>
        </AuthCard>

        <Button type="submit" disabled={isSubmitting} className="self-center">
          Se connecter
        </Button>
      </form>
      <p className="text-sm text-muted-foreground">
        Pas encore de compte ?{' '}
        <Link to="/register" className="underline">
          Créer un compte
        </Link>
      </p>
    </div>
  );
}
