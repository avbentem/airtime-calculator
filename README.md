# Airtime calculator for LoRaWAN

A basic React UI for the formulas defined in Semtech's [LoRa Modem Designer's Guide
(AN1200.13)](./doc/LoraDesignGuide_STD.pdf), showing the airtime for data rates as used in the
[frequency plans](https://www.thethingsnetwork.org/docs/lorawan/frequency-plans.html) of The
Things Network (TTN), and showing the limitations that apply to the TTN public network.

See it in action on <https://avbentem.github.io/airtime-calculator>.

## Wishlist

Next versions may include:

- a help page explaining the basics
- support for MAC commands
- support for FSK
- an option to toggle if maximum dwell times are applicable (and maybe toggle
  the old/new maximum payload sizes for CN470-510)

## Data rates and frequency plans

The frequency plans from which the data rates are shown, are those of The Things Network. They are
based on the [frequency plans](https://www.thethingsnetwork.org/docs/lorawan/frequency-plans.html) and
the LoRaWAN [Regional Parameters v1.0.2rB](./doc/lorawan_regional_parameters_v1.0.2_final_1944_1.pdf),
and defined in [config.json](./public/config.json).

Some frequency plans have very different data rates for uplinks and downlinks; for those distinct
"regions" are defined in this application, like for US902 (uplink) and US902 DL (downlink). Others
share (most) of the data rates, like EU868.

## Maximum duty cycle and maximum dwell time limitations

- Both countries and the LoRaWAN specifications may define maximum duty cycle or maximum dwell time
  limitations: when some frequency plan can be used in several countries, different countries may
  still impose different legal limitations. [And](https://www.thethingsnetwork.org/forum/t/37924/2):

  > It's important to keep in mind that the duty cycle limitations described in the tables of the
  > specifications are LoRaWAN-imposed limitations, and not legal limitations. If you build
  > commercial devices and want them to be LoRaWAN certified, they need to comply with the
  > specification. Development devices don't have to be fully compliant with the specification. Any
  > device (whether LoRaWAN or not, gateway or node, commercial or development) needs to be
  > compliant with the legal limitations that apply in your country.
  >
  > [...]
  >
  > The LoRaWAN-imposed duty cycle applies to nodes only. Gateways are technically just LoRa devices,
  > not LoRaWAN, so the LoRaWAN specification doesn’t apply to them. The regulatory duty cycle
  > limitations typically apply to any transmitter.

- Like for AS923:

  - The LoRaWAN 1% maximum duty cycle [only applies](https://www.thethingsnetwork.org/forum/t/37924)
    to 923.20 and 923.40 MHz.

  - The 400 ms maximum dwell time [may not apply](https://www.thethingsnetwork.org/forum/t/36601/6)
    for Australia.

## Maximum payload size

The LoRaWAN specification(s) defines multiple options for the maximum payload size, like depending
on dwell time settings, and with or without support for a possible repeater encapsulation.

In the early specifications, these choices are quite confusing as often _smaller_ maximum values are
listed when _no_ maximum dwell times apply. However, the February 2020 LoRaWAN Regional Parameters
[RP002-1.0.1](./doc/rp_2-1.0.1.pdf) states that no MACPayload may be larger than 230 bytes,
regardless of dwell time limitations, and in that version the numbers have been adjusted as well.

This calculator uses the maximum payload sizes from RP002-1.0.1, which allow for a possible repeater
encapsulation and do not take maximum dwell times into account. If the device will never operate
under a repeater then the maximum size could be a bit larger. If dwell times have been defined then
those will generate warnings in the calculator regardless the maximum payload size, allowing users
to whom those dwell times do not apply to still see the correct (higher) maximum payload sizes.

## Time on air

- Changing the payload size does not always affect the number of symbols that make up the LoRa
  packet payload and header, or not for all data rates. For example, this is very visible for
  application payload sizes of 12 versus 13 bytes. This is the expected outcome, [caused by the LoRa
  radio modulation, interleaving and forward error correction](./doc/Reverse_Eng_Report.pdf). The
  graph below the grid visualizes this.

- Semtech's [LoRa Modem Designer's Guide (AN1200.13)](./doc/LoraDesignGuide_STD.pdf) defines some
  more parameters, especially preamble length (to detect the signal), coding rate (CR, for forward
  error correction), header mode (to include a LoRa header with details such as coding rate, payload
  length and CRC), and low data rate optimisation mode (to avoid issues with drift of the crystal
  reference oscillator due to either temperature change or motion). For LoRaWAN, these are not
  configurable, so are not exposed as a user input (except for CR, if a non-default value is set
  through the URL).

- For LoRaWAN, the preamble length is always 8, CR is always 4/5, the LoRa-level header is always
  included, and low data rate optimisation mode is active for SF11 and SF12 on 125 kHz.

## Copying results

The browser's copy event is mapped as follows:

- If any text is selected, copy that. This is handled by the browser.

- Otherwise, when a tooltip is active, copy its text. This yields both HTML and plain text formats.
  On a desktop browser you'll need the keyboard to copy a tooltip.

- Or else, copy the results. This only supports HTML.

For the line breaks in the results grid, this uses a format that is very specific to the automatic
conversion from HTML to Markdown in Discourse, like as used on the TTN Forum: Discourse replaces
`<br>` with `\n` but then [rejects `\n` in table cells][discourse-md]. As a workaround, `<br>` is
outputted as `&lt;br>`, which is handled as expected in Discourse's editor but needs some editing
when pasted elsewhere. Of course, using the static results is not quite useful anyhow.

For `text/plain` no URL is added, as Discourse [prefers the plain text content][discourse-plain] if
that is longer than the HTML.

[discourse-md]: https://github.com/discourse/discourse/blob/v2.5.0/app/assets/javascripts/discourse/app/lib/to-markdown.js#L342-L343
[discourse-plain]: https://github.com/discourse/discourse/blob/v2.5.0/app/assets/javascripts/discourse/app/components/d-editor.js#L904

## URL structure

This application was created with sharable URLs in mind, so almost every user input yields an updated URL:

- `/<network>/<region>[/<parameters>]`, e.g. `/ttn/eu868` and `/ttn/us902/6,14,cr48`.

- `<parameters>` is a comma-separated list, and defines:

  - the application payload size, taken from the first integer value
  - the LoRaWAN overhead size, taken from the second integer value
  - the coding rate, taken from one of `cr45`, `cr46`, `cr47`, `cr48`
  - experimental: one or more [MAC commands](./src/lora/MacCommands.ts), like `LinkAdrReq`

- Default values are not included in the `<parameters>` segment; this currently applies to:

  - payload size, 12 bytes: just a random choice, which however nicely shows how the maximum dwell
    time for US902 is quite limiting for DR0 SF10BW125 (the URL includes this default when using a
    non-default value for overhead size)
  - overhead size, 13 bytes: for a LoRaWAN uplink and downlink, the overhead is at least 13 bytes
    for MHDR (1), DevAddr (4), FCtrl (1), FCnt (2), FPort (1) and MIC (4); additionally FOpts may
    add one or more MAC commands
  - coding rate, `cr45`: as fixed for LoRaWAN

- When all parameters use their defaults, the `<parameters>` segment and its slash are excluded.

### URL structure and GitHub Pages

To serve this single-page application from GitHub Pages, some trickery with a JavaScript redirect
in [a custom 404 page](public/404.html) is needed. Unfortunately, some browsers (such as Brave) may
try to be helpful and show an option like _"Do you want to check if a saved version is available on
the Wayback Machine?"_ even when properly executing the expected redirect. It's unclear why the
final 200 OK [removes the banner for some sites](https://github.com/brave/brave-browser/issues/8401)
in Brave, but not for GitHub Pages.

## Development and deployment

This project was bootstrapped with [Create React App](https://create-react-app.dev/).

To use a limited bundle for Plotly (removing about 690 kB from the build), while using the typings
of the full bundle, a `paths` alias configuration is used in [`tsconfig.json`](./tsconfig.json).
However, during testing or building, Create React App would boldly remove that:

```text
> react-scripts build

The following changes are being made to your tsconfig.json file:
  - compilerOptions.paths must not be set (aliased imports are not supported)

...

TypeScript error in /src/components/result/Graph.tsx(1,20):
Could not find a declaration file for module 'plotly.js-basic-dist'
```

To mitigate that, some trickery with `extends` is used instead. This will still show the same
message for `npm test` and `npm run build`, and will even pretty-format the base `tsconfig.json`,
but in the end it won't touch the `extends` and use [`tsconfig-paths.json`](./tsconfig-paths.json).

### NPM commands

In the project directory, run:

- `npm install`

  Downloads all dependencies. You can safely ignore the warnings about missing peer dependencies.

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

  To build for a subfolder, set `"homepage": "/some/path/to/airtime-calculator"` in `package.json`.
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

Beware that Sourcetree might [silently skip](https://jira.atlassian.com/browse/SRCTREE-7184) the
pre-commit hook.

### Editor setup

#### WebStorm

- Enable Stylelint in _Languages and Frameworks | Style Sheets | Stylelint_, and optionally disable
  the standard inspections in _Editor | Inspections | CSS_. (For example, WebStorm does not like
  `@import-normalize;` in [`App.scss`](./src/App.scss), but using `// noinspection CssInvalidAtRule`
  already suppresses that specific inspection in this code.)

- The Prettier settings in [`.prettierrc.yaml`](.prettierrc.yaml) define `trailingComma: es5`. After
  being prompted _"Use code style based in Prettier for this project?"_ in WebStorm, this will yield
  _Coding Style | Punctuation | Trailing comma: Add when multiline_. Unfortunately this also applies
  to function parameters, which adds an excessive comma when hitting Option-Command-L for Reformat
  Code (but not for Option-Shift-Command-P for Reformat with Prettier). To avoid that, manually set
  WebStorm to use _Trailing comma: Keep_.

- The editor settings in [`.editorconfig`](.editorconfig) define `max_line_length`, which is used
  when hitting Option-Command-L for Reformat Code, but not when using Option-Shift-Command-P for
  Reformat with Prettier.
