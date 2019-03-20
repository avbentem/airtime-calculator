import { createBrowserHistory as createHistory, createLocation } from 'history';
import React from 'react';
import { RouteComponentProps } from 'react-router';
import { render } from 'react-testing-library';
import cfg from '../../../public/config.json';
import { AppConfig } from '../../AppConfig';
import Calculator from './Calculator';

// Explicit set the type to satisfy the TS compiler, which otherwise throws:
// Types of property 'bw' are incompatible. Type 'number' is not assignable to type '250 | 125 | 500'.
const config: AppConfig = cfg as any;

describe('Calculator component', () => {

  const history = createHistory();
  const location = createLocation('/ttn/eu868');

  const router: RouteComponentProps = {
    history,
    location,
    match: {} as any
  };

  // react-testing-library
  it('renders UserInput child', () => {
    const {getByLabelText, getByText} = render(<Calculator {...router} config={config} />);

    // We need some 'starts with' due to the help icon that's within the label text
    expect(getByLabelText((content, element) => /^Header size/.test(element.textContent || ''))).toBeInTheDocument();
    expect(getByLabelText((content, element) => /^Payload size/.test(element.textContent || ''))).toBeInTheDocument();
    expect(getByLabelText((content, element) => /^Coding rate/.test(element.textContent || ''))).toBeInTheDocument();

    expect(getByText('The Things Network EU868')).toBeInTheDocument();
    // This is actually something like the following, with some more whitespace and newlines:
    //   <span class="sf">SF12</span><span class="bw">BW<br>125</span>
    // For that, the following would fail:
    //   expect(getByText('SF7BW125')).toBeInTheDocument();
    // So, find some parent:
    expect(getByText((content, element) => element.textContent === 'SF12BW125')).toBeInTheDocument();

    expect(getByText('DR0')).toBeInTheDocument();
    expect(getByText('/24h')).toBeInTheDocument();
    expect(getByText('avg/hour')).toBeInTheDocument();
  });
});
