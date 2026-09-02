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
    coverUrl: 'https://cdn.example.com/cover.webp',
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

  it('shows a placeholder instead of breaking when coverUrl is null', () => {
    renderCard(buildCase({ coverUrl: null }));
    expect(screen.getByText('Aucune image')).toBeInTheDocument();
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('renders the real cover image when coverUrl is set', () => {
    renderCard(buildCase({ coverUrl: 'https://cdn.example.com/cover.webp' }));
    expect(screen.getByRole('img')).toHaveAttribute(
      'src',
      'https://cdn.example.com/cover.webp',
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
