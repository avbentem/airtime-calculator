import {render, screen} from '@testing-library/react';
import {shallow} from 'enzyme';
import React from 'react';
import config from '../../../public/config.json';
import {AppConfig, DataRate} from '../../AppConfig';
import Airtime from '../../lora/Airtime';
import Results from './Results';

// Explicit set the type to satisfy the TS compiler, which otherwise throws:
// Types of property 'bw' are incompatible. Type 'number' is not assignable to type '250 | 125 | 500'.
const region = (config as AppConfig).networks[0].regions.find((r) => r.name === 'eu868') as any;

describe('Results component', () => {
  // Enzyme
  it('renders without crashing', () => {
    shallow(<Results region={region} packetSize={23} codingRate="4/5" />);
  });

  // react-testing-library
  it('renders Result children', () => {
    render(<Results region={region} packetSize={23} codingRate="4/5" />);

    // From child <Result> components
    region.dataRates.forEach((dr: DataRate) => {
      expect(screen.getByText(dr.name)).toBeInTheDocument();

      // This is actually something like the following:
      //
      //   <div class="Result-datarate">
      //     <span class="dr">DR6</span>
      //     <span>
      //       <span class="sf">
      //         SF
      //         7
      //       </span>
      //       <span class="Result-unit">
      //         BW
      //         <br>
      //         250
      //       </span>
      //     </span>
      //   </div>
      //
      // For that, all the following would fail:
      //
      //   expect(screen.getByText('SF7BW250')).toBeInTheDocument();
      //   expect(screen.getByText('SF7BW 250')).toBeInTheDocument();
      //   expect(screen.getByText('SF 7 BW 250')).toBeInTheDocument();
      //
      // So find some parent with the given concatenated text:

      expect(
        screen.getByText((content, element) => {
          return element.textContent === `SF${dr.sf}BW${dr.bw}`;
        })
      ).toBeInTheDocument();

      // Something like, with some more whitespace, but yielding multiple parents with just that text:
      //
      //   <div class="Result-airtime">
      //     <div>
      //       <span>
      //         1,482.8ms
      //         <span class="Result-unit">
      //           ms
      //         </span>
      //       </span>
      //     </div>
      //   </div>
      // So, search for the formatted number, and limit on <span>:

      const airtime = Airtime.calculate(23, dr.sf, dr.bw, '4/5');
      const formatted = airtime.toLocaleString('en-US', {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      });

      expect(
        screen.getByText((content, element) => {
          return element.tagName === 'SPAN' && element.textContent === `${formatted}ms`;
        })
      ).toBeInTheDocument();
    });

    expect(screen.getAllByText('avg/hour')).toHaveLength(region.dataRates.length);
  });
});
