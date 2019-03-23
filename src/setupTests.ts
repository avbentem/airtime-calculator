// For enzyme
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
// this adds jest-dom's custom assertions
import 'jest-dom/extend-expect';
import 'jest-enzyme';
// For react-testing-library
// react-testing-library renders your components to document.body,
// this will ensure they're removed after each test.
import 'react-testing-library/cleanup-after-each';
import { AppConfig, DataRate, Network, Region } from './AppConfig';

// For enzyme
configure({adapter: new Adapter()});

/**
 * Some shared fixtures.
 */
export class Fixtures {
  static eu868dr6: DataRate = {
    name: 'DR6',
    sf: 7,
    bw: 250
  };

  static eu868dr5: DataRate = {
    name: 'DR5',
    sf: 7,
    bw: 125
  };

  static eu868dr4: DataRate = {
    name: 'DR4',
    sf: 8,
    bw: 125
  };

  static eu868dr3: DataRate = {
    name: 'DR3',
    sf: 9,
    bw: 125
  };

  static eu868dr2: DataRate = {
    name: 'DR2',
    sf: 10,
    bw: 125
  };

  static eu868dr1: DataRate = {
    name: 'DR1',
    sf: 11,
    bw: 125
  };

  static eu868dr0: DataRate = {
    name: 'DR0',
    sf: 12,
    bw: 125
  };

  static eu868: Region = {
    name: 'eu868',
    label: 'EU868',
    dataRates: [Fixtures.eu868dr6, Fixtures.eu868dr5, Fixtures.eu868dr4, Fixtures.eu868dr3,
      Fixtures.eu868dr2, Fixtures.eu868dr1, Fixtures.eu868dr0]
  };

  static ttn: Network = {
    name: 'ttn',
    defaultRegion: Fixtures.eu868.name,
    regions: [Fixtures.eu868]
  };

  static config: AppConfig = {
    networks: [Fixtures.ttn]
  };
}
