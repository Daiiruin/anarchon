import { Button } from '@/shared/ui/button';

function App() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background text-foreground">
      <h1 className="text-4xl font-semibold tracking-widest">ANACHRON</h1>
      <p className="text-muted-foreground">
        Fondation frontend en cours de construction.
      </p>
      <Button>Bouton shadcn/ui</Button>
    </main>
  );
}

export default App;
