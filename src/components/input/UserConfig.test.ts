import {DownlinkMacCommands102, UplinkMacCommands102} from '../../lora/MacCommands';
import {decodeUserConfig, defaults, encodeUserConfig} from './UserConfig';

const linkCheckReq = UplinkMacCommands102.find((cmd) => cmd.name === 'LinkCheckReq');
const newChannelAns = UplinkMacCommands102.find((cmd) => cmd.name === 'NewChannelAns');
const linkAdrAns = UplinkMacCommands102.find((cmd) => cmd.name === 'LinkAdrAns');
const linkCheckAns = DownlinkMacCommands102.find((cmd) => cmd.name === 'LinkCheckAns');

describe('decodeUserConfig', () => {
  it('handles empty parameters', () => {
    const decoded = decodeUserConfig(undefined);
    expect(decoded.payloadSize).toBe(defaults.payloadSize);
    expect(decoded.headerSize).toBe(defaults.headerSize);
    expect(decoded.codingRate).toBe(defaults.codingRate);
    expect(decoded.macCommands).toBeUndefined();
  });

  it('handles single integer', () => {
    const decoded = decodeUserConfig('99');
    expect(decoded.payloadSize).toBe(99);
    expect(decoded.headerSize).toBe(defaults.headerSize);
    expect(decoded.codingRate).toBe(defaults.codingRate);
    expect(decoded.macCommands).toBeUndefined();
  });

  it('handles single integer plus coding rate', () => {
    const decoded = decodeUserConfig('99,cr47');
    expect(decoded.payloadSize).toBe(99);
    expect(decoded.headerSize).toBe(defaults.headerSize);
    expect(decoded.codingRate).toBe('4/7');
    expect(decoded.macCommands).toBeUndefined();
  });

  it('handles two integers plus coding rate', () => {
    const decoded = decodeUserConfig('99,100,cr47');
    expect(decoded.payloadSize).toBe(99);
    expect(decoded.headerSize).toBe(100);
    expect(decoded.codingRate).toBe('4/7');
    expect(decoded.macCommands).toBeUndefined();
  });

  it('handles two integers plus coding rate in any order', () => {
    const decoded = decodeUserConfig('99,cr47,100');
    expect(decoded.payloadSize).toBe(99);
    expect(decoded.headerSize).toBe(100);
    expect(decoded.codingRate).toBe('4/7');
    expect(decoded.macCommands).toBeUndefined();
  });

  it('ignores excessive integers', () => {
    const decoded = decodeUserConfig('99,100,3,cr47');
    expect(decoded.payloadSize).toBe(99);
    expect(decoded.headerSize).toBe(100);
    expect(decoded.codingRate).toBe('4/7');
    expect(decoded.macCommands).toBeUndefined();
  });

  it('handles MAC commands, preserves order, and ignores unknown commands', () => {
    const decoded = decodeUserConfig(
      '99,LinkCheckReq,cr47,LinkCheckAns,NewChannelAns,100,INVALID,LinkAdrAns'
    );
    expect(decoded.payloadSize).toBe(99);
    expect(decoded.headerSize).toBe(100);
    expect(decoded.codingRate).toBe('4/7');
    expect(decoded.macCommands).toHaveLength(4);
    expect(decoded.macCommands).toEqual([linkCheckReq, linkCheckAns, newChannelAns, linkAdrAns]);
  });

  it('is case insensitive', () => {
    const decoded = decodeUserConfig(
      '99,linkcheckreq,Cr47,lInKcHeCkAnS,NewChannelAns,100,INVALID,LINKADRANS'
    );
    expect(decoded.payloadSize).toBe(99);
    expect(decoded.headerSize).toBe(100);
    expect(decoded.codingRate).toBe('4/7');
    expect(decoded.macCommands).toHaveLength(4);
    expect(decoded.macCommands).toEqual([linkCheckReq, linkCheckAns, newChannelAns, linkAdrAns]);
  });
});

describe('encodeUserConfig', () => {
  it('returns empty value for defaults', () => {
    expect(encodeUserConfig(defaults.payloadSize, defaults.headerSize)).toBe('');
    expect(encodeUserConfig(defaults.payloadSize, defaults.headerSize, defaults.codingRate)).toBe(
      ''
    );
  });

  it('includes default payload size for non-default header size', () => {
    expect(encodeUserConfig(defaults.payloadSize, 100)).toBe(`${defaults.payloadSize},100`);
  });

  it('does not return default header size', () => {
    expect(encodeUserConfig(99, defaults.headerSize)).toBe('99');
    expect(encodeUserConfig(99, defaults.headerSize, '4/7')).toBe('99,cr47');
  });

  it('does not require coding rate', () => {
    expect(encodeUserConfig(99, 100)).toBe('99,100');
  });

  it('does not return default coding rate', () => {
    expect(encodeUserConfig(99, 100, defaults.codingRate)).toBe('99,100');
  });

  it('handles empty MAC commands', () => {
    expect(encodeUserConfig(99, defaults.headerSize, '4/7', [])).toBe('99,cr47');
  });

  it('handles MAC commands', () => {
    expect(
      encodeUserConfig(99, defaults.headerSize, '4/7', [
        linkCheckReq,
        linkCheckAns,
        newChannelAns,
        linkAdrAns,
      ] as any)
    ).toBe('99,cr47,LinkCheckReq,LinkCheckAns,NewChannelAns,LinkAdrAns');
  });
});
