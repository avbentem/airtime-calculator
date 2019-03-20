export type CodingRate = '4/5' | '4/6' | '4/7' | '4/8';

export default class Airtime {
  /**
   * Calculates the LoRa airtime in microseconds.
   *
   * See https://www.semtech.com/uploads/documents/LoraDesignGuide_STD.pdf#page=7
   *
   * Spreading factor and bandwidth together define the data rate.
   *
   * @param size full packet size
   * @param sf spreading factor, 6..12 (6 is not used in LoRaWAN)
   * @param bw bandwidth in kHz, typically 125, sometimes 250 or 500
   * @param codingRate coding rate, '4/5', '4/6', '4/7' or '4/8'
   * @param lowDrOptimize low data rate optimization, 'auto', true or false
   * @param explicitHeader true for LoRaWAN: this is the low-level header that
   *        indicates coding rate, payload length and payload CRC presence. In
   *        plain LoRa it can be left out if both sides have these parameters
   *        fixed.
   * @param preambleLength
   */
  static calculate(size: number, sf: number, bw = 125, codingRate: CodingRate = '4/5',
                   lowDrOptimize: 'auto' | true | false = 'auto', explicitHeader = true, preambleLength = 8) {

    // time in milliseconds
    const tSym = Math.pow(2, sf) / (bw * 1000) * 1000;
    const tPreamble = (preambleLength + 4.25) * tSym;

    // H = 0 when the header is enabled, H = 1 when no header is present.
    const h = explicitHeader ? 0 : 1;
    // DE = 1 when the low data rate optimization is enabled, DE = 0 for disabled.
    // When 'auto' then only for SF11 and SF12, on 125kHz
    const de = ((lowDrOptimize === 'auto' && +bw === 125 && +sf >= 11) || lowDrOptimize === true) ? 1 : 0;
    // CR is the coding rate from 1 to 4
    const cr = +codingRate[2] - 4;
    const payloadSymbNb = 8 + Math.max(Math.ceil(
      (8 * size - 4 * sf + 28 + 16 - 20 * h) / (4 * (sf - 2 * de))) * (cr + 4), 0);
    const tPayload = payloadSymbNb * tSym;

    return +(tPreamble + tPayload).toFixed(2);
  }
}
