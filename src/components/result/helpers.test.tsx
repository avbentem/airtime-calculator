import {fmt, withFullStops} from './helpers';

describe('fmt', () => {
  it('rounds down if needed', () => {
    expect(fmt(123.44, 1)).toBe('123.4');
  });
  it('rounds up if needed', () => {
    expect(fmt(123.45, 1)).toBe('123.5');
  });
  it('adds trailing zero if needed', () => {
    expect(fmt(123, 1)).toBe('123.0');
  });
  it('keeps trailing zero if needed', () => {
    expect(fmt(123.0, 1)).toBe('123.0');
  });
  it('adds thousands separator if needed', () => {
    expect(fmt(12345.67, 1)).toBe('12,345.7');
  });
});

describe('withFullStops', () => {
  it('does not add full stop for single sentence', () => {
    expect(withFullStops('line 1', false, undefined, 0)).toBe('line 1');
  });
  it('does not add full stop if already included', () => {
    expect(withFullStops('line 1.', undefined, 'line 2')).toBe('line 1. line 2.');
  });
});
