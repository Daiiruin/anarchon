import type { ReactNode } from 'react';
import { User } from 'lucide-react';

export function AuthCard({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="flex w-full flex-col border border-border bg-card">
      <div className="flex items-center border-b border-border py-4">
        <div className="h-5 w-[25%] bg-primary" aria-hidden="true" />
        <span className="px-3 font-mono text-lg font-semibold tracking-widest text-primary uppercase">
          Anarchon
        </span>
        <div className="flex items-center gap-1" aria-hidden="true">
          <span className="h-5 w-16 bg-primary" />
          <span className="h-5 w-8 bg-primary" />
          <span className="h-5 w-4 bg-primary" />
        </div>
        <div className="flex-1" />
      </div>

      <div className="flex flex-1 flex-col gap-6 p-8 sm:flex-row">
        <div className="flex size-32 shrink-0 items-center justify-center overflow-hidden border border-border bg-background">
          <User className="size-16 text-foreground" strokeWidth={1.5} />
        </div>
        <div className="flex flex-1 flex-col gap-4">
          <h1 className="font-mono text-lg font-semibold tracking-wide uppercase">
            {title}
          </h1>
          {children}
        </div>
      </div>

      <div className="flex items-center border-t border-border py-4">
        <div className="h-5 w-[25%] bg-primary" aria-hidden="true" />
        <span className="flex-1 px-3 text-center font-mono text-xs tracking-widest text-muted-foreground uppercase">
          48.8566° N, 2.3522° E - Paris
        </span>
        <div className="h-5 w-[25%] bg-primary" aria-hidden="true" />
      </div>
    </div>
  );
}
