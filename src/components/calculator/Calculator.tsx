import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import ReactMarkdown from 'react-markdown';
import { RouteComponentProps } from 'react-router-dom';
import { AppConfig, Region } from '../../AppConfig';
import { CodingRate } from '../../lora/Airtime';
import UserInput from '../input/UserInput';
import Results from '../result/Results';
import { parseUrl, setUrl } from './Router';

type CalculatorProps = {
  config: AppConfig;
} & RouteComponentProps;

/**
 * The user inputs and the calculated results.
 *
 * Most state is also kept in the URL, as we want that to be copy-paste ready.
 */
export default function Calculator(props: CalculatorProps) {

  const {network, region, parameters} = parseUrl(props.history, props.location, props.config);

  if (!network) {
    const n = props.config.networks[0];
    const r = n.regions.find(r => !!r.dataRates) as any;
    setUrl(props.history, props.location, props.config, n, r);
    return null;
  }

  if (!region) {
    const r = network.regions.find(r => !!r.dataRates) as any;
    setUrl(props.history, props.location, props.config, network, r);
    return null;
  }

  // The real defaults are set in the UserInput component, and posted back using callbacks
  const [packetSize, setPacketSize] = useState<number>(null as any);
  const [codingRate, setCodingRate] = useState<CodingRate>(null as any);

  const handlePacketSizeChange = (size: number) => {
    console.log('packet size', packetSize, size);
    setPacketSize(size);
  };

  const handleCodingRateChange = (cr: CodingRate) => {
    console.log('coding rate', codingRate, cr);
    setCodingRate(cr);
  };

  /**
   * Saves the updated user configuration in the current URL.
   */
  const handleParametersChange = (parameters: string) => {
    console.log('URL', parameters);
    setUrl(props.history, props.location, props.config, network, region, parameters);
  };

  const setRegion = (region: Region) => {
    console.log('region', region);
    setUrl(props.history, props.location, props.config, network, region);
  };

  return (
    <>
      <Row>
        <Col>
          <ButtonGroup>
            {network.regions.map((r) =>
              <Button variant="outline-primary" size="sm" active={r.name === region.name} disabled={!r.dataRates}
                      key={r.name} onClick={() => setRegion(r)}>{r.label}</Button>
            )}
          </ButtonGroup>
        </Col>
      </Row>

      <Row>
        <hr />
      </Row>

      <Row className="justify-content-md-center">
        <Col md="auto">
          <UserInput userConfig={parameters} setUserConfig={handleParametersChange}
                     setPacketSize={handlePacketSizeChange} setCodingRate={handleCodingRateChange}
          />
        </Col>
      </Row>

      <Row className="justify-content-md-center">
        <Col md="8">
          <h2>{network.title} {region.label}</h2>
          {region.description && (
            <ReactMarkdown source={region.description} />
          )}
        </Col>
      </Row>

      <Results region={region} packetSize={packetSize} codingRate={codingRate} />
    </>
  );

}
