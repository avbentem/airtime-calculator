import {fmt, fmtSeconds, withFullStops} from './helpers';

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

describe('fmtSeconds', () => {
  it('returns trailing zero if needed', () => {
    expect(fmtSeconds(12)).toBe('12.0 seconds');
  });
  it('returns seconds for small values', () => {
    expect(fmtSeconds(12.344)).toBe('12.3 seconds');
  });
  it('returns seconds for small values', () => {
    expect(fmtSeconds(120)).toBe('120.0 seconds');
  });
  it('returns seconds for small values', () => {
    expect(fmtSeconds(120.0499)).toBe('120.0 seconds');
  });
  it('returns minutes for large values', () => {
    expect(fmtSeconds(120.05)).toBe('2.0 minutes');
  });
  it('returns minutes for large values', () => {
    expect(fmtSeconds(2.05 * 60)).toBe('2.1 minutes');
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
