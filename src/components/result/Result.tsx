import React from 'react';
import Card from 'react-bootstrap/Card';
import { DataRate } from '../../AppConfig';
import HelpTooltip from '../help/HelpTooltip';

type ResultCardProps = {
  dr: DataRate;
  airtime: number;
}

/**
 * A single result, showing the data rate (SF, bandwidth), time on air and calculated limits.
 */
export function Result({dr, airtime}: ResultCardProps) {
  return (
    <Card>
      <Card.Header>
        <Card.Title>
          {dr.name}
          <HelpTooltip text={dr.notes} placement="top" />
        </Card.Title>
        <Card.Subtitle as="h4">
          {/* SF{dr.sf} yields a newline between SF and the value */}
          <span className="sf">{'SF' + dr.sf}</span>
          <span className="bw">BW<br />{dr.bw}</span>
        </Card.Subtitle>
      </Card.Header>

      <Card.Title as="h4">
        {airtime}<span className="Result-unit">ms</span>
      </Card.Title>
      <Card.Footer>
        <div>
          {Math.floor(30000 / airtime)}<span className="Result-unit">/24h</span>
        </div>
        <div>
          {(30000 / 24 / airtime).toFixed(1)}<span className="Result-unit">avg<br />/hour</span>
        </div>
      </Card.Footer>
    </Card>
  );
}
