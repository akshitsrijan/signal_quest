"use client";

import { useEffect, useRef } from "react";

import {
  EGG_KEYS,
  drawAsteroid,
  drawBinaryGlyph,
  drawEgg,
  drawPlanet,
  type EggKey,
} from "~/app/_components/pixel-sprites";

// A calm, seamless-looping retro-computing space scene: twinkling pixel
// stars, slow comets, drifting asteroids/planets, and rare pixel-art
// easter eggs (floppy disks, a CRT, a tiny robot, ...). Drifting objects
// stay in the outer 20% band on each edge so the center 60% of the
// viewport — where page content sits — stays clear.

type Star = { x: number; y: number; size: 1 | 2; phase: number; speed: number };
type Comet = { x: number; y: number; vx: number; vy: number; life: number; maxLife: number };
type Bit = { x: number; y: number; bit: 0 | 1; life: number };

type Lane = "top" | "bottom" | "left" | "right";
type Drifter = {
  lane: Lane;
  pos: number; // position along the travel axis (px)
  cross: number; // position across the band (px)
  speed: number;
  scale: number;
  phase: number;
  kind: "asteroid" | "planet" | EggKey;
  planetColor?: string;
  planetRing?: string;
};

const STAR_COUNT = 650;
const COMET_INTERVAL_MS = 9000;
const AMBIENT_COUNT = 6; // asteroids + planets, always present
const EGG_SPAWN_MIN_MS = 14000;
const EGG_SPAWN_MAX_MS = 32000;
const MAX_EGGS_ON_SCREEN = 3;

const PLANET_PALETTES: [string, string][] = [
  ["#4a3f6b", "#8a7a9a"],
  ["#5a4030", "#9a7a55"],
  ["#2f4a4a", "#6a9a9a"],
];

function bandThickness(width: number, height: number, lane: Lane) {
  return lane === "top" || lane === "bottom" ? height * 0.2 : width * 0.2;
}

function spawnDrifter(
  width: number,
  height: number,
  kind: Drifter["kind"],
  speedBase: number,
): Drifter {
  const lanes: Lane[] = ["top", "bottom", "left", "right"];
  const lane = lanes[Math.floor(Math.random() * lanes.length)]!;
  const band = bandThickness(width, height, lane);
  const pad = band * 0.25;
  const cross = pad + Math.random() * (band - 2 * pad);
  const horizontal = lane === "top" || lane === "bottom";
  const travelLength = horizontal ? width : height;
  const fromStart = Math.random() < 0.5;
  const speed = (speedBase + Math.random() * speedBase * 0.6) * (fromStart ? 1 : -1);

  let planetColor: string | undefined;
  let planetRing: string | undefined;
  if (kind === "planet") {
    const palette = PLANET_PALETTES[Math.floor(Math.random() * PLANET_PALETTES.length)]!;
    planetColor = palette[0];
    planetRing = palette[1];
  }

  return {
    lane,
    pos: fromStart ? -60 : travelLength + 60,
    cross,
    speed,
    scale: kind === "planet" ? 1.4 : kind === "asteroid" ? 1 : 1.1 + Math.random() * 0.4,
    phase: Math.random() * 100,
    kind,
    planetColor,
    planetRing,
  };
}

function drifterScreenPos(d: Drifter, width: number, height: number) {
  const band = bandThickness(width, height, d.lane);
  switch (d.lane) {
    case "top":
      return { x: d.pos, y: d.cross };
    case "bottom":
      return { x: d.pos, y: height - band + d.cross };
    case "left":
      return { x: d.cross, y: d.pos };
    case "right":
      return { x: width - band + d.cross, y: d.pos };
  }
}

function isOffscreen(d: Drifter, width: number, height: number) {
  const travelLength = d.lane === "top" || d.lane === "bottom" ? width : height;
  return d.pos < -80 || d.pos > travelLength + 80;
}

export function StarfieldBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    ctx.imageSmoothingEnabled = false;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let width = 0;
    let height = 0;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.imageSmoothingEnabled = false;
    };
    resize();
    window.addEventListener("resize", resize);

    const stars: Star[] = Array.from({ length: STAR_COUNT }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() < 0.15 ? 2 : 1,
      phase: Math.random() * Math.PI * 2,
      speed: 0.001 + Math.random() * 0.0015,
    }));

    const ambient: Drifter[] = Array.from({ length: AMBIENT_COUNT }, (_, i) =>
      spawnDrifter(width, height, i % 3 === 0 ? "planet" : "asteroid", 0.15),
    );

    let eggs: Drifter[] = [];
    let comets: Comet[] = [];
    let bits: Bit[] = [];
    let lastComet = 0;
    let nextEggAt = EGG_SPAWN_MIN_MS;
    let animId: number;

    const spawnComet = () => {
      const fromLeft = Math.random() < 0.5;
      comets.push({
        x: fromLeft ? -30 : width + 30,
        y: Math.random() * height * 0.7,
        vx: fromLeft ? 1.2 + Math.random() * 0.8 : -(1.2 + Math.random() * 0.8),
        vy: 0.5 + Math.random() * 0.5,
        life: 0,
        maxLife: 260,
      });
    };

    const draw = (time: number) => {
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, width, height);

      // Stars — subtle independent twinkle, static positions (loops forever).
      for (const star of stars) {
        const t = reduceMotion ? 0 : time;
        const b = 0.55 + 0.45 * Math.sin(t * star.speed + star.phase);
        ctx.fillStyle = `rgba(255,255,255,${Math.max(0.15, b).toFixed(2)})`;
        ctx.fillRect(Math.round(star.x), Math.round(star.y), star.size, star.size);
      }

      // Comets — slow, blocky fading pixel trail.
      if (!reduceMotion && time - lastComet > COMET_INTERVAL_MS) {
        spawnComet();
        lastComet = time;
      }
      comets = comets.filter((c) => c.life < c.maxLife);
      for (const comet of comets) {
        comet.x += comet.vx;
        comet.y += comet.vy;
        comet.life++;
        for (let i = 0; i < 6; i++) {
          const tx = comet.x - comet.vx * i * 2.2;
          const ty = comet.y - comet.vy * i * 2.2;
          const alpha = 1 - i / 6;
          ctx.fillStyle = i === 0 ? "#ffffff" : `rgba(168,232,255,${alpha.toFixed(2)})`;
          ctx.fillRect(Math.round(tx), Math.round(ty), 2, 2);
        }
      }

      // Ambient asteroids + planets, always drifting in the outer bands.
      for (const d of ambient) {
        if (!reduceMotion) d.pos += d.speed * 16;
        if (isOffscreen(d, width, height)) {
          Object.assign(d, spawnDrifter(width, height, d.kind, 0.15));
        }
        const { x, y } = drifterScreenPos(d, width, height);
        if (d.kind === "planet") {
          drawPlanet(ctx, x, y, d.scale, d.planetColor!, d.planetRing!);
        } else {
          drawAsteroid(ctx, x, y, d.scale);
        }
      }

      // Rare pixel-art easter eggs.
      if (!reduceMotion && time > nextEggAt && eggs.length < MAX_EGGS_ON_SCREEN) {
        const key = EGG_KEYS[Math.floor(Math.random() * EGG_KEYS.length)]!;
        eggs.push(spawnDrifter(width, height, key, 0.05));
        nextEggAt =
          time + EGG_SPAWN_MIN_MS + Math.random() * (EGG_SPAWN_MAX_MS - EGG_SPAWN_MIN_MS);
      }
      eggs = eggs.filter((e) => !isOffscreen(e, width, height));
      for (const egg of eggs) {
        if (!reduceMotion) egg.pos += egg.speed * 16;
        const { x, y } = drifterScreenPos(egg, width, height);
        drawEgg(ctx, egg.kind as EggKey, x, y, egg.scale, time, egg.phase);

        // Binary transmission blips near the satellite.
        if (egg.kind === "satellite" && !reduceMotion && Math.random() < 0.01) {
          bits.push({ x: x + 8, y: y - 10, bit: Math.random() < 0.5 ? 0 : 1, life: 0 });
        }
      }

      bits = bits.filter((b) => b.life < 60);
      for (const bit of bits) {
        bit.life++;
        bit.y -= 0.3;
        const alpha = 1 - bit.life / 60;
        drawBinaryGlyph(ctx, bit.bit, bit.x, bit.y, 2, "#33ff66", alpha);
      }

      animId = requestAnimationFrame(draw);
    };

    animId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 -z-10 h-full w-full"
    />
  );
}
