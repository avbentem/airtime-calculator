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
import Graph from '../result/Graph';
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
    setPacketSize(size);
  };

  const handleCodingRateChange = (cr: CodingRate) => {
    setCodingRate(cr);
  };

  /**
   * Saves the updated user configuration in the current URL.
   */
  const handleParametersChange = (parameters: string) => {
    changeUrl(network, region, parameters);
  };

  const setRegion = (region: Region) => {
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

      <Row className="justify-content-sm-center">
        <Col>
          <h3>{region.title}</h3>
        </Col>
      </Row>

      <Row className="justify-content-center">
        <Col>
          <UserInput
            userConfig={parameters}
            setUserConfig={handleParametersChange}
            setPacketSize={handlePacketSizeChange}
            setCodingRate={handleCodingRateChange}
          />
        </Col>
      </Row>

      <Row className="justify-content-center">
        <Col>
          <Results region={region} packetSize={packetSize} codingRate={codingRate} />
          <hr />
        </Col>
      </Row>

      <Row className="justify-content-md-center">
        <Col md="8">{region.limitations && <ReactMarkdown source={region.limitations} />}</Col>
      </Row>

      <Row className="justify-content-md-center">
        <Col md="8">
          <p>
            Increasing the spreading factor SF by one step almost doubles the time on air (for the
            same bandwidth BW). This also means that, say, a single transmission on SF10 takes more
            time than 6&nbsp;transmissions on SF7, or may need about the same airtime as
            3&nbsp;transmissions on SF7, SF8 and SF9 combined. This is why using{' '}
            <a href="https://lora-developers.semtech.com/library/tech-papers-and-guides/understanding-adr">
              ADR
            </a>{' '}
            or{' '}
            <a href="https://lora-developers.semtech.com/library/tech-papers-and-guides/blind-adr">
              Blind ADR
            </a>{' '}
            is important.
          </p>
          <p>
            The LoRa radio modulation, interleaving and forward error correction{' '}
            <a href="https://www.epfl.ch/labs/tcl/wp-content/uploads/2020/02/Reverse_Eng_Report.pdf">
              yield fixed-length blocks
            </a>{' '}
            for the transmissions, so a small change in the payload size does not always imply a
            change in the time on air. The start of new blocks is not the same for each data rate,
            and the block size may also alternate within a single data rate. The following graph
            shows the time on air for the <em>total</em> payload sizes as allowed for each data rate
            for {region.label}, highlighting the currently selected total packet size of{' '}
            {packetSize}&nbsp;bytes.
          </p>
        </Col>
      </Row>

      <Row className="Graph justify-content-center">
        <Col>
          <Graph region={region} selectedPacketSize={packetSize} codingRate={codingRate} />
        </Col>
      </Row>

      <Row className="justify-content-md-center">
        <Col md="8">{region.countries && <ReactMarkdown source={region.countries} />}</Col>
      </Row>
    </>
  );
}
