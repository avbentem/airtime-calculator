export type CodingRate = '4/5' | '4/6' | '4/7' | '4/8';

export default class Airtime {
  /**
   * Calculates the LoRa airtime in milliseconds.
   *
   * See https://lora-developers.semtech.com/library/product-documents/ for the
   * equations in AN1200.13 "LoRa Modem Designer’s Guide".
   *
   * Spreading factor and bandwidth together define the so called data rate.
   *
   * @param size full packet size. For LoRaWAN this includes the LoRaWAN MAC
   *   header (about 9 bytes when no MAC commands are included), the application
   *   payload, and the MIC (4 bytes).
   * @param sf spreading factor, 6..12 (6 is not used in LoRaWAN)
   * @param bw bandwidth in kHz, typically 125, 250 or 500
   * @param codingRate coding rate, '4/5', '4/6', '4/7' or '4/8'. For LoRaWAN
   *   this is always '4/5'.
   * @param lowDrOptimize low data rate optimization, 'auto', true or false.
   *   This is usually enabled for low data rates, to avoid issues with drift
   *   of the crystal reference oscillator due to either temperature change or
   *   motion. When enabled, specifically for 125 kHz bandwidth and SF11 and
   *   SF12, this adds a small overhead to increase robustness to reference
   *   frequency variations over the timescale of the packet.
   * @param explicitHeader if the LoRa header is present, true or false. This
   *   is the low-level header that defines, e.g., coding rate, payload length
   *   and the presence of a CRC checksum. In plain LoRa it can be left out if
   *   each transmission uses the very same parameters and the receiver is
   *   aware of those. For LoRaWAN, where at least the payload length is not
   *   fixed, the low-level LoRa header is always enabled.
   * @param preambleLength number of preamble symbols. For LoRaWAN this is 8.
   */
  static calculate(
    size: number,
    sf: number,
    bw: number,
    codingRate: CodingRate = '4/5',
    lowDrOptimize: 'auto' | true | false = 'auto',
    explicitHeader: boolean = true,
    preambleLength = 8
  ) {
    // All times in milliseconds
    const tSym = (Math.pow(2, sf) / (bw * 1000)) * 1000;
    const tPreamble = (preambleLength + 4.25) * tSym;

    // H = 0 when the header is enabled, H = 1 when no header is present.
    const h = explicitHeader ? 0 : 1;
    // DE = 1 when the low data rate optimization is enabled, DE = 0 for
    // disabled. When 'auto' then only for SF11 and SF12, on 125kHz. Allow for
    // programming errors that pass string values from, e.g., some form input.
    const de =
      (lowDrOptimize === 'auto' && +bw === 125 && +sf >= 11) || lowDrOptimize === true ? 1 : 0;
    // CR is the coding rate from 1 to 4
    const cr = +codingRate[2] - 4;
    const payloadSymbNb =
      8 +
      Math.max(
        Math.ceil((8 * size - 4 * sf + 28 + 16 - 20 * h) / (4 * (sf - 2 * de))) * (cr + 4),
        0
      );
    const tPayload = payloadSymbNb * tSym;

    return tPreamble + tPayload;
  }
}
