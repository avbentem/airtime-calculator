import React from 'react';
import { mount, shallow } from 'enzyme';
import App from './App';

describe('App component', () => {
  it('renders full app without crashing', () => {
    mount(<App />);
  });

  it('renders application header', () => {
    const wrapper = shallow(<App />);
    const title = <h1>LoRaWAN 1.0.x airtime calculator</h1>;
    expect(wrapper).toContainReact(title);
  });
});
