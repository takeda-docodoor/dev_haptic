"use client";

import { useWebHaptics } from "web-haptics/react";
import type { HapticInput } from "web-haptics";
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

export function HapticPad() {
  // Android: Vibration API / iOS Safari: 非表示の switch をクリックして触覚フィードバック
  const { trigger } = useWebHaptics();

  return (
    <div className="grid w-full max-w-md grid-cols-3 gap-3 px-4">
      {PATTERNS.map(({ label, input }) => (
        <HapticButton
          key={label}
          label={label}
          input={input}
          onTap={() => trigger(input)}
        />
      ))}
    </div>
  );
}
