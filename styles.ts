const baseFontSize = 1;

const rem = (n: number) => `${n}rem`;
const px = (n: number) => `${n}px`;

export const colors = {
  mint: "#D1FFEF",
  white: "#FFFFFF",
  black: "#000000",
  darkGrey: "#424242",
  midGrey: "#C4C4C4",
  grey: "#E6E6E6",
  green: "#65CA69",
  yellowGreen: "#CAEA4D",
  yellow: "#EBE66F",
  orange: "#F4C975",
  red: "#CA6565",
  purple: "#7662F4"
};

export const fontSizes = {
  large: px(30 * baseFontSize),
  medium: px(24 * baseFontSize),
  small: px(18 * baseFontSize)
};

export function unit(n: number) {
  return rem(n * 0.4);
}

export const shadow = {
  drop: "0px 4px 4px rgba(0, 0, 0, 0.25)",
  glowPurple: `0px 0px 6px ${colors.purple}`,
  nav: "0px 0px 6px rgba(0, 0, 0, 0.25)"
};

export const navHeight = unit(8);

export const zLayers = {
  selectDropdown: 1
};
