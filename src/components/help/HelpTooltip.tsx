import React, {PropsWithChildren, useState} from 'react';
import {Placement} from 'react-bootstrap/Overlay';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import {uniqueId} from 'lodash';

type HelpTooltipProps = {
  text?: string;
  placement?: Placement;
};

/**
 * Add an information icon for a tooltip to the given element, if the optional
 * help text is set.
 */
export default function HelpTooltip({
  text,
  placement = 'bottom',
  children,
}: PropsWithChildren<HelpTooltipProps>) {
  const [id] = useState(() => uniqueId('HelpTooltip-'));

  if (!text) {
    return null;
  }

  return (
    <OverlayTrigger placement={placement} overlay={<Tooltip id={id}>{text}</Tooltip>}>
      <span>
        {children}
        <sup>
          <small className="text-muted">&#9432;</small>
        </sup>
      </span>
    </OverlayTrigger>
  );
}
