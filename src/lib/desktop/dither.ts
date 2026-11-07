// The fetch window's portrait: the photo redrawn as an 8×8 ordered (Bayer) dither in the colorscheme's ink.

const BAYER = [
  0, 32, 8, 40, 2, 34, 10, 42, 48, 16, 56, 24, 50, 18, 58, 26, 12, 44, 4, 36, 14, 46, 6, 38, 60, 28, 52, 20, 62, 30, 54,
  22, 3, 35, 11, 43, 1, 33, 9, 41, 51, 19, 59, 27, 49, 17, 57, 25, 15, 47, 7, 39, 13, 45, 5, 37, 63, 31, 55, 23, 61, 29,
  53, 21,
];

function hexRgb(h: string) {
  h = h.trim().replace("#", "");
  if (h.length === 3)
    h = h
      .split("")
      .map((c) => c + c)
      .join("");
  const n = parseInt(h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/**
 * Draws `photo` into `canvas` as `size`×`size` dither dots in `ink`. On a light colorscheme (`invert`) the dots mark
 * the dark areas instead. Returns false if the canvas can't be read back (a cross-origin photo).
 */
export function drawDither(
  canvas: HTMLCanvasElement,
  photo: HTMLImageElement,
  size: number,
  ink: string,
  invert: boolean,
) {
  canvas.width = size;
  canvas.height = size;
  const c = canvas.getContext("2d", { willReadFrequently: true })!;
  c.drawImage(photo, 0, 0, photo.naturalWidth, photo.naturalHeight, 0, 0, size, size);
  let img: ImageData;
  try {
    img = c.getImageData(0, 0, size, size);
  } catch {
    return false;
  }
  const d = img.data,
    N = size * size,
    lum = new Float32Array(N);
  for (let i = 0; i < N; i++) lum[i] = (0.2126 * d[i * 4] + 0.7152 * d[i * 4 + 1] + 0.0722 * d[i * 4 + 2]) / 255;
  // Stretch contrast between the 18th and 98.5th percentiles so the face fills the dot range.
  const sorted = Array.from(lum).sort((a, b) => a - b);
  const lo = sorted[Math.floor(N * 0.18)],
    hi = sorted[Math.floor(N * 0.985)];
  const [r, g, b] = hexRgb(ink);
  const out = c.createImageData(size, size),
    o = out.data;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = y * size + x;
      let v = Math.pow(Math.min(1, Math.max(0, (lum[i] - lo) / (hi - lo || 1))), 1.25);
      if (invert) v = 1 - v;
      const on = v > (BAYER[(y % 8) * 8 + (x % 8)] + 0.5) / 64;
      o[i * 4] = r;
      o[i * 4 + 1] = g;
      o[i * 4 + 2] = b;
      o[i * 4 + 3] = on ? 255 : 0;
    }
  }
  c.putImageData(out, 0, 0);
  return true;
}
