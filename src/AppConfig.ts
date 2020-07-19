/**
 * Application configuration, defining one or more networks, each having one or more regions, each defining specific
 * settings for their supported data rates.
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
  /**
   * Optional description. Supports Markdown.
   */
  description?: string;
  notes?: string;
  dataRates: DataRate[];
};

export type DataRate = {
  name: string;
  notes?: string;
  sf: number;
  bw: 125 | 250 | 500;
  highlight?: 'none' | 'low';
};
