# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project
adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased](https://github.com/avbentem/airtime-calculator/compare/v1.3.0...HEAD)

### Added

- Show maximum dwell time in the graph, especially for regions where it may not
  always be mandatory, hence the airtime may exceed the maximum dwell time.

### Fixed

- Update some broken links to the LoRa Alliance specifications (see [issue #4](https://github.com/avbentem/airtime-calculator/issues/4))

## [1.3.0](https://github.com/avbentem/airtime-calculator/compare/v1.2.1...v1.3.0) - 2020-09-05

### Added

- Show graph for payload size vs airtime for a region's available data rates.

### Fixed

- Lower minimum LoRaWAN overhead size to 12 bytes, as FPort is only given when an application
  payload is present.
- For CN470-510, add maximum dwell time and note about Listen Before Talk, as per [upcoming
  regulations](https://lora-alliance.org/wp-content/uploads/2020/11/rp_2-1.0.1.pdf#page=51).
- Improve documentation.

## [1.2.1](https://github.com/avbentem/airtime-calculator/compare/v1.2.0...v1.2.1) - 2020-08-08

### Fixed

- The shareable URL now includes some text to provide context.
- Handle copy button without user selection in Safari.

## [1.2.0](https://github.com/avbentem/airtime-calculator/compare/v1.1.0...v1.2.0) - 2020-08-03

### Added

- Copy (formatted) tooltip and result grid. For the grid, this uses a workaround
  for the Discourse forum software: newlines in table cells use `&lt;br>`, to
  support its automatic conversion from HTML to Markdown.
- Share URL.
- New icons.

### Fixed

- More details on dwell time limitations.
- Make tooltip choose best position on small screens.
- Layout fixes.

## [1.1.0](https://github.com/avbentem/airtime-calculator/compare/v1.0.0...v1.1.0) - 2020-07-22

### Added

- Validate against LoRaWAN-defined maximum payload size.
- LoRaWAN always uses coding rate 4/5: hide user input when using default.

### Fixed

- Document 1% duty cycle for the default channels of AS923.
- Document usage of AS923 in Australia.
- De-emphasize/shade all data rates that only apply to a single frequency.
- Layout fixes.

## 1.0.0 - 2020-07-21

Initial release.
