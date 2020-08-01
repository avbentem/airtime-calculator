import axios from 'axios';
import React, {useEffect, useState} from 'react';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import GithubCorner from 'react-github-corner';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import './App.scss';
import {AppConfig} from './AppConfig';
import Calculator from './components/calculator/Calculator';
import Toast from './components/notification/Toast';
import useClipboard from './hooks/clipboard/useClipboard';

/**
 * Loads the JSON configuration file and renders the application.
 */
export default function App() {
  const configUrl = process.env.PUBLIC_URL + '/config.json';
  const [progress, setProgress] = useState<string | null>('Loading configuration...');
  const [config, setConfig] = useState({} as AppConfig);

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
        setProgress(
          `Failed to load configuration ${process.env.PUBLIC_URL} ${configUrl}: ${error}`
        );
      }
    };

    // Workaround to suppress the following React warning:
    //   Warning: useEffect function must return a cleanup function or nothing.
    //   Promises and useEffect(async () => ...) are not supported, but you can
    //   call an async function inside an effect.
    // This still makes the compiler warn about ignoring the returned Promise.
    fetchConfig();
    return () => {
      didCancel = true;
    };
  }, [configUrl]);

  const {notification: copyNotification} = useClipboard();

  return (
    <Router basename={process.env.PUBLIC_URL}>
      <Container fluid className="App">
        <Toast notification={copyNotification} />
        <Row>
          <Col>
            <h1>Airtime calculator for LoRaWAN</h1>
            {/*TODO check if IE does not show text null */}
            <p>{progress}</p>
          </Col>
        </Row>
        {config.networks && <Route render={(props) => <Calculator {...props} config={config} />} />}
        <GithubCorner href="https://github.com/avbentem/airtime-calculator" />
      </Container>
    </Router>
  );
}
