import { shallow } from 'enzyme';
import React from 'react';
import { render } from 'react-testing-library';
import config from '../../../public/config.json';
import { AppConfig, DataRate } from '../../AppConfig';
import Airtime from '../../lora/Airtime';
import Results from './Results';

// Explicit set the type to satisfy the TS compiler, which otherwise throws:
// Types of property 'bw' are incompatible. Type 'number' is not assignable to type '250 | 125 | 500'.
const region = (config as AppConfig).networks[0].regions.find(r => r.name === 'eu868') as any;

describe('Results component', () => {

  // Enzyme
  it('renders without crashing', () => {
    shallow(<Results region={region} packetSize={23} codingRate="4/5" />);
  });

  // react-testing-library
  it('renders Result children', () => {
    const {getByText} = render(<Results region={region} packetSize={23} codingRate="4/5" />);

    // From child <Result> components
    region.dataRates.forEach((dr: DataRate) => {
      expect(getByText(`SF${dr.sf}`)).toBeInTheDocument();
      // This is actually something like the following, with some more whitespace and newlines:
      //   <span class="sf">SF7</span><span class="bw">BW<br>125</span>
      // For that, the following would fail:
      //   expect(getByText(`SF${dr.sf}BW${dr.bw}`)).toBeInTheDocument();
      // So, find some parent:
      expect(getByText((content, element) => element.textContent === `SF${dr.sf}BW${dr.bw}`)).toBeInTheDocument();

      const airtime = Airtime.calculate(23, dr.sf, dr.bw, '4/5');
      // Something like: `25.73<span className="Result-unit">ms</span>`
      expect(getByText((content, element) => element.textContent === `${airtime}ms`)).toBeInTheDocument();
    });

    expect(getByText('avg/hour')).toBeInTheDocument();
  });
});
