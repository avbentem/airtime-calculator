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
      // This is actually something like the following, with some more whitespace
      // and newlines:
      //   <div class="card-title h5">DR5</div>
      //   <h4><span class="sf">SF7</span><span class="bw">BW<br>250</span></h4>
      // For that, all the following would fail:
      //   expect(screen.getByText('SF7BW250')).toBeInTheDocument();
      //   expect(screen.getByText('SF7BW 250')).toBeInTheDocument();
      //   expect(screen.getByText('SF7 BW 250')).toBeInTheDocument();
      // But `screen.getByRole('heading', {name: 'SF7 BW 250'})` works just fine.
      expect(screen.getByRole('heading', {name: `SF${dr.sf} BW ${dr.bw}`})).toBeInTheDocument();

      const airtime = Airtime.calculate(23, dr.sf, dr.bw, '4/5');
      // Something like: `25.73<span className="Result-unit">ms</span>` so find
      // some parent with the given concatenated text:
      expect(
        screen.getByText((content, element) => element.textContent === `${airtime}ms`)
      ).toBeInTheDocument();
    });

    expect(screen.getAllByText('avg/hour')).toHaveLength(region.dataRates.length);
  });
});
