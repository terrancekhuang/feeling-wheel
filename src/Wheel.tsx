import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { arc } from "d3-shape";
import { interpolate } from "d3-interpolate";
import { root, fill, bySlug, type Node } from "./content";
import { navigate, linkTo } from "./router";

type Rect = { x0: number; x1: number; y0: number; y1: number; o: number }; // o = opacity

const DURATION = 650;
const reduceMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
const nodes = root.descendants().slice(1);

/** Where every slice sits when `p` is in the centre. Rings 1–2 (y units) are the visible ones. */
function layout(p: Node) {
  const m = new Map<Node, Rect>();
  const span = p.x1 - p.x0;
  for (const d of nodes) {
    const r = {
      x0: Math.max(0, Math.min(1, (d.x0 - p.x0) / span)) * 2 * Math.PI,
      x1: Math.max(0, Math.min(1, (d.x1 - p.x0) / span)) * 2 * Math.PI,
      y0: Math.max(0, d.y0 - p.depth),
      y1: Math.max(0, d.y1 - p.depth),
      o: 0,
    };
    r.o = r.y1 <= 3 && r.y0 >= 1 && r.x1 - r.x0 > 1e-6 ? 1 : 0;
    m.set(d, r);
  }
  return m;
}

export default function Wheel({ initial }: { initial?: string }) {
  const box = useRef<HTMLDivElement>(null);
  const svg = useRef<SVGSVGElement>(null);
  const [size, setSize] = useState(0);
  const [focus, setFocus] = useState<Node>(() => bySlug.get(initial ?? "") ?? root);
  const [rects, setRects] = useState(() => layout(focus));
  const [animating, setAnimating] = useState(false);
  const frame = useRef(0);
  const viaKeyboard = useRef(false);

  // Size to the container (and the viewport height on wide screens).
  useLayoutEffect(() => {
    const el = box.current!;
    const ro = new ResizeObserver(() => setSize(Math.min(el.clientWidth, 640, Math.max(320, innerHeight - 220))));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Remember the zoom level in this history entry, so Back from an emotion page returns here.
  useEffect(() => {
    history.replaceState({ focus: focus === root ? null : focus.data.slug }, "");
  }, [focus]);

  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  function zoom(p: Node) {
    if (p === focus) return;
    const from = rects;
    const to = layout(p);
    setFocus(p);
    cancelAnimationFrame(frame.current);
    if (reduceMotion()) return setRects(to);
    const lerp = new Map(nodes.map((d) => [d, interpolate(from.get(d)!, to.get(d)!)]));
    const start = performance.now();
    setAnimating(true);
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / DURATION);
      setRects(new Map(nodes.map((d) => [d, lerp.get(d)!(ease(t))])));
      if (t < 1) frame.current = requestAnimationFrame(tick);
      else {
        setAnimating(false);
        // Keyboard users: if the focused slice vanished, land on the first visible one.
        if (viaKeyboard.current && !svg.current?.contains(document.activeElement)) svg.current?.querySelector<SVGElement>(".arc")?.focus();
      }
    };
    frame.current = requestAnimationFrame(tick);
  }

  // Ring radii: small centre, then two rings (outer one wider, it holds longer names).
  const R = size / 2 - 2;
  const stops = [0, R * 0.34, R * 0.64, R];
  const radius = (y: number) => (y <= 3 ? stops[Math.floor(y)] + (y % 1) * (stops[Math.min(3, Math.floor(y) + 1)] - stops[Math.floor(y)]) : R + (y - 3) * R * 0.36);
  const path = useMemo(
    () =>
      arc<Rect>()
        .startAngle((d) => d.x0)
        .endAngle((d) => d.x1)
        .padAngle((d) => Math.min((d.x1 - d.x0) / 2, 0.006))
        .padRadius(R * 0.5)
        .innerRadius((d) => radius(d.y0))
        .outerRadius((d) => Math.max(radius(d.y0), radius(d.y1) - 2))
        .cornerRadius(4),
    [size],
  );

  const shown = nodes.filter((d) => rects.get(d)!.o > 0.01);
  const kids = focus.children?.length ?? 0;

  function activate(d: Node, keyboard = false) {
    viaKeyboard.current = keyboard;
    if (d.children) zoom(d);
    else navigate(`/${d.data.slug}`, null);
  }

  return (
    <div ref={box} className="w-full flex justify-center">
      {size > 0 && (
        <div className="relative" style={{ width: size, height: size }}>
          <svg ref={svg} width={size} height={size} viewBox={`${-size / 2} ${-size / 2} ${size} ${size}`} role="group" aria-label="Emotion wheel">
            {focus !== root && (
              <circle r={stops[1]} fill="transparent" className="cursor-pointer" onClick={() => zoom(focus.parent!)} aria-hidden />
            )}
            {shown.map((d) => {
              const r = rects.get(d)!;
              const label = animating ? null : fitLabel(d.data.name, radius(r.y0), radius(r.y1), r.x0, r.x1);
              const more = d.children?.length;
              return (
                <g
                  key={d.data.slug}
                  className="arc"
                  tabIndex={0}
                  role={more ? "button" : "link"}
                  aria-label={more ? `${d.data.name}: ${d.data.description}. ${more} feelings inside.` : `${d.data.name}: ${d.data.description}`}
                  onClick={() => activate(d)}
                  onMouseDown={(e) => e.preventDefault() /* no focus ring on tap */}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      activate(d, true);
                    }
                  }}
                  style={{ opacity: r.o }}
                >
                  <path d={path(r)!} style={{ fill: fill(d) }} />
                  {label && <Label {...label} />}
                  <title>{d.data.name}</title>
                </g>
              );
            })}
          </svg>

          {/* Centre: current emotion, its verses, and the way back out. */}
          <div
            className="pointer-events-none absolute inset-0 m-auto flex flex-col items-center justify-center text-center gap-1.5"
            style={{ width: stops[1] * 1.6, height: stops[1] * 1.6 }}
          >
            {focus === root ? (
              <p className="font-serif italic text-ink-soft text-sm leading-snug">Tap a feeling</p>
            ) : (
              <>
                <p className="font-serif font-semibold leading-tight text-[clamp(0.95rem,3.6vw,1.35rem)]">{focus.data.name}</p>
                <a
                  href={`/${focus.data.slug}`}
                  onClick={linkTo(`/${focus.data.slug}`)}
                  className="pointer-events-auto rounded-full bg-accent text-accent-ink text-xs font-medium px-3 py-1.5 hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
                >
                  Read verses
                </a>
                <button
                  type="button"
                  onClick={() => zoom(focus.parent!)}
                  className="pointer-events-auto text-[11px] text-ink-soft underline-offset-2 hover:underline focus-visible:outline-2 focus-visible:outline-ink rounded px-1"
                >
                  ‹ {focus.parent === root ? "All feelings" : focus.parent!.data.name}
                </button>
              </>
            )}
          </div>
        </div>
      )}
      <p className="sr-only" aria-live="polite">
        {focus === root ? "Showing all feelings." : `Showing ${focus.data.name}: ${kids} feelings inside.`}
      </p>
    </div>
  );
}

// ---- Labels: pick the biggest size/orientation that fits the slice, or hide (zoom in to read it). ----

type Fit = { lines: string[]; size: number; radial: boolean; r: number; a: number };
const SIZES = [13, 11.5, 10];
let ctx: CanvasRenderingContext2D | null = null;

function textWidth(s: string, size: number) {
  ctx ??= document.createElement("canvas").getContext("2d")!;
  ctx.font = `500 ${size}px ${getComputedStyle(document.body).fontFamily}`;
  return ctx.measureText(s).width;
}

function twoLines(s: string) {
  const words = s.split(" ");
  if (words.length < 2) return null;
  let best: string[] = [];
  for (let i = 1; i < words.length; i++) {
    const pair = [words.slice(0, i).join(" "), words.slice(i).join(" ")];
    if (!best.length || Math.max(...pair.map((p) => p.length)) < Math.max(...best.map((p) => p.length))) best = pair;
  }
  return best;
}

function fitLabel(name: string, r0: number, r1: number, a0: number, a1: number): Fit | null {
  const ringW = r1 - r0;
  const r = (r0 + r1) / 2;
  const arcLen = (a1 - a0) * r;
  const a = (a0 + a1) / 2;
  const options = [[name], twoLines(name)].filter(Boolean) as string[][];
  for (const size of SIZES) {
    for (const lines of options) {
      const w = Math.max(...lines.map((l) => textWidth(l, size)));
      const h = lines.length * size * 1.15;
      if (w + 10 <= arcLen && h + 6 <= ringW) return { lines, size, radial: false, r, a };
      if (w + 10 <= ringW && h + 4 <= arcLen) return { lines, size, radial: true, r, a };
    }
  }
  return null;
}

function Label({ lines, size, radial, r, a }: Fit) {
  const deg = (a * 180) / Math.PI;
  const transform = radial
    ? `rotate(${deg - 90}) translate(${r},0) rotate(${deg < 180 ? 0 : 180})`
    : `translate(${r * Math.sin(a)},${-r * Math.cos(a)}) rotate(${deg > 90 && deg < 270 ? deg + 180 : deg})`;
  const lh = size * 1.15;
  return (
    <text transform={transform} textAnchor="middle" dominantBaseline="central" fontSize={size} fontWeight={500} fill="var(--ink)" pointerEvents="none">
      {lines.map((l, i) => (
        <tspan key={i} x={0} dy={i === 0 ? (-(lines.length - 1) * lh) / 2 : lh}>
          {l}
        </tspan>
      ))}
    </text>
  );
}
