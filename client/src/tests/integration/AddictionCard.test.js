import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AddictionCard from '../../components/AddictionCard';

const renderWithRouter = (ui) => render(<MemoryRouter>{ui}</MemoryRouter>);

describe('AddictionCard', () => {
  // Freeze time to a known timestamp so daysStopped is deterministic.
  // 2025-01-20T00:00:00.000Z = 1737331200000 ms
  const FROZEN_NOW = 1737331200000;

  beforeEach(() => {
    jest.spyOn(Date, 'now').mockReturnValue(FROZEN_NOW);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const makeAddiction = (overrides = {}) => ({
    _id: 'abc123',
    name: '🚬 Nicotine',
    stopDate: new Date(FROZEN_NOW - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
    moneySpentPerDay: 5,
    ...overrides,
  });

  it('renders the addiction name', () => {
    renderWithRouter(<AddictionCard addiction={makeAddiction()} />);
    expect(screen.getByText('🚬 Nicotine')).toBeInTheDocument();
  });

  it('shows the correct number of days stopped', () => {
    renderWithRouter(<AddictionCard addiction={makeAddiction()} />);
    expect(screen.getByText('10')).toBeInTheDocument();
  });

  it('shows the correct money saved', () => {
    // 10 days × $5/day = $50.00
    renderWithRouter(<AddictionCard addiction={makeAddiction()} />);
    expect(screen.getByText('$50.00')).toBeInTheDocument();
  });

  it('renders the "Days" and "Saved" labels', () => {
    renderWithRouter(<AddictionCard addiction={makeAddiction()} />);
    expect(screen.getByText('Days')).toBeInTheDocument();
    expect(screen.getByText('Saved')).toBeInTheDocument();
  });

  it('renders an encouragement message', () => {
    renderWithRouter(<AddictionCard addiction={makeAddiction()} />);
    expect(screen.getByText(/Keep up the great work/i)).toBeInTheDocument();
  });

  it('renders a link to the correct addiction detail URL', () => {
    renderWithRouter(<AddictionCard addiction={makeAddiction()} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/addiction/abc123');
  });

  it('handles zero money spent per day', () => {
    const addiction = makeAddiction({ moneySpentPerDay: 0 });
    renderWithRouter(<AddictionCard addiction={addiction} />);
    expect(screen.getByText('$0.00')).toBeInTheDocument();
  });

  it('handles a stop date of today (0 days stopped)', () => {
    const addiction = makeAddiction({ stopDate: new Date(FROZEN_NOW).toISOString() });
    renderWithRouter(<AddictionCard addiction={addiction} />);
    expect(screen.getByText('0')).toBeInTheDocument();
  });
});
