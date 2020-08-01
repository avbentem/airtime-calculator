import React, {PropsWithChildren, useState} from 'react';
import {Placement} from 'react-bootstrap/Overlay';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import {uniqueId} from 'lodash';
import './HelpTooltip.scss';

type HelpTooltipProps = {
  content?: string | React.ReactElement;
  showIcon?: boolean;
  placement?: Placement;
};

/**
 * Add an information icon for a tooltip to the given element, if the optional
 * help text is set.
 */
export default function HelpTooltip({
  content,
  showIcon = false,
  placement = 'auto-end',
  children,
}: PropsWithChildren<HelpTooltipProps>) {
  const [id] = useState(() => uniqueId('HelpTooltip-'));

  if (!content) {
    return <>{children}</>;
  }

  return (
    <OverlayTrigger placement={placement} overlay={<Tooltip id={id}>{content}</Tooltip>}>
      <div>
        {children}
        {showIcon && (
          <sup>
            <small className="text-muted">&#9432;</small>
          </sup>
        )}
      </div>
    </OverlayTrigger>
  );
}
