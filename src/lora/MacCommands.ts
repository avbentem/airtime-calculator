export type MacCommand = {
  name: string;
  /**
   * The command's payload size, excluding the byte for the MAC command itself.
   */
  size: number;
};

/**
 * The LoRaWAN 1.0.2 MAC commands and their payload sizes, if any (excluding
 * the one byte for the MAC command itself). Some commands can be present in
 * the very same LoRaWAN packet multiple times.
 */
export const UplinkMacCommands102: MacCommand[] = [
  {name: 'LinkCheckReq', size: 0},
  {name: 'LinkAdrAns', size: 1},
  {name: 'DutyCycleAns', size: 0},
  {name: 'RXParamSetupAns', size: 1},
  {name: 'DevStatusAns', size: 2},
  {name: 'NewChannelAns', size: 1},
  {name: 'DlChannelAns', size: 1},
  {name: 'RXTimingSetupAns', size: 0},
  {name: 'TxParamSetupAns', size: 0},
];

export const DownlinkMacCommands102: MacCommand[] = [
  {name: 'LinkCheckAns', size: 2},
  {name: 'LinkAdrReq', size: 4},
  {name: 'DutyCycleReq', size: 1},
  {name: 'RXParamSetupReq', size: 4},
  {name: 'DevStatusReq', size: 0},
  {name: 'NewChannelReq', size: 5},
  {name: 'DlChannelReq', size: 4},
  {name: 'RXTimingSetupReq', size: 1},
  {name: 'TxParamSetupReq', size: 1},
];
