import {ClipboardActionToken} from './useClipboard';
/**
 * Some helpers to trigger the browser's built-in clipboard events, which will
 * be captured by the useClipboard hook to figure out the expected action and
 * provide some user feedback.
 *
 * When there is no need for the user feedback or the centralized logic to
 * determine what to copy, then see https://whatwebcando.today/clipboard.html
 */

/**
 * Trigger the built-in copy event without providing any specific content.
 */
export function triggerCopy() {
  // For most browsers `document.execCommand('copy')` suffices, regardless if
  // the user selected some text. But Safari refuses that if the user has not
  // selected anything. So, if it fails, boldly assume the user did not select
  // anything and pass a token that the useClipboard hook will handle.
  if (!document.execCommand('copy')) {
    if (!copyText(ClipboardActionToken.Default)) {
      alert('Sorry, it seems your browser does not support this.');
    }
  }
}

/**
 * Trigger the built-in copy event to copy a shareable URL.
 */
export function triggerCopyUrl() {
  // We could pass window.location.href directly, but using the token allows
  // subsequent handling in the useClipboard hook to use the browser's extended
  // ClipboardEvent#clipboardData to provide both text and HTML content.
  if (!copyText(ClipboardActionToken.ShareUrl)) {
    alert('Sorry, your browser does not support this. Please copy the URL from the location bar.');
  }
}

/**
 * Put any plain text we like on the clipboard, while also making the browser
 * provide a full blown ClipboardEvent for further handling.
 */
function copyText(text: string): boolean {
  // Most examples would simply use an `<input>` element along with `.select()`.
  // But as the useClipboard hook relies on `window.getSelection()`, which
  // does not work on the content of `<textarea>` and `<input>` elements in
  // Firefox, Edge (Legacy) and Internet Explorer, we need some trickery; see
  // https://developer.mozilla.org/en-US/docs/Web/API/Window/getSelection
  const selection = window.getSelection && window.getSelection();
  if (!selection) {
    return false;
  }

  const dummy = document.createElement('p');
  dummy.textContent = text;
  document.body.appendChild(dummy);

  const range = document.createRange();
  range.setStartBefore(dummy);
  range.setEndAfter(dummy);

  // Preserve any user selection (assuming they can only select a single range)
  const userSelection = selection.rangeCount > 0 ? selection.getRangeAt(0) : false;

  selection.removeAllRanges();
  selection.addRange(range);
  document.execCommand('copy');
  selection.removeAllRanges();

  if (userSelection) {
    selection.addRange(userSelection);
  }

  document.body.removeChild(dummy);
  return true;
}
