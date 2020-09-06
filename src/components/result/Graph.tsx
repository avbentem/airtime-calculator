import {merge} from 'lodash';
import Plotly from 'plotly.js-basic-dist';
import React, {useEffect, useState} from 'react';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import {FaRulerHorizontal, FaRulerVertical} from 'react-icons/fa';
import {Figure, PlotParams} from 'react-plotly.js';
import createPlotlyComponent from 'react-plotly.js/factory';
import {Region} from '../../AppConfig';
import useWindowWidth from '../../hooks/resize/useWindowWidth';
import usePrevious from '../../hooks/state/usePrevious';
import Airtime, {CodingRate} from '../../lora/Airtime';
import HelpTooltip from '../help/HelpTooltip';

// Using `import Plot from 'react-plotly.js'` needs the full blown `plotly.js`
// as a peer dependency; here use the limited `plotly.js-basic-dist` instead
const Plot = createPlotlyComponent(Plotly);

type GraphProps = {
  region: Region;
  selectedPacketSize: number;
  codingRate: CodingRate;
};

/**
 * A graph showing time on air for all the current region's data rates (SF,
 * bandwidth) and their supported full LoRaWAN payload sizes.
 *
 * The graph resets the visible traces when the region or coding rate changes,
 * but preserves vertical scale, horizontal range and any panning. Changing the
 * window width will only reset panning, but keep the other choices.
 */
export default function Graph({region, selectedPacketSize, codingRate}: GraphProps) {
  const prevRegion = usePrevious(region);
  const prevCodingRate = usePrevious(codingRate);
  const windowWidth = useWindowWidth();

  const [xAxisFitFullRange, setXAxisFitFullRange] = useState(true);
  const [yAxisLogarithmic, setYAxisLogarithmic] = useState(false);
  const [revision, setRevision] = useState(0);
  const [data, setData] = useState<PlotParams['data']>([]);

  const [layout, setLayout] = useState<PlotParams['layout']>({
    autosize: true,
    margin: {l: 70, t: 0, r: 5},
    dragmode: 'pan',
    xaxis: {
      autorange: false,
      range: [0, 1],
      title: 'total packet size (overhead + application payload)',
      ticks: 'outside',
    },
    yaxis: {
      ticks: 'outside',
      autorange: true,
      fixedrange: true,
      rangemode: 'tozero',
      separatethousands: true,
    },
    legend: {
      orientation: 'h',
      xanchor: 'center',
      x: 0.5,
      y: -0.2,
    },
  });

  /**
   * Increment the plot's revision to force updating the graph even if the
   * identities of `data` and `layout` don't change. See
   * https://github.com/plotly/react-plotly.js/blob/master/README.md#refreshing-the-plot
   */
  const triggerRender = () => setRevision((curr) => ++curr);

  /**
   * Merge the given objects and force updating the graph.
   */
  const mergeAndTriggerRender = <T,>(target: T, source: T | Partial<T>): T => {
    merge(target, source);
    // We cannot delegate to `triggerRender` as then the linter can no longer
    // properly determine the dependencies, and would expect us to include this
    // very method in the useEffect's dependencies
    setRevision((curr) => ++curr);
    return target;
  };

  /**
   * Ensure any user interaction did not pan below zero, or fix that if it did.
   *
   * React Plotly behaves a bit odd. It needs one to provide state for `data`
   * (including user interactions that change visibility of traces) and `layout`
   * (including the updated range due to panning) whenever it needs to rerender.
   * So, this handler would also be a good place to store the plot's full state.
   * However, Plotly also mutates the input that it's given: before this handler
   * is invoked, Plotly has already changed our state for `data` and `layout`.
   * As such, we don't need to update the state again, not even when we need to
   * fix the horizontal range to ensure it's always positive.
   *
   * See https://github.com/plotly/react-plotly.js/issues/43 and
   * https://github.com/plotly/react-plotly.js/blob/master/README.md#state-management
   */
  const onUpdate = (figure: Readonly<Figure>) => {
    const range = figure.layout.xaxis?.range;
    if (range && range[0] < 0) {
      // For auto-range, Plotly adds some padding within the graph. Remove the
      // left padding. There will also be some padding on the right (about the
      // same size as the one on the left); keep that to show that the full
      // graph is visible. For manual panning below 0, add the left padding to
      // the right, for otherwise the range gets smaller for each fix.
      const autoRange = figure.layout.xaxis?.autorange;
      mergeAndTriggerRender(figure.layout, {
        xaxis: {
          range: [0, range[1] - (autoRange ? 0 : range[0])],
          autorange: false,
        },
      });
    }
  };

  /**
   * Toggle the y-axis between linear and logarithmic scale.
   */
  const toggleScale = () => {
    setYAxisLogarithmic((curr) => !curr);
  };

  /**
   * Toggle the range of the x-axis between using a fixed scale, and fitting the
   * full graph.
   */
  const toggleFitFullRange = () => {
    setXAxisFitFullRange((curr) => !curr);
  };

  /**
   * Convert the given number to a logarithmic scale, or vice versa, like to
   * properly position annotations on a logarithmic scale.
   *
   * For annotations, see https://github.com/plotly/plotly.js/issues/1258
   */
  const toLogarithmic = (toLogarithmic: boolean, y: number | string | undefined) => {
    return toLogarithmic ? Math.log10(+(y ?? 1)) : Math.pow(10, +(y ?? 0));
  };

  useEffect(() => {
    if (!codingRate) {
      return;
    }

    // This fully replaces the object that's currently in our state, so no need
    // to manually trigger a Plotly rendering
    setData((currentData) => {
      return region.dataRates.map(
        (dr, idx): Plotly.Data => {
          // PHYPayload = MHDR[1] | MACPayload[..] | MIC[4]
          const maxPhyPayloadSize = dr.maxMacPayloadSize + 5;
          const sizes = Array.from(Array(maxPhyPayloadSize + 1).keys());

          const values = sizes.map((size) => {
            const airtime = Airtime.calculate(size, dr.sf, dr.bw, codingRate);
            return {
              y: airtime,
              size: size === selectedPacketSize ? 8 : 4,
            };
          });

          const resetVisibleTraces = codingRate !== prevCodingRate || region !== prevRegion;
          const current = currentData[idx]?.visible;
          const configured = dr.highlight === 'low' ? 'legendonly' : true;
          const visible = resetVisibleTraces ? configured : current ?? configured;

          return {
            x: sizes,
            y: values.map((val) => val.y),
            visible: visible,
            name: `${dr.name} SF${dr.sf}BW${dr.bw}`,
            marker: {
              size: values.map((val) => val.size),
            },
            type: 'scatter',
            mode: 'lines+markers',
            line: {
              dash: 'dot',
              shape: 'hvh',
              width: 0.5,
            },
            connectgaps: true,
            // See https://plotly.com/javascript/reference/#scatter-hovertemplate
            hovertemplate: '%{y:,.1f} ms<extra>%{x} bytes on %{fullData.name}</extra>',
          };
        }
      );
    });

    if (region.maxDwellTime) {
      setLayout((current) => {
        const color = 'red';
        return mergeAndTriggerRender(current, {
          shapes: [
            {
              type: 'line',
              x0: 0,
              y0: region.maxDwellTime,
              x1: 1,
              y1: region.maxDwellTime,
              xref: 'paper',
              opacity: 0.2,
              line: {
                color: color,
                width: 2,
                dash: 'dashdot',
              },
            },
          ],
          // Shapes don't support hover text, so add an annotation
          annotations: [
            {
              text: 'max dwell time',
              x: 1,
              xref: 'paper',
              xanchor: 'right',
              y:
                current.yaxis?.type === 'log'
                  ? toLogarithmic(true, region.maxDwellTime)
                  : region.maxDwellTime,
              yanchor: 'bottom',
              showarrow: false,
              font: {
                color: color,
              },
              opacity: 0.4,
            },
          ],
        });
      });
    } else if (prevRegion?.maxDwellTime) {
      setLayout((current) => {
        delete current.shapes;
        delete current.annotations;
        triggerRender();
        return current;
      });
    }
  }, [region, prevRegion, codingRate, prevCodingRate, selectedPacketSize]);

  useEffect(() => {
    setLayout((current) => {
      return mergeAndTriggerRender(current, {
        yaxis: {
          type: yAxisLogarithmic ? 'log' : 'linear',
          title: yAxisLogarithmic ? 'airtime (ms, logarithmic)' : 'airtime (ms)',
        },
        annotations: current.annotations?.map((annotation) => ({
          y: toLogarithmic(yAxisLogarithmic, annotation.y),
        })),
      });
    });
  }, [yAxisLogarithmic]);

  useEffect(() => {
    setLayout((current) => {
      // 970 - 658 = 312
      const xaxisFixedScaleRange = [0, (windowWidth - 312) / 6];

      const xaxisRange = xAxisFitFullRange
        ? current.xaxis?.range ?? xaxisFixedScaleRange
        : xaxisFixedScaleRange;

      return mergeAndTriggerRender(current, {
        xaxis: {
          autorange: xAxisFitFullRange,
          fixedrange: xAxisFitFullRange,
          range: xaxisRange,
        },
      });
    });
  }, [windowWidth, xAxisFitFullRange]);

  if (!codingRate) {
    return null;
  }

  return (
    <>
      <Plot
        style={{width: '100%', height: '400px'}}
        // See comments above about Plotly mutating `data` and `layout`
        data={data}
        layout={layout}
        revision={revision}
        onUpdate={onUpdate}
        config={{
          // This also needs width: 100% for the <Plot> component
          responsive: true,
          displayModeBar: false,
          showEditInChartStudio: false,
          showTips: false,
        }}
      />
      <ButtonGroup>
        <HelpTooltip
          content={<>Switch between a linear or logarithmic scale for the vertical axis.</>}
        >
          <Button variant="outline-secondary" aria-label="Share" onClick={toggleScale}>
            <FaRulerVertical size="1em" />
            &nbsp;linear / logarithmic
          </Button>
        </HelpTooltip>
        &nbsp;
        <HelpTooltip
          content={
            <>
              Switch between a compressed horizontal range to fit all allowed payload sizes, or a
              scrollable range with a fixed-width scale per payload size.
            </>
          }
        >
          <Button variant="outline-secondary" aria-label="Copy" onClick={toggleFitFullRange}>
            <FaRulerHorizontal size="1em" />
            &nbsp;fit all / scrollable
          </Button>
        </HelpTooltip>
      </ButtonGroup>
    </>
  );
}
