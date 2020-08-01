import React, {ReactElement, useEffect, useRef, useState} from 'react';
import {default as BsToast} from 'react-bootstrap/Toast';
import {AppNotification} from './AppNotification';
import './Toast.scss';

/**
 * The interval at which the notification toast should be updated, like to show
 * some feedback to the user. (Of course, when there is no need for re-rendering
 * until endTime is reached, then one should rewrite this component to simply
 * set the timeout to match the end time.)
 *
 * Note that most browsers throttle timeouts for background tabs to 1 second.
 * But even then it's okay to specify a smaller number as this component uses
 * timestamps internally.
 */
const INTERVAL_MS = 1000;

type ToastProps = {
  notification?: AppNotification;
};

/**
 * A basic, single (non-stacked) notification, that auto-hides based on the
 * length of the notification text.
 */
export default function Toast({notification}: ToastProps) {
  const [endTime, setEndTime] = useState<number>(0);
  const [lastTimeout, setLastTimeout] = useState<number>(0);
  const timeoutHandle = useRef<number | null>(0);

  // Handle new/changed notification
  useEffect(() => {
    if (notification) {
      const text = textContent(notification.title) + textContent(notification.content);
      const timeout = Math.max(3000, 70 * text.length);
      // Assuming the new endTime is never the same as the last, this also
      // triggers the next effect which sets the (first) timeout
      setEndTime(Date.now() + timeout);
    }
  }, [notification]);

  // Set a timer to update and eventually hide the notification
  useEffect(() => {
    if (timeoutHandle.current) {
      // A timeout was already scheduled but the notification (and hence the end
      // time) changed
      window.clearTimeout(timeoutHandle.current);
    }

    // Ensure a new timeout is even scheduled when the end time expired just
    // now: when a timeout has changed state for lastTimeout then this effect is
    // not invoked until AFTER a new render completed. This could imply that
    // during the render it would be decided that the notification should be
    // displayed, but, due to time having advanced a bit, no new timeout would
    // be scheduled right here. And as this effect does not change any state,
    // no additional render would happen either, so outdated results would be
    // added to the DOM and show until eventually a new notification were set.
    if (endTime - lastTimeout > 0) {
      timeoutHandle.current = window.setTimeout(() => {
        timeoutHandle.current = null;
        // Trigger component rendering and execution of this very effect
        setLastTimeout(Date.now());
      }, INTERVAL_MS);
    }
  }, [endTime, lastTimeout]);

  const close = () => {
    setEndTime(Date.now());
  };

  const timeLeft = (endTime - Date.now()) / 1000;

  if (timeLeft <= 0 || !notification) {
    return null;
  }

  return (
    <BsToast className="Toast" onClose={close} onClick={close}>
      <BsToast.Header>
        <strong className="mr-auto header">{notification.title}</strong>
        <small>{timeLeft.toFixed(0)}</small>
      </BsToast.Header>
      {notification.content ? <BsToast.Body>{notification.content}</BsToast.Body> : null}
    </BsToast>
  );
}

/**
 * Traverse any props.children to get their combined text content.
 *
 * This does not add whitespace for readability: `<p>Hello <em>world</em>!</p>`
 * yields `Hello world!` as expected, but `<p>Hello</p><p>world</p>` returns
 * `Helloworld`.
 *
 * NOTE: This may be very dependent on the internals of React.
 */
function textContent(elem: ReactElement | string | undefined): string {
  if (!elem) {
    return '';
  }

  if (typeof elem === 'string') {
    return elem;
  }

  // Debugging for basic content shows that props.children, if any, is either a
  // ReactElement, or a string, or an Array with any combination. Like for
  // `<p>Hello <em>world</em>!</p>`:
  //
  //   $$typeof: Symbol(react.element)
  //   type: "p"
  //   props:
  //     children:
  //       - "Hello "
  //       - $$typeof: Symbol(react.element)
  //         type: "em"
  //         props:
  //           children: "world"
  //       - "!"
  const children = elem.props && elem.props.children;

  if (children instanceof Array) {
    return children.map(textContent).join('');
  }

  return textContent(children);
}
