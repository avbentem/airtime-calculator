import React from 'react';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import {DataRate} from '../../AppConfig';
import HelpTooltip from '../help/HelpTooltip';

type ResultGridProps = {
  dr: DataRate;
  airtime: number;
};

function fmt(n: number, digits: number) {
  return n.toLocaleString('en-US', {minimumFractionDigits: digits, maximumFractionDigits: digits});
}

/**
 * A single result, showing the data rate (SF, bandwidth), time on air and
 * calculated limits.
 */
export function Result({dr, airtime}: ResultGridProps) {
  // Minimum delay in seconds between two packet starts, for maximum 1% duty cycle
  const dcDelay = airtime / 0.01 / 1000;

  // Maximum messages/day for 30 seconds TTN Fair Access Policy
  const fapMessages = 30000 / airtime;
  const fapDelay = (24 * 3600) / fapMessages;

  return (
    <>
      <div className="Result-datarate">
        <span className="Result-dr">
          {dr.name}
          <HelpTooltip text={dr.notes} placement="top" />
        </span>
        <span>
          <span className="Result-sf">SF{dr.sf}</span>
          <span className="Result-unit Result-unit-bw">
            BW
            <br />
            {dr.bw}
          </span>
        </span>
      </div>
      <div className="Result-airtime">
        <OverlayTrigger
          placement={`top`}
          overlay={
            <Tooltip id="Result-dutycycle-help">{fmt(airtime, 3)} milliseconds time on air</Tooltip>
          }
        >
          <div>
            <span>
              {fmt(airtime, 1)}
              <span className="Result-unit">ms</span>
            </span>
          </div>
        </OverlayTrigger>
      </div>
      <div className="Result-dutycycle">
        <OverlayTrigger
          placement={`top`}
          overlay={
            <Tooltip id="Result-dutycycle-help">
              If regional legal or LoRaWAN maximum duty cycles apply, then a 1% maximum duty cycle
              needs a <em>minimum</em> of {fmt(dcDelay, 3)} seconds between <em>any</em> subsequent
              packet starts in the same subband.
            </Tooltip>
          }
        >
          <div>
            <div>
              {fmt(dcDelay, 1)}
              <span className="Result-unit">sec</span>
            </div>
            <div>
              {fmt(Math.floor(3600 / dcDelay), 0)}
              <span className="Result-unit">
                msg
                <br />
                /hour
              </span>
            </div>
          </div>
        </OverlayTrigger>
      </div>
      <div className="Result-fairaccess">
        <OverlayTrigger
          placement={`top`}
          overlay={
            <Tooltip id="Result-dutycycle-help">
              <p>
                The TTN Fair Access Policy allows for at most 30 seconds time on air per device, per
                24 hours. An airtime of {fmt(airtime, 3)}&nbsp;ms thus yields a maximum of{' '}
                {fmt(fapMessages, 1)} messages.
              </p>
              <p>
                When transmitting all day, this translates to, <em>on average</em>, a minimum of{' '}
                {fmt(fapDelay, 1)} seconds between the starts of two uplinks, or a maximum of{' '}
                {fmt(fapMessages / 24, 1)}&nbsp;messages per hour.
              </p>
            </Tooltip>
          }
        >
          <div>
            <div className="Result-fairaccess-messages">
              {fmt((24 * 3600) / fapMessages, 1)}
              <span className="Result-unit">
                sec
                <br />
                (avg)
              </span>
            </div>
            <div className="Result-fairaccess-messages-per-day">
              {fmt(Math.floor(fapMessages), 0)}
              <span className="Result-unit">
                msg
                <br />
                /24h
              </span>
            </div>
            <div className="Result-fairaccess-messages-per-hour">
              {fmt(fapMessages / 24, 1)}
              <span className="Result-unit">
                avg
                <br />
                /hour
              </span>
            </div>
          </div>
        </OverlayTrigger>
      </div>
    </>
  );
}
