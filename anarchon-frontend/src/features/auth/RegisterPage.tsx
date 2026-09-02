import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { registerSchema, type RegisterInput } from './auth.schemas';
import { register as registerRequest, fetchProfile } from './auth.api';
import { useAuthStore } from './auth.store';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { RadioGroup, RadioGroupItem } from '@/shared/ui/radio-group';

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
    <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center gap-6 px-6">
      <h1 className="text-2xl font-semibold">Créer un compte</h1>
      <form
        onSubmit={(e) => void handleSubmit(onSubmit)(e)}
        className="flex flex-col gap-4"
        noValidate
      >
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="name">Nom</Label>
          <Input id="name" {...registerField('name')} />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">E-mail</Label>
          <Input id="email" type="email" {...registerField('email')} />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="password">Mot de passe</Label>
          <Input id="password" type="password" {...registerField('password')} />
          {errors.password && (
            <p className="text-sm text-destructive">
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label>Genre</Label>
          <Controller
            control={control}
            name="gender"
            render={({ field }) => (
              <RadioGroup
                value={field.value}
                onValueChange={field.onChange}
                name={field.name}
              >
                <Label className="flex items-center gap-2 font-normal">
                  <RadioGroupItem value="HOMME" /> Homme
                </Label>
                <Label className="flex items-center gap-2 font-normal">
                  <RadioGroupItem value="FEMME" /> Femme
                </Label>
              </RadioGroup>
            )}
          />
          {errors.gender && (
            <p className="text-sm text-destructive">{errors.gender.message}</p>
          )}
        </div>

        {serverError && (
          <p className="text-sm text-destructive">{serverError}</p>
        )}

        <Button type="submit" disabled={isSubmitting}>
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
