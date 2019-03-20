import { createBrowserHistory as createHistory, createLocation } from 'history';
import { AppConfig, Network, Region } from '../../AppConfig';
import { parseUrl, setUrl } from './Router';

const eu868: Region = {
  name: 'eu868',
  label: 'EU868',
  dataRates: []
};

const ttn: Network = {
  name: 'ttn',
  regions: [eu868]
};

const config: AppConfig = {
  networks: [ttn]
};

const history = createHistory();
const location = createLocation('/');
const pushMock = jest.spyOn(history, 'replace');

describe('parseUrl', () => {

  it('handles empty path', () => {
    location.pathname = '';
    const parsed = parseUrl(history, location, config);
    expect(parsed.network).toBeUndefined();
    expect(parsed.region).toBeUndefined();
    expect(parsed.parameters).toBeUndefined();
  });

  it('handles empty path', () => {
    location.pathname = '/';
    const parsed = parseUrl(history, location, config);
    expect(parsed.network).toBeUndefined();
    expect(parsed.region).toBeUndefined();
    expect(parsed.parameters).toBeUndefined();
  });

  it('handles network only path', () => {
    location.pathname = '/ttn';
    const parsed = parseUrl(history, location, config);
    expect(parsed.network).toBe(ttn);
    expect(parsed.region).toBeUndefined();
    expect(parsed.parameters).toBeUndefined();
  });

  it('handles network with region path', () => {
    location.pathname = '/ttn/eu868';
    const parsed = parseUrl(history, location, config);
    expect(parsed.network).toBe(ttn);
    expect(parsed.region).toBe(eu868);
    expect(parsed.parameters).toBeUndefined();
  });

  it('rejects unknown network', () => {
    location.pathname = '/INVALID/eu868/params';
    const parsed = parseUrl(history, location, config);
    expect(parsed.network).toBeUndefined();
    expect(parsed.region).toBeUndefined();
    expect(parsed.parameters).toBe('params');
  });

  it('rejects unknown region', () => {
    location.pathname = '/ttn/INVALID/params';
    const parsed = parseUrl(history, location, config);
    expect(parsed.network).toBe(ttn);
    expect(parsed.region).toBeUndefined();
    expect(parsed.parameters).toBe('params');
  });
});

describe('setUrl', () => {

  it('handles empty parameters', () => {
    location.pathname = '';
    setUrl(history, location, config, ttn as any, eu868);
    expect(pushMock).toHaveBeenCalledWith('/ttn/eu868');
    pushMock.mockReset();
  });

  it('handles non-empty parameters', () => {
    location.pathname = '';
    setUrl(history, location, config, ttn as any, eu868, 'parameters');
    expect(pushMock).toHaveBeenCalledTimes(1);
    expect(pushMock).toHaveBeenCalledWith('/ttn/eu868/parameters');
    pushMock.mockReset();
  });

  it('does not replace URL when it has not changed', () => {
    location.pathname = '/ttn/eu868/parameters';
    setUrl(history, location, config, ttn as any, eu868, 'parameters');
    expect(pushMock).toHaveBeenCalledTimes(0);
    pushMock.mockReset();
  });

});
