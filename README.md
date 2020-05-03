# LoRaWAN 1.0.x airtime calculator

A simple React UI for the formulas defined in Semtech's [LoRa Modem Designer's Guide
(AN1200.13)](./doc/LoraDesignGuide_STD.pdf), showing the airtime for data rates as used in the
[frequency plans](https://www.thethingsnetwork.org/docs/lorawan/frequency-plans.html) of The
Things Network (TTN), and showing the limitations that apply to the TTN public network.

See it in action on <https://avbentem.github.io/lorawan-airtime-ui>.

## To do

This is work in progress. Version 1 should include:

- definition of maximum duty cycle(s) and dwell time per region
- layout fixes (results; form inputs in Firefox; hide number spinner; pointer for help tooltips)

Next versions might include:

- support for MAC commands
- a help page explaining the basics
- support for FSK

## Data rates and frequency plans

The frequency plans from which the data rates are shown, are those of The Things Network. They are
based on the [frequency plans](https://www.thethingsnetwork.org/docs/lorawan/frequency-plans.html) and
the LoRaWAN [Regional Parameters v1.0.2rB](./doc/lorawan_regional_parameters_v1.0.2_final_1944_1.pdf),
and defined in [config.json](./public/config.json).

Some frequency plans have very different data rates for uplinks and downlinks; for those distinct
"regions" are defined in this application, like for US902 (uplink) and US902 DL (downlink). Others
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

This project was bootstrapped with [Create React App](https://create-react-app.dev/).

### NPM commands

In the project directory, run:

- `npm install`

  Downloads all dependencies. You can safely ignore the following warnings:

  - `react-scripts@3.4.1 requires a peer of typescript@^3.2.1 but none is installed.`
  - `sass-loader@8.0.2 requires a peer of node-sass@^4.0.0 but none is installed.`
  - `sass-loader@8.0.2 requires a peer of sass@^1.3.0 but none is installed.`
  - `sass-loader@8.0.2 requires a peer of fibers@>= 3.1.0 but none is installed.`
  - `tsutils@3.17.1 requires a peer of typescript@>=2.8.0 || >= 3.2.0-dev || >= 3.3.0-dev || ...`

- `npm start`

  Runs the app in the development mode. Open [http://localhost:3000](http://localhost:3000) to view
  it in the browser. The page will reload if you make edits. You will also see any lint errors in
  the console.

- `npm test`

  Launches the test runner in the interactive watch mode. See the Create React App documentation on
  [running tests](https://create-react-app.dev/docs/running-tests) for details.

- `npm test -- --coverage`

  Single test run with coverage.

- `npm run lint`, `npm run lint:es`, `npm run lint:style` or `npm run lint:pretty`

  Manually run all linters and Prettier, or run only those for code, styleheets, or the remaining
  files. Unlike the pre-commit hook (see below), this is not limited to staged files.

- `npm run build`

  Runs the linters, and (only) if all succeed builds the app with minimized bundles for production
  into the `build` folder.

  To ensure URLs like `/ttn/eu868/1,2` can be loaded without first loading the bare `/`, see for
  example the Apache [`.htaccess`](./public/.htaccess) file.

  To build for a subfolder, set `"homepage": "/some/path/to/lorawan-airtime"` in `package.json`.
  This will not affect the development server, which will always load from the root folder. For
  deployment in the root folder, set it to `"/"` or don't set it at all. See also the Create React
  App documentation about [deployment](https://create-react-app.dev/docs/deployment).

### Linting and Prettier

A pre-commit hook ensures that linting errors and formatting errors cannot be committed. To allow
Prettier rules to supersede any formatting rules that might be defined by a linter, it is configured
to run as a plugin for both ESLint and stylelint, and to explicitly run for the few file types not
handled by either of those.

Note that the pre-commit hook uses [lint-staged](https://github.com/okonet/lint-staged), which
temporarily hides unstaged changes to partially staged files. This may make your IDE show warnings
about files that were changed outside of the IDE.

### Editor setup

#### WebStorm

- Enable Stylelint in _Languages and Frameworks | Style Sheets | Stylelint_.

- The Prettier settings in [`.prettierrc.yaml`](.prettierrc.yaml) define `trailingComma: es5`. After
  being prompted _"Use code style based in Prettier for this project?"_ in WebStorm, this will yield
  _Coding Style | Punctuation | Trailing comma: Add when multiline_. Unfortunately this also applies
  to function parameters, which adds an excessive comma when hitting Option-Command-L for Reformat
  Code (but not for Option-Shift-Command-P for Reformat with Prettier). To avoid that, manually set
  WebStorm to use _Trailing comma: Keep_.

- The editor settings in [`.editorconfig`](.editorconfig) define `max_line_length`, which is used
  when hitting Option-Command-L for Reformat Code, but not when using Option-Shift-Command-P for
  Reformat with Prettier.
