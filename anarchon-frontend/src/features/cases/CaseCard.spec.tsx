import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { CaseCard } from './CaseCard';
import type { CaseStatus, CaseSummary } from './cases.schemas';

function buildCase(overrides: Partial<CaseSummary> = {}): CaseSummary {
  return {
    id: '1',
    slug: 'le-meurtre-de-l-hotel-beaumont',
    title: "Le meurtre de l'Hôtel Beaumont",
    eraLabel: 'Paris — 1962',
    synopsisExcerpt: 'Un homme est retrouvé mort…',
    difficulty: 3,
    themeKey: 'hotel-1960',
    status: 'NOT_STARTED',
    ...overrides,
  };
}

function renderCard(caseSummary: CaseSummary) {
  return render(<CaseCard caseSummary={caseSummary} />, {
    wrapper: MemoryRouter,
  });
}

describe('CaseCard', () => {
  it.each<[CaseStatus, string]>([
    ['NOT_STARTED', 'Jamais commencé'],
    ['IN_PROGRESS', 'En cours'],
    ['COMPLETED', 'Affaire résolue'],
  ])('shows the correct label for status %s', (status, label) => {
    renderCard(buildCase({ status }));
    expect(screen.getByText(label)).toBeInTheDocument();
  });

  it('renders the right number of filled and empty difficulty dots', () => {
    renderCard(buildCase({ difficulty: 3 }));
    const dots = screen.getByLabelText('Difficulté 3 sur 5');
    expect(dots).toHaveTextContent('●●●○○');
  });

  it('builds the cover image src from the case slug', () => {
    renderCard(buildCase({ slug: 'le-meurtre-de-l-hotel-beaumont' }));
    expect(screen.getByRole('img')).toHaveAttribute(
      'src',
      '/cases/le-meurtre-de-l-hotel-beaumont/cover.webp',
    );
  });

  it('links to the case detail page', () => {
    renderCard(buildCase({ slug: 'le-meurtre-de-l-hotel-beaumont' }));
    expect(screen.getByRole('link')).toHaveAttribute(
      'href',
      '/cases/le-meurtre-de-l-hotel-beaumont',
    );
  });
});
