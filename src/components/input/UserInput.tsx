import React, {MouseEvent, useEffect, useState} from 'react';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import {FaCopy, FaLink} from 'react-icons/fa';
import {triggerCopy, triggerCopyUrl} from '../../hooks/clipboard/helpers';
import {CodingRate} from '../../lora/Airtime';
import {MacCommand, UplinkMacCommands102} from '../../lora/MacCommands';
import HelpTooltip from '../help/HelpTooltip';
import {withFormControl} from './helpers';
import NumberInput from './NumberInput';
import {decodeUserConfig, encodeUserConfig} from './UserConfig';

/**
 * The components determines its parameters given its URL fragment, and only
 * tells the parent component about the total packet size and the coding rate.
 */
type UserConfigProps = {
  userConfig?: string;
  setPacketSize: (size: number) => void;
  setCodingRate: (cr: CodingRate) => void;
  setUserConfig: (fragment: string) => void;
};

/**
 * Form using some controlled components to input the packet's details.
 *
 * TODO The state is maintained by the parent component.
 *
 * This reports the total LoRa packet size, the coding rate and its own
 * fragment in the URL to its parent.
 *
 * /ttn/eu868/1.0.x,4/5,15,LinkCheckReq,LinkAdrAns,DutyCycleAns,RXParamSetupAns,DevStatusAns,NewChannelAns,RXTimingSetupAns,TxParamSetupAns,DlChannelAns
 *
 *
 */
export default function UserInput(props: UserConfigProps) {
  function useParam<T>(defaultValue: T) {
    const [value, setValue] = useState(defaultValue);
    return {value, setValue};
  }

  const params = decodeUserConfig(props.userConfig);
  const payloadSize = useParam(params.payloadSize);
  const headerSize = useParam(params.headerSize);
  const codingRate = useParam(params.codingRate);
  const macCommands = useParam(params.macCommands);

  function increaseHeaderSize(size: number) {
    headerSize.setValue((v) => v + size);
    // Same result:
    // headerSize.setValue(headerSize.value + size);
  }

  function addMacCommand(cmd: MacCommand) {
    macCommands.setValue((macCommands.value || []).concat(cmd));
    increaseHeaderSize(cmd.size + 1);
  }

  useEffect(() => {
    props.setPacketSize(headerSize.value + payloadSize.value);
  }, [props, headerSize.value, payloadSize.value]);

  useEffect(() => {
    props.setCodingRate(codingRate.value);
  }, [props, codingRate.value]);

  /**
   * Tells the parent that the user's configuration has changed, to keep the
   * URL synchronized with the current inputs.
   *
   * Rather than this callback, we could use a Route in the parent component
   * and manage our own URL segment here. However, by design, when the user
   * configuration only uses default values then that segment would not exist.
   * And as the routing does not provide an API to only change a specific URL
   * segment, this component would need to know about the URL segments of its
   * parent to reliably change its own segment. (Like to detect excessive
   * slashes and avoid endless loops.) Instead, the URL segment is passed to
   * this component, and this component notifies the parent about changes. The
   * parent needs to know about this segment anyhow, like when the parent
   * component changes the region for which the user configuration should be
   * preserved.
   */
  useEffect(() => {
    props.setUserConfig(
      encodeUserConfig(payloadSize.value, headerSize.value, codingRate.value, macCommands.value)
    );
  }, [props, headerSize.value, payloadSize.value, codingRate.value, macCommands.value]);

  function copy(e: MouseEvent) {
    triggerCopy();
    // We need `currentTarget` rather than `target`, to support clicking the
    // icon in the button, in which case the button is not the (first) target
    (e.currentTarget as HTMLElement).blur();
  }

  function copyUrl(e: MouseEvent) {
    triggerCopyUrl();
    (e.currentTarget as HTMLElement).blur();
  }

  const macCommandButtons = UplinkMacCommands102.map((cmd, idx) => (
    <div key={idx}>
      <Badge
        onClick={() => addMacCommand(cmd)}
        pill
        variant={params.macCommands && params.macCommands.includes(cmd) ? 'primary' : 'secondary'}
      >
        {cmd.name} {cmd.size}
      </Badge>
      &nbsp;
    </div>
  ));

  return (
    <>
      <Form>
        <Form.Row className="justify-content-center">
          <Form.Group as={Col} xs={4} sm={3} lg={2} controlId="formOverheadSize">
            <HelpTooltip
              showIcon={true}
              content={
                <>
                  For a data uplink and downlink, the overhead is at least 12 bytes: MHDR (1),
                  DevAddr (4), FCtrl (1), FCnt (2) and MIC (4). When an application payload is
                  present, FPort (1) is given too. Also, FOpts may include up to 15 bytes for MAC
                  commands.
                </>
              }
            >
              <Form.Label>overhead size</Form.Label>
            </HelpTooltip>
            {/* Length field for FCtrl is 4 bits, hence max 15 bytes for MAC commands */}
            <NumberInput {...headerSize} min={12} max={28} />
          </Form.Group>

          <Form.Group as={Col} xs={4} sm={3} lg={2} controlId="formApplicationPayloadSize">
            <HelpTooltip
              showIcon={true}
              content={
                <>
                  The application payload size. Maximum 222 bytes, assuming 13 bytes of overhead.
                  May be empty for a simple ACK or if the packet only includes MAC commands. For the
                  time on air, only the <em>total</em> size matters, being the overhead size plus
                  the application payload size.
                </>
              }
            >
              <Form.Label>payload size</Form.Label>
            </HelpTooltip>
            {/* When operating in "repeater compatible" mode, no MACPayload may be larger than 230
             bytes, and full packet PHYPayload = MHDR[1] | MACPayload[..] | MIC[4]. So, assuming a
             13 bytes overhead, 230 - 8 = 222 bytes application payload. */}
            <NumberInput {...payloadSize} max={222} />
          </Form.Group>

          {/* Only expose the coding rate input when a non-default is used in the URL. */}
          {/* A future version may include some "advanced settings" option. */}
          {codingRate.value !== '4/5' && (
            <Form.Group as={Col} xs={4} sm={3} lg={2} controlId="formCodingRate">
              <HelpTooltip
                showIcon={true}
                content="The coding rate (CR) used for forward error correction (FEC). Always 4/5 for LoRaWAN."
              >
                <Form.Label>coding rate</Form.Label>
              </HelpTooltip>
              <Form.Control as="select" {...withFormControl(codingRate)}>
                <option value="4/5">4/5</option>
                <option value="4/6">4/6</option>
                <option value="4/7">4/7</option>
                <option value="4/8">4/8</option>
              </Form.Control>
            </Form.Group>
          )}

          <Form.Group as={Col} xs={3} sm={2} md={1} controlId="formShare">
            <HelpTooltip
              showIcon={true}
              content={
                <>
                  <p>
                    Use <FaCopy size="1em" /> or your keyboard to copy any selected text, if
                    applicable. Otherwise, when a tooltip is active, the tooltip's text is copied.
                    (This needs the keyboard on a desktop browser.) Or else, this copies the
                    results.
                  </p>
                  <p>
                    Use <FaLink size="1em" /> to copy a shareable URL.
                  </p>
                </>
              }
            >
              <Form.Label>share</Form.Label>
            </HelpTooltip>
            <div>
              <ButtonGroup>
                <Button variant="outline-secondary" aria-label="Copy" onClick={copy}>
                  <FaCopy size="1em" />
                </Button>
                <Button variant="outline-secondary" aria-label="Share" onClick={copyUrl}>
                  <FaLink size="1em" />
                </Button>
              </ButtonGroup>
            </div>
          </Form.Group>
        </Form.Row>

        {/* TODO Work in progress: somehow allow for adding/removing MAC commands; for now only when already in URL. */}
        {params.macCommands && (
          <>
            <Form.Row className="justify-content-md-center">
              <Col md="8">
                <Form.Label>MAC command</Form.Label>
                <ButtonToolbar aria-label="MAC commands">{macCommandButtons}</ButtonToolbar>
              </Col>
            </Form.Row>
            <br />
          </>
        )}
      </Form>
    </>
  );
}
