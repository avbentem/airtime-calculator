import {createBrowserHistory as createHistory, createLocation} from 'history';
import {Fixtures} from '../../setupTests';
import {parseUrl, setUrl} from './Router';

const history = createHistory();
const location = createLocation('/');
const historyReplaceSpy = jest.spyOn(history, 'replace');

describe('parseUrl', () => {
  it('handles empty path', () => {
    location.pathname = '';
    const parsed = parseUrl(history, location, Fixtures.config);
    expect(parsed.network).toBeUndefined();
    expect(parsed.region).toBeUndefined();
    expect(parsed.parameters).toBeUndefined();
  });

  it('handles empty path', () => {
    location.pathname = '/';
    const parsed = parseUrl(history, location, Fixtures.config);
    expect(parsed.network).toBeUndefined();
    expect(parsed.region).toBeUndefined();
    expect(parsed.parameters).toBeUndefined();
  });

  it('handles network only path', () => {
    location.pathname = '/ttn';
    const parsed = parseUrl(history, location, Fixtures.config);
    expect(parsed.network).toBe(Fixtures.ttn);
    expect(parsed.region).toBeUndefined();
    expect(parsed.parameters).toBeUndefined();
  });

  it('handles network with region path', () => {
    location.pathname = '/ttn/eu868';
    const parsed = parseUrl(history, location, Fixtures.config);
    expect(parsed.network).toBe(Fixtures.ttn);
    expect(parsed.region).toBe(Fixtures.eu868);
    expect(parsed.parameters).toBeUndefined();
  });

  it('rejects unknown network', () => {
    location.pathname = '/INVALID/eu868/params';
    const parsed = parseUrl(history, location, Fixtures.config);
    expect(parsed.network).toBeUndefined();
    expect(parsed.region).toBeUndefined();
    expect(parsed.parameters).toBe('params');
  });

  it('rejects unknown region', () => {
    location.pathname = '/ttn/INVALID/params';
    const parsed = parseUrl(history, location, Fixtures.config);
    expect(parsed.network).toBe(Fixtures.ttn);
    expect(parsed.region).toBeUndefined();
    expect(parsed.parameters).toBe('params');
  });
});

describe('setUrl', () => {
  it('handles empty parameters', () => {
    location.pathname = '';
    setUrl(history, location, Fixtures.config, Fixtures.ttn as any, Fixtures.eu868);
    expect(historyReplaceSpy).toHaveBeenCalledWith('/ttn/eu868');
    historyReplaceSpy.mockReset();
  });

  it('handles non-empty parameters', () => {
    location.pathname = '';
    setUrl(history, location, Fixtures.config, Fixtures.ttn as any, Fixtures.eu868, 'parameters');
    expect(historyReplaceSpy).toHaveBeenCalledTimes(1);
    expect(historyReplaceSpy).toHaveBeenCalledWith('/ttn/eu868/parameters');
    historyReplaceSpy.mockReset();
  });

  it('does not replace URL when it has not changed', () => {
    location.pathname = '/ttn/eu868/parameters';
    setUrl(history, location, Fixtures.config, Fixtures.ttn as any, Fixtures.eu868, 'parameters');
    expect(historyReplaceSpy).toHaveBeenCalledTimes(0);
    historyReplaceSpy.mockReset();
  });
});
