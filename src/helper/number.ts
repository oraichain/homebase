export const isNegative = (number) => number <= 0;

// add `,` when split thounsand value.
export const numberWithCommas = (
  x: number,
  locales: Intl.LocalesArgument = undefined,
  options: Intl.NumberFormatOptions = {}
) => {
  if (isNegative(x)) return '0';
  return x.toLocaleString(locales, options);
};
