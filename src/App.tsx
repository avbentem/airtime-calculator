import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import GithubCorner from 'react-github-corner';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import './App.scss';
import { AppConfig } from './AppConfig';
import Calculator from './components/calculator/Calculator';

/**
 * Loads the JSON configuration file and renders the application.
 */
export default function App() {
  const configUrl = process.env.PUBLIC_URL + '/config.json';
  const [progress, setProgress] = useState<string | null>('Loading configuration...');
  const [config, setConfig] = useState({} as AppConfig);

  // Given the empty array for deps, this only runs once, when component mounts;
  // https://reactjs.org/docs/hooks-reference.html#conditionally-firing-an-effect
  useEffect(() => {
    let didCancel = false;
    const fetchConfig = async () => {
      try {
        // By default, axios expects JSON in UTF8, and converts that on the fly
        const result = (await axios.get<AppConfig>(configUrl)).data;
        if (!didCancel) {
          setProgress(null);
          setConfig(result);
        }
      } catch (error) {
        // TODO fine for 404, but this does not catch JSON parse errors?
        setProgress(`Failed to load configuration ${process.env.PUBLIC_URL} ${configUrl}: ${error}`);
      }
    };

    // Workaround to suppress the following React warning:
    //   Warning: useEffect function must return a cleanup function or nothing.
    //   Promises and useEffect(async () => ...) are not supported, but you can
    //   call an async function inside an effect.
    // This will still make the compiler warn about ignoring the returned Promise.
    fetchConfig();
    return () => {
      didCancel = true;
    };
  }, []);

  return (
    <Router basename={process.env.PUBLIC_URL}>
      <Container className="App">
        <Row>
          <Col>
            <h1>LoRaWAN 1.0.x airtime calculator</h1>
            {/*TODO check if IE does not show text null */}
            <p>{progress}</p>
          </Col>
        </Row>
        {config.networks && (
          <Route render={props => <Calculator {...props} config={config} />} />
        )}
        <GithubCorner href="https://github.com/avbentem/lorawan-airtime-ui" />
      </Container>
    </Router>
  );
}
