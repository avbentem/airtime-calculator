import Airtime from './Airtime';

// As compared to
// https://docs.google.com/spreadsheets/d/1QvcKsGeTTPpr9icj4XkKXq4r2zTc2j0gsHLrnplzM3I
describe('Airtime', () => {
  it('gets correct airtime for SF7BW125 CR4/5, using default coding rate', () => {
    expect(Airtime.calculate(14, 7, 125)).toBeCloseTo(46.336, 2);
    // The test above should use the defaults as specified in the next test
    expect(Airtime.calculate(14, 7, 125, '4/5', false, true)).toBeCloseTo(46.336, 2);
    expect(Airtime.calculate(15, 7, 125)).toBeCloseTo(46.336, 2);
    expect(Airtime.calculate(16, 7, 125)).toBeCloseTo(51.456, 2);
    expect(Airtime.calculate(25, 7, 125)).toBeCloseTo(61.696, 2);
  });

  it('gets correct airtime for SF7BW250', () => {
    expect(Airtime.calculate(14, 7, 250)).toBeCloseTo(23.168, 2);
    expect(Airtime.calculate(14, 7, 250, '4/5', false, true)).toBeCloseTo(23.168, 2);
    expect(Airtime.calculate(15, 7, 250)).toBeCloseTo(23.168, 2);
    expect(Airtime.calculate(16, 7, 250)).toBeCloseTo(25.728, 2);
    expect(Airtime.calculate(25, 7, 250)).toBeCloseTo(30.848, 2);
  });

  it('gets correct airtime for SF7BW125 with CR4/8', () => {
    expect(Airtime.calculate(14, 7, 125, '4/8')).toBeCloseTo(61.696, 2);
    expect(Airtime.calculate(14, 7, 125, '4/8', false, true)).toBeCloseTo(61.696, 2);
    expect(Airtime.calculate(15, 7, 125, '4/8')).toBeCloseTo(61.696, 2);
    expect(Airtime.calculate(16, 7, 125, '4/8')).toBeCloseTo(69.888, 2);
    expect(Airtime.calculate(25, 7, 125, '4/8')).toBeCloseTo(86.272, 2);
  });

  it('gets correct airtime for SF7BW250 with CR4/8', () => {
    expect(Airtime.calculate(14, 7, 250, '4/8')).toBeCloseTo(30.848, 2);
    expect(Airtime.calculate(14, 7, 250, '4/8', false, true)).toBeCloseTo(30.848, 2);
    expect(Airtime.calculate(15, 7, 250, '4/8')).toBeCloseTo(30.848, 2);
    expect(Airtime.calculate(16, 7, 250, '4/8')).toBeCloseTo(34.944, 2);
    expect(Airtime.calculate(25, 7, 250, '4/8')).toBeCloseTo(43.136, 2);
  });

  it('gets correct airtime for SF8BW125', () => {
    expect(Airtime.calculate(14, 8, 125)).toBeCloseTo(82.432, 2);
    expect(Airtime.calculate(14, 8, 125, '4/5', false, true)).toBeCloseTo(82.432, 2);
    expect(Airtime.calculate(15, 8, 125)).toBeCloseTo(92.672, 2);
    expect(Airtime.calculate(16, 8, 125)).toBeCloseTo(92.672, 2);
    expect(Airtime.calculate(25, 8, 125)).toBeCloseTo(113.152, 2);
  });

  // SF11 and SF12 enable low data rate optimization
  it('gets correct airtime for SF11BW125', () => {
    expect(Airtime.calculate(14, 11, 125)).toBeCloseTo(659.456, 2);
    expect(Airtime.calculate(14, 11, 125, '4/5', true, true)).toBeCloseTo(659.456, 2);
    expect(Airtime.calculate(15, 11, 125)).toBeCloseTo(659.456, 2);
    expect(Airtime.calculate(16, 11, 125)).toBeCloseTo(659.456, 2);
    expect(Airtime.calculate(25, 11, 125)).toBeCloseTo(823.296, 2);
  });

  // When due to programming errors string values are passed from, e.g, some
  // form input, then either fail or return good results
  it('does not silently return wrong results for string values at runtime', () => {
    expect(Airtime.calculate('14' as any, '7' as any, '125' as any)).toBeCloseTo(46.336, 2);
    expect(Airtime.calculate('14' as any, '7' as any, '250' as any)).toBeCloseTo(23.168, 2);
    expect(Airtime.calculate('14' as any, '7' as any, '125' as any, '4/8')).toBeCloseTo(61.696, 2);
    expect(Airtime.calculate('14' as any, '7' as any, '250' as any, '4/8')).toBeCloseTo(30.848, 2);
    expect(Airtime.calculate('14' as any, '8' as any, '125' as any)).toBeCloseTo(82.432, 2);
    expect(Airtime.calculate('14' as any, '11' as any, '125' as any)).toBeCloseTo(659.456, 2);
    expect(
      Airtime.calculate('14' as any, '11' as any, '125' as any, '4/5', true, true)
    ).toBeCloseTo(659.456, 2);
  });
});
