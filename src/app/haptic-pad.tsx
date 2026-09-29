"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useWebHaptics } from "web-haptics/react";
import type { HapticInput } from "web-haptics";
import { toPulses } from "@/lib/haptic-pulses";
import { HapticButton } from "./haptic-button";

// 文字列は web-haptics の組み込みプリセット名
const PATTERNS: { label: string; input: HapticInput }[] = [
  { label: "selection", input: "selection" },
  { label: "light", input: "light" },
  { label: "medium", input: "medium" },
  { label: "heavy", input: "heavy" },
  { label: "soft", input: "soft" },
  { label: "rigid", input: "rigid" },
  { label: "success", input: "success" },
  { label: "warning", input: "warning" },
  { label: "error", input: "error" },
  { label: "nudge", input: "nudge" },
  { label: "buzz", input: "buzz" },
  {
    label: "heartbeat",
    input: [
      { duration: 40, intensity: 1 },
      { delay: 120, duration: 30, intensity: 0.6 },
      { delay: 500, duration: 40, intensity: 1 },
      { delay: 120, duration: 30, intensity: 0.6 },
    ],
  },
];

type Ripple = {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  ms: number;
};

// 振動の長さ → 波紋が広がる時間、強さ → 波紋の濃さ・大きさ
const RIPPLE_BASE_MS = 600;

export function HapticPad() {
  // Android: Vibration API / iOS Safari: 非表示の switch をクリックして触覚フィードバック
  const { trigger } = useWebHaptics();
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const nextId = useRef(0);
  const timers = useRef(new Set<number>());

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach((t) => clearTimeout(t));
  }, []);

  // 振動パターンの各パルスの開始時刻に合わせて、タップ位置から背景に波紋を出す
  const handleTap = (input: HapticInput, { x, y }: { x: number; y: number }) => {
    trigger(input);

    // 画面の対角線を基準に、強いほど遠くまで広がる
    const base = Math.hypot(window.innerWidth, window.innerHeight);

    for (const { start, duration, intensity } of toPulses(input)) {
      const timer = window.setTimeout(() => {
        timers.current.delete(timer);
        const id = nextId.current++;
        const size = base * (0.6 + intensity * 1.4);
        setRipples((prev) => [
          ...prev,
          {
            id,
            x,
            y,
            size,
            opacity: 0.08 + intensity * 0.22,
            ms: RIPPLE_BASE_MS + duration * 2,
          },
        ]);
      }, start);
      timers.current.add(timer);
    }
  };

  const removeRipple = (id: number) =>
    setRipples((prev) => prev.filter((r) => r.id !== id));

  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      >
        {ripples.map(({ id, x, y, size, opacity, ms }) => (
          <span
            key={id}
            onAnimationEnd={() => removeRipple(id)}
            className="absolute animate-ripple rounded-full bg-foreground"
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
      </div>
      <div className="grid w-full max-w-md grid-cols-3 gap-3 px-4">
        {PATTERNS.map(({ label, input }) => (
          <HapticButton
            key={label}
            label={label}
            onTap={(point) => handleTap(input, point)}
          />
        ))}
      </div>
    </>
  );
}
