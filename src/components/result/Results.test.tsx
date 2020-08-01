import {render, screen} from '@testing-library/react';
import {shallow} from 'enzyme';
import React from 'react';
import config from '../../../public/config.json';
import {AppConfig, DataRate, Region} from '../../AppConfig';
import Airtime from '../../lora/Airtime';
import {textInMarkupMatcher} from '../../test/helpers';
import Results from './Results';

// Explicit set the type to satisfy the TS compiler, which otherwise throws:
// Types of property 'bw' are incompatible. Type 'number' is not assignable to type '250 | 125 | 500'.
const region = (config as AppConfig).networks[0].regions.find((r) => r.name === 'eu868') as Region;

describe('Results component', () => {
  // Enzyme
  it('renders without crashing', () => {
    shallow(<Results region={region} packetSize={23} codingRate="4/5" />);
  });

  // react-testing-library
  it('renders Result children', () => {
    render(<Results region={region} packetSize={23} codingRate="4/5" />);

    // From child <Result> components
    region.dataRates.forEach((dr: DataRate, idx: number) => {
      expect(screen.getByText(dr.name)).toBeInTheDocument();

      const drsfbw = screen.getByText(textInMarkupMatcher(`${dr.name}SF${dr.sf}BW${dr.bw}`));
      // Or:
      //   const drsfbw = screen.getByRole('cell', {
      //     name: textInMarkupMatcher(`${dr.name}SF${dr.sf}BW${dr.bw}`),
      //   });

      expect(drsfbw).toBeInTheDocument();

      // Only check the most basic styling, which is not otherwise indicated to the user
      const oddEven = `Results-result-${idx % 2 ? 'odd' : 'even'}`;
      const highlight = `Results-result-highlight-${dr.highlight || 'none'}`;
      expect(drsfbw.closest(`.${oddEven}`)).toBeInTheDocument();
      expect(drsfbw.closest(`.${highlight}`)).toBeInTheDocument();

      const airtime = Airtime.calculate(23, dr.sf, dr.bw, '4/5');
      const formatted = airtime.toLocaleString('en-US', {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      });

      expect(screen.getByText(textInMarkupMatcher(`${formatted}ms`))).toBeInTheDocument();
    });

    expect(screen.getAllByText('avg/hour')).toHaveLength(region.dataRates.length);
  });
});
