export function fmt(n: number, digits: number) {
  return n.toLocaleString('en-US', {minimumFractionDigits: digits, maximumFractionDigits: digits});
}

/**
 * Join non-empty fragments into a sentence, adding full stops when combining
 * more than one fragment.
 */
export function withFullStops(...lines: (string | false | 0 | undefined)[]) {
  return (
    lines.reduce((acc: string, line) => {
      if (!line) {
        return acc;
      }
      return (
        acc +
        (acc && acc.slice(-1) !== '.' ? '. ' : acc ? ' ' : '') +
        line +
        (acc && line.slice(-1) !== '.' ? '.' : '')
      );
    }, '') || undefined
  );
}
