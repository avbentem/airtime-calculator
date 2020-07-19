import React, {useEffect, useState} from 'react';
import Badge from 'react-bootstrap/Badge';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
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
        <Form.Row>
          <Form.Group as={Col} controlId="formHeaderSize">
            <HelpTooltip
              text="For a LoRaWAN 1.0.x uplink and downlink, the header is at least 13 bytes: Type (1), DevAddr (4), FCtrl (1), FCnt (2), FPort (1) and MIC (4)."
              placement="top"
              children={<Form.Label>Header size</Form.Label>}
            />
            <NumberInput {...headerSize} min={13} />
          </Form.Group>

          <Form.Group as={Col} controlId="formApplicationPayloadSize">
            <HelpTooltip
              text="The application payload size. Might be empty for a simple ACK or if the packet only includes MAC commands."
              placement="top"
              children={<Form.Label>Payload size</Form.Label>}
            />
            <NumberInput {...payloadSize} />
          </Form.Group>

          <Form.Group as={Col} controlId="formCodingRate">
            <HelpTooltip
              text="The coding rate (CR) used for forward error correction (FEC)."
              placement="top"
              children={<Form.Label>Coding rate</Form.Label>}
            />
            <Form.Control
              as="select"
              {...withFormControl(codingRate)}
              className="xxtext-primary xxborder-primary"
            >
              <option value="4/5">4/5</option>
              <option value="4/6">4/6</option>
              <option value="4/7">4/7</option>
              <option value="4/8">4/8</option>
            </Form.Control>
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
