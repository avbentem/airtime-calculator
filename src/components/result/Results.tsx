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
    const oddEven = `Results-result-${idx % 2 ? 'odd' : 'even'}`;
    const highlight = `Results-result-highlight-${dr.highlight || 'none'}`;

    return (
      <div key={dr.name} className={`Results-result ${oddEven} ${highlight}`}>
        <Result dr={dr} airtime={airtime} />
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
