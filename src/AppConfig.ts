/**
 * Application configuration, defining one or more networks, each having one or
 * more regions, each defining specific settings for their supported data rates.
 */

export type AppConfig = {
  networks: Network[];
};

export type Network = {
  name: string;
  title?: string;
  defaultRegion: string;
  regions: Region[];
};

export type Region = {
  name: string;
  label: string;
  title: string;
  /**
   * Optional description of the countries. Supports Markdown.
   */
  countries?: string;
  /**
   * Optional description of the limitations. Supports Markdown.
   */
  limitations?: string;
  maxDwellTime?: number;
  dataRates: DataRate[];
};

export type DataRate = {
  name: string;
  notes?: string;
  sf: number;
  bw: 125 | 250 | 500;
  /**
   * Maximum LoRaWAN-defined MAC payload size, allowing for repeater, not taking
   * any maximum dwell time into account.
   */
  maxMacPayloadSize: number;
  /**
   * Default highlight of the results; may be overruled if limits are exceeded.
   */
  highlight?: 'none' | 'low';
};
