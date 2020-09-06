import React from 'react';
import {DataRate, Region} from '../../AppConfig';
import HelpTooltip from '../help/HelpTooltip';
import {fmt, fmtSeconds, withFullStops} from './helpers';

type ResultGridProps = {
  region: Region;
  dr: DataRate;
  size: number;
  airtime: number;
  maxPhyPayloadSize: number;
};

/**
 * A single result, showing the data rate (SF, bandwidth), time on air and
 * calculated limits.
 */
export function Result({region, dr, size, airtime, maxPhyPayloadSize}: ResultGridProps) {
  // Minimum delay in seconds between two packet starts, for maximum 1% duty cycle
  const dcDelay = airtime / 0.01 / 1000;

  // Maximum messages/day for 30 seconds TTN Fair Access Policy
  const fapMessages = 30000 / airtime;
  const fapDelay = (24 * 3600) / fapMessages;

  const maxDwellTime = region.maxDwellTime || 0;
  const dwellTimeExceeded = maxDwellTime > 0 && airtime > maxDwellTime;
  const sizeExceeded = dr.maxMacPayloadSize && size > maxPhyPayloadSize;

  // The single `&#x200b;` and double `&#x200b;&#x200b;` markers are used to add
  // whitespace and newlines when copying; see useClipboard.
  return (
    <>
      <HelpTooltip
        content={withFullStops(
          dr.notes,
          dr.maxMacPayloadSize &&
            (sizeExceeded
              ? `The total payload of ${size} bytes exceeds the maximum packet size of ${maxPhyPayloadSize} bytes for ${region.label} SF${dr.sf}BW${dr.bw}`
              : `For ${region.label} SF${dr.sf}BW${dr.bw} the maximum total packet size is ${maxPhyPayloadSize} bytes`)
        )}
      >
        <div
          className={`Result-datarate ${
            sizeExceeded ? 'Result-has-warning' : dr.notes ? 'Result-has-note' : ''
          }`}
          role="cell"
        >
          <div className="Result-dr">{dr.name}</div>
          <div>
            &#x200b;&#x200b;
            <span className="Result-sf">SF{dr.sf}</span>
            &#x200b;&#x200b;
            <span className="Result-unit Result-unit-bw">
              BW
              <br />
              {dr.bw}
            </span>
          </div>
          {sizeExceeded && (
            <div className={'Result-datarate-warning'}>&#x200b;&#x200b;max size exceeded</div>
          )}
        </div>
      </HelpTooltip>

      <HelpTooltip
        content={
          <>
            On SF{dr.sf}BW{dr.bw}, a total packet size of {size} bytes{' '}
            <a href={window.location.href}>needs {fmt(airtime, 2)} milliseconds time on air</a>.
            {dwellTimeExceeded && (
              <>
                {' '}
                This exceeds the maximum dwell time of {fmt(maxDwellTime, 0)} milliseconds for{' '}
                {region.label}.
              </>
            )}
          </>
        }
      >
        <div
          className={`Result-airtime ${dwellTimeExceeded ? 'Result-has-warning' : ''}`}
          role="cell"
        >
          <div>
            {fmt(airtime, 1)}&#x200b;<span className="Result-unit">ms</span>
          </div>
          {dwellTimeExceeded && (
            <div className={'Result-airtime-warning'}>&#x200b;&#x200b;max dwell time exceeded</div>
          )}
        </div>
      </HelpTooltip>

      <HelpTooltip
        content={
          <>
            If regional legal or LoRaWAN maximum duty cycles apply, then a 1% maximum duty cycle
            needs a <em>minimum</em> of {fmt(dcDelay, 2)} seconds between <em>any</em> subsequent
            packet starts in the same subband.
          </>
        }
      >
        <div className="Result-dutycycle" role="cell">
          <div>
            {fmt(dcDelay, 1)}
            &#x200b;
            <span className="Result-unit">sec</span>
            &#x200b;&#x200b;
          </div>
          <div>
            {fmt(Math.floor(3600 / dcDelay), 0)}
            &#x200b;
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
            {/*{ Links are only added for copy/pasting rich text. On touch devices links in tooltips
             would be clickable, but still are rendered invisibly, to not confuse the user clicking
             the link that points back to this very location. }*/}
            <p>
              The <a href="https://www.thethingsnetwork.org/forum/t/1300">TTN Fair Access Policy</a>{' '}
              allows for at most 30 seconds time on air per device, per 24 hours. So, an{' '}
              <a href={window.location.href}>
                airtime of {fmt(airtime, 1)} milliseconds for {size} bytes on SF{dr.sf}BW{dr.bw}
              </a>{' '}
              imposes a limit of {fmt(fapMessages, 1)} messages per day.
            </p>
            {/* Add newlines between paragraphs in case we're copy/pasting plain text. */}
            {'\n\n'}
            <p>
              When transmitting all day, <strong>on average</strong> this needs a minimum of{' '}
              {fmtSeconds(fapDelay)} between the starts of two uplinks, or a maximum of{' '}
              {fmt(fapMessages / 24, 1)}
              &nbsp;messages per hour.
            </p>
          </>
        }
      >
        <div className="Result-fairaccess" role="cell">
          <div className="Result-fairaccess-messages">
            {fmt((24 * 3600) / fapMessages, 1)}
            &#8203;
            <span className="Result-unit">
              sec&#8203;
              <br />
              (avg)
            </span>
            &#8203;&#8203;
          </div>
          <div>
            <span className="Result-fairaccess-messages-per-hour">{fmt(fapMessages / 24, 1)}</span>
            &#8203;
            <span className="Result-unit Result-unit-hour">
              avg
              <br />
              /hour
            </span>
            &#8203;&#8203;
          </div>
          <div className="Result-fairaccess-messages-per-day">
            {fmt(Math.floor(fapMessages), 0)}
            &#8203;
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
