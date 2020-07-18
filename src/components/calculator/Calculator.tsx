import React, {useState} from 'react';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import ReactMarkdown from 'react-markdown';
import {RouteComponentProps} from 'react-router-dom';
import {AppConfig, Region} from '../../AppConfig';
import {CodingRate} from '../../lora/Airtime';
import UserInput from '../input/UserInput';
import Results from '../result/Results';
import HorizontalScroll from '../scroll/HorizontalScroll';
import {parseUrl, setUrl} from './Router';

type CalculatorProps = {
  config: AppConfig;
} & RouteComponentProps;

/**
 * The user inputs and the calculated results.
 *
 * Most state is also kept in the URL, as we want that to be copy-paste ready.
 */
export default function Calculator(props: CalculatorProps) {
  // The real defaults are set in the UserInput component, and posted back
  // using callbacks
  const [packetSize, setPacketSize] = useState<number>(null as any);
  const [codingRate, setCodingRate] = useState<CodingRate>(null as any);

  const changeUrl = setUrl.bind(null, props.history, props.location, props.config);
  const {network, region, parameters} = parseUrl(props.history, props.location, props.config);

  if (!network) {
    const n = props.config.networks[0];
    const r = n.regions.find((r) => r.name === n.defaultRegion) as Region;
    changeUrl(n, r);
    return null;
  }

  if (!region) {
    const r = network.regions.find((r) => r.name === network.defaultRegion) as Region;
    changeUrl(network, r);
    return null;
  }

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
    changeUrl(network, region, parameters);
  };

  const setRegion = (region: Region) => {
    console.log('region', region);
    changeUrl(network, region);
  };

  return (
    <>
      <Row>
        <Col>
          <HorizontalScroll>
            <ButtonGroup>
              {network.regions.map((r) => (
                <Button
                  variant="outline-primary"
                  size="sm"
                  active={r.name === region.name}
                  disabled={!r.dataRates}
                  key={r.name}
                  onClick={() => setRegion(r)}
                >
                  {r.label}
                </Button>
              ))}
            </ButtonGroup>
          </HorizontalScroll>
        </Col>
      </Row>

      <Row>
        <hr />
      </Row>

      <Row className="justify-content-md-center">
        <Col md="auto">
          <UserInput
            userConfig={parameters}
            setUserConfig={handleParametersChange}
            setPacketSize={handlePacketSizeChange}
            setCodingRate={handleCodingRateChange}
          />
        </Col>
      </Row>

      <Row className="justify-content-md-center">
        <Col md="8">
          <h2>
            {network.title} {region.label}
          </h2>
        </Col>
      </Row>

      <Row className="justify-content-sm-center">
        <Col>
          <hr />
          <Results region={region} packetSize={packetSize} codingRate={codingRate} />
          <hr />
        </Col>
      </Row>

      <Row className="justify-content-md-center">
        <Col md="8">{region.description && <ReactMarkdown source={region.description} />}</Col>
      </Row>
    </>
  );
}
