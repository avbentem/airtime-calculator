import React from 'react';
import { Placement } from 'react-bootstrap/Overlay';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

type HelpTooltipProps = {
  text?: string;
  placement?: Placement;
}

/**
 * Shows an information icon for a tooltip, if the optional help text is set.
 */
export default function HelpTooltip({text, placement = "bottom"}: HelpTooltipProps) {
  if (!text) {
    return null;
  }

  return (
    <sup>
      <OverlayTrigger placement={placement} overlay={
        <Tooltip id="todo">
          {text}
        </Tooltip>
      }>
        <small className="text-muted">&#9432;</small>
      </OverlayTrigger>
    </sup>
  );
}
