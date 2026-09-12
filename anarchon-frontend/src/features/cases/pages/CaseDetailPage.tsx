import { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useCaseDetail } from '../hooks/useCaseDetail';
import { Button } from '@/shared/ui/button';
import { Loading } from '@/shared/ui/loading';
import { ACTION_LABELS, STATUS_LABELS, STATUS_BADGE_CLASSES } from '../lib/consts/cases';

export function CaseDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { data, loading, error } = useCaseDetail(slug ?? '');

  useEffect(() => {
    if (error) {
      void navigate('/cases', { replace: true });
    }
  }, [error, navigate]);

  if (loading || error || !data) return <Loading />;

  return (
    <div className="relative flex flex-1 flex-col">
      <img
        src={`/cases/${data.slug}/cover.webp`}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-background/80" />

      <div className="relative z-10 mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center gap-6 px-6 py-12">
        <Link
          to="/cases"
          className="font-mono text-sm text-muted-foreground hover:text-foreground"
        >
          ← Retour aux affaires
        </Link>

        <h1 className="font-mono text-3xl font-semibold tracking-wide uppercase">
          {data.title}
        </h1>
        <div className="flex items-center gap-3">
          <p className="font-mono text-sm tracking-wide text-muted-foreground uppercase">
            {data.eraLabel}
          </p>
          <span
            className={`rounded-sm px-1.5 py-0.5 font-mono text-[0.65rem] tracking-wide uppercase ${STATUS_BADGE_CLASSES[data.status]}`}
          >
            {STATUS_LABELS[data.status]}
          </span>
        </div>

        <div>
          <p className="mb-1 font-mono text-xs tracking-wide text-muted-foreground uppercase">
            Difficulté
          </p>
          <span className="font-mono text-lg tracking-widest">
            <span className="text-primary">{'●'.repeat(data.difficulty)}</span>
            <span className="text-muted-foreground">
              {'○'.repeat(5 - data.difficulty)}
            </span>
          </span>
        </div>

        <p className="leading-relaxed text-foreground">{data.synopsis}</p>

        <Button
          size="lg"
          className="self-start"
          onClick={() => void navigate(`/cases/${data.slug}/play`)}
        >
          {ACTION_LABELS[data.status]}
        </Button>
      </div>
    </div>
  );
}
