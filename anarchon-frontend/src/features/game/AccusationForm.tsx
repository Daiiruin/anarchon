import { useState, type FormEvent } from 'react';
import { useSubmitAccusation } from './useSubmitAccusation';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';

interface AccusationFormProps {
  slug: string;
}

export function AccusationForm({ slug }: AccusationFormProps) {
  const [suspectId, setSuspectId] = useState('');
  const [motiveId, setMotiveId] = useState('');
  const [weaponId, setWeaponId] = useState('');
  const { mutate, data, isPending } = useSubmitAccusation(slug);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    mutate({ suspectId, motiveId, weaponId });
  }

  return (
    <section className="border-t border-border pt-6">
      <h2 className="mb-2 text-sm tracking-wide text-muted-foreground uppercase">
        Accusation
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="suspectId">Suspect</Label>
          <Input
            id="suspectId"
            value={suspectId}
            onChange={(e) => setSuspectId(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="motiveId">Mobile</Label>
          <Input
            id="motiveId"
            value={motiveId}
            onChange={(e) => setMotiveId(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="weaponId">Arme</Label>
          <Input
            id="weaponId"
            value={weaponId}
            onChange={(e) => setWeaponId(e.target.value)}
          />
        </div>
        <Button type="submit" disabled={isPending} className="self-start">
          Rendre mon verdict
        </Button>
      </form>
      {data && (
        <p className="mt-3 font-medium">
          {data.isCorrect
            ? 'Accusation correcte — affaire résolue.'
            : 'Accusation incorrecte.'}
        </p>
      )}
    </section>
  );
}
