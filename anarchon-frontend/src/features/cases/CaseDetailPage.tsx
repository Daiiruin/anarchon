import { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useCaseDetail } from './useCaseDetail';
import type { CaseStatus } from './cases.schemas';
import { Button } from '@/shared/ui/button';

const ACTION_LABELS: Record<CaseStatus, string> = {
  NOT_STARTED: "COMMENCER L'AFFAIRE",
  IN_PROGRESS: "REPRENDRE L'AFFAIRE",
  COMPLETED: 'CONSULTER L’AFFAIRE',
};

export function CaseDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { data, isLoading, isError } = useCaseDetail(slug ?? '');

  useEffect(() => {
    // Le backend renvoie le même 404 pour une affaire DRAFT ou inexistante —
    // le frontend ne doit rien tenter de distinguer, juste revenir au catalogue.
    if (isError) {
      void navigate('/cases', { replace: true });
    }
  }, [isError, navigate]);

  if (isLoading || isError || !data) {
    return <p className="p-6 text-muted-foreground">Chargement…</p>;
  }

  return (
    <div className="relative flex flex-1 flex-col">
      {data.detailBackgroundUrl && (
        <img
          src={data.detailBackgroundUrl}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
      <div className="absolute inset-0 bg-background/80" />

      <div className="relative z-10 mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center gap-6 px-6 py-12">
        <Link
          to="/cases"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Retour aux affaires
        </Link>

        <h1 className="text-3xl font-semibold tracking-wide uppercase">
          {data.title}
        </h1>
        <p className="text-sm tracking-wide text-muted-foreground uppercase">
          {data.eraLabel}
        </p>

        <div>
          <p className="mb-1 text-xs tracking-wide text-muted-foreground uppercase">
            Difficulté
          </p>
          <span className="text-lg tracking-widest">
            <span className="text-primary">{'●'.repeat(data.difficulty)}</span>
            <span className="text-muted-foreground">
              {'○'.repeat(5 - data.difficulty)}
            </span>
          </span>
        </div>

        <p className="leading-relaxed text-foreground">{data.synopsis}</p>

        {/*
          Le bouton n'a volontairement pas de onClick : POST /cases/:slug/start
          n'existe pas encore côté backend (doc 02, GameEngine). Visuellement
          complet, fonctionnellement inerte jusque-là.
        */}
        <Button size="lg" className="self-start">
          {ACTION_LABELS[data.status]}
        </Button>
      </div>
    </div>
  );
}
