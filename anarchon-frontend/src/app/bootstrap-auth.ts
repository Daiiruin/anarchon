import { useAuthStore } from '@/features/auth/auth.store';
import { fetchProfile } from '@/features/auth/auth.api';
import { refreshAccessToken } from '@/shared/api/auth-refresh';

/**
 * Tente de restaurer une session existante au chargement de l'app, à partir
 * du cookie httpOnly de refresh (le seul survivant d'un F5 — l'access token
 * en mémoire ne l'est jamais). Échec à n'importe quelle étape = utilisateur
 * traité comme déconnecté, pas d'erreur remontée à l'appelant : c'est un
 * état normal (première visite, session expirée, etc.), pas une panne.
 */
export async function bootstrapAuth(): Promise<void> {
  try {
    const accessToken = await refreshAccessToken();
    const user = await fetchProfile();
    useAuthStore.getState().setSession({ accessToken, user });
  } catch {
    useAuthStore.getState().clearSession();
  }
}
