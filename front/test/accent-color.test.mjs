import test from 'node:test';
import assert from 'node:assert/strict';
import {
  applyAccentPalette,
  getAccentPalette,
  getAccentTextColor,
  getContrastRatio,
  normalizeAccentColor,
} from '../app/utils/accentColor.js';
import themeReducer, { setAccentColor } from '../app/redux/features/theme/themeSlice.js';

test('normalizes supported hex colors and rejects malformed values', () => {
  assert.equal(normalizeAccentColor('#AbC'), '#aabbcc');
  assert.equal(normalizeAccentColor('#06B6D4'), '#06b6d4');
  assert.equal(normalizeAccentColor('blue'), null);
  assert.equal(normalizeAccentColor('#12'), null);
});

test('derives readable brand shades for bright, dark, and custom accents', () => {
  for (const color of ['#06b6d4', '#fb923c', '#34d399', '#f43f5e', '#ffffff', '#000000', '#777777']) {
    const palette = getAccentPalette(color);
    assert.ok(getContrastRatio(palette[500], '#ffffff') >= 4.5, `${color} shade 500`);
    assert.ok(getContrastRatio(palette[600], '#ffffff') >= 4.5, `${color} shade 600`);
    assert.ok(getContrastRatio(palette[400], '#090d16') >= 4.5, `${color} shade 400`);
    assert.ok(getContrastRatio(color, getAccentTextColor(color)) >= 4.5, `${color} preview`);
  }
});

test('applies the selected palette and theme-appropriate action colors to CSS variables', () => {
  const properties = {};
  const attributes = {};
  const root = {
    style: {
      setProperty(name, value) {
        properties[name] = value;
      },
    },
    setAttribute(name, value) {
      attributes[name] = value;
    },
  };

  applyAccentPalette(root, '#fb923c', 'dark');

  assert.equal(properties['--user-accent'], '#fb923c');
  assert.equal(properties['--brand-primary'], getAccentPalette('#fb923c')[400]);
  assert.equal(properties['--accent-action'], properties['--brand-primary']);
  assert.ok(getContrastRatio(
    properties['--accent-action'],
    properties['--accent-action-foreground']
  ) >= 4.5);
  assert.equal(attributes['data-accent-color'], '#fb923c');
});

test('stores valid selected accents and ignores invalid updates', () => {
  const saved = {};
  const previousWindow = globalThis.window;
  const previousLocalStorage = globalThis.localStorage;
  globalThis.window = {};
  globalThis.localStorage = {
    setItem(key, value) {
      saved[key] = value;
    },
  };

  try {
    let state = { theme: 'light', accentColor: '#06b6d4' };
    state = themeReducer(state, setAccentColor('#AbC'));
    assert.equal(state.accentColor, '#aabbcc');
    assert.equal(saved.accentColor, '#aabbcc');

    state = themeReducer(state, setAccentColor('not-a-color'));
    assert.equal(state.accentColor, '#aabbcc');
    assert.equal(saved.accentColor, '#aabbcc');
  } finally {
    if (previousWindow === undefined) delete globalThis.window;
    else globalThis.window = previousWindow;
    if (previousLocalStorage === undefined) delete globalThis.localStorage;
    else globalThis.localStorage = previousLocalStorage;
  }
});
