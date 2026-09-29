"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent,
  type PointerEvent,
} from "react";
import type { HapticInput } from "web-haptics";
import { toPulses } from "@/lib/haptic-pulses";

type Props = {
  label: string;
  input: HapticInput;
  onTap: () => void;
};

type Ripple = {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  ms: number;
};

// 振動の長さ → 波紋が広がる時間、強さ → 波紋の濃さ・大きさ
const RIPPLE_BASE_MS = 350;

export function HapticButton({ label, input, onTap }: Props) {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const nextId = useRef(0);
  const origin = useRef<{ x: number; y: number } | null>(null);
  const timers = useRef(new Set<number>());

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach((t) => clearTimeout(t));
  }, []);

  const handlePointerDown = (e: PointerEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    origin.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  // 振動パターンの各パルスの開始時刻に合わせて波紋を出す
  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    onTap();

    const rect = e.currentTarget.getBoundingClientRect();
    // キーボード操作などポインタ位置がない場合は中央から
    const { x, y } = origin.current ?? { x: rect.width / 2, y: rect.height / 2 };
    origin.current = null;
    const base = Math.max(rect.width, rect.height);

    for (const { start, duration, intensity } of toPulses(input)) {
      const timer = window.setTimeout(() => {
        timers.current.delete(timer);
        const id = nextId.current++;
        setRipples((prev) => [
          ...prev,
          {
            id,
            x,
            y,
            size: base * (1.2 + intensity),
            opacity: 0.2 + intensity * 0.6,
            ms: RIPPLE_BASE_MS + duration,
          },
        ]);
      }, start);
      timers.current.add(timer);
    }
  };

  const removeRipple = (id: number) =>
    setRipples((prev) => prev.filter((r) => r.id !== id));

  return (
    <button
      type="button"
      onPointerDown={handlePointerDown}
      onClick={handleClick}
      className="relative h-24 touch-manipulation select-none overflow-hidden rounded-2xl bg-foreground text-base font-medium text-background shadow-lg [-webkit-tap-highlight-color:transparent]"
    >
      {label}
      {ripples.map(({ id, x, y, size, opacity, ms }) => (
        <span
          key={id}
          aria-hidden="true"
          onAnimationEnd={() => removeRipple(id)}
          className="pointer-events-none absolute animate-ripple rounded-full bg-background"
          style={
            {
              left: x - size / 2,
              top: y - size / 2,
              width: size,
              height: size,
              animationDuration: `${ms}ms`,
              "--ripple-opacity": opacity,
            } as CSSProperties
          }
        />
      ))}
    </button>
  );
}
