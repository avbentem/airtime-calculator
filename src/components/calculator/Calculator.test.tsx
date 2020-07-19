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
    // We need a partial match due to the help icon that's within the label text
    expect(screen.getByRole('spinbutton', {name: /^Header size/})).toBeInTheDocument();
    expect(screen.getByRole('spinbutton', {name: /^Payload size/})).toBeInTheDocument();
    expect(screen.getByRole('combobox', {name: /^Coding rate/})).toBeInTheDocument();
  });

  it('renders region details', () => {
    render(<Calculator {...router} config={config} />);
    // The network's title is suffixed with the region's label. Though that
    // introduces newlines in the HTML, `getByRole` and `getByText` handle that.
    expect(screen.getByRole('heading', {name: 'The Things Network EU868'})).toBeInTheDocument();
    // Partial match
    expect(screen.getByText(/^EU863-870 MHz uplink and downlink/)).toBeInTheDocument();
  });

  it('renders Results child', () => {
    render(<Calculator {...router} config={config} />);
    expect(screen.getByText('DR0')).toBeInTheDocument();
    // This actually uses a non-breaking space
    expect(screen.getByText('1% max duty cycle')).toBeInTheDocument();
    expect(screen.getByText('fair access policy')).toBeInTheDocument();
  });
});