import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CountryFlag } from '../src/catalog/infrastructure/ui/components/CountryFlag.js';

describe('CountryFlag', () => {
  it('renders England flag for GB-ENG iso code', async () => {
    render(<CountryFlag isoCode="GB-ENG" countryName="Inglaterra" />);
    const flag = await screen.findByRole('img', { name: 'Inglaterra' });
    expect(flag).toBeInTheDocument();
    expect(flag).toHaveAttribute('data-iso-code', 'GB-ENG');
  });

  it('renders Scotland flag for GB-SCT iso code', async () => {
    render(<CountryFlag isoCode="GB-SCT" countryName="Escocia" />);
    const flag = await screen.findByRole('img', { name: 'Escocia' });
    expect(flag).toBeInTheDocument();
    expect(flag).toHaveAttribute('data-iso-code', 'GB-SCT');
  });

  it('renders Mexico flag for MX iso code', async () => {
    render(<CountryFlag isoCode="MX" countryName="México" />);
    const flag = await screen.findByRole('img', { name: 'México' });
    expect(flag).toBeInTheDocument();
    expect(flag).toHaveAttribute('data-iso-code', 'MX');
  });

  it('renders placeholder when iso code is null', () => {
    const { container } = render(<CountryFlag isoCode={null} />);
    expect(container.querySelector('[role="img"]')).not.toBeInTheDocument();
  });
});
