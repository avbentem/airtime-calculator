import React from 'react';
import {DataRate} from '../../AppConfig';
import HelpTooltip from '../help/HelpTooltip';

type ResultGridProps = {
  dr: DataRate;
  size: number;
  airtime: number;
  maxPhyPayloadSize: number;
  maxDwellTime?: number;
};

export function fmt(n: number, digits: number) {
  return n.toLocaleString('en-US', {minimumFractionDigits: digits, maximumFractionDigits: digits});
}

/**
 * Join non-empty fragments into a sentence, adding full stops when combining
 * more than one fragment.
 */
export function withFullStops(...lines: (string | false | 0 | undefined)[]) {
  return (
    lines.reduce((acc: string, line) => {
      if (!line) {
        return acc;
      }
      return (
        acc +
        (acc && acc.slice(-1) !== '.' ? '. ' : acc ? ' ' : '') +
        line +
        (acc && line.slice(-1) !== '.' ? '.' : '')
      );
    }, '') || undefined
  );
}

/**
 * A single result, showing the data rate (SF, bandwidth), time on air and
 * calculated limits.
 */
export function Result({dr, size, airtime, maxPhyPayloadSize, maxDwellTime = 0}: ResultGridProps) {
  // Minimum delay in seconds between two packet starts, for maximum 1% duty cycle
  const dcDelay = airtime / 0.01 / 1000;

  // Maximum messages/day for 30 seconds TTN Fair Access Policy
  const fapMessages = 30000 / airtime;
  const fapDelay = (24 * 3600) / fapMessages;

  const dwellTimeExceeded = maxDwellTime > 0 && airtime > maxDwellTime;
  const sizeExceeded = dr.maxMacPayloadSize && size > maxPhyPayloadSize;

  return (
    <>
      <HelpTooltip
        content={withFullStops(
          dr.notes,
          dr.maxMacPayloadSize &&
            (sizeExceeded
              ? `The full payload of ${size} bytes exceeds the maximum packet size of ${maxPhyPayloadSize} bytes`
              : `Maximum total packet size ${maxPhyPayloadSize} bytes`)
        )}
      >
        <div
          className={`Result-datarate ${
            sizeExceeded ? 'Result-has-warning' : dr.notes ? 'Result-has-note' : ''
          }`}
        >
          <div className="Result-dr">{dr.name}</div>
          <div>
            <span className="Result-sf">SF{dr.sf}</span>
            <span className="Result-unit Result-unit-bw">
              BW
              <br />
              {dr.bw}
            </span>
          </div>
          {sizeExceeded && <div className={'Result-datarate-warning'}>max size exceeded</div>}
        </div>
      </HelpTooltip>

      <HelpTooltip
        content={withFullStops(
          `${fmt(airtime, 3)} milliseconds time on air`,
          dwellTimeExceeded && `This exceeds the maximum dwell time of ${maxDwellTime} milliseconds`
        )}
      >
        <div className={`Result-airtime ${dwellTimeExceeded ? 'Result-has-warning' : ''}`}>
          <div>
            {fmt(airtime, 1)}
            <span className="Result-unit">ms</span>
          </div>
          {dwellTimeExceeded && (
            <div className={'Result-airtime-warning'}>max dwell time exceeded</div>
          )}
        </div>
      </HelpTooltip>

      <HelpTooltip
        content={
          <>
            If regional legal or LoRaWAN maximum duty cycles apply, then a 1% maximum duty cycle
            needs a <em>minimum</em> of {fmt(dcDelay, 3)} seconds between <em>any</em> subsequent
            packet starts in the same subband.
          </>
        }
      >
        <div className="Result-dutycycle">
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
      </HelpTooltip>

      <HelpTooltip
        content={
          <>
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
          </>
        }
      >
        <div className="Result-fairaccess">
          <div className="Result-fairaccess-messages">
            {fmt((24 * 3600) / fapMessages, 1)}
            <span className="Result-unit">
              sec
              <br />
              (avg)
            </span>
          </div>
          <div>
            <span className="Result-fairaccess-messages-per-hour">{fmt(fapMessages / 24, 1)}</span>
            <span className="Result-unit Result-unit-hour">
              avg
              <br />
              /hour
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
        </div>
      </HelpTooltip>
    </>
  );
}
