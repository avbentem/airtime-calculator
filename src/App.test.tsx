import {mount, shallow} from 'enzyme';
import React from 'react';
import App from './App';

describe('App component', () => {
  it('renders full app without crashing', () => {
    mount(<App />);
  });

  it('renders application header', () => {
    const wrapper = shallow(<App />);
    const title = <h1>Airtime calculator for LoRaWAN</h1>;
    expect(wrapper).toContainReact(title);
  });
});
