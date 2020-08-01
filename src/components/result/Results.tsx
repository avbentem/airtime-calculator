import React from 'react';
import {Region} from '../../AppConfig';
import Airtime, {CodingRate} from '../../lora/Airtime';
import {Result} from './Result';

type ResultsProps = {
  region: Region;
  packetSize: number;
  codingRate: CodingRate;
};

/**
 * Shows the results of the airtime calculations.
 */
export default function Results({region, packetSize, codingRate}: ResultsProps) {
  if (!codingRate) {
    return null;
  }

  const results = region.dataRates.map((dr, idx) => {
    const airtime = Airtime.calculate(packetSize, dr.sf, dr.bw, codingRate);
    // PHYPayload = MHDR[1] | MACPayload[..] | MIC[4]
    const maxPhyPayloadSize = dr.maxMacPayloadSize + 5;
    const tooLong =
      (region.maxDwellTime && airtime > region.maxDwellTime) ||
      (dr.maxMacPayloadSize && packetSize > maxPhyPayloadSize);
    const oddEven = `Results-result-${idx % 2 ? 'odd' : 'even'}`;
    const highlight = `Results-result-highlight-${tooLong ? 'warning' : dr.highlight || 'none'}`;

    return (
      <div key={dr.name} className={`Results-result ${oddEven} ${highlight}`} role={'row'}>
        <Result
          size={packetSize}
          region={region}
          dr={dr}
          airtime={airtime}
          maxPhyPayloadSize={maxPhyPayloadSize}
        />
      </div>
    );
  });

  return (
    <>
      <div
        className={`Results-grid Results-grid-${results.length}`}
        role="table"
        data-label={`Time on air and limitations for a full LoRaWAN packet of ${packetSize} bytes in ${region.label}:`}
      >
        <div role="rowgroup">
          <div className={`Results-legend`} role="row">
            <div role="columnheader">data rate</div>
            <div role="columnheader">airtime</div>
            <div role="columnheader">1%&nbsp;max duty&nbsp;cycle</div>
            <div role="columnheader">fair access policy</div>
          </div>
        </div>
        <div role="rowgroup">{results}</div>
      </div>
    </>
  );
}
