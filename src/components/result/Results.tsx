import React from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { Region } from '../../AppConfig';
import Airtime, { CodingRate } from '../../lora/Airtime';
import { Result } from './Result';

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

  const results = region.dataRates.map((dr) => {
    const airtime = Airtime.calculate(packetSize, dr.sf, dr.bw, codingRate);
    return (
      <Col key={dr.name} xs="auto" sm="auto" md="auto" lg="auto" xl="auto">
        {/*<Col xs="12" sm="auto" md="3" lg="2" xl="auto">*/}
        <Result dr={dr} airtime={airtime} />
      </Col>
    );
  });

  return (
    <>
      {/* Though the nested Result is actually a Card, a CardDeck does not yield a proper responsive result. */}
      <Row className="justify-content-md-center">
        {results}
      </Row>
    </>
  );
}
