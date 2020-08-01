import {render, screen} from '@testing-library/react';
import {createBrowserHistory as createHistory, createLocation} from 'history';
import React from 'react';
import {RouteComponentProps} from 'react-router';
import cfg from '../../../public/config.json';
import {AppConfig, Region} from '../../AppConfig';
import Calculator from './Calculator';

// Explicit set the type to satisfy the TS compiler, which otherwise throws:
// Types of property 'bw' are incompatible. Type 'number' is not assignable to
// type '250 | 125 | 500'.
const config: AppConfig = cfg as any;

describe('Calculator component', () => {
  const history = createHistory();
  const location = createLocation('/ttn/eu868');

  const router: RouteComponentProps = {
    history,
    location,
    match: {} as any,
  };

  it('renders region selector', () => {
    render(<Calculator {...router} config={config} />);

    const network = config.networks[0];
    network.regions.forEach((r: Region) => {
      const b = screen.getByRole('button', {name: r.label});
      expect(b).toBeInTheDocument();
      expect(b.classList.contains('active')).toBe(r.name === network.defaultRegion);
    });
  });

  it('renders UserInput child', () => {
    render(<Calculator {...router} config={config} />);
    expect(screen.getByRole('spinbutton', {name: 'overhead size'})).toBeInTheDocument();
    expect(screen.getByRole('spinbutton', {name: 'payload size'})).toBeInTheDocument();
  });

  it('renders region details', () => {
    render(<Calculator {...router} config={config} />);
    expect(
      screen.getByRole('heading', {name: 'EU863-870 uplink and downlink'})
    ).toBeInTheDocument();
    // Partial matches
    expect(
      screen.getByText(
        /^For EU863-870, the LoRaWAN Regional Parameters 1.0.2 Rev B as used by the TTN community network/
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /^EU863-870 is used in Albania, Andorra, Angola, Austria, Bahrain, Belgium, Bosnia and Herzegovina/
      )
    ).toBeInTheDocument();
  });

  it('renders Results child', () => {
    render(<Calculator {...router} config={config} />);
    expect(screen.getByText('DR0')).toBeInTheDocument();
    // This actually uses a non-breaking space
    expect(screen.getByText('1% max duty cycle')).toBeInTheDocument();
    expect(screen.getByText('fair access policy')).toBeInTheDocument();
  });
});
