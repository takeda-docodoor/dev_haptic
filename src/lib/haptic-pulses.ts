import { defaultPatterns, type HapticInput, type Vibration } from "web-haptics";

export type Pulse = { start: number; duration: number; intensity: number };

// web-haptics の trigger() と同じ規則で入力を解釈し、各振動の開始時刻(ms)を求める。
// - delay は直前の振動が終わってからの間隔
// - intensity 未指定時は 0.5、duration は最大 1000ms
const DEFAULT_INTENSITY = 0.5;
const MAX_DURATION = 1000;

function toVibrations(input: HapticInput): Vibration[] {
  if (typeof input === "number") return [{ duration: input }];
  if (typeof input === "string") {
    const preset = defaultPatterns[input as keyof typeof defaultPatterns];
    return preset ? preset.pattern : [];
  }
  if (Array.isArray(input)) {
    if (input.length === 0) return [];
    if (typeof input[0] === "number") {
      // [振動, 休止, 振動, ...] の交互指定
      const nums = input as number[];
      const result: Vibration[] = [];
      for (let i = 0; i < nums.length; i += 2) {
        result.push({ delay: i > 0 ? nums[i - 1] : 0, duration: nums[i] });
      }
      return result;
    }
    return input as Vibration[];
  }
  return input.pattern;
}

export function toPulses(input: HapticInput): Pulse[] {
  let t = 0;
  return toVibrations(input).map(({ delay = 0, duration, intensity }) => {
    t += delay;
    const d = Math.min(duration, MAX_DURATION);
    const pulse = {
      start: t,
      duration: d,
      intensity: Math.max(0, Math.min(1, intensity ?? DEFAULT_INTENSITY)),
    };
    t += d;
    return pulse;
  });
}
