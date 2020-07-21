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
      <div key={dr.name} className={`Results-result ${oddEven} ${highlight}`}>
        <Result
          size={packetSize}
          dr={dr}
          airtime={airtime}
          maxPhyPayloadSize={maxPhyPayloadSize}
          maxDwellTime={region.maxDwellTime}
        />
      </div>
    );
  });

  return (
    <>
      <div className={`Results-grid Results-grid-${results.length}`}>
        <div className={`Results-legend`}>
          <div>data rate</div>
          <div>airtime</div>
          <div>1%&nbsp;max duty&nbsp;cycle</div>
          <div>fair access policy</div>
        </div>
        {results}
      </div>
    </>
  );
}
