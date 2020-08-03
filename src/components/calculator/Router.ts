import {History, Location} from 'history';
import {AppConfig, Network, Region} from '../../AppConfig';

/**
 * Custom URL handling:
 *
 * - Updated URL for almost each change in the user input
 * - URL does not include default values, and no trailing slash if all
 * parameters are defaults
 * - Changing the network or region only replaces part of the URL, without
 * wiping the trailing parameters
 */

export function parseUrl(
  history: History,
  location: Location,
  config: AppConfig
): {network: Network | undefined; region: Region | undefined; parameters: string | undefined} {
  // Due to using `<Router basename={process.env.PUBLIC_URL}>`, even when deployed in a subfolder,
  // location.pathname will only include a leading slash followed by our application's URL segments.
  // So, no need to strip process.env.PUBLIC_URL here.
  const [, networkName, regionName, parameters] = location.pathname.split('/');
  const network = config.networks.find((network) => network.name === networkName);
  const region = network ? network.regions.find((region) => region.name === regionName) : undefined;
  return {network, region, parameters};
}

export function setUrl(
  history: History,
  location: Location,
  config: AppConfig,
  network: Network,
  region: Region,
  parameters?: string
) {
  const current = parseUrl(history, location, config);
  // current.parameters might be undefined as well
  const params = parameters === undefined ? current.parameters : parameters;
  const url = '/' + network.name + '/' + region.name + (params ? '/' + params : '');
  if (location.pathname === url) {
    return;
  }
  // Due to using `<Router basename={process.env.PUBLIC_URL}>` this adds the process.env.PUBLIC_URL prefix
  history.replace(url);
}
