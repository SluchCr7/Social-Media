export const DEFAULT_ACCENT_COLOR = '#06b6d4';

const HEX_COLOR_PATTERN = /^#(?:[\da-f]{3}|[\da-f]{6})$/i;
const DARK_SURFACE = '#090d16';
const WHITE = '#ffffff';
const BLACK = '#000000';

export const normalizeAccentColor = (color) => {
  if (typeof color !== 'string' || !HEX_COLOR_PATTERN.test(color)) return null;
  const hex = color.slice(1);
  const expanded = hex.length === 3
    ? hex.split('').map((digit) => `${digit}${digit}`).join('')
    : hex;
  return `#${expanded.toLowerCase()}`;
};

const hexToRgb = (hex) => {
  const normalized = normalizeAccentColor(hex);
  if (!normalized) return null;
  return [
    Number.parseInt(normalized.slice(1, 3), 16),
    Number.parseInt(normalized.slice(3, 5), 16),
    Number.parseInt(normalized.slice(5, 7), 16),
  ];
};

const rgbToHex = ([red, green, blue]) =>
  `#${[red, green, blue]
    .map((channel) => Math.round(channel).toString(16).padStart(2, '0'))
    .join('')}`;

const mix = (color, target, amount) =>
  color.map((channel, index) => channel + (target[index] - channel) * amount);

const relativeLuminance = (rgb) => {
  const [red, green, blue] = rgb.map((channel) => {
    const value = channel / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
};

export const getContrastRatio = (foreground, background) => {
  const foregroundRgb = hexToRgb(foreground);
  const backgroundRgb = hexToRgb(background);
  if (!foregroundRgb || !backgroundRgb) return 1;
  const values = [relativeLuminance(foregroundRgb), relativeLuminance(backgroundRgb)]
    .sort((first, second) => second - first);
  return (values[0] + 0.05) / (values[1] + 0.05);
};

const makeReadableOn = (color, background, target, minimumContrast = 4.5) => {
  const rgb = hexToRgb(color);
  const targetRgb = hexToRgb(target);
  if (getContrastRatio(color, background) >= minimumContrast) return color;

  let low = 0;
  let high = 1;
  for (let iteration = 0; iteration < 24; iteration += 1) {
    const amount = (low + high) / 2;
    const candidate = rgbToHex(mix(rgb, targetRgb, amount));
    if (getContrastRatio(candidate, background) >= minimumContrast) {
      high = amount;
    } else {
      low = amount;
    }
  }
  return rgbToHex(mix(rgb, targetRgb, high));
};

export const getAccentPalette = (color) => {
  const accent = normalizeAccentColor(color) || DEFAULT_ACCENT_COLOR;
  const lightAccent = makeReadableOn(accent, WHITE, BLACK);
  const darkAccent = makeReadableOn(accent, DARK_SURFACE, WHITE);
  const lightRgb = hexToRgb(lightAccent);
  const darkRgb = hexToRgb(darkAccent);
  const whiteRgb = hexToRgb(WHITE);
  const blackRgb = hexToRgb(BLACK);

  const shadeRgb = {
    50: mix(lightRgb, whiteRgb, 0.94),
    100: mix(lightRgb, whiteRgb, 0.88),
    200: mix(lightRgb, whiteRgb, 0.74),
    300: mix(lightRgb, whiteRgb, 0.54),
    400: darkRgb,
    500: lightRgb,
    600: mix(lightRgb, blackRgb, 0.12),
    700: mix(lightRgb, blackRgb, 0.28),
    800: mix(lightRgb, blackRgb, 0.44),
    900: mix(lightRgb, blackRgb, 0.60),
    950: mix(lightRgb, blackRgb, 0.74),
  };

  return Object.fromEntries(
    Object.entries(shadeRgb).map(([shade, rgb]) => [shade, rgbToHex(rgb)])
  );
};

export const getAccentTextColor = (color) =>
  getContrastRatio(color, BLACK) >= getContrastRatio(color, WHITE) ? BLACK : WHITE;

export const applyAccentPalette = (root, color, theme = 'light') => {
  const accent = normalizeAccentColor(color) || DEFAULT_ACCENT_COLOR;
  const palette = getAccentPalette(accent);
  const actionColor = theme === 'dark' ? palette[400] : palette[600];

  root.style.setProperty('--user-accent', accent);
  Object.entries(palette).forEach(([shade, hex]) => {
    root.style.setProperty(`--user-accent-${shade}`, hexToRgb(hex).join(' '));
  });
  root.style.setProperty('--brand-primary', actionColor);
  root.style.setProperty('--brand-accent', actionColor);
  root.style.setProperty('--accent-action', actionColor);
  root.style.setProperty('--accent-action-foreground', getAccentTextColor(actionColor));
  root.style.setProperty('--focus-ring', `color-mix(in srgb, ${accent} 46%, transparent)`);
  root.setAttribute('data-accent-color', accent);
};
