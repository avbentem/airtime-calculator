/**
 * Find the element that has the given text, from the combined own text content
 * and/or that of its direct children, and ignoring any zero-width space that
 * may be present to support proper copy/paste.
 *
 * This supports HTML such as below, which has multiple elements for which the
 * text content `DR4SF8BW125` or `1,482.8ms` is an exact match:
 *
 * ```html
 * <div class="Results-result" role="row">
 *   <div>
 *     ...
 *   </div>
 *   <div>                                            <-- First candidate
 *     <div class="Result-datarate" role="cell">      <-- Second candidate
 *       <div class="Result-dr">
 *         DR4
 *       </div>
 *       <div>
 *         &#x200b;&#x200b;                           <-- Ignored
 *         <span class="Result-sf">
 *           SF
 *           8
 *         </span>
 *         &#x200b;&#x200b;                           <-- Ignored
 *         <span class="Result-unit Result-unit-bw">
 *           BW
 *           <br>
 *           125
 *         </span>
 *       </div>
 *     </div>
 *   </div>
 *   <div>                                            <-- First candidate
 *     <div class="Result-airtime" role="cell">       <-- Second candidate
 *       <div>                                        <-- Third candidate
 *         1,482.8
 *         &#x200b;                                   <-- Ignored
 *         <span class="Result-unit">
 *           ms
 *         </span>
 *       </div>
 *     </div>
 *   </div>
 *   <div>
 *     ...
 *   </div>
 * </div>
 * ```
 *
 * Given the nested elements, things like the following would fail:
 *
 * ```javascript
 * expect(screen.getByText('DR4SF8BW125')).toBeInTheDocument();
 * expect(screen.getByText('DR4 SF8 BW 125')).toBeInTheDocument();
 * ```
 *
 * ...which would all throw:
 *
 * > TestingLibraryElementError: Unable to find an element with the text: ...
 * > This could be because the text is broken up by multiple elements. In this
 * > case, you can provide a function for your text matcher to make your matcher
 * > more flexible.
 *
 * Use this custom matcher like:
 *
 * ```javascript
 * expect(screen.getByText(textInMarkupMatcher('DR4SF8BW125))).toBeInTheDocument();
 *
 * expect(screen.getByRole('cell',
 *   {name: textInMarkupMatcher('DR4SF8BW125')})).toBeInTheDocument();
 * ```
 *
 * See https://www.polvara.me/posts/five-things-you-didnt-know-about-testing-library/
 * on Giorgio Polvara's blog.
 */
export const textInMarkupMatcher = (
  text: string
): ((text: string, element: Element) => boolean) => {
  const hasText = (element: Element) => (element.textContent || '').replace(/\u200B/g, '') === text;

  const inMarkup = (element: Element): boolean =>
    hasText(element) && Array.from(element.children).every((child) => !hasText(child));

  // To support both getByText and getByRole, don't use MatcherFunction, which
  // uses HTMLElement rather than Element
  return (text: string, element: Element) => inMarkup(element);
};
