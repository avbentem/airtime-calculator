import {CodingRate} from '../../lora/Airtime';
import {DownlinkMacCommands102, MacCommand, UplinkMacCommands102} from '../../lora/MacCommands';

type UserConfig = {
  macCommands?: MacCommand[];
} & typeof defaults;

export const defaults = {
  payloadSize: 12,
  headerSize: 13,
  codingRate: '4/5' as CodingRate,
};

/**
 * Takes the first integer argument to be the application payload size, the
 * second as the LoRaWAN header size, a single string starting with "cr" as the
 * coding rate, and all other values as possible MAC commands.
 */
export function decodeUserConfig(params: string = ''): UserConfig {
  const result: UserConfig = {} as any;
  const values = params.split(',').map((v) => v.trim());
  for (let value of values) {
    if (value === '') {
      continue;
    }

    if (/^\d+$/.test(value)) {
      // The first integer denotes the payload size, the second the header size
      if (!result.payloadSize) {
        result.payloadSize = +value;
      } else if (!result.headerSize) {
        result.headerSize = +value;
      } else {
        console.warn(
          `Ignored numeric value ${value}; already parsed both payloadSize and headerSize`
        );
      }
      continue;
    }

    if (/^cr4[5678]$/i.test(value)) {
      if (!result.codingRate) {
        result.codingRate = value.substr(2).split('').join('/') as CodingRate;
      } else {
        console.warn(`Ignored string value ${value}; already parsed codingRate`);
      }
      continue;
    }

    // Case-insensitive search in both the uplink and downlink MAC commands
    const lowerCase = value.toLowerCase();
    const mac = UplinkMacCommands102.concat(DownlinkMacCommands102).find(
      (cmd) => cmd.name.toLowerCase() === lowerCase
    );
    if (mac) {
      result.macCommands = (result.macCommands || []).concat(mac);
    } else {
      console.warn(`Ignored string value ${value}; no matching MAC command found`);
    }
  }

  return {...defaults, ...result};
}

/**
 * Encodes the user inputs for use in an URL segment.
 */
export function encodeUserConfig(
  payloadSize: number,
  headerSize: number,
  codingRate?: CodingRate,
  macCommands?: MacCommand[]
) {
  const parts: (string | number)[] = [];
  if (payloadSize !== defaults.payloadSize || headerSize !== defaults.headerSize) {
    parts.push(payloadSize);
  }
  if (headerSize !== defaults.headerSize) {
    parts.push(headerSize);
  }
  if (codingRate && codingRate !== defaults.codingRate) {
    parts.push('cr' + codingRate.replace('/', ''));
  }
  if (macCommands) {
    parts.push(...macCommands.map((cmd) => cmd.name));
  }
  return parts.join(',');
}
