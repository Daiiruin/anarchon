import { useEffect, useState } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';
import { queryClient } from './query-client';
import { router } from './router';
import { bootstrapAuth } from './bootstrap-auth';

export function App() {
  const [isBootstrapped, setIsBootstrapped] = useState(false);

  useEffect(() => {
    void bootstrapAuth().finally(() => setIsBootstrapped(true));
  }, []);

  // Tant que le refresh silencieux (cookie httpOnly -> access token en
  // mémoire) n'a pas résolu, on ne sait pas encore si l'utilisateur est
  // connecté : ProtectedRoute ne doit pas trancher trop tôt.
  if (!isBootstrapped) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
        Chargement…
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
