import React, {useEffect, useState} from 'react';
import {AppNotification} from '../../components/notification/AppNotification';

/**
 * Tokens that may be put onto the browser's clipboard to trigger special
 * handling in this hook.
 */
export enum ClipboardActionToken {
  Default = 'CLIPBOARD_ACTION_DEFAULT',
  ShareUrl = 'CLIPBOARD_ACTION_URL',
}

/**
 * Bind browser's copy event to copy the user's selection, or the active tooltip
 * window, or the result grid, all as plain text and as HTML. Return a result
 * message for feedback to the user.
 *
 * When not using the keyboard to trigger this, a mouse-out event will likely
 * already have fired for any item that may have been showing a tooltip. On
 * touch devices, the animation to close the tooltip will still be running, so
 * the copy handler can still fetch the tooltip's contents.
 */
export default function useClipboard() {
  const [notification, setNotification] = useState<AppNotification>();

  useEffect(() => {
    const handler = createClipboardHandler(setNotification);
    window.addEventListener('copy', handler);

    return () => window.removeEventListener('copy', handler);
  }, []);

  return {notification};
}

function createClipboardHandler(setNotification: (notification: AppNotification) => void) {
  return (event: Event) => {
    if (window.getSelection && event instanceof ClipboardEvent && event.clipboardData) {
      if (shareUrl(event)) {
        setNotification({
          title: 'A shareable URL was copied',
          content: (
            <>
              The URL shares the current settings for region, overhead size and payload size. Some
              of those may be the default values, hence not explicitly visible in the URL.
            </>
          ),
        });
        return;
      }

      if (hasUserSelection()) {
        // Delegate to the browser and boldly assume that the system copy works
        // if (isUrl()) {
        setNotification({
          title: <>The selected text was copied</>,
          content: (
            <>
              {hasTooltip() ? (
                <>
                  <p>
                    <strong>Did you intend to copy the tooltip?</strong> Then ensure no text is
                    selected when copying.
                  </p>
                </>
              ) : (
                <p>
                  To copy a tooltip, ensure no text is selected. (And use the keyboard on a desktop
                  browser.)
                </p>
              )}
              <p>To copy the result grid, make sure no text is selected and no tooltip is shown.</p>
            </>
          ),
        });
        return;
      }

      if (copyTooltip(event)) {
        setNotification({
          title: 'The tooltip text was copied',
          content: 'To copy the result grid, make sure no tooltip is shown while copying.',
        });
        return;
      }

      if (copyResultGrid(event)) {
        setNotification({
          title: 'The result grid was copied',
          content: (
            <>
              <p>
                To copy a tooltip, make sure it's shown while copying. (And use the keyboard on a
                desktop browser.)
              </p>
            </>
          ),
        });
        return;
      }

      // Should not happen; delegate to the browser
      setNotification({
        title: 'Action failed',
        content: (
          <>
            <p>
              Somehow copying failed. Care to{' '}
              <a href="https://github.com/avbentem/airtime-calculator/issues">share more details</a>
              ?
            </p>
          </>
        ),
      });
      return;
    }

    setNotification({
      title: 'Unsupported browser',
      content:
        'Your browser does not support the enhanced copy function to copy the tooltip or result grid.',
    });
  };
}

/**
 * Determine if the user selected some text.
 *
 * This does not work on the content of `<textarea>` and `<input>` elements in
 * Firefox, Edge (Legacy) and Internet Explorer; see the June 2001 issue report
 * at https://bugzilla.mozilla.org/show_bug.cgi?id=85686 and see
 * https://developer.mozilla.org/en-US/docs/Web/API/Window/getSelection
 */
function hasUserSelection(): boolean {
  if (window.getSelection) {
    const selection = (window.getSelection() || '').toString();
    return selection !== '' && selection !== ClipboardActionToken.Default;
  }
  // Unsupported browser
  return false;
}

function shareUrl(event: ClipboardEvent): boolean {
  if (!window.getSelection || !event.clipboardData) {
    return false;
  }
  const selection = window.getSelection();
  if (selection && selection.toString() === ClipboardActionToken.ShareUrl) {
    event.clipboardData.setData(
      'text/html',
      `Learn about the limits of LoRaWAN, using the online <a href="${window.location.href}">airtime calculator</a>.`
    );
    event.clipboardData.setData(
      'text/plain',
      `Learn about the limits of LoRaWAN, using the online airtime calculator at ${window.location.href}`
    );
    event.preventDefault();
    return true;
  }
  return false;
}

function getTooltip() {
  return document.querySelector('[role="tooltip"] .tooltip-inner');
}

function hasTooltip(): boolean {
  return getTooltip() !== null;
}

function copyTooltip(event: ClipboardEvent): boolean {
  if (!event.clipboardData) {
    return false;
  }
  const tooltip = getTooltip();
  if (tooltip) {
    if (tooltip instanceof HTMLElement && tooltip.innerHTML) {
      event.clipboardData.setData('text/html', tooltip.innerHTML);
    }
    // Beware that when the plain text content is longer than the HTML content,
    // Discourse will somehow prefer the plain text over the HTML version:
    // https://github.com/discourse/discourse/blob/v2.5.0/app/assets/javascripts/discourse/app/components/d-editor.js#L904
    // So, don't boldly add the current URL to the plain text content.
    if (tooltip && tooltip.textContent) {
      event.clipboardData.setData('text/plain', tooltip.textContent);
    }
    event.preventDefault();
    return true;
  }
  return false;
}

function getResultGrid() {
  return document.querySelector('[role="table"]');
}

function getChildrenByRole(elem: Element, role: string) {
  return Array.from(elem.querySelectorAll(`[role="${role}"]`));
}

function copyResultGrid(event: ClipboardEvent): boolean {
  if (!event.clipboardData) {
    return false;
  }
  const grid = getResultGrid();
  if (grid) {
    const label = grid.getAttribute('data-label');
    const groups = getChildrenByRole(grid, 'rowgroup');
    const columnHeaders = getChildrenByRole(groups[0], 'columnheader');
    const rows = getChildrenByRole(groups[1], 'row');

    const thead = `<thead>\n<tr>${columnHeaders
      .map((header) => `<th>${header.textContent}</th>`)
      .join('')}</tr>\n</thead>`;

    const getCells = (row: Element) => getChildrenByRole(row, 'cell');

    const tr = (cells: Element[]) =>
      `<tr>${cells.map((cell) => `<td>${cell.textContent}</td>`).join('')}</tr>`;

    const tbody = `<tbody>\n${rows.map(getCells).map(tr).join('\n')}\n</tbody>`;

    // The grid data includes zero-width spaces for formatting while copying.
    // Using the plain text `&lt;br>` is an explicit hack for Discourse; see
    // README.md. It won't look nice in, e.g., Word.
    const table = `<table>\n${thead}\n${tbody}\n</table>`
      .replace(/\u200B\u200B/g, '&lt;br>')
      .replace(/\u200B/g, ' ');

    event.clipboardData.setData(
      'text/html',
      `<p>${label}</p>
${table}
<p>See <a href="${window.location.href}">the airtime calculator</a> for many more details and interactive results.</p>`
    );

    // In Discourse, this is also used when pasting into a code block
    event.clipboardData.setData(
      'text/plain',
      `Unfortunately, the table layout is not supported when pasting as plain text.

Please paste as formatted text, or see ${window.location.href} for many more details and formatted, interactive results.`
    );

    event.preventDefault();
    return true;
  }

  return false;
}
