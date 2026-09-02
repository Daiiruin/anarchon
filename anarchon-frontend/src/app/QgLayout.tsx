import { Outlet } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/auth.store';
import { logout as logoutRequest } from '@/features/auth/auth.api';
import { Button } from '@/shared/ui/button';

export function QgLayout() {
  const user = useAuthStore((state) => state.user);
  const clearSession = useAuthStore((state) => state.clearSession);

  async function handleLogout() {
    await logoutRequest().catch(() => {
      // Le cookie est de toute façon effacé côté serveur au mieux ; côté
      // client, on déconnecte l'utilisateur quoi qu'il arrive.
    });
    clearSession();
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="flex items-center justify-between border-b border-border px-6 py-4">
        <span className="text-lg font-semibold tracking-widest">ANACHRON</span>
        {user && (
          <Button variant="ghost" size="sm" onClick={() => void handleLogout()}>
            Déconnexion
          </Button>
        )}
      </header>
      <main className="flex flex-1 flex-col">
        <Outlet />
      </main>
    </div>
  );
}
