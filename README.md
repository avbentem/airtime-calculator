# LoRaWAN 1.0.x airtime calculator

A simple React UI for the formulas defined in Semtech's [LoRa Modem Designer's Guide
(AN1200.13)](./doc/LoraDesignGuide_STD.pdf), showing the airtime for data rates as used in the
frequency plans of The Things Network.

See it in action on <https://avbentem.github.io/lorawan-airtime-ui>.


## To do

This is work in progress. Version 1 should include:

- definition of maximum duty cycle(s) per region
- layout fixes (results; form inputs in Firefox; hide number spinner; pointer for help tooltips)
- missing frequency plans

Next versions might include:

- support for MAC commands
- a help page explaining the basics
- support for FSK


## Data rates and frequency plans

The frequency plans from which the data rates are shown, are those of The Things Network. They are
defined in [config.json](./public/config.json).

Currently only the data rates for EU868 and US902 are included.

Some frequency plans have very different data rates for uplinks and downlinks; for those distinct
"regions" are defined in this application, like for US915 (uplink) and US915 DL (downlink). Others
share (most) of the data rates, like EU868.


## URL structure

This application was created with sharable URLs in mind, so almost every user input yields an updated URL:

- `/<network>/<region>[/<parameters>]`, e.g. `/ttn/eu868` and `/ttn/us902/6,14,cr48`.

- `<parameters>` is a comma-separated list, and defines:

  - the payload size, taken from the first integer value
  - the header size, taken from the second integer value
  - the coding rate, taken from one of `cr45`, `cr46`, `cr47`, `cr48`
  - experimental: one or more [MAC commands](./src/lora/MacCommands.ts), like `LinkAdrReq`

- Default values are not included in the `<parameters>` segment; this currently applies to:
 
   - payload size, 6 bytes: just a random choice (the default is included for a non-default header size)
   - header size, 13 bytes: for a LoRaWAN 1.0.x uplink and downlink, the overhead is at least 13 bytes
     for the Message Type (1), DevAddr (4), FCtrl (1), FCnt (2), FPort (1) and MIC (4)
   - coding rate, 4/5: as used for all downlinks

- When all parameters use their defaults, the `<parameters>` segment and its slash are excluded.


## Development and deployment

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

In the project directory, run:

- `npm start`

  Runs the app in the development mode. Open [http://localhost:3000](http://localhost:3000) to view
  it in the browser. The page will reload if you make edits. You will also see any lint errors in
  the console.

- `npm test`

  Launches the test runner in the interactive watch mode. See the React documentation about
  [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for details.

- `npm test -- --coverage`

  Single test run with coverage.

- `npm run build`

  Builds the app for production to the `build` folder. It correctly bundles React in production
  mode and optimizes the build for the best performance.

  The build is minified and the filenames include the hashes. See the React documentation about
  [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.
  
  To ensure URLs like `/ttn/eu868/1,2` can be loaded without first loading the bare `/`, see for
  example the Apache [`.htaccess`](./public/.htaccess) file.
  
  To build for a subfolder, set `"homepage": "/some/path/to/lorawan-airtime"` in `package.json`.
  This will not affect the development server, which will always load from the root folder. For
  deployment in the root folder, set it to `"/"` or don't set it at all.
