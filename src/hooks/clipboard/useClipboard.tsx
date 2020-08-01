import React, {useEffect, useState} from 'react';
import {AppNotification} from '../../components/notification/AppNotification';

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
    return () => {
      window.removeEventListener('copy', handler);
    };
  }, []);

  return {notification};
}

function createClipboardHandler(setNotification: (notification: AppNotification) => void) {
  return (event: Event) => {
    if (window.getSelection && event instanceof ClipboardEvent && event.clipboardData) {
      if (hasUserSelection()) {
        // Delegate to the browser and boldly assume that the system copy works
        if (isURL()) {
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
      }

      // Should not happen; delegate to the browser
      return;
    }

    setNotification({
      title: 'Unsupported browser',
      content:
        'Your browser does not support the enhanced copy function to copy the tooltip or result grid.',
    });
  };
}

function hasUserSelection() {
  if (window.getSelection) {
    const selection = window.getSelection();
    return selection !== null && selection.toString() !== '';
  }
  // Unsupported browser
  return false;
}

function isURL() {
  if (window.getSelection) {
    const selection = window.getSelection();
    return selection !== null && /^https?:\/\//.test(selection.toString());
  }
  // Unsupported browser
  return false;
}

function getTooltip() {
  return document.querySelector('[role="tooltip"] .tooltip-inner');
}

function hasTooltip() {
  return getTooltip() !== null;
}

function copyTooltip(event: ClipboardEvent) {
  if (!event.clipboardData) {
    return false;
  }
  const tooltip = getTooltip();
  if (tooltip) {
    if (tooltip instanceof HTMLElement && tooltip.innerHTML) {
      event.clipboardData.setData('text/html', tooltip.innerHTML);
    }
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

function copyResultGrid(event: ClipboardEvent) {
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
<p>See <a href="${document.location.href}">the airtime calculator</a> for interactive results.</p>`
    );

    event.clipboardData.setData(
      'text/plain',
      `Unfortunately, the table layout is not supported when pasting as plain text.

Please paste as formatted text, or see ${document.location.href} for formatted results.`
    );

    event.preventDefault();
    return true;
  }

  return false;
}
