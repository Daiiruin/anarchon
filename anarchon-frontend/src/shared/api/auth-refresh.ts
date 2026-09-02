import { useAuthStore } from '@/features/auth/auth.store';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

let refreshPromise: Promise<string> | null = null;

/**
 * Le backend fait tourner les refresh tokens à chaque appel (rotation) :
 * l'ancien est révoqué dès qu'un nouveau est émis. Si deux requêtes échouent
 * en 401 en même temps, il ne doit y avoir qu'UN SEUL appel /auth/refresh en
 * vol — sinon le second échoue à tort contre un token déjà révoqué par le
 * premier. Cette promesse partagée est le verrou.
 *
 * Utilise fetch brut (pas le client `http`) : le client `http` appelle cette
 * fonction sur un 401, donc l'inverse créerait une dépendance circulaire.
 */
export function refreshAccessToken(): Promise<string> {
  refreshPromise ??= fetch(`${API_BASE_URL}/auth/refresh`, {
    method: 'POST',
    credentials: 'include',
  })
    .then(async (res) => {
      if (!res.ok) {
        throw new Error('Refresh failed');
      }
      const data = (await res.json()) as { access_token: string };
      useAuthStore.getState().setAccessToken(data.access_token);
      return data.access_token;
    })
    .catch((error: unknown) => {
      useAuthStore.getState().clearSession();
      throw error;
    })
    .finally(() => {
      refreshPromise = null;
    });

  return refreshPromise;
}
