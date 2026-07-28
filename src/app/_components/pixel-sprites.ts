// Tiny pixel-art sprites for the retro-computing starfield background.
// Everything is drawn with integer-aligned fillRect calls (no arcs, no
// gradients, no image scaling) so it stays crisp with zero anti-aliasing.

export type EggKey =
  | "floppy"
  | "crt"
  | "pc"
  | "punchcard"
  | "chip"
  | "robot"
  | "satellite"
  | "pi"
  | "teddy"
  | "tape";

export const EGG_KEYS: EggKey[] = [
  "floppy",
  "crt",
  "pc",
  "punchcard",
  "chip",
  "robot",
  "satellite",
  "pi",
  "teddy",
  "tape",
];

function px(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  color: string,
) {
  ctx.fillStyle = color;
  ctx.fillRect(Math.round(x), Math.round(y), Math.ceil(w), Math.ceil(h));
}

// A filled or ring-shaped circle built from grid-aligned squares — reads as
// an authentic blocky 8-bit circle instead of a smooth anti-aliased arc.
export function pixelCircle(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  r: number,
  unit: number,
  color: string,
  filled = true,
) {
  for (let y = -r; y <= r; y += unit) {
    for (let x = -r; x <= r; x += unit) {
      const d = Math.sqrt(x * x + y * y);
      if (filled ? d <= r : Math.abs(d - r) <= unit) {
        px(ctx, cx + x, cy + y, unit, unit, color);
      }
    }
  }
}

const GLYPH_0 = ["111", "101", "101", "101", "111"];
const GLYPH_1 = ["010", "110", "010", "010", "111"];

export function drawBinaryGlyph(
  ctx: CanvasRenderingContext2D,
  bit: 0 | 1,
  x: number,
  y: number,
  unit: number,
  color: string,
  alpha: number,
) {
  const glyph = bit === 0 ? GLYPH_0 : GLYPH_1;
  ctx.globalAlpha = alpha;
  for (let r = 0; r < glyph.length; r++) {
    const row = glyph[r]!;
    for (let c = 0; c < row.length; c++) {
      if (row[c] === "1") px(ctx, x + c * unit, y + r * unit, unit, unit, color);
    }
  }
  ctx.globalAlpha = 1;
}

function drawFloppy(ctx: CanvasRenderingContext2D, cx: number, cy: number, s: number) {
  const w = 10 * s;
  const h = 10 * s;
  const x = cx - w / 2;
  const y = cy - h / 2;
  px(ctx, x, y, w, h, "#2b2b35");
  px(ctx, x + s, y + s, w - 2 * s, 3 * s, "#e8e8ef");
  px(ctx, x + s, y + h - 3 * s, w - 2 * s, 2 * s, "#b8bcc9");
  px(ctx, x + w - 3 * s, y, 2 * s, s, "#000");
}

function drawCRT(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  s: number,
  blink: number,
) {
  const w = 14 * s;
  const h = 12 * s;
  const x = cx - w / 2;
  const y = cy - h / 2;
  px(ctx, x, y, w, h, "#c9c9d1");
  px(ctx, x + 2 * s, y + 2 * s, w - 4 * s, h - 6 * s, "#0a0a0a");
  if (blink) px(ctx, x + 3 * s, y + h - 6 * s, s, s, "#33ff66");
  px(ctx, x + w / 2 - 2 * s, y + h - 3 * s, 4 * s, 3 * s, "#9a9aa5");
}

function drawPC(ctx: CanvasRenderingContext2D, cx: number, cy: number, s: number) {
  const w = 12 * s;
  const h = 10 * s;
  const x = cx - w / 2;
  const y = cy - h / 2;
  px(ctx, x, y, w, h, "#d8c9a3");
  px(ctx, x + s, y + 2 * s, w - 2 * s, s, "#8a7c5c");
  px(ctx, x + s, y + 4 * s, w - 2 * s, s, "#8a7c5c");
  px(ctx, x - 2 * s, y + h + s, w + 2 * s, 3 * s, "#cbbf9c");
  px(ctx, x + w + s, y + h - s, s, 2 * s, "#6b6050");
}

function drawPunchcard(ctx: CanvasRenderingContext2D, cx: number, cy: number, s: number) {
  const w = 14 * s;
  const h = 8 * s;
  const x = cx - w / 2;
  const y = cy - h / 2;
  px(ctx, x, y, w, h, "#e8dfc0");
  px(ctx, x + w - 2 * s, y, 2 * s, 2 * s, "#000");
  for (let r = 0; r < 2; r++) {
    for (let c = 0; c < 5; c++) {
      px(ctx, x + 2 * s + c * 2 * s, y + 2 * s + r * 3 * s, s, s, "#000");
    }
  }
}

function drawChip(ctx: CanvasRenderingContext2D, cx: number, cy: number, s: number) {
  const w = 8 * s;
  const h = 8 * s;
  const x = cx - w / 2;
  const y = cy - h / 2;
  px(ctx, x, y, w, h, "#111116");
  px(ctx, x + s, y + s, s, s, "#ff3355");
  for (let i = 0; i < 3; i++) {
    px(ctx, x - s, y + (1 + i * 2) * s, s, s, "#c9c9d1");
    px(ctx, x + w, y + (1 + i * 2) * s, s, s, "#c9c9d1");
    px(ctx, x + (1 + i * 2) * s, y - s, s, s, "#c9c9d1");
    px(ctx, x + (1 + i * 2) * s, y + h, s, s, "#c9c9d1");
  }
}

function drawRobot(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  s: number,
  wave: boolean,
) {
  const headW = 6 * s;
  const headH = 5 * s;
  const bodyW = 8 * s;
  const bodyH = 7 * s;
  const x = cx - bodyW / 2;
  const yBody = cy - bodyH / 2 + 2 * s;
  const xh = cx - headW / 2;
  const yh = yBody - headH;
  px(ctx, xh, yh, headW, headH, "#9aa0ad");
  px(ctx, xh + s, yh + s, s, s, "#33aaff");
  px(ctx, xh + headW - 2 * s, yh + s, s, s, "#33aaff");
  px(ctx, x, yBody, bodyW, bodyH, "#7f8592");
  px(ctx, x - 2 * s, yBody + 2 * s, 2 * s, 3 * s, "#7f8592");
  if (wave) {
    px(ctx, x + bodyW, yBody - s, 2 * s, 2 * s, "#7f8592");
  } else {
    px(ctx, x + bodyW, yBody + 2 * s, 2 * s, 3 * s, "#7f8592");
  }
}

function drawSatellite(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  s: number,
  blink: number,
  dishOffset: number,
) {
  const bodyW = 6 * s;
  const bodyH = 5 * s;
  const x = cx - bodyW / 2;
  const y = cy - bodyH / 2;
  px(ctx, x - 6 * s, y + s, 6 * s, 3 * s, "#3f6fae");
  px(ctx, x - 4 * s, y + s, s, 3 * s, "#274b7a");
  px(ctx, x + bodyW, y + s, 6 * s, 3 * s, "#3f6fae");
  px(ctx, x + bodyW + 2 * s, y + s, s, 3 * s, "#274b7a");
  px(ctx, x, y, bodyW, bodyH, "#b7bcc9");
  px(ctx, x + bodyW / 2 - s + dishOffset * s, y - 3 * s, 2 * s, 2 * s, "#e2e2e6");
  if (blink) px(ctx, x + bodyW - s, y + bodyH - s, s, s, "#ff3355");
}

function drawPi(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  s: number,
  blink: number,
) {
  const w = 12 * s;
  const h = 8 * s;
  const x = cx - w / 2;
  const y = cy - h / 2;
  px(ctx, x, y, w, h, "#1f6b3a");
  px(ctx, x + s, y + s, 3 * s, 2 * s, "#111116");
  px(ctx, x + 6 * s, y + s, 2 * s, 2 * s, "#111116");
  for (let i = 0; i < 6; i++) {
    px(ctx, x + s + i * s, y - s, s * 0.7, s, "#c9c9c9");
  }
  if (blink) px(ctx, x + w - 2 * s, y + h - 2 * s, s, s, "#33ff66");
}

function drawTeddy(ctx: CanvasRenderingContext2D, cx: number, cy: number, s: number) {
  pixelCircle(ctx, cx, cy, 7 * s, s, "#e8e8ef", false);
  px(ctx, cx - 3 * s, cy - 3 * s, 6 * s, 6 * s, "#8a5a3c");
  px(ctx, cx - 4 * s, cy - 4 * s, 2 * s, 2 * s, "#8a5a3c");
  px(ctx, cx + 2 * s, cy - 4 * s, 2 * s, 2 * s, "#8a5a3c");
  px(ctx, cx - 2 * s, cy - s, s, s, "#241a12");
  px(ctx, cx + s, cy - s, s, s, "#241a12");
  px(ctx, cx - s, cy + s, 2 * s, s, "#5c3c26");
  px(ctx, cx - 3 * s, cy + 3 * s, 6 * s, 5 * s, "#e8e8ef");
}

function drawTape(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  s: number,
  angle: number,
) {
  const r = 5 * s;
  pixelCircle(ctx, cx, cy, r, s, "#3a3a42", false);
  px(ctx, cx - s / 2, cy - s / 2, s, s, "#111116");
  for (let i = 0; i < 3; i++) {
    const a = angle + (i * Math.PI * 2) / 3;
    const sx = cx + Math.cos(a) * r * 0.6;
    const sy = cy + Math.sin(a) * r * 0.6;
    px(ctx, sx - s / 2, sy - s / 2, s, s, "#8a8a92");
  }
}

export function drawAsteroid(ctx: CanvasRenderingContext2D, cx: number, cy: number, s: number) {
  pixelCircle(ctx, cx, cy, 4 * s, s, "#5a5a63", true);
  px(ctx, cx - s, cy - s, s, s, "#3a3a42");
  px(ctx, cx + 2 * s, cy + s, s, s, "#3a3a42");
}

export function drawPlanet(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  s: number,
  color: string,
  ringColor: string,
) {
  px(ctx, cx - 9 * s, cy - s, 18 * s, s, ringColor);
  pixelCircle(ctx, cx, cy, 6 * s, s, color, true);
}

export function drawEgg(
  ctx: CanvasRenderingContext2D,
  key: EggKey,
  cx: number,
  cy: number,
  s: number,
  time: number,
  phase: number,
) {
  const blink = Math.floor(time / 450 + phase) % 2;
  switch (key) {
    case "floppy":
      drawFloppy(ctx, cx, cy, s);
      return;
    case "crt":
      drawCRT(ctx, cx, cy, s, blink);
      return;
    case "pc":
      drawPC(ctx, cx, cy, s);
      return;
    case "punchcard":
      drawPunchcard(ctx, cx, cy, s);
      return;
    case "chip":
      drawChip(ctx, cx, cy, s);
      return;
    case "robot": {
      const waveState = Math.floor(time / 220 + phase) % 10;
      drawRobot(ctx, cx, cy, s, waveState === 0 || waveState === 1);
      return;
    }
    case "satellite": {
      const dishState = Math.floor(time / 600 + phase) % 8;
      const dishOffset = dishState === 1 ? 1 : dishState === 3 ? -1 : 0;
      drawSatellite(ctx, cx, cy, s, blink, dishOffset);
      return;
    }
    case "pi":
      drawPi(ctx, cx, cy, s, blink);
      return;
    case "teddy":
      drawTeddy(ctx, cx, cy, s);
      return;
    case "tape":
      drawTape(ctx, cx, cy, s, time / 900 + phase);
      return;
  }
}
