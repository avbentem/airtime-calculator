import { History, Location } from 'history';
import { AppConfig, Network, Region } from '../../AppConfig';

/**
 * Custom URL handling:
 *
 * - Updated URL for almost each change in the user input
 * - URL does not include default values, and no trailing slash if all parameters are defaults
 * - Changing the network or region only replaces part of the URL, without wiping the trailing parameters
 */

export function parseUrl(history: History, location: Location, config: AppConfig): { network: Network | undefined, region: Region | undefined, parameters: string | undefined } {
  // Even when using `<Router basename={process.env.PUBLIC_URL}>`, when deployed in a subfolder then
  // location.pathname will still be the full path, including whatever is in process.env.PUBLIC_URL,
  // so including that subfolder.
  const [, networkName, regionName, parameters] = location.pathname.substr(process.env.PUBLIC_URL.length).split('/');
  const network = config.networks.find(network => network.name === networkName);
  const region = network ? network.regions.find(region => region.name === regionName) : undefined;
  return {network, region, parameters};
}

export function setUrl(history: History, location: Location, config: AppConfig, network: Network, region: Region, parameters?: string) {
  const current = parseUrl(history, location, config);
  // current.parameters might be undefined as well
  const params = parameters === undefined ? current.parameters : parameters;
  const url = process.env.PUBLIC_URL + '/' + network.name + '/' + region.name + (params ? '/' + params : '');
  if (location.pathname === url) {
    console.log(`No URL change needed; ${url}`);
    return;
  }
  history.replace(url);
}
